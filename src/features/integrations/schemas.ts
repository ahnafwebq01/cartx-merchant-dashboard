import { z } from "zod";

export const webhookEndpointSchema = z.object({
  url: z.string().url("Must be a valid HTTPS/HTTP URL (e.g. https://api.yourstore.com/webhooks)"),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional().default(""),
  events: z.array(z.enum([
    "order.created",
    "order.updated",
    "order.cancelled",
    "inventory.low_stock",
    "customer.created",
    "coupon.redeemed",
  ])).min(1, "Select at least one subscribed webhook event"),
  isActive: z.boolean().default(true),
});

export type WebhookEndpointFormValues = z.infer<typeof webhookEndpointSchema>;

export const integrationConfigSchema = z.record(z.string(), z.string().or(z.boolean()));

export type IntegrationConfigValues = Record<string, string | boolean>;

