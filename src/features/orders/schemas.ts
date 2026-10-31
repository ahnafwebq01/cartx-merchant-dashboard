import { z } from "zod";

export const cancelOrderSchema = z.object({
  reason: z
    .string()
    .min(3, "Cancellation reason must be at least 3 characters")
    .max(500, "Reason cannot exceed 500 characters"),
  restockInventory: z.boolean().default(true),
});

export type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;

export const returnOrderSchema = z.object({
  reason: z
    .string()
    .min(3, "Return reason must be at least 3 characters")
    .max(500, "Reason cannot exceed 500 characters"),
  restockInventory: z.boolean().default(true),
  refundAmount: z.number().min(0).optional(),
});

export type ReturnOrderFormValues = z.infer<typeof returnOrderSchema>;

export const orderStatusTransitionSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "ready_to_ship",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
    "partially_returned",
  ]),
  note: z.string().max(300).optional(),
});

export type OrderStatusTransitionFormValues = z.infer<
  typeof orderStatusTransitionSchema
>;

export const orderNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty").max(1000, "Note too long"),
});

export type OrderNoteFormValues = z.infer<typeof orderNoteSchema>;

export const markPaymentSchema = z.object({
  paymentStatus: z.enum([
    "unpaid",
    "pending",
    "paid",
    "partially_paid",
    "partially_refunded",
    "refunded",
    "failed",
  ]),
  paymentReference: z.string().optional(),
  amountPaid: z.number().min(0).optional(),
});

export type MarkPaymentFormValues = z.infer<typeof markPaymentSchema>;

