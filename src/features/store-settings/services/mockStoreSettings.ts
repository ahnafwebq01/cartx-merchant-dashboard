import type { StoreSettings } from "../types";

export const STORE_SETTINGS_STORAGE_KEY = "cartx_demo_store_settings_v1";

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  id: "store_demo_01",
  name: "CartX Demo Store",
  slug: "cartx-demo",
  description: "Authentic Bangladeshi e-commerce store with nationwide delivery.",
  status: "active",
  storefrontUrl: "https://cartx-demo.cartx.com.bd",
  businessCategory: "clothing_fashion",
  businessAddress: "House 12, Road 4, Sector 7, Uttara",
  district: "Dhaka",
  cityArea: "Uttara",
  postalCode: "1230",
  tradeLicenseNo: "TRAD/DNCC/102948/2024",
  ownerName: "Demo Merchant Admin",
  contactEmail: "demo@cartx.example.com",
  contactPhone: "+880 1700-000000",
  currency: "BDT",
  locale: "bn-BD",
  timezone: "Asia/Dhaka",
  updatedAt: new Date().toISOString(),
};

export class MockStoreSettingsService {
  private memorySettings: StoreSettings = JSON.parse(JSON.stringify(INITIAL_STORE_SETTINGS));

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
      console.warn(`[MockStoreSettingsService] LocalStorage set error for key ${key}:`, e);
    }
  }

  public getSettings(): StoreSettings {
    const settings = this.safeGetItem(STORE_SETTINGS_STORAGE_KEY, this.memorySettings);
    this.memorySettings = JSON.parse(JSON.stringify(settings));
    return JSON.parse(JSON.stringify(settings));
  }

  public updateSettings(data: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated: StoreSettings = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.memorySettings = JSON.parse(JSON.stringify(updated));
    this.safeSetItem(STORE_SETTINGS_STORAGE_KEY, updated);

    return JSON.parse(JSON.stringify(updated));
  }

  public resetSettings(): StoreSettings {
    this.memorySettings = JSON.parse(JSON.stringify(INITIAL_STORE_SETTINGS));
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORE_SETTINGS_STORAGE_KEY);
      } catch (e) {
        console.warn("[MockStoreSettingsService] Failed to remove store settings storage:", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_STORE_SETTINGS));
  }
}

export const mockStoreSettingsService = new MockStoreSettingsService();

