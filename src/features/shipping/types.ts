export type CourierProviderId = "steadfast" | "pathao" | "redx";

export type NormalizedShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "returned"
  | "failed";

export type ShipmentDeliveryType = "standard" | "express";

export interface ShipmentTimelineEvent {
  id: string;
  status: NormalizedShipmentStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface Shipment {
  id: string; // e.g. "shp-1001"
  consignmentId: string; // Courier-assigned consignment number
  trackingId: string; // Public tracking code for customer/courier portal
  orderId: string;
  orderNumber: string;
  courier: CourierProviderId;
  courierName: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  deliveryAddress: string;
  city: string;
  district: string;
  deliveryCharge: number; // In BDT
  codAmount: number; // Cash to collect on delivery in BDT
  weightKg: number;
  status: NormalizedShipmentStatus;
  rawCourierStatus?: string;
  deliveryType: ShipmentDeliveryType;
  timeline: ShipmentTimelineEvent[];
  idempotencyKey: string;
  estimatedDelivery?: string;
  pickupLocation: string;
  specialInstructions?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourierConnection {
  id: CourierProviderId;
  name: string;
  displayNameBn: string;
  description: string;
  isEnabled: boolean;
  status: "connected" | "disconnected" | "demo_mode" | "error";
  defaultPickupAddress: string;
  pickupPhone: string;
  accountIdentifier?: string;
  hasApiKey: boolean; // True if configured on backend; secrets NEVER stored in client
  supportedServices: string[];
  isDemo: boolean;
  lastSyncAt?: string;
}

export interface ShippingRatesConfig {
  insideDhakaRate: number;
  outsideDhakaRate: number;
  freeShippingThreshold: number;
  codFeePercentage: number;
  defaultCourier: CourierProviderId;
}

export interface ShippingKPIStats {
  totalShipmentsCount: number;
  inTransitCount: number;
  deliveredCount: number;
  pendingPickupCount: number;
  returnedOrCancelledCount: number;
  totalCodToCollect: number;
}

export interface ShipmentFilterParams {
  search?: string;
  status?: NormalizedShipmentStatus | "all";
  courier?: CourierProviderId | "all";
  page?: number;
  limit?: number;
  sortBy?: "date_desc" | "date_asc" | "cod_desc" | "cod_asc";
}

export interface PaginatedShipmentsResult {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

