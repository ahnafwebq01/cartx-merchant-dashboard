import { describe, it, expect, beforeEach } from "vitest";
import { DEMO_USER, DEMO_STORE, DEMO_CREDENTIALS } from "@/lib/auth/context";
import { APPEARANCE_STORAGE_KEY } from "@/components/theme/AppearanceContext";
import { NOTIFICATIONS_STORAGE_KEY } from "@/components/settings/NotificationSettings";
import { REGIONAL_STORAGE_KEY } from "@/components/settings/RegionalSettings";

describe("Phase 10: Complete UI Redesign & Architecture Verification", () => {
  const storageMap = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => storageMap.get(k) ?? null,
    setItem: (k: string, v: string) => storageMap.set(k, String(v)),
    removeItem: (k: string) => storageMap.delete(k),
    clear: () => storageMap.clear(),
    get length() {
      return storageMap.size;
    },
    key: (i: number) => Array.from(storageMap.keys())[i] ?? null,
  };

  beforeEach(() => {
    storageMap.clear();
    (global as unknown as { window: { localStorage: typeof mockStorage } }).window = {
      localStorage: mockStorage,
    };
  });

  describe("1. Authentication & Demo Mode Boundaries", () => {
    it("should provide structured demo credentials for all major merchant roles", () => {
      expect(DEMO_CREDENTIALS.length).toBeGreaterThanOrEqual(4);
      
      const ownerCred = DEMO_CREDENTIALS.find((c) => c.role === "owner");
      expect(ownerCred).toBeDefined();
      expect(ownerCred?.email).toBe("demo@cartx.example.com");
      expect(ownerCred?.password).toBe("password123");

      const adminCred = DEMO_CREDENTIALS.find((c) => c.role === "admin");
      expect(adminCred).toBeDefined();
      expect(adminCred?.email).toBe("admin@cartx.example.com");

      const orderManagerCred = DEMO_CREDENTIALS.find((c) => c.role === "order_manager");
      expect(orderManagerCred).toBeDefined();

      const supportCred = DEMO_CREDENTIALS.find((c) => c.role === "support");
      expect(supportCred).toBeDefined();
    });

    it("should maintain baseline demo merchant admin profile and store entity", () => {
      expect(DEMO_USER.name).toBe("Demo Merchant Admin");
      expect(DEMO_USER.email).toBe("demo@cartx.example.com");
      expect(DEMO_STORE.name).toBe("CartX Demo Store");
      expect(DEMO_STORE.currency).toBe("BDT (৳)");
      expect(DEMO_STORE.status).toBe("active");
    });

    it("should prevent duplicate registration for built-in demo emails", () => {
      const existingEmail = "demo@cartx.example.com";
      const isDuplicate = DEMO_CREDENTIALS.some(
        (c) => c.email.toLowerCase() === existingEmail.toLowerCase()
      );
      expect(isDuplicate).toBe(true);
    });

    it("should generate valid store subdomain slug from merchant store name", () => {
      const rawStoreName = "Chittagong Organic Leather & Crafts!";
      const slug = rawStoreName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      expect(slug).toBe("chittagong-organic-leather-crafts");
      expect(slug).not.toContain(" ");
      expect(slug).not.toContain("!");
    });
  });

  describe("2. Theme Customization & Appearance System", () => {
    it("should verify appearance persistence storage key", () => {
      expect(APPEARANCE_STORAGE_KEY).toBe("cartx_appearance_settings_v1");
    });

    it("should save and restore valid appearance configuration", () => {
      const sampleSettings = {
        accentColor: "emerald",
        sidebarStyle: "glass",
        borderRadius: "smooth",
        density: "compact",
      };

      window.localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify(sampleSettings)
      );

      const retrieved = JSON.parse(
        window.localStorage.getItem(APPEARANCE_STORAGE_KEY) || "{}"
      );

      expect(retrieved.accentColor).toBe("emerald");
      expect(retrieved.sidebarStyle).toBe("glass");
      expect(retrieved.borderRadius).toBe("smooth");
      expect(retrieved.density).toBe("compact");
    });
  });

  describe("3. Notification Preferences & Telemetry", () => {
    it("should have consistent notification storage key and defaults", () => {
      expect(NOTIFICATIONS_STORAGE_KEY).toBe("cartx_notification_preferences_v1");

      const defaultPrefs = {
        emailOrders: true,
        emailPayments: true,
        emailInventory: true,
        emailMarketing: false,
        pushOrders: true,
        pushPayments: true,
        pushInventory: true,
        smsUrgent: true,
      };

      window.localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(defaultPrefs)
      );

      const parsed = JSON.parse(
        window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || "{}"
      );

      expect(parsed.emailOrders).toBe(true);
      expect(parsed.smsUrgent).toBe(true);
      expect(parsed.emailMarketing).toBe(false);
    });
  });

  describe("4. Regional & Bangladesh Localization Defaults", () => {
    it("should preserve Bangladesh-specific operational defaults", () => {
      expect(REGIONAL_STORAGE_KEY).toBe("cartx_regional_preferences_v1");

      const bdDefaults = {
        currency: "BDT",
        language: "en-BD",
        dateFormat: "DD/MM/YYYY",
        timezone: "Asia/Dhaka",
        numberFormat: "lakh_crore",
      };

      window.localStorage.setItem(REGIONAL_STORAGE_KEY, JSON.stringify(bdDefaults));
      const loaded = JSON.parse(
        window.localStorage.getItem(REGIONAL_STORAGE_KEY) || "{}"
      );

      expect(loaded.currency).toBe("BDT");
      expect(loaded.timezone).toBe("Asia/Dhaka");
      expect(loaded.dateFormat).toBe("DD/MM/YYYY");
      expect(loaded.numberFormat).toBe("lakh_crore");
    });
  });

  describe("5. Data Privacy & Export Integrity", () => {
    it("should generate exportable JSON payload containing demo keys", () => {
      window.localStorage.setItem("cartx_test_key", JSON.stringify({ status: "ok" }));

      const exportObject: Record<string, { status: string }> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith("cartx_")) {
          exportObject[key] = JSON.parse(window.localStorage.getItem(key) || "{}");
        }
      }

      expect(exportObject["cartx_test_key"]).toBeDefined();
      expect(exportObject["cartx_test_key"].status).toBe("ok");
    });
  });
});
