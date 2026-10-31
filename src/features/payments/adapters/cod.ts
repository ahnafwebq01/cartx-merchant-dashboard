import type {
  PaymentAdapter,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  PaymentRefundRequest,
  PaymentRefundResponse,
  ProviderHealthResponse,
} from "./types";

export class CodPaymentAdapter implements PaymentAdapter {
  public readonly providerId = "cod" as const;
  public readonly displayName = "Cash on Delivery (COD)";

  public async initiatePayment(
    request: PaymentInitiateRequest
  ): Promise<PaymentInitiateResponse> {
    if (request.amount <= 0) {
      throw new Error("[COD Adapter] Order total must be positive");
    }

    return {
      transactionId: `trx-${Date.now().toString(36)}`,
      gatewayReference: `COD-${request.orderNumber}`,
      status: "pending",
      isDemoSimulation: false,
      message: "Cash on delivery invoice registered. Payment due upon parcel delivery.",
    };
  }

  public async verifyPayment(
    request: PaymentVerifyRequest
  ): Promise<PaymentVerifyResponse> {
    return {
      success: true,
      status: "successful",
      gatewayTransactionId: request.gatewayTransactionId || `COD-CASH-${Date.now().toString(36).toUpperCase()}`,
      amount: 0,
      completedAt: new Date().toISOString(),
      isAuthoritative: true,
    };
  }

  public async processRefund(
    request: PaymentRefundRequest
  ): Promise<PaymentRefundResponse> {
    return {
      success: true,
      gatewayRefundId: `COD-REV-${Date.now().toString(36).toUpperCase()}`,
      status: "processed",
      amount: request.amount,
      processedAt: new Date().toISOString(),
    };
  }

  public async checkHealth(): Promise<ProviderHealthResponse> {
    return {
      provider: "cod",
      status: "connected",
      latencyMs: 5,
      message: "Cash on Delivery engine active and enabled.",
      isDemo: false,
    };
  }
}

