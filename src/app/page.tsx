import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "CartX Merchant Dashboard — Simple, Modern E-Commerce Platform",
  description:
    "Centralized merchant administration console for catalog management, multi-courier logistics, order tracking, and sales analytics.",
};

export default function RootHomePage() {
  return <LandingPage />;
}
