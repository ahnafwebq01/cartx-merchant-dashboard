import type {
  CourierProviderId,
  NormalizedShipmentStatus,
  ShipmentTimelineEvent,
} from "../types";

export interface CreateConsignmentRequest {
  orderId: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  city: string;
  district: string;
  codAmount: number;
  weightKg: number;
  deliveryType: "standard" | "express";
  pickupLocation: string;
  instructions?: string;
  idempotencyKey: string;
}

export interface CreateConsignmentResponse {
  consignmentId: string;
  trackingId: string;
  status: NormalizedShipmentStatus;
  rawStatus: string;
  message: string;
  isDemoSimulation: boolean;
}

export interface TrackConsignmentResponse {
  consignmentId: string;
  trackingId: string;
  status: NormalizedShipmentStatus;
  rawStatus: string;
  events: ShipmentTimelineEvent[];
}

export interface CancelConsignmentResponse {
  success: boolean;
  consignmentId: string;
  message: string;
}

export interface CourierAdapter {
  readonly courierId: CourierProviderId;
  readonly displayName: string;
  createConsignment(
    request: CreateConsignmentRequest
  ): Promise<CreateConsignmentResponse>;
  trackConsignment(consignmentId: string): Promise<TrackConsignmentResponse>;
  cancelConsignment(
    consignmentId: string,
    reason?: string
  ): Promise<CancelConsignmentResponse>;
  normalizeStatus(rawStatus: string): NormalizedShipmentStatus;
}

