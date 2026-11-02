import { z } from "zod";

export const changePlanSchema = z.object({
  planId: z.enum(["starter", "growth", "pro"] as const),
  billingCycle: z.enum(["monthly", "annual"] as const),
});

export type ChangePlanFormValues = z.infer<typeof changePlanSchema>;

export const billingSettingsSchema = z.object({
  billingEmail: z.string().trim().email("Please enter a valid billing email"),
  companyName: z.string().trim().min(2, "Company / Store legal name is required"),
  businessIdentificationNumber: z.string().trim().optional(),
  taxRegistrationNumber: z.string().trim().optional(),
  street: z.string().trim().min(2, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "District / State is required"),
  postalCode: z.string().trim().min(3, "Postal code is required"),
  country: z.string().trim().default("Bangladesh"),
});

export type BillingSettingsFormValues = z.infer<typeof billingSettingsSchema>;

export const paymentMethodSchema = z.object({
  type: z.enum(["bkash", "nagad", "card"] as const),
  label: z.string().trim().min(2, "Label is required"),
  identifier: z.string().trim().min(4, "Identifier (e.g. mobile number or last 4 digits) is required"),
  accountHolderName: z.string().trim().min(2, "Account holder name is required"),
  isDefault: z.boolean().default(false),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

