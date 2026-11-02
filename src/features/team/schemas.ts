import { z } from "zod";
import type { MerchantRole } from "@/types/auth";

export const ALL_ROLES: MerchantRole[] = [
  "owner",
  "admin",
  "order_manager",
  "product_manager",
  "inventory_manager",
  "marketing_manager",
  "accountant",
  "support",
];

export const INVITABLE_ROLES: MerchantRole[] = [
  "admin",
  "order_manager",
  "product_manager",
  "inventory_manager",
  "marketing_manager",
  "accountant",
  "support",
];

export const inviteMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  role: z.enum([
    "admin",
    "order_manager",
    "product_manager",
    "inventory_manager",
    "marketing_manager",
    "accountant",
    "support",
  ] as const, {
    message: "Please select a valid role",
  }),
  customPermissions: z.array(z.string()).default([]),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export const updateMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().optional(),
  role: z.enum([
    "owner",
    "admin",
    "order_manager",
    "product_manager",
    "inventory_manager",
    "marketing_manager",
    "accountant",
    "support",
  ] as const),
  status: z.enum(["active", "suspended", "inactive"] as const),
  customPermissions: z.array(z.string()).default([]),
});

export type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;
