import { z } from "zod";

export const paymentProviderEnum = z.enum(["bkash", "nagad", "sslcommerz", "cod"]);
export const paymentTransactionStatusEnum = z.enum([
  "pending",
  "successful",
  "failed",
  "cancelled",
  "expired",
  "refunded",
  "partially_refunded",
]);

export const refundStatusEnum = z.enum([
  "pending",
  "approved",
  "processed",
  "rejected",
  "failed",
]);

export const initiatePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().regex(/^(?:\+8801|01)[3-9]\d{8}$/, "Valid Bangladesh phone required"),
  amount: z.number().positive("Amount must be greater than 0"),
  provider: paymentProviderEnum,
  idempotencyKey: z.string().min(8, "Idempotency key must be at least 8 characters"),
});

export const verifyPaymentSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  gatewayTransactionId: z.string().min(4, "Gateway Transaction ID is required"),
  status: z.enum(["successful", "failed", "cancelled", "expired"]),
  errorMessage: z.string().optional(),
});

export const requestRefundSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  amount: z.number().positive("Refund amount must be greater than 0"),
  reason: z.string().min(5, "Refund reason must be at least 5 characters"),
  idempotencyKey: z.string().min(8, "Idempotency key must be at least 8 characters"),
  requestedBy: z.string(),
});

export const configurePaymentMethodSchema = z.object({
  provider: paymentProviderEnum,
  isEnabled: z.boolean(),
  environment: z.enum(["sandbox", "live"]),
  merchantId: z.string().optional(),
  accountIdentifier: z.string().optional(),
  // Public instructions / customer notes
  instructions: z.string().optional(),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type RequestRefundInput = z.infer<typeof requestRefundSchema>;
export type ConfigurePaymentMethodInput = z.infer<typeof configurePaymentMethodSchema>;
