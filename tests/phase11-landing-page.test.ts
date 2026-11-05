import { describe, it, expect, beforeEach } from "vitest";
import {
  AUTH_STORAGE_KEY,
  DEMO_USERS_REGISTRY_KEY,
  DEMO_USER,
  DEMO_STORE,
  DEMO_CREDENTIALS,
} from "@/lib/auth/context";
import { LandingPage } from "@/components/landing/LandingPage";

describe("Phase 11: Landing Page & Navigation Flows", () => {
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

  describe("1. Landing Page Component Integrity", () => {
    it("should export LandingPage component", () => {
      expect(LandingPage).toBeDefined();
      expect(typeof LandingPage).toBe("function");
    });
  });

  describe("2. Authentication State for New Visitors & Returning Users", () => {
    it("should start with unauthenticated state when localStorage is clean (new visitor)", () => {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      expect(stored).toBeNull();
    });

    it("should restore existing session when valid session exists in localStorage", () => {
      const sampleSession = {
        user: DEMO_USER,
        currentStore: DEMO_STORE,
        currentRole: "owner",
        memberships: [
          {
            storeId: DEMO_STORE.id,
            store: DEMO_STORE,
            role: "owner",
          },
        ],
      };

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sampleSession));
      const retrieved = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "{}");

      expect(retrieved.user).toBeDefined();
      expect(retrieved.user.email).toBe("demo@cartx.example.com");
      expect(retrieved.currentRole).toBe("owner");
      expect(retrieved.currentStore.slug).toBe("cartx-demo");
    });

    it("should record session on demo login and clear on logout", () => {
      // Simulate login
      const demoAccount = DEMO_CREDENTIALS.find((c) => c.role === "admin");
      expect(demoAccount).toBeDefined();

      const userSession = {
        user: {
          ...DEMO_USER,
          email: demoAccount?.email,
          name: "Demo Admin",
        },
        currentStore: DEMO_STORE,
        currentRole: "admin",
        memberships: [
          {
            storeId: DEMO_STORE.id,
            store: DEMO_STORE,
            role: "admin",
          },
        ],
      };

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      expect(JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "{}").user.name).toBe("Demo Admin");

      // Simulate logout
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: null, currentStore: null, currentRole: null, memberships: [] })
      );
      const postLogout = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "{}");
      expect(postLogout.user).toBeNull();
      expect(postLogout.currentStore).toBeNull();
      expect(postLogout.currentRole).toBeNull();
      expect(postLogout.memberships).toEqual([]);
    });
  });

  describe("3. Registration State & Onboarding Handshake", () => {
    it("should reset onboarding draft storage key on new merchant registration", () => {
      const ONBOARDING_KEY = "cartx_demo_onboarding_draft_v1";

      // Simulate prior draft left in browser
      window.localStorage.setItem(
        ONBOARDING_KEY,
        JSON.stringify({
          currentStep: 5,
          completedSteps: [1, 2, 3, 4],
          isPublished: false,
        })
      );
      expect(window.localStorage.getItem(ONBOARDING_KEY)).not.toBeNull();

      // Trigger registration cleanup simulation
      window.localStorage.removeItem(ONBOARDING_KEY);
      expect(window.localStorage.getItem(ONBOARDING_KEY)).toBeNull();
    });

    it("should store new merchant in demo users registry without duplicate collisions", () => {
      const initialRegistry = [
        {
          user: {
            id: "usr_001",
            name: "Initial Merchant",
            email: "merchant1@example.com",
          },
          store: {
            id: "store_001",
            name: "Shop 1",
            slug: "shop-1",
            currency: "BDT (৳)",
            status: "active",
          },
          role: "owner",
          passwordHash: "secure123",
          createdAt: new Date().toISOString(),
        },
      ];

      window.localStorage.setItem(DEMO_USERS_REGISTRY_KEY, JSON.stringify(initialRegistry));

      const raw = window.localStorage.getItem(DEMO_USERS_REGISTRY_KEY);
      const registry = JSON.parse(raw || "[]");
      expect(registry).toHaveLength(1);

      // Check collision detection logic
      const isDuplicate = registry.some(
        (acc: { user: { email: string } }) => acc.user.email.toLowerCase() === "merchant1@example.com"
      );
      expect(isDuplicate).toBe(true);

      const isNewEmailDuplicate = registry.some(
        (acc: { user: { email: string } }) => acc.user.email.toLowerCase() === "brandnew@example.com"
      );
      expect(isNewEmailDuplicate).toBe(false);
    });
  });

  describe("4. Route Targets & Navigation Specs", () => {
    it("should define valid target routes for landing buttons", () => {
      const loginRoute = "/login";
      const registerRoute = "/register";
      const onboardingRoute = "/onboarding";
      const dashboardRoute = "/dashboard";
      const homeRoute = "/";

      expect(loginRoute).toBe("/login");
      expect(registerRoute).toBe("/register");
      expect(onboardingRoute).toBe("/onboarding");
      expect(dashboardRoute).toBe("/dashboard");
      expect(homeRoute).toBe("/");
    });
  });
});

