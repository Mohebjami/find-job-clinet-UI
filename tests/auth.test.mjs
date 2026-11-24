import assert from "node:assert/strict";
import test from "node:test";

import { AuthError, createAuthClient } from "../lib/auth.ts";

const user = { id: 7, name: "Test Person", email: "person@example.com" };
const session = (token = "access-token") => ({
  access_token: token,
  refresh_token: "handled-by-the-http-only-cookie",
  user,
});
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", ...headers },
});

test("login sends JSON credentials and uses the returned bearer token for the profile", async () => {
  const client = createAuthClient(async (path, options) => {
    assert.equal(options.credentials, "same-origin");
    assert.equal(options.cache, "no-store");
    assert.equal(options.headers.get("Accept"), "application/json");

    if (path.endsWith("/login")) {
      assert.equal(options.method, "POST");
      assert.equal(options.headers.get("Content-Type"), "application/json");
      assert.deepEqual(JSON.parse(options.body), { email: user.email, password: "password123" });
      return json(session());
    }

    assert.equal(path, "/api/v1/auth/me");
    assert.equal(options.headers.get("Authorization"), "Bearer access-token");
    return json({ data: user });
  });

  assert.deepEqual(await client.login(` ${user.email} `, "password123"), user);
  assert.deepEqual(await client.getUser(), user);
});

test("registration sends the backend field names and signs the user in immediately", async () => {
  const client = createAuthClient(async (path, options) => {
    if (path.endsWith("/register")) {
      assert.deepEqual(JSON.parse(options.body), {
        name: user.name,
        email: user.email,
        password: "password123",
        password_confirmation: "password123",
      });
      return json(session("registration-token"), 201);
    }
    assert.equal(options.headers.get("Authorization"), "Bearer registration-token");
    return json({ data: user });
  });

  assert.deepEqual(await client.register({
    name: ` ${user.name} `,
    email: ` ${user.email} `,
    password: "password123",
    password_confirmation: "password123",
  }), user);
  assert.deepEqual(await client.getUser(), user);
});

test("a page reload restores the session through the refresh cookie", async () => {
  const paths = [];
  const client = createAuthClient(async (path, options) => {
    paths.push(path);
    if (path.endsWith("/refresh")) {
      assert.equal(options.method, "POST");
      assert.equal(options.credentials, "same-origin");
      assert.equal(options.body, undefined);
      return json(session("refreshed-token"));
    }
    assert.equal(options.headers.get("Authorization"), "Bearer refreshed-token");
    return json({ data: user });
  });

  assert.deepEqual(await client.getUser(), user);
  assert.deepEqual(paths, ["/api/v1/auth/refresh", "/api/v1/auth/me"]);
});

test("an expired access token refreshes and retries the protected request once", async () => {
  const paths = [];
  const client = createAuthClient(async (path, options) => {
    paths.push(path);
    if (path.endsWith("/login")) return json(session("expired-token"));
    if (path.endsWith("/refresh")) return json(session("fresh-token"));
    if (options.headers.get("Authorization") === "Bearer expired-token") {
      return json({ message: "Unauthenticated." }, 401);
    }
    assert.equal(options.headers.get("Authorization"), "Bearer fresh-token");
    return json({ data: user });
  });

  await client.login(user.email, "password123");
  assert.deepEqual(await client.getUser(), user);
  assert.deepEqual(paths, ["/api/v1/auth/login", "/api/v1/auth/me", "/api/v1/auth/refresh", "/api/v1/auth/me"]);
});

test("a second unauthorized response stops instead of creating a refresh loop", async () => {
  let refreshes = 0;
  let profiles = 0;
  const client = createAuthClient(async (path) => {
    if (path.endsWith("/login")) return json(session());
    if (path.endsWith("/refresh")) {
      refreshes += 1;
      return json(session("fresh-token"));
    }
    profiles += 1;
    return json({ message: "Unauthenticated." }, 401);
  });

  await client.login(user.email, "password123");
  await assert.rejects(client.getUser(), (error) => error instanceof AuthError && error.status === 401);
  assert.equal(refreshes, 1);
  assert.equal(profiles, 2);
});

