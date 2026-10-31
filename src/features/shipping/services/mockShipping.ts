import type {
  CourierConnection,
  NormalizedShipmentStatus,
  PaginatedShipmentsResult,
  Shipment,
  ShipmentFilterParams,
  ShippingKPIStats,
  ShippingRatesConfig,
} from "../types";
import { courierAdapterRegistry } from "../adapters";
import { mockOrderService } from "../../orders/services/mockOrders";
import type {
  CreateShipmentInput,
  CancelShipmentInput,
  ShippingRatesInput,
  ConfigureCourierInput,
} from "../schemas";

export const SHIPMENTS_STORAGE_KEY = "cartx_demo_shipments_v1";
export const COURIERS_STORAGE_KEY = "cartx_demo_couriers_v1";
export const SHIPPING_RATES_STORAGE_KEY = "cartx_demo_shipping_rates_v1";

export const INITIAL_COURIER_CONNECTIONS: CourierConnection[] = [
  {
    id: "steadfast",
    name: "Steadfast Courier",
    displayNameBn: "স্টেডফাস্ট কুরিয়ার",
    description: "Nationwide next-day courier with automated COD remittance and API tracking.",
    isEnabled: true,
    status: "connected",
    defaultPickupAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka",
    pickupPhone: "+8801711002233",
    accountIdentifier: "STDF-MER-8910",
    hasApiKey: true,
    supportedServices: ["Home Delivery", "Hub Pickup", "Express Next-Day"],
    isDemo: true,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
  {
    id: "pathao",
    name: "Pathao Courier",
    displayNameBn: "পাঠাও কুরিয়ার",
    description: "Rapid on-demand merchant parcel delivery across 64 Bangladesh districts.",
    isEnabled: true,
    status: "demo_mode",
    defaultPickupAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka",
    pickupPhone: "+8801711002233",
    accountIdentifier: "PTH-STORE-1029",
    hasApiKey: true,
    supportedServices: ["Same Day Dhaka", "Next Day National", "Fragile"],
    isDemo: true,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
  {
    id: "redx",
    name: "RedX Delivery",
    displayNameBn: "রেডএক্স ডেলিভারি",
    description: "ShopUp logistics network covering rural upazilas with doorstep COD.",
    isEnabled: true,
    status: "demo_mode",
    defaultPickupAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka",
    pickupPhone: "+8801711002233",
    accountIdentifier: "RDX-MER-3310",
    hasApiKey: true,
    supportedServices: ["Standard Doorstep", "Upazila Express"],
    isDemo: true,
    lastSyncAt: "2026-10-31T10:00:00.000Z",
  },
];

export const INITIAL_SHIPPING_RATES: ShippingRatesConfig = {
  insideDhakaRate: 60,
  outsideDhakaRate: 120,
  freeShippingThreshold: 5000,
  codFeePercentage: 1,
  defaultCourier: "steadfast",
};

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: "shp-1001",
    consignmentId: "STDF-89101",
    trackingId: "STDF89101BD",
    orderId: "ord-1002",
    orderNumber: "CTX-1002",
    courier: "steadfast",
    courierName: "Steadfast Courier",
    recipientName: "Nusrat Jahan",
    recipientPhone: "+8801819334455",
    recipientEmail: "nusrat.j@example.com",
    deliveryAddress: "Sector 4, Road 11, House 18, Uttara",
    city: "Dhaka",
    district: "Dhaka",
    deliveryCharge: 60,
    codAmount: 0,
    weightKg: 0.8,
    status: "in_transit",
    rawCourierStatus: "in_transit",
    deliveryType: "standard",
    pickupLocation: "Dhaka Warehouse (Uttara Hub)",
    idempotencyKey: "idem-shp-1002-initial",
    estimatedDelivery: "Tomorrow by 6:00 PM",
    timeline: [
      {
        id: "evt-shp-1001-1",
        status: "pending",
        title: "Consignment Booked",
        description: "Merchant created consignment via Steadfast API.",
        location: "Uttara Merchant Hub",
        timestamp: "2026-10-29T12:00:00.000Z",
      },
      {
        id: "evt-shp-1001-2",
        status: "picked_up",
        title: "Picked Up by Courier Rider",
        description: "Rider completed parcel collection from merchant premises.",
        location: "Uttara, Dhaka",
        timestamp: "2026-10-29T15:30:00.000Z",
      },
      {
        id: "evt-shp-1001-3",
        status: "in_transit",
        title: "Departed Sorting Hub",
        description: "Parcel dispatched to Uttara local delivery station.",
        location: "Tejgaon Central Hub",
        timestamp: "2026-10-30T09:00:00.000Z",
      },
    ],
    createdAt: "2026-10-29T12:00:00.000Z",
    updatedAt: "2026-10-30T09:00:00.000Z",
  },
  {
    id: "shp-1002",
    consignmentId: "STDF-89102",
    trackingId: "STDF89102BD",
    orderId: "ord-1003",
    orderNumber: "CTX-1003",
    courier: "steadfast",
    courierName: "Steadfast Courier",
    recipientName: "Mahmudul Hasan",
    recipientPhone: "+8801912445566",
    recipientEmail: "m.hasan@example.com",
    deliveryAddress: "GEC Circle, Nasirabad Housing Society, Road 3, House 7",
    city: "Chittagong",
    district: "Chittagong",
    deliveryCharge: 120,
    codAmount: 0,
    weightKg: 1.2,
    status: "delivered",
    rawCourierStatus: "delivered",
    deliveryType: "standard",
    pickupLocation: "Dhaka Warehouse",
    idempotencyKey: "idem-shp-1003-initial",
    estimatedDelivery: "Delivered",
    timeline: [
      {
        id: "evt-shp-1002-1",
        status: "pending",
        title: "Consignment Booked",
        description: "Consignment generated for Chittagong delivery.",
        location: "Dhaka Central",
        timestamp: "2026-10-29T14:30:00.000Z",
      },
      {
        id: "evt-shp-1002-2",
        status: "in_transit",
        title: "In Transit across Highway Hub",
        description: "Parcel in transit to Chittagong Nasirabad Hub.",
        location: "Chittagong Express Highway",
        timestamp: "2026-10-30T06:00:00.000Z",
      },
      {
        id: "evt-shp-1002-3",
        status: "delivered",
        title: "Delivered to Recipient",
        description: "Customer signed for delivery. Signature confirmed.",
        location: "Nasirabad, Chittagong",
        timestamp: "2026-10-30T17:45:00.000Z",
      },
    ],
    createdAt: "2026-10-29T14:30:00.000Z",
    updatedAt: "2026-10-30T17:45:00.000Z",
  },
  {
    id: "shp-1003",
    consignmentId: "RDX-44101",
    trackingId: "RDX44101BD",
    orderId: "ord-1004",
    orderNumber: "CTX-1004",
    courier: "redx",
    courierName: "RedX Delivery",
    recipientName: "Sharmin Sultana",
    recipientPhone: "+8801715667788",
    deliveryAddress: "Kandirpar, Nazrul Avenue, Holding 14/B",
    city: "Cumilla",
    district: "Cumilla",
    deliveryCharge: 60,
    codAmount: 0,
    weightKg: 0.6,
    status: "in_transit",
    rawCourierStatus: "in_transit",
    deliveryType: "standard",
    pickupLocation: "Dhaka Warehouse",
    idempotencyKey: "idem-shp-1004-initial",
    timeline: [
      {
        id: "evt-shp-1003-1",
        status: "pending",
        title: "Parcel Booked",
        description: "RedX booking confirmed.",
        location: "Dhaka Sorting Center",
        timestamp: "2026-10-29T17:00:00.000Z",
      },
      {
        id: "evt-shp-1003-2",
        status: "in_transit",
        title: "Out for Regional Transit",
        description: "Transferred to Cumilla Kandirpar Hub.",
        location: "Cumilla Hub",
        timestamp: "2026-10-30T11:00:00.000Z",
      },
    ],
    createdAt: "2026-10-29T17:00:00.000Z",
    updatedAt: "2026-10-30T11:00:00.000Z",
  },
  {
    id: "shp-1004",
    consignmentId: "STDF-89103",
    trackingId: "STDF89103BD",
    orderId: "ord-1005",
    orderNumber: "CTX-1005",
    courier: "steadfast",
    courierName: "Steadfast Courier",
    recipientName: "Kazi Arif",
    recipientPhone: "+8801816778899",
    deliveryAddress: "Zindabazar, East Chowhatta, Road 2",
    city: "Sylhet",
    district: "Sylhet",
    deliveryCharge: 60,
    codAmount: 3480,
    weightKg: 1.5,
    status: "pending",
    rawCourierStatus: "in_review",
    deliveryType: "standard",
    pickupLocation: "Dhaka Warehouse",
    idempotencyKey: "idem-shp-1005-initial",
    timeline: [
      {
        id: "evt-shp-1004-1",
        status: "pending",
        title: "Consignment Created",
        description: "Consignment registered with COD ৳3,480. Awaiting rider pickup.",
        location: "Dhaka Warehouse",
        timestamp: "2026-10-29T17:30:00.000Z",
      },
    ],
    createdAt: "2026-10-29T17:30:00.000Z",
    updatedAt: "2026-10-29T17:30:00.000Z",
  },
  {
    id: "shp-1005",
    consignmentId: "PTH-67891",
    trackingId: "PTH67891BD",
    orderId: "ord-1006",
    orderNumber: "CTX-1006",
    courier: "pathao",
    courierName: "Pathao Courier",
    recipientName: "Rumana Akter",
    recipientPhone: "+8801917889900",
    deliveryAddress: "South Khulshi, Road 2, Villa 9",
    city: "Chittagong",
    district: "Chittagong",
    deliveryCharge: 60,
    codAmount: 1610,
    weightKg: 0.5,
    status: "delivered",
    rawCourierStatus: "Delivered",
    deliveryType: "express",
    pickupLocation: "Dhaka Warehouse",
    idempotencyKey: "idem-shp-1006-initial",
    timeline: [
      {
        id: "evt-shp-1005-1",
        status: "pending",
        title: "Pickup Requested",
        description: "Express pickup requested.",
        location: "Dhaka Hub",
        timestamp: "2026-10-29T19:30:00.000Z",
      },
      {
        id: "evt-shp-1005-2",
        status: "in_transit",
        title: "Arrived at Chittagong Hub",
        description: "Parcel processed for final mile delivery.",
        location: "Khulshi Delivery Station",
        timestamp: "2026-10-30T08:30:00.000Z",
      },
      {
        id: "evt-shp-1005-3",
        status: "delivered",
        title: "Delivered & COD Collected",
        description: "COD ৳1,610 collected by Pathao hero rider.",
        location: "Khulshi, Chittagong",
        timestamp: "2026-10-30T11:00:00.000Z",
      },
    ],
    createdAt: "2026-10-29T19:30:00.000Z",
    updatedAt: "2026-10-30T11:00:00.000Z",
  },
];

