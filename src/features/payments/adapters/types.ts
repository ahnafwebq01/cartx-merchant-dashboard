import type {
  PaymentProviderId,
  PaymentTransactionStatus,
  RefundStatus,
  ProviderConnectionStatus,
} from "../types";

export interface PaymentInitiateRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerPhone: string;
  customerName: string;
  idempotencyKey: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitiateResponse {
  transactionId: string;
  gatewayReference: string;
  redirectUrl?: string;
  status: PaymentTransactionStatus;
  isDemoSimulation: boolean;
  message?: string;
}

export interface PaymentVerifyRequest {
  transactionId: string;
  gatewayTransactionId?: string;
  paymentReference?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status: PaymentTransactionStatus;
  gatewayTransactionId: string;
  amount: number;
  completedAt: string;
  isAuthoritative: boolean;
  errorMessage?: string;
}

export interface PaymentRefundRequest {
  transactionId: string;
  gatewayTransactionId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
}

export interface PaymentRefundResponse {
  success: boolean;
  gatewayRefundId: string;
  status: RefundStatus;
  amount: number;
  processedAt: string;
  errorMessage?: string;
}

export interface ProviderHealthResponse {
  provider: PaymentProviderId;
  status: ProviderConnectionStatus;
  latencyMs: number;
  message: string;
  isDemo: boolean;
}

export interface PaymentAdapter {
  readonly providerId: PaymentProviderId;
  readonly displayName: string;
  initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse>;
  verifyPayment(request: PaymentVerifyRequest): Promise<PaymentVerifyResponse>;
  processRefund(request: PaymentRefundRequest): Promise<PaymentRefundResponse>;
  checkHealth(): Promise<ProviderHealthResponse>;
}

