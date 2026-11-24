import type { ReactNode } from "react";

import AuthPoster from "@/components/auth/auth-poster";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 rounded-3xl border border-brand-white/10 bg-brand-white/5 p-4 sm:p-6 md:grid-cols-2 md:p-8 lg:gap-12">
          <AuthPoster />
          {children}
        </div>
      </div>
    </main>
  );
}
