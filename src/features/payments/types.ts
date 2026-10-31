export type PaymentProviderId = "bkash" | "nagad" | "sslcommerz" | "cod";

export type PaymentTransactionStatus =
  | "pending"
  | "successful"
  | "failed"
  | "cancelled"
  | "expired"
  | "refunded"
  | "partially_refunded";

export type RefundStatus =
  | "pending"
  | "approved"
  | "processed"
  | "rejected"
  | "failed";

export type ProviderConnectionStatus =
  | "connected"
  | "disconnected"
  | "demo_mode"
  | "error";

export interface PaymentTransaction {
  id: string; // e.g., "trx-1001"
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  provider: PaymentProviderId;
  amount: number; // In BDT
  currency: "BDT";
  status: PaymentTransactionStatus;
  gatewayTransactionId?: string; // e.g. bKash TrxID, Nagad TrxID
  gatewayReference?: string;
  idempotencyKey: string;
  errorMessage?: string;
  refundedAmount: number;
  paymentExecutionUrl?: string;
  initiatedAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentRefund {
  id: string; // e.g., "ref-1001"
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number; // In BDT
  reason: string;
  status: RefundStatus;
  gatewayRefundId?: string;
  idempotencyKey: string;
  requestedBy: string;
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface PaymentMethodConfig {
  id: PaymentProviderId;
  name: string;
  displayNameBn: string;
  description: string;
  isEnabled: boolean;
  status: ProviderConnectionStatus;
  environment: "sandbox" | "live";
  merchantId?: string;
  accountIdentifier?: string; // e.g. public merchant number/shortcode
  hasCredentials: boolean; // True if configured on backend; secrets NEVER stored in client
  supportedChannels: string[];
  isDemo: boolean;
  lastSyncAt?: string;
}

export interface PaymentKPIStats {
  totalGrossVolume: number;
  successfulTransactionsCount: number;
  pendingTransactionsCount: number;
  failedTransactionsCount: number;
  totalRefundedAmount: number;
  activeMethodsCount: number;
}

export interface PaymentFilterParams {
  search?: string;
  status?: PaymentTransactionStatus | "all";
  provider?: PaymentProviderId | "all";
  datePreset?: "all" | "today" | "yesterday" | "last7days" | "last30days";
  page?: number;
  limit?: number;
  sortBy?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
}

export interface PaginatedPaymentsResult {
  transactions: PaymentTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedRefundsResult {
  refunds: PaymentRefund[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

