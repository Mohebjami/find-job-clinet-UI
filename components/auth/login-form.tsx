"use client";

import Link from "next/link";

import AuthHeader from "@/components/auth/auth-header";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import FormMessage from "@/components/ui/form-message";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authClient } from "@/lib/auth";

export default function LoginForm() {
  const { handleSubmit, isSubmitting, error, fieldErrors } = useAuthForm((data) =>
    authClient.login(String(data.get("email") || ""), String(data.get("password") || "")),
  );

  return (
    <section aria-labelledby="login-title" className="px-2 py-6 sm:px-4 lg:px-8">
      <AuthHeader
        id="login-title"
        title="Welcome back"
        description="Your next opportunity is waiting. Sign in to continue."
      />

      <form method="post" onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-8 space-y-6">
        <FormMessage message={error} />
        <FormField
          id="login-email"
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          maxLength={255}
          placeholder="you@example.com"
          error={fieldErrors.email?.[0]}
          required
        />
        <FormField
          id="login-password"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          maxLength={1024}
          placeholder="Enter your password"
          error={fieldErrors.password?.[0]}
          required
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm leading-6 text-brand-white/65">
        New to mb-web-client?{" "}
        <Link href="/signup" className="rounded text-brand-blue underline-offset-4 hover:text-brand-lime hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
          Create an account
        </Link>
      </p>
    </section>
  );
}
