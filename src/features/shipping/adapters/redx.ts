import type {
  CourierAdapter,
  CreateConsignmentRequest,
  CreateConsignmentResponse,
  TrackConsignmentResponse,
  CancelConsignmentResponse,
} from "./types";
import type { NormalizedShipmentStatus, ShipmentTimelineEvent } from "../types";

export class RedxCourierAdapter implements CourierAdapter {
  public readonly courierId = "redx" as const;
  public readonly displayName = "RedX Delivery";

  public normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    const s = rawStatus.toLowerCase().replace(/_/g, " ").trim();
    switch (s) {
      case "ready for pickup":
      case "pending":
        return "pending";
      case "pickup done":
      case "picked up":
        return "picked_up";
      case "in transit":
      case "sorted":
        return "in_transit";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      case "agent returning":
      case "returned":
        return "returned";
      case "delivery failed":
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  }

  public async createConsignment(
    request: CreateConsignmentRequest
  ): Promise<CreateConsignmentResponse> {
    if (!request.recipientPhone) {
      throw new Error("[RedX Adapter] Recipient phone number required");
    }

    if (!request.idempotencyKey) {
      throw new Error("[RedX Adapter] Idempotency key required");
    }

    const randNum = Math.floor(10000 + Math.random() * 90000);
    const consignmentId = `RDX-${randNum}`;
    const trackingId = `RDX${randNum}BD`;

    return {
      consignmentId,
      trackingId,
      status: "pending",
      rawStatus: "ready_for_pickup",
      message: "RedX parcel booking confirmed.",
      isDemoSimulation: true,
    };
  }

  public async trackConsignment(
    consignmentId: string
  ): Promise<TrackConsignmentResponse> {
    const events: ShipmentTimelineEvent[] = [
      {
        id: `evt-${Date.now().toString(36)}-1`,
        status: "pending",
        title: "Parcel Registered",
        description: "Parcel booked on RedX network.",
        location: "Dhaka Hub",
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      consignmentId,
      trackingId: `${consignmentId.replace("-", "")}BD`,
      status: "pending",
      rawStatus: "ready_for_pickup",
      events,
    };
  }

  public async cancelConsignment(
    consignmentId: string,
    reason: string = "Merchant cancelled parcel"
  ): Promise<CancelConsignmentResponse> {
    return {
      success: true,
      consignmentId,
      message: `Consignment ${consignmentId} cancelled in RedX. Reason: ${reason}`,
    };
  }
}

