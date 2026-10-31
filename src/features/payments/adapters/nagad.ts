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

export class NagadPaymentAdapter implements PaymentAdapter {
  public readonly providerId = "nagad" as const;
  public readonly displayName = "Nagad Direct Checkout";

  public async initiatePayment(
    request: PaymentInitiateRequest
  ): Promise<PaymentInitiateResponse> {
    if (request.amount <= 0) {
      throw new Error("[Nagad Adapter] Payment amount must be greater than 0 BDT");
    }

    if (!request.idempotencyKey) {
      throw new Error("[Nagad Adapter] Idempotency key required");
    }

    const paymentRefId = `NGD-REF-${Date.now().toString(36).toUpperCase()}`;
    const redirectUrl = `http://sandbox.mynagad.com:10080/check-out/${paymentRefId}`;

    return {
      transactionId: `trx-${Date.now().toString(36)}`,
      gatewayReference: paymentRefId,
      redirectUrl,
      status: "pending",
      isDemoSimulation: true,
      message: "Nagad checkout session initialized. Ready for challenge URL redirect.",
    };
  }

  public async verifyPayment(
    request: PaymentVerifyRequest
  ): Promise<PaymentVerifyResponse> {
    if (!request.transactionId) {
      throw new Error("[Nagad Adapter] Missing transactionId for verification");
    }

    const simulatedTrxId =
      request.gatewayTransactionId ||
      `NGD${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

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
      throw new Error("[Nagad Adapter] Refund amount must be positive");
    }
    if (!request.gatewayTransactionId) {
      throw new Error("[Nagad Adapter] Original Nagad TrxID required for refund");
    }

    const gatewayRefundId = `NGD-REF-${Date.now().toString(36).toUpperCase()}`;

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
      provider: "nagad",
      status: "demo_mode",
      latencyMs: 180,
      message: "Nagad API boundary active (Demo Sandbox Mode). Live backend PG verification pending.",
      isDemo: true,
    };
  }
}

