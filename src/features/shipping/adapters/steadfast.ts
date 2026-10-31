import type {
  CourierAdapter,
  CreateConsignmentRequest,
  CreateConsignmentResponse,
  TrackConsignmentResponse,
  CancelConsignmentResponse,
} from "./types";
import type { NormalizedShipmentStatus, ShipmentTimelineEvent } from "../types";

export class SteadfastCourierAdapter implements CourierAdapter {
  public readonly courierId = "steadfast" as const;
  public readonly displayName = "Steadfast Courier";

  public normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    const s = rawStatus.toLowerCase().trim();
    switch (s) {
      case "in_review":
      case "pending":
        return "pending";
      case "picked_up":
        return "picked_up";
      case "in_transit":
      case "hold":
        return "in_transit";
      case "delivered":
      case "partial_delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      case "returned":
      case "return_received":
        return "returned";
      case "delivery_failed":
        return "failed";
      default:
        return "pending";
    }
  }

  public async createConsignment(
    request: CreateConsignmentRequest
  ): Promise<CreateConsignmentResponse> {
    if (!request.recipientPhone) {
      throw new Error("[Steadfast Adapter] Recipient phone number is required");
    }

    if (!request.idempotencyKey) {
      throw new Error("[Steadfast Adapter] Idempotency key required");
    }

    const randNum = Math.floor(10000 + Math.random() * 90000);
    const consignmentId = `STDF-${randNum}`;
    const trackingId = `STDF${randNum}BD`;

    return {
      consignmentId,
      trackingId,
      status: "pending",
      rawStatus: "in_review",
      message: "Steadfast consignment created successfully.",
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
        title: "Consignment Created",
        description: "Parcel order registered in Steadfast system.",
        location: "Merchant Hub, Dhaka",
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      consignmentId,
      trackingId: `${consignmentId.replace("-", "")}BD`,
      status: "pending",
      rawStatus: "in_review",
      events,
    };
  }

  public async cancelConsignment(
    consignmentId: string,
    reason: string = "Merchant cancelled shipment"
  ): Promise<CancelConsignmentResponse> {
    return {
      success: true,
      consignmentId,
      message: `Consignment ${consignmentId} cancelled in Steadfast. Reason: ${reason}`,
    };
  }
}

