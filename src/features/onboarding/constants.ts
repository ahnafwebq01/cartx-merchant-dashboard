import type { OnboardingStepDefinition } from "./types";

export const ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    step: 1,
    id: "store",
    title: "Store Identity",
    titleBn: "স্টোরের পরিচয়",
    description: "Store name, subdomain slug, and owner details",
    path: "/onboarding/store",
  },
  {
    step: 2,
    id: "business",
    title: "Business Info",
    titleBn: "ব্যবসার তথ্য",
    description: "Physical location, district, and business category",
    path: "/onboarding/business",
  },
  {
    step: 3,
    id: "storefront",
    title: "Storefront",
    titleBn: "স্টোরফ্রন্ট সেটআপ",
    description: "Theme selection, brand color, and description",
    path: "/onboarding/storefront",
  },
  {
    step: 4,
    id: "products",
    title: "First Product",
    titleBn: "প্রথম পণ্য যোগ",
    description: "Add initial catalog item with BDT pricing and stock",
    path: "/onboarding/products",
  },
  {
    step: 5,
    id: "payments",
    title: "Payment Setup",
    titleBn: "পেমেন্ট পদ্ধতি",
    description: "Cash on delivery and digital payment gateways",
    path: "/onboarding/payments",
    isOptional: true,
  },
  {
    step: 6,
    id: "shipping",
    title: "Shipping & Delivery",
    titleBn: "ডেলিভারি সেটিংস",
    description: "Delivery charges inside/outside Dhaka",
    path: "/onboarding/shipping",
    isOptional: true,
  },
  {
    step: 7,
    id: "publish",
    title: "Preview & Publish",
    titleBn: "রিভিউ ও প্রকাশ",
    description: "Verify configurations and launch storefront",
    path: "/onboarding/publish",
  },
];