test("concurrent requests share one refresh operation", async () => {
  let refreshes = 0;
  let release;
  const refreshResponse = new Promise((resolve) => { release = () => resolve(json(session())); });
  const client = createAuthClient(async (path) => {
    if (path.endsWith("/refresh")) {
      refreshes += 1;
      return refreshResponse;
    }
    return json({ data: user });
  });

  const first = client.getUser();
  const second = client.getUser();
  assert.equal(refreshes, 1);
  release();
  assert.deepEqual(await Promise.all([first, second]), [user, user]);
});

test("missing or expired refresh cookies produce a sign-in error without fetching private data", async () => {
  const client = createAuthClient(async (path) => {
    assert.equal(path, "/api/v1/auth/refresh");
    return json({ message: "The refresh token field is required." }, 422);
  });

  await assert.rejects(client.getUser(), (error) =>
    error instanceof AuthError && error.status === 401 && /sign in again/.test(error.message),
  );
});

test("Laravel field validation errors are preserved for inline feedback", async () => {
  const errors = { email: ["The email has already been taken."] };
  const client = createAuthClient(async () => json({ message: "Please check your details.", errors }, 422));

  await assert.rejects(client.register({ name: user.name, email: user.email, password: "password123", password_confirmation: "password123" }),
    (error) => error instanceof AuthError && error.status === 422 && assert.deepEqual(error.errors, errors) === undefined,
  );
});

test("rate limits show the backend retry interval", async () => {
  const client = createAuthClient(async () => json({ message: "Too many requests." }, 429, { "Retry-After": "30" }));
  await assert.rejects(client.login(user.email, "password123"), (error) =>
    error instanceof AuthError && error.status === 429 && /30 seconds/.test(error.message),
  );
});

test("network and non-JSON server failures show useful messages", async () => {
  const offline = createAuthClient(async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(offline.login(user.email, "password123"), /couldn't connect/);

  const unavailable = createAuthClient(async () => new Response("Private server diagnostics", { status: 503 }));
  await assert.rejects(unavailable.login(user.email, "password123"), (error) =>
    error.status === 503 && error.message.includes("temporarily unavailable") && !error.message.includes("diagnostics"),
  );
});

test("a stale refresh cannot overwrite a newer login", async () => {
  let release;
  const pending = new Promise((resolve) => { release = () => resolve(json(session("stale-token"))); });
  const client = createAuthClient(async (path, options) => {
    if (path.endsWith("/refresh")) return pending;
    if (path.endsWith("/login")) return json(session("new-login-token"));
    assert.equal(options.headers.get("Authorization"), "Bearer new-login-token");
    return json({ data: user });
  });

  const oldRequest = client.getUser();
  const rejection = assert.rejects(oldRequest, (error) => error instanceof AuthError && error.status === 409);
  await client.login(user.email, "password123");
  release();
  await rejection;
  assert.deepEqual(await client.getUser(), user);
});

test("logout revokes the backend session and clears the in-memory access token", async () => {
  let loggedOut = false;
  const client = createAuthClient(async (path, options) => {
    if (path.endsWith("/login")) return json(session());
    if (path.endsWith("/logout")) {
      assert.equal(options.method, "POST");
      assert.equal(options.headers.get("Authorization"), "Bearer access-token");
      loggedOut = true;
      return json({ message: "Successfully logged out." });
    }
    assert.equal(path, "/api/v1/auth/refresh");
    assert.equal(loggedOut, true);
    return json({ message: "Expired session." }, 401);
  });

  await client.login(user.email, "password123");
  await client.logout();
  await assert.rejects(client.getUser(), (error) => error.status === 401);
});

test("malformed success responses never authenticate a user", async () => {
  const client = createAuthClient(async () => json({ access_token: "token", user: null }));
  await assert.rejects(client.login(user.email, "password123"), (error) => error.status === 502);
});
