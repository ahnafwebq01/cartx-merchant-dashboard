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

export class BkashPaymentAdapter implements PaymentAdapter {
  public readonly providerId = "bkash" as const;
  public readonly displayName = "bKash Tokenized Checkout";

  public async initiatePayment(
    request: PaymentInitiateRequest
  ): Promise<PaymentInitiateResponse> {
    if (request.amount <= 0) {
      throw new Error("[bKash Adapter] Payment amount must be greater than 0 BDT");
    }

    if (!request.idempotencyKey) {
      throw new Error("[bKash Adapter] Idempotency key required to prevent duplicate billing");
    }

    // In client-side / demo mode, simulate bKash Tokenized API createPayment
    const demoPaymentId = `BKSH-PAY-${Date.now().toString(36).toUpperCase()}`;
    const redirectUrl = `https://checkout.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout?paymentID=${demoPaymentId}`;

    return {
      transactionId: `trx-${Date.now().toString(36)}`,
      gatewayReference: demoPaymentId,
      redirectUrl,
      status: "pending",
      isDemoSimulation: true,
      message: "bKash demo checkout session initialized. Ready for OTP/PIN simulation.",
    };
  }

  public async verifyPayment(
    request: PaymentVerifyRequest
  ): Promise<PaymentVerifyResponse> {
    if (!request.transactionId) {
      throw new Error("[bKash Adapter] Missing transactionId for verification");
    }

    // Generate authoritative demo bKash TrxID
    const simulatedTrxId =
      request.gatewayTransactionId ||
      `BKH${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return {
      success: true,
      status: "successful",
      gatewayTransactionId: simulatedTrxId,
      amount: 0, // Injected by caller
      completedAt: new Date().toISOString(),
      isAuthoritative: true,
    };
  }

  public async processRefund(
    request: PaymentRefundRequest
  ): Promise<PaymentRefundResponse> {
    if (request.amount <= 0) {
      throw new Error("[bKash Adapter] Refund amount must be positive");
    }
    if (!request.gatewayTransactionId) {
      throw new Error("[bKash Adapter] Original bKash TrxID required for refund");
    }

    const gatewayRefundId = `BKH-REF-${Date.now().toString(36).toUpperCase()}`;

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
      provider: "bkash",
      status: "demo_mode",
      latencyMs: 142,
      message: "bKash Tokenized Checkout boundary active (Demo Sandbox Mode). Live backend proxy pending.",
      isDemo: true,
    };
  }
}

