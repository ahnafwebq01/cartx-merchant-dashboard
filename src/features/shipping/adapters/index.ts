import { SteadfastCourierAdapter } from "./steadfast";
import { PathaoCourierAdapter } from "./pathao";
import { RedxCourierAdapter } from "./redx";
import type { CourierAdapter } from "./types";
import type { CourierProviderId } from "../types";

export * from "./types";
export * from "./steadfast";
export * from "./pathao";
export * from "./redx";

class CourierAdapterRegistry {
  private adapters: Map<CourierProviderId, CourierAdapter> = new Map();

  constructor() {
    this.register(new SteadfastCourierAdapter());
    this.register(new PathaoCourierAdapter());
    this.register(new RedxCourierAdapter());
  }

  public register(adapter: CourierAdapter) {
    this.adapters.set(adapter.courierId, adapter);
  }

  public get(courierId: CourierProviderId): CourierAdapter {
    const adapter = this.adapters.get(courierId);
    if (!adapter) {
      throw new Error(`Unsupported courier provider: "${courierId}"`);
    }
    return adapter;
  }

  public getAll(): CourierAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const courierAdapterRegistry = new CourierAdapterRegistry();

