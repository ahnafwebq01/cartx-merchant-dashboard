import { z } from "zod";

/**
 * Bangladeshi phone number pattern: +8801XXXXXXXXX, 8801XXXXXXXXX, or 01XXXXXXXXX (11 digits)
 */
const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

/**
 * Valid subdomain slug: lowercase letters, numbers, and hyphens (not leading/trailing)
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const storeIdentitySchema = z.object({
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters (দোকানের নাম কমপক্ষে ২ অক্ষরের হতে হবে)")
    .max(100, "Store name cannot exceed 100 characters"),
  storeSlug: z
    .string()
    .min(3, "Subdomain slug must be at least 3 characters")
    .max(50, "Subdomain slug cannot exceed 50 characters")
    .regex(SLUG_REGEX, "Slug can only contain lowercase letters, numbers, and hyphens (e.g. my-store)"),
  businessType: z.string().min(1, "Please select your business structure (ব্যবসার ধরন নির্বাচন করুন)"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters (মালিকের নাম আবশ্যক)"),
  contactEmail: z.string().email("Please provide a valid email address (সঠিক ইমেইল ঠিকানা দিন)"),
  contactPhone: z
    .string()
    .regex(BD_PHONE_REGEX, "Please provide a valid 11-digit Bangladeshi mobile number (যেমন: 01700000000)"),
});

export type StoreIdentityFormValues = z.infer<typeof storeIdentitySchema>;

export const businessInfoSchema = z.object({
  businessAddress: z.string().min(5, "Full business address is required (ব্যবসার পূর্ণ ঠিকানা দিন)"),
  district: z.string().min(1, "Please select a district (জেলা নির্বাচন করুন)"),
  cityArea: z.string().min(2, "City or area is required (শহর বা এলাকা আবশ্যক)"),
  postalCode: z.string().optional(),
  businessCategory: z.string().min(1, "Please select a business category (ব্যবসার ক্যাটাগরি নির্বাচন করুন)"),
  tradeLicenseNo: z.string().optional(),
});

export type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

export const storefrontSetupSchema = z.object({
  storeDescription: z
    .string()
    .min(10, "Please provide a short description of your store (কমপক্ষে ১০ অক্ষর)")
    .max(500, "Description cannot exceed 500 characters"),
  brandColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color (যেমন: #2563EB)"),
  themeId: z.string().min(1, "Please select a storefront theme"),
  logoUrl: z.string().url("Please provide a valid image URL").optional().or(z.literal("")),
});

export type StorefrontSetupFormValues = z.infer<typeof storefrontSetupSchema>;

export const firstProductSchema = z.object({
  productName: z.string().min(2, "Product name is required (পণ্যের নাম আবশ্যক)"),
  price: z.number().positive("Price must be greater than 0 BDT (মূল্য ০ টাকার বেশি হতে হবে)"),
  initialStock: z.number().int().nonnegative("Initial stock cannot be negative (স্টক ঋণাত্মক হতে পারবে না)"),
  category: z.string().min(1, "Product category is required (পণ্যের ক্যাটাগরি নির্বাচন করুন)"),
  imageUrl: z.string().url("Please provide a valid product image URL").optional().or(z.literal("")),
});

export type FirstProductFormValues = z.infer<typeof firstProductSchema>;

export const paymentSetupSchema = z.object({
  cashOnDelivery: z.boolean(),
  onlineProvider: z.string().optional(),
  providerStatus: z.enum(["unconfigured", "connected", "failed", "unavailable"]),
});

export type PaymentSetupFormValues = z.infer<typeof paymentSetupSchema>;

export const shippingSetupSchema = z.object({
  insideDhakaRate: z.number().min(0, "Inside Dhaka delivery charge cannot be negative"),
  outsideDhakaRate: z.number().min(0, "Outside Dhaka delivery charge cannot be negative"),
  freeShippingThreshold: z.number().min(0).optional(),
  courierPartner: z.string().optional(),
});

export type ShippingSetupFormValues = z.infer<typeof shippingSetupSchema>;
