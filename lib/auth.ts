export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type FieldErrors = Record<string, string[]>;

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export class AuthError extends Error {
  status: number;
  errors: FieldErrors;

  constructor(message: string, status = 0, errors: FieldErrors = {}) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.errors = errors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readUser(value: unknown): AuthUser {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string"
  ) {
    throw new AuthError("We received an unexpected response. Please try again.", 502);
  }

  return { id: value.id, name: value.name, email: value.email };
}

function readSession(value: unknown) {
  if (!isRecord(value) || typeof value.access_token !== "string" || !value.access_token) {
    throw new AuthError("We received an unexpected response. Please try again.", 502);
  }

  return { accessToken: value.access_token, user: readUser(value.user) };
}

export function createAuthClient(fetcher: typeof fetch = fetch) {
  let accessToken: string | null = null;
  let refreshPromise: Promise<void> | null = null;
  let authVersion = 0;

  function setAccessToken(token: string | null) {
    accessToken = token;
    authVersion += 1;
  }

  async function request(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (options.body) headers.set("Content-Type", "application/json");

    let response: Response;

    try {
      response = await fetcher(`/api/v1/auth/${endpoint}`, {
        ...options,
        headers,
        credentials: "same-origin",
        cache: "no-store",
      });
    } catch {
      throw new AuthError("We couldn't connect to the server. Please try again.");
    }

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const errors: FieldErrors = {};

      if (isRecord(data) && isRecord(data.errors)) {
        for (const [field, messages] of Object.entries(data.errors)) {
          if (Array.isArray(messages)) {
            errors[field] = messages.filter((message): message is string => typeof message === "string");
          }
        }
      }

      let message = isRecord(data) && typeof data.message === "string"
        ? data.message
        : "Something went wrong. Please try again.";

      if (response.status >= 500) {
        message = "The service is temporarily unavailable. Please try again.";
      }

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("Retry-After") || (isRecord(data) ? data.retry_after : 0));
        message = Number.isFinite(retryAfter) && retryAfter > 0
          ? `Too many attempts. Please try again in ${Math.ceil(retryAfter)} seconds.`
          : "Too many attempts. Please wait a moment and try again.";
      }

      throw new AuthError(message, response.status, errors);
    }

    return data;
  }

  async function authenticate(endpoint: "login" | "register", credentials: object) {
    const session = readSession(await request(endpoint, {
      method: "POST",
      body: JSON.stringify(credentials),
    }));
    setAccessToken(session.accessToken);
    return session.user;
  }

  function refreshAccessToken(): Promise<void> {
    if (!refreshPromise) {
      const version = authVersion;

      refreshPromise = (async () => {
        const session = readSession(await request("refresh", { method: "POST" }));

        if (version !== authVersion) {
          throw new AuthError("Your session changed. Please try again.", 409);
        }

        setAccessToken(session.accessToken);
      })().catch((error: unknown) => {
        if (error instanceof AuthError && [401, 422].includes(error.status)) {
          if (version === authVersion) setAccessToken(null);
          throw new AuthError("Your session has expired. Please sign in again.", 401);
        }

        throw error;
      }).finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  }

  async function authenticatedRequest(endpoint: "me" | "logout", options: RequestInit = {}) {
    if (!accessToken) await refreshAccessToken();

    const send = () => request(endpoint, {
      ...options,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const sentToken = accessToken;

    try {
      return await send();
    } catch (error) {
      if (!(error instanceof AuthError) || error.status !== 401) throw error;
    }

    if (accessToken === sentToken) await refreshAccessToken();
    const retryToken = accessToken;

    try {
      return await send();
    } catch (error) {
      if (error instanceof AuthError && error.status === 401 && accessToken === retryToken) {
        setAccessToken(null);
      }
      throw error;
    }
  }

  return {
    login(email: string, password: string) {
      return authenticate("login", { email: email.trim(), password });
    },
    register(credentials: RegisterCredentials) {
      return authenticate("register", {
        ...credentials,
        name: credentials.name.trim(),
        email: credentials.email.trim(),
      });
    },
    async getUser() {
      const result = await authenticatedRequest("me");
      return readUser(isRecord(result) ? result.data : null);
    },
    async logout() {
      try {
        await authenticatedRequest("logout", { method: "POST" });
      } catch (error) {
        if (!(error instanceof AuthError) || error.status !== 401) throw error;
      }
      setAccessToken(null);
    },
  };
}

export const authClient = createAuthClient();
