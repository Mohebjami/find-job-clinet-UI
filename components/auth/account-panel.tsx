"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthHeader from "@/components/auth/auth-header";
import Button from "@/components/ui/button";
import FormMessage from "@/components/ui/form-message";
import { authClient, AuthError, type AuthUser } from "@/lib/auth";

type AccountState =
  | { status: "loading" }
  | { status: "ready"; user: AuthUser }
  | { status: "error"; message: string };

export default function AccountPanel() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let active = true;

    authClient.getUser().then((user) => {
      if (active) setAccount({ status: "ready", user });
    }).catch((error: unknown) => {
      if (!active) return;
      if (error instanceof AuthError && error.status === 401) {
        router.replace("/login");
      } else {
        setAccount({
          status: "error",
          message: error instanceof AuthError ? error.message : "We couldn't load your account. Please try again.",
        });
      }
    });

    return () => { active = false; };
  }, [router, attempt]);

  async function handleLogout() {
    setIsSigningOut(true);
    setLogoutError("");

    try {
      await authClient.logout();
      setAccount({ status: "loading" });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof AuthError ? error.message : "We couldn't sign you out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <section aria-labelledby="account-title" className="min-w-0 px-2 py-6 sm:px-4 lg:px-8">
      {account.status === "loading" ? (
        <div role="status" className="py-12 text-center text-brand-white/70">
          <h1 id="account-title" className="sr-only">Your account</h1>
          Checking your session…
        </div>
      ) : account.status === "error" ? (
        <div className="space-y-6">
          <h1 id="account-title" className="text-3xl font-semibold">Your account</h1>
          <FormMessage message={account.message} />
          <Button onClick={() => {
            setAccount({ status: "loading" });
            setAttempt((value) => value + 1);
          }}>Try again</Button>
        </div>
      ) : (
        <>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-mint/25 bg-brand-mint/10 px-3 py-1.5 text-xs font-medium text-brand-mint">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-mint" />
            Successfully signed in
          </div>
          <AuthHeader
            id="account-title"
            title={`Welcome, ${account.user.name}`}
            description="Your account is ready for your next opportunity."
          />
          <dl className="my-8 space-y-5 rounded-2xl border border-brand-white/10 bg-brand-ink p-5">
            <div>
              <dt className="text-xs text-brand-white/60">Full name</dt>
              <dd className="mt-1 break-words font-medium text-brand-white">{account.user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-white/60">Email address</dt>
              <dd className="mt-1 break-all font-medium text-brand-white">{account.user.email}</dd>
            </div>
          </dl>
          <div className="space-y-4">
            <FormMessage message={logoutError} />
            <Button onClick={handleLogout} loading={isSigningOut} className="w-full">
              {isSigningOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