export class MockShippingService {
  private memoryShipments: Shipment[] = JSON.parse(
    JSON.stringify(INITIAL_SHIPMENTS)
  );
  private memoryCouriers: CourierConnection[] = JSON.parse(
    JSON.stringify(INITIAL_COURIER_CONNECTIONS)
  );
  private memoryRates: ShippingRatesConfig = JSON.parse(
    JSON.stringify(INITIAL_SHIPPING_RATES)
  );

  private safeGetItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSetItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[MockShippingService] LocalStorage set error for key ${key}:`, e);
    }
  }

  public loadShipments(): Shipment[] {
    return this.safeGetItem(SHIPMENTS_STORAGE_KEY, this.memoryShipments);
  }

  public saveShipments(list: Shipment[]): void {
    this.memoryShipments = list;
    this.safeSetItem(SHIPMENTS_STORAGE_KEY, list);
  }

  public loadCouriers(): CourierConnection[] {
    return this.safeGetItem(COURIERS_STORAGE_KEY, this.memoryCouriers);
  }

  public saveCouriers(list: CourierConnection[]): void {
    this.memoryCouriers = list;
    this.safeSetItem(COURIERS_STORAGE_KEY, list);
  }

  public loadRates(): ShippingRatesConfig {
    return this.safeGetItem(SHIPPING_RATES_STORAGE_KEY, this.memoryRates);
  }

  public saveRates(rates: ShippingRatesConfig): void {
    this.memoryRates = rates;
    this.safeSetItem(SHIPPING_RATES_STORAGE_KEY, rates);
  }

  // --- Shipments Query & Mutation ---

  public getShipments(params: ShipmentFilterParams = {}): PaginatedShipmentsResult {
    let list = this.loadShipments();

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.consignmentId.toLowerCase().includes(q) ||
          s.trackingId.toLowerCase().includes(q) ||
          s.orderNumber.toLowerCase().includes(q) ||
          s.recipientName.toLowerCase().includes(q) ||
          s.recipientPhone.includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== "all") {
      list = list.filter((s) => s.status === params.status);
    }

    if (params.courier && params.courier !== "all") {
      list = list.filter((s) => s.courier === params.courier);
    }

    const sortBy = params.sortBy || "date_desc";
    list.sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "date_asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "cod_desc") {
        return b.codAmount - a.codAmount;
      }
      if (sortBy === "cod_asc") {
        return a.codAmount - b.codAmount;
      }
      return 0;
    });

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const clampedPage = Math.min(page, totalPages);
    const startIndex = (clampedPage - 1) * limit;

    return {
      shipments: list.slice(startIndex, startIndex + limit),
      total,
      page: clampedPage,
      limit,
      totalPages,
    };
  }

  public getShipmentById(id: string): Shipment | null {
    const list = this.loadShipments();
    return list.find((s) => s.id === id) || null;
  }

  public getShipmentByOrderId(orderId: string): Shipment | null {
    const list = this.loadShipments();
    return (
      list.find(
        (s) => s.orderId === orderId && s.status !== "cancelled" && s.status !== "returned"
      ) ||
      list.find((s) => s.orderId === orderId) ||
      null
    );
  }

  public getShippingKPIs(): ShippingKPIStats {
    const list = this.loadShipments();

    let inTransit = 0;
    let delivered = 0;
    let pendingPickup = 0;
    let returnedOrCancelled = 0;
    let totalCod = 0;

    for (const s of list) {
      if (s.status === "in_transit") inTransit++;
      else if (s.status === "delivered") delivered++;
      else if (s.status === "pending" || s.status === "picked_up") pendingPickup++;
      else if (s.status === "cancelled" || s.status === "returned") returnedOrCancelled++;

      if (s.status !== "cancelled" && s.status !== "returned") {
        totalCod += s.codAmount;
      }
    }

    return {
      totalShipmentsCount: list.length,
      inTransitCount: inTransit,
      deliveredCount: delivered,
      pendingPickupCount: pendingPickup,
      returnedOrCancelledCount: returnedOrCancelled,
      totalCodToCollect: totalCod,
    };
  }

  // --- Consignment Creation & Cancellation ---

  public async createShipment(input: CreateShipmentInput): Promise<Shipment> {
    const list = this.loadShipments();

    // 1. Idempotency check: if request was already processed with same key, return it
    const existingByIdem = list.find((s) => s.idempotencyKey === input.idempotencyKey);
    if (existingByIdem) {
      return existingByIdem;
    }

    // 2. Prevent duplicate active shipments for the same order
    const existingActive = list.find(
      (s) =>
        s.orderId === input.orderId &&
        s.status !== "cancelled" &&
        s.status !== "returned" &&
        s.status !== "failed"
    );
    if (existingActive) {
      throw new Error(
        `Active shipment (${existingActive.consignmentId}) already exists for order ${input.orderNumber}. Cancel the previous shipment before creating a new one.`
      );
    }

    // 3. Call courier adapter
    const adapter = courierAdapterRegistry.get(input.courier);
    const adapterRes = await adapter.createConsignment({
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      recipientName: input.recipientName,
      recipientPhone: input.recipientPhone,
      deliveryAddress: input.deliveryAddress,
      city: input.city,
      district: input.district,
      codAmount: input.codAmount,
      weightKg: input.weightKg,
      deliveryType: input.deliveryType,
      pickupLocation: input.pickupLocation,
      instructions: input.specialInstructions,
      idempotencyKey: input.idempotencyKey,
    });

    const now = new Date().toISOString();
    const courierDisplayName = adapter.displayName;

    const initialTimeline: Shipment["timeline"] = [
      {
        id: `evt-${Date.now().toString(36)}-create`,
        status: "pending",
        title: "Consignment Created",
        description: `Consignment registered with ${courierDisplayName}. Tracking ID: ${adapterRes.trackingId}.`,
        location: input.pickupLocation,
        timestamp: now,
      },
    ];

    const newShipment: Shipment = {
      id: `shp-${Date.now().toString(36)}`,
      consignmentId: adapterRes.consignmentId,
      trackingId: adapterRes.trackingId,
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      courier: input.courier,
      courierName: courierDisplayName,
      recipientName: input.recipientName,
      recipientPhone: input.recipientPhone,
      deliveryAddress: input.deliveryAddress,
      city: input.city,
      district: input.district,
      deliveryCharge: input.deliveryCharge,
      codAmount: input.codAmount,
      weightKg: input.weightKg,
      status: "pending",
      rawCourierStatus: adapterRes.rawStatus,
      deliveryType: input.deliveryType,
      pickupLocation: input.pickupLocation,
      specialInstructions: input.specialInstructions,
      idempotencyKey: input.idempotencyKey,
      estimatedDelivery: "1-3 business days",
      timeline: initialTimeline,
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newShipment);
    this.saveShipments(list);

    // 4. Update order delivery in mockOrderService
    try {
      const courierCapitalized =
        input.courier === "steadfast"
          ? "Steadfast"
          : input.courier === "pathao"
          ? "Pathao"
          : "RedX";

      mockOrderService.updateOrderDelivery(
        input.orderId,
        {
          courier: courierCapitalized,
          trackingNumber: newShipment.trackingId,
          consignmentId: newShipment.consignmentId,
          shippingFee: input.deliveryCharge,
          estimatedDays: "1-3 business days",
          dispatchedAt: now,
        },
        `Courier Integration (${courierDisplayName})`
      );
    } catch (e) {
      console.warn(`[MockShippingService] Could not link delivery to order ${input.orderId}:`, e);
    }

    return newShipment;
  }

  public async cancelShipment(input: CancelShipmentInput): Promise<Shipment> {
    const list = this.loadShipments();
    const idx = list.findIndex((s) => s.id === input.shipmentId);
    if (idx === -1) {
      throw new Error(`Shipment "${input.shipmentId}" not found`);
    }

    const shipment = list[idx];
    if (shipment.status === "delivered") {
      throw new Error("Delivered shipments cannot be cancelled");
    }

    if (shipment.status === "cancelled") {
      return shipment;
    }

    const adapter = courierAdapterRegistry.get(shipment.courier);
    await adapter.cancelConsignment(shipment.consignmentId, input.reason);

    const now = new Date().toISOString();
    const updatedTimeline = [
      ...shipment.timeline,
      {
        id: `evt-${Date.now().toString(36)}-cancel`,
        status: "cancelled" as NormalizedShipmentStatus,
        title: "Shipment Cancelled",
        description: `Shipment cancelled. Reason: ${input.reason}`,
        timestamp: now,
      },
    ];

    const updated: Shipment = {
      ...shipment,
      status: "cancelled",
      cancellationReason: input.reason,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    list[idx] = updated;
    this.saveShipments(list);
    return updated;
  }

  // --- Courier Connections & Rates ---

  public getCourierConnections(): CourierConnection[] {
    return this.loadCouriers();
  }

  public updateCourierConnection(input: ConfigureCourierInput): CourierConnection {
    const list = this.loadCouriers();
    const idx = list.findIndex((c) => c.id === input.courierId);
    if (idx === -1) {
      throw new Error(`Courier "${input.courierId}" not found`);
    }

    const updated: CourierConnection = {
      ...list[idx],
      isEnabled: input.isEnabled,
      accountIdentifier: input.accountIdentifier || list[idx].accountIdentifier,
      defaultPickupAddress: input.defaultPickupAddress,
      pickupPhone: input.pickupPhone,
      lastSyncAt: new Date().toISOString(),
    };

    list[idx] = updated;
    this.saveCouriers(list);
    return updated;
  }

  public getShippingRates(): ShippingRatesConfig {
    return this.loadRates();
  }

  public updateShippingRates(input: ShippingRatesInput): ShippingRatesConfig {
    this.saveRates(input);
    return input;
  }

  // --- CSV Export ---

  public exportShipmentsToCSV(shipments: Shipment[]): string {
    const headers = [
      "Shipment ID",
      "Consignment ID",
      "Tracking ID",
      "Order Number",
      "Courier",
      "Recipient Name",
      "Recipient Phone",
      "City",
      "COD Amount (BDT)",
      "Status",
      "Created Date",
    ];

    const rows = shipments.map((s) => [
      `"${s.id}"`,
      `"${s.consignmentId}"`,
      `"${s.trackingId}"`,
      `"${s.orderNumber}"`,
      `"${s.courierName}"`,
      `"${s.recipientName.replace(/"/g, '""')}"`,
      `"${s.recipientPhone}"`,
      `"${s.city}"`,
      s.codAmount,
      `"${s.status.toUpperCase()}"`,
      `"${new Date(s.createdAt).toLocaleDateString("en-BD")}"`,
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  }

  public resetDemoShipping(): void {
    this.memoryShipments = JSON.parse(JSON.stringify(INITIAL_SHIPMENTS));
    this.memoryCouriers = JSON.parse(JSON.stringify(INITIAL_COURIER_CONNECTIONS));
    this.memoryRates = JSON.parse(JSON.stringify(INITIAL_SHIPPING_RATES));

    if (typeof window !== "undefined") {
      this.safeSetItem(SHIPMENTS_STORAGE_KEY, this.memoryShipments);
      this.safeSetItem(COURIERS_STORAGE_KEY, this.memoryCouriers);
      this.safeSetItem(SHIPPING_RATES_STORAGE_KEY, this.memoryRates);
    }
  }
}

export const mockShippingService = new MockShippingService();

