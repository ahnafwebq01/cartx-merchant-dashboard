import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(120, "Subject cannot exceed 120 characters"),
  category: z.enum([
    "billing",
    "technical",
    "shipping",
    "payments",
    "general",
    "feature_request",
  ] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  message: z
    .string()
    .trim()
    .min(15, "Please describe your issue or inquiry with at least 15 characters"),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const replyTicketSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Reply message cannot be empty"),
});

export type ReplyTicketFormValues = z.infer<typeof replyTicketSchema>;

