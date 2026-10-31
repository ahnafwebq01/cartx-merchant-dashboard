import type {
  CourierAdapter,
  CreateConsignmentRequest,
  CreateConsignmentResponse,
  TrackConsignmentResponse,
  CancelConsignmentResponse,
} from "./types";
import type { NormalizedShipmentStatus, ShipmentTimelineEvent } from "../types";

export class PathaoCourierAdapter implements CourierAdapter {
  public readonly courierId = "pathao" as const;
  public readonly displayName = "Pathao Courier";

  public normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    const s = rawStatus.toLowerCase().replace(/_/g, " ").trim();
    switch (s) {
      case "pickup requested":
      case "assigned for pickup":
      case "pending":
        return "pending";
      case "picked up":
        return "picked_up";
      case "in transit":
      case "at sorting hub":
        return "in_transit";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      case "return":
      case "returned":
      case "return in transit":
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
      throw new Error("[Pathao Adapter] Recipient mobile number required");
    }

    if (!request.idempotencyKey) {
      throw new Error("[Pathao Adapter] Idempotency key required");
    }

    const randNum = Math.floor(10000 + Math.random() * 90000);
    const consignmentId = `PTH-${randNum}`;
    const trackingId = `PTH${randNum}BD`;

    return {
      consignmentId,
      trackingId,
      status: "pending",
      rawStatus: "Pickup_Requested",
      message: "Pathao pickup requested successfully.",
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
        title: "Pickup Requested",
        description: "Merchant requested parcel pickup via Pathao Merchant API.",
        location: "Dhaka Central Hub",
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      consignmentId,
      trackingId: `${consignmentId.replace("-", "")}BD`,
      status: "pending",
      rawStatus: "Pickup_Requested",
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
      message: `Consignment ${consignmentId} cancelled in Pathao. Reason: ${reason}`,
    };
  }
}

