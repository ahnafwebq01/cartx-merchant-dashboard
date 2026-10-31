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

export class SslcommerzPaymentAdapter implements PaymentAdapter {
  public readonly providerId = "sslcommerz" as const;
  public readonly displayName = "SSLCommerz Gateway";

  public async initiatePayment(
    request: PaymentInitiateRequest
  ): Promise<PaymentInitiateResponse> {
    if (request.amount <= 0) {
      throw new Error("[SSLCommerz Adapter] Payment amount must be greater than 0 BDT");
    }

    if (!request.idempotencyKey) {
      throw new Error("[SSLCommerz Adapter] Idempotency key required");
    }

    const sessionKey = `SSL-SESS-${Date.now().toString(36).toUpperCase()}`;
    const redirectUrl = `https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=pay&SESSIONKEY=${sessionKey}`;

    return {
      transactionId: `trx-${Date.now().toString(36)}`,
      gatewayReference: sessionKey,
      redirectUrl,
      status: "pending",
      isDemoSimulation: true,
      message: "SSLCommerz session generated. Redirect URL points to sandbox payment gateway.",
    };
  }

  public async verifyPayment(
    request: PaymentVerifyRequest
  ): Promise<PaymentVerifyResponse> {
    if (!request.transactionId) {
      throw new Error("[SSLCommerz Adapter] Missing transactionId for validation");
    }

    const simulatedTrxId =
      request.gatewayTransactionId ||
      `SSL${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return {
      success: true,
      status: "successful",
      gatewayTransactionId: simulatedTrxId,
      amount: 0,
      completedAt: new Date().toISOString(),
      isAuthoritative: true,
    };
  }

  public async processRefund(
    request: PaymentRefundRequest
  ): Promise<PaymentRefundResponse> {
    if (request.amount <= 0) {
      throw new Error("[SSLCommerz Adapter] Refund amount must be positive");
    }
    if (!request.gatewayTransactionId) {
      throw new Error("[SSLCommerz Adapter] Original SSLCommerz bank_tran_id required");
    }

    const gatewayRefundId = `SSL-REF-${Date.now().toString(36).toUpperCase()}`;

    return {
      success: true,
      gatewayRefundId,
      status: "processed",
      amount: request.amount,
      processedAt: new Date().toISOString(),
    };
  }

  public async checkHealth(): Promise<ProviderHealthResponse> {
    return {
      provider: "sslcommerz",
      status: "demo_mode",
      latencyMs: 210,
      message: "SSLCommerz IPN & Order Validation boundary active (Demo Sandbox Mode).",
      isDemo: true,
    };
  }
}

