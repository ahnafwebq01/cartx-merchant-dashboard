import { BkashPaymentAdapter } from "./bkash";
import { NagadPaymentAdapter } from "./nagad";
import { SslcommerzPaymentAdapter } from "./sslcommerz";
import { CodPaymentAdapter } from "./cod";
import type { PaymentAdapter } from "./types";
import type { PaymentProviderId } from "../types";

export * from "./types";
export * from "./bkash";
export * from "./nagad";
export * from "./sslcommerz";
export * from "./cod";

class PaymentAdapterRegistry {
  private adapters: Map<PaymentProviderId, PaymentAdapter> = new Map();

  constructor() {
    this.register(new BkashPaymentAdapter());
    this.register(new NagadPaymentAdapter());
    this.register(new SslcommerzPaymentAdapter());
    this.register(new CodPaymentAdapter());
  }

  public register(adapter: PaymentAdapter) {
    this.adapters.set(adapter.providerId, adapter);
  }

  public get(providerId: PaymentProviderId): PaymentAdapter {
    const adapter = this.adapters.get(providerId);
    if (!adapter) {
      throw new Error(`Unsupported payment provider adapter: "${providerId}"`);
    }
    return adapter;
  }

  public getAll(): PaymentAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const paymentAdapterRegistry = new PaymentAdapterRegistry();

