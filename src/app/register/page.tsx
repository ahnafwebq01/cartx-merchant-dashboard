import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register Merchant Store — CartX",
  description: "Create a new CartX merchant demo account and launch your storefront",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Merchant Store"
      subtitle="Experience full-featured e-commerce management built for Bangladeshi merchants"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

