import type { Metadata } from "next";

import AccountPanel from "@/components/auth/account-panel";
import AuthLayout from "@/components/auth/auth-layout";

export const metadata: Metadata = { title: "Your account" };

export default function AccountPage() {
  return <AuthLayout><AccountPanel /></AuthLayout>;
}
