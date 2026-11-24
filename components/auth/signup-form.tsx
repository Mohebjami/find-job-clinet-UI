"use client";

import Link from "next/link";

import AuthHeader from "@/components/auth/auth-header";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import FormMessage from "@/components/ui/form-message";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authClient, AuthError } from "@/lib/auth";

export default function SignupForm() {
  const { handleSubmit, isSubmitting, error, fieldErrors } = useAuthForm((data) => {
    const password = String(data.get("password") || "");
    const passwordConfirmation = String(data.get("password_confirmation") || "");

    if (password !== passwordConfirmation) {
      throw new AuthError("Please check your password confirmation.", 422, {
        password_confirmation: ["Your passwords do not match."],
      });
    }

    return authClient.register({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      password,
      password_confirmation: passwordConfirmation,
    });
  });

  return (
    <section aria-labelledby="signup-title" className="px-2 py-6 sm:px-4 lg:px-8">
      <AuthHeader
        id="signup-title"
        title="Your next chapter"
        description="Create your account and take the first step toward your next job."
      />

      <form method="post" onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-8 space-y-5">
        <FormMessage message={error} />
        <FormField
          id="signup-name"
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={255}
          placeholder="Your full name"
          error={fieldErrors.name?.[0]}
          required
        />
        <FormField
          id="signup-email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={255}
          placeholder="you@example.com"
          error={fieldErrors.email?.[0]}
          required
        />
        <FormField
          id="signup-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          placeholder="Create a password"
          hint="Use at least 8 characters."
          error={fieldErrors.password?.[0]}
          required
        />
        <FormField
          id="signup-password-confirmation"
          label="Confirm password"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          placeholder="Enter your password again"
          error={fieldErrors.password_confirmation?.[0]}
          required
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Creating your account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm leading-6 text-brand-white/65">
        Already have an account?{" "}
        <Link href="/login" className="rounded text-brand-blue underline-offset-4 hover:text-brand-lime hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
          Sign in
        </Link>
      </p>
    </section>
  );
}
