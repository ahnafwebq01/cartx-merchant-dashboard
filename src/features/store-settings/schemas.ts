import { z } from "zod";
import { SLUG_REGEX } from "@/features/onboarding/schemas";

const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export const storeSettingsSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name cannot exceed 100 characters"),
  slug: z
    .string()
    .min(3, "Subdomain slug must be at least 3 characters")
    .max(50, "Subdomain slug cannot exceed 50 characters")
    .regex(SLUG_REGEX, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  businessCategory: z.string().min(1, "Business category is required"),
  businessAddress: z.string().min(5, "Physical business address is required"),
  district: z.string().min(1, "District is required"),
  cityArea: z.string().min(2, "City or area is required"),
  postalCode: z.string().optional(),
  tradeLicenseNo: z.string().optional(),
  ownerName: z.string().min(2, "Owner name is required"),
  contactEmail: z.string().email("Valid email address required"),
  contactPhone: z
    .string()
    .regex(BD_PHONE_REGEX, "Valid 11-digit Bangladeshi mobile number required"),
  currency: z.string(),
  locale: z.string(),
  timezone: z.string(),
});

export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;
