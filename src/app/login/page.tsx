import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Merchant Sign In — CartX",
  description: "Sign in to access your CartX merchant administration console",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome to CartX"
      subtitle="Sign in to administer products, track live orders, and manage fulfillment"
    >
      <LoginForm />
    </AuthLayout>
  );
}

