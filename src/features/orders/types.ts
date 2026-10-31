export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "partially_returned";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "partially_paid"
  | "partially_refunded"
  | "refunded"
  | "failed";

export type FulfillmentStatus = "unfulfilled" | "partially_fulfilled" | "fulfilled";

export type PaymentMethod =
  | "cod"
  | "bkash"
  | "nagad"
  | "rocket"
  | "sslcommerz"
  | "bank_transfer";

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  sku: string;
  variantName?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  division: string;
  postalCode?: string;
  country: string;
}

export interface OrderDelivery {
  courier: "Steadfast" | "Pathao" | "RedX" | "Paperfly" | "Internal Fleet";
  trackingNumber?: string;
  consignmentId?: string;
  shippingFee: number;
  estimatedDays?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: CustomerAddress;
  billingAddress?: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  amountPaid: number;
  amountDue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  orderStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  delivery: OrderDelivery;
  timeline: OrderTimelineEvent[];
  internalNotes?: string;
  cancellationReason?: string;
  returnReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterParams {
  search?: string;
  orderStatus?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  paymentMethod?: PaymentMethod | "all";
  fulfillmentStatus?: FulfillmentStatus | "all";
  courier?: string;
  page?: number;
  limit?: number;
  sortBy?: "date_desc" | "date_asc" | "total_desc" | "total_asc" | "orderNumber_desc";
  datePreset?: "all" | "today" | "yesterday" | "last7days" | "last30days";
}

export interface OrderKPIStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface PaginatedOrdersResult {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Valid Next Statuses Map according to CARTX_MERCHANT_DASHBOARD.md Section 8.2 & 8.4
 */
export const VALID_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["ready_to_ship", "cancelled"],
  ready_to_ship: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
  partially_returned: ["returned"],
};

