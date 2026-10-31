import { z } from "zod";

export const courierProviderEnum = z.enum(["steadfast", "pathao", "redx"]);
export const normalizedShipmentStatusEnum = z.enum([
  "pending",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
  "returned",
  "failed",
]);

export const createShipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  courier: courierProviderEnum,
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  recipientPhone: z.string().regex(/^(?:\+8801|01)[3-9]\d{8}$/, "Valid Bangladesh mobile number required"),
  deliveryAddress: z.string().min(5, "Delivery address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  weightKg: z.number().positive("Weight must be greater than 0 kg"),
  codAmount: z.number().min(0, "COD amount cannot be negative"),
  deliveryCharge: z.number().min(0, "Delivery charge cannot be negative"),
  deliveryType: z.enum(["standard", "express"]),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  specialInstructions: z.string().optional(),
  idempotencyKey: z.string().min(8, "Idempotency key required"),
});

export const cancelShipmentSchema = z.object({
  shipmentId: z.string().min(1, "Shipment ID is required"),
  reason: z.string().min(5, "Cancellation reason must be at least 5 characters"),
});

export const shippingRatesSchema = z.object({
  insideDhakaRate: z.number().min(0, "Inside Dhaka rate must be non-negative"),
  outsideDhakaRate: z.number().min(0, "Outside Dhaka rate must be non-negative"),
  freeShippingThreshold: z.number().min(0, "Free shipping threshold must be non-negative"),
  codFeePercentage: z.number().min(0).max(10, "COD fee must be between 0% and 10%"),
  defaultCourier: courierProviderEnum,
});

export const configureCourierSchema = z.object({
  courierId: courierProviderEnum,
  isEnabled: z.boolean(),
  accountIdentifier: z.string().optional(),
  defaultPickupAddress: z.string().min(5, "Pickup address is required"),
  pickupPhone: z.string().regex(/^(?:\+8801|01)[3-9]\d{8}$/, "Valid Bangladesh phone required"),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type CancelShipmentInput = z.infer<typeof cancelShipmentSchema>;
export type ShippingRatesInput = z.infer<typeof shippingRatesSchema>;
export type ConfigureCourierInput = z.infer<typeof configureCourierSchema>;
