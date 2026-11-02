import { describe, it, expect, beforeEach } from "vitest";
import {
  mockOnboardingService,
  RESERVED_SLUGS,
  ONBOARDING_STORAGE_KEY,
} from "@/features/onboarding/services/mockOnboarding";
import {
  mockStoreSettingsService,
  STORE_SETTINGS_STORAGE_KEY,
} from "@/features/store-settings/services/mockStoreSettings";
import {
  getOnboardingDraft,
  saveOnboardingStep,
  checkSlugAvailability,
  publishStore,
} from "@/features/onboarding/api";
import { getCurrentStore, updateCurrentStore } from "@/features/store-settings/api";
import { resetAllDemoData, ALL_DEMO_STORAGE_KEYS } from "@/lib/demo/resetDemo";
import type { OnboardingDraft } from "@/features/onboarding/types";

describe("Onboarding & Demo Mode Test Suite", () => {
  beforeEach(() => {
    mockOnboardingService.resetOnboarding();
    mockStoreSettingsService.resetSettings();
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  describe("1. Mock Onboarding Service & Lifecycle", () => {
    it("should initialize with clean baseline draft", () => {
      const draft = mockOnboardingService.getDraft();
      expect(draft.currentStep).toBe(1);
      expect(draft.completedSteps).toEqual([]);
      expect(draft.isPublished).toBe(false);
      expect(draft.step1).toBeUndefined();
    });

    it("should save Step 1, record completion, and advance currentStep to 2", () => {
      const step1Payload = {
        storeName: "Bengal Heritage Crafts",
        storeSlug: "bengal-heritage",
        businessType: "individual",
        ownerName: "Rahim Ahmed",
        contactEmail: "rahim@bengal.example.com",
        contactPhone: "01712345678",
      };

      const updatedDraft = mockOnboardingService.saveStep(1, step1Payload);
      expect(updatedDraft.step1?.storeName).toBe("Bengal Heritage Crafts");
      expect(updatedDraft.step1?.storeSlug).toBe("bengal-heritage");
      expect(updatedDraft.completedSteps).toContain(1);
      expect(updatedDraft.currentStep).toBe(2);

      // Verify automatic synchronization with store settings
      const settings = mockStoreSettingsService.getSettings();
      expect(settings.name).toBe("Bengal Heritage Crafts");
      expect(settings.slug).toBe("bengal-heritage");
      expect(settings.ownerName).toBe("Rahim Ahmed");
    });

    it("should save all sequential steps through to publishing", () => {
      // Step 1
      mockOnboardingService.saveStep(1, {
        storeName: "Artisan Silk",
        storeSlug: "artisan-silk",
        businessType: "partnership",
        ownerName: "Nusrat Jahan",
        contactEmail: "nusrat@artisan.example.com",
        contactPhone: "01812345678",
      });

      // Step 2
      mockOnboardingService.saveStep(2, {
        businessAddress: "House 10, Road 4, Dhanmondi",
        district: "Dhaka",
        cityArea: "Dhanmondi",
        postalCode: "1205",
        businessCategory: "clothing_fashion",
      });

      // Step 3
      mockOnboardingService.saveStep(3, {
        storeDescription: "Handcrafted traditional sarees and fashion.",
        brandColor: "#10B981",
        themeId: "minimal_boutique",
      });

      // Step 4
      mockOnboardingService.saveStep(4, {
        productName: "Jamdani Saree",
        price: 8500,
        initialStock: 12,
        category: "clothing_fashion",
      });

      // Step 5
      mockOnboardingService.saveStep(5, {
        cashOnDelivery: true,
        onlineProvider: "none",
        providerStatus: "unconfigured",
      });

      // Step 6
      const step6Draft = mockOnboardingService.saveStep(6, {
        insideDhakaRate: 60,
        outsideDhakaRate: 120,
        freeShippingThreshold: 5000,
        courierPartner: "steadfast",
      });

      expect(step6Draft.completedSteps).toEqual([1, 2, 3, 4, 5, 6]);
      expect(step6Draft.currentStep).toBe(7);

      // Publish
      const publishResult = mockOnboardingService.publishStore();
      expect(publishResult.success).toBe(true);
      expect(publishResult.storefrontUrl).toBe("https://artisan-silk.cartx.com.bd");

      const finalDraft = mockOnboardingService.getDraft();
      expect(finalDraft.isPublished).toBe(true);
      expect(finalDraft.completedSteps).toContain(7);
      expect(finalDraft.storefrontUrl).toBe("https://artisan-silk.cartx.com.bd");
    });

    it("should reset onboarding progress back to baseline", () => {
      mockOnboardingService.saveStep(1, {
        storeName: "Temporary Store",
        storeSlug: "temp-store",
        businessType: "individual",
        ownerName: "Test Owner",
        contactEmail: "test@example.com",
        contactPhone: "01700000000",
      });

      const resetResult = mockOnboardingService.resetOnboarding();
      expect(resetResult.completedSteps).toEqual([]);
      expect(resetResult.currentStep).toBe(1);
      expect(resetResult.step1).toBeUndefined();

      const freshFetch = mockOnboardingService.getDraft();
      expect(freshFetch.completedSteps).toEqual([]);
    });
  });

  describe("2. Simulated Subdomain Availability Checker", () => {
    it("should accept valid and unreserved store slugs", () => {
      const result = mockOnboardingService.checkSlugAvailability("dhaka-handicrafts");
      expect(result.available).toBe(true);
      expect(result.slug).toBe("dhaka-handicrafts");
      expect(result.message).toContain("available");
      expect(result.message).toContain("Simulated check");
    });

    it("should reject reserved platform subdomains", () => {
      const reservedTests = ["admin", "api", "cartx", "dashboard", "demo", "billing", "support"];
      reservedTests.forEach((slug) => {
        expect(RESERVED_SLUGS.has(slug)).toBe(true);
        const result = mockOnboardingService.checkSlugAvailability(slug);
        expect(result.available).toBe(false);
        expect(result.message).toContain("reserved");
      });
    });

    it("should reject malformed slugs (short, uppercase, invalid chars)", () => {
      const shortResult = mockOnboardingService.checkSlugAvailability("ab");
      expect(shortResult.available).toBe(false);
      expect(shortResult.message).toContain("at least 3 characters");

      const invalidCharResult = mockOnboardingService.checkSlugAvailability("my_store_123");
      expect(invalidCharResult.available).toBe(false);
      expect(invalidCharResult.message).toContain("Invalid slug format");
    });
  });

  describe("3. Mock Store Settings Service", () => {
    it("should retrieve initial baseline store settings", () => {
      const settings = mockStoreSettingsService.getSettings();
      expect(settings.name).toBe("CartX Demo Store");
      expect(settings.slug).toBe("cartx-demo");
      expect(settings.currency).toBe("BDT");
      expect(settings.locale).toBe("bn-BD");
      expect(settings.timezone).toBe("Asia/Dhaka");
    });

    it("should update store settings and maintain persistence", () => {
      const updated = mockStoreSettingsService.updateSettings({
        name: "Sylhet Tea Gardens",
        slug: "sylhet-tea",
        description: "Finest organic green and black tea from Sreemangal gardens.",
        district: "Sylhet",
      });

      expect(updated.name).toBe("Sylhet Tea Gardens");
      expect(updated.slug).toBe("sylhet-tea");
      expect(updated.district).toBe("Sylhet");

      const fetched = mockStoreSettingsService.getSettings();
      expect(fetched.name).toBe("Sylhet Tea Gardens");
      expect(fetched.slug).toBe("sylhet-tea");
    });
  });

  describe("4. Graceful API Client Backend Fallbacks", () => {
    it("getOnboardingDraft should succeed and return draft without an Express server", async () => {
      const draft = await getOnboardingDraft();
      expect(draft).toBeDefined();
      expect(draft.currentStep).toBe(1);
    });

    it("saveOnboardingStep should persist step in Demo Mode without throwing network error", async () => {
      const result = await saveOnboardingStep(1, {
        storeName: "Dhaka Books",
        storeSlug: "dhaka-books",
        businessType: "individual",
        ownerName: "Kamal Hossain",
        contactEmail: "kamal@books.example.com",
        contactPhone: "01711223344",
      });

      expect(result).toBeDefined();
      expect(result.step1?.storeName).toBe("Dhaka Books");
      expect(result.completedSteps).toContain(1);
    });

    it("checkSlugAvailability should return simulated check without network error", async () => {
      const result = await checkSlugAvailability("my-online-store");
      expect(result).toBeDefined();
      expect(result.available).toBe(true);
      expect(result.message).toContain("Simulated check");
    });

    it("publishStore should return published storefront URL in Demo Mode", async () => {
      const result = await publishStore();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.storefrontUrl).toContain(".cartx.com.bd");
      expect(result.message).toContain("Demo Mode");
    });

    it("getCurrentStore and updateCurrentStore should work smoothly in Demo Mode", async () => {
      const current = await getCurrentStore();
      expect(current).toBeDefined();
      expect(current.currency).toBe("BDT");

      const updated = await updateCurrentStore({ name: "Updated Demo Name" });
      expect(updated.name).toBe("Updated Demo Name");
    });
  });

  describe("5. Centralized Reset & Storage Isolation", () => {
    it("should list and clean all demo storage keys", () => {
      expect(ALL_DEMO_STORAGE_KEYS).toContain(ONBOARDING_STORAGE_KEY);
      expect(ALL_DEMO_STORAGE_KEYS).toContain(STORE_SETTINGS_STORAGE_KEY);

      // Mutate onboarding
      mockOnboardingService.saveStep(1, {
        storeName: "Mutated Store",
        storeSlug: "mutated-store",
        businessType: "individual",
        ownerName: "Owner",
        contactEmail: "o@test.com",
        contactPhone: "01700000000",
      });

      expect(mockOnboardingService.getDraft().completedSteps).toContain(1);

      // Perform complete reset
      resetAllDemoData();

      const resetDraft = mockOnboardingService.getDraft();
      expect(resetDraft.completedSteps).toEqual([]);
      expect(resetDraft.currentStep).toBe(1);

      const resetSettings = mockStoreSettingsService.getSettings();
      expect(resetSettings.name).toBe("CartX Demo Store");
    });
  });

  describe("6. Resume Setup Dynamic Path Derivation", () => {
    it("should resolve step 1 when store identity is missing", () => {
      const draft: OnboardingDraft = {
        currentStep: 1,
        completedSteps: [],
      };

      const getResumePath = (d: OnboardingDraft) => {
        if (!d.step1?.storeName || !d.step1?.storeSlug) return "/onboarding/store";
        if (!d.step2?.businessAddress || !d.step2?.district) return "/onboarding/business";
        if (!d.step3?.brandColor || !d.step3?.themeId) return "/onboarding/storefront";
        if (!d.step4?.productName || !d.step4?.price) return "/onboarding/products";
        if (d.step5?.cashOnDelivery === undefined && d.step5?.providerStatus !== "connected") return "/onboarding/payments";
        if (d.step6?.insideDhakaRate === undefined) return "/onboarding/shipping";
        return "/onboarding/publish";
      };

      expect(getResumePath(draft)).toBe("/onboarding/store");

      draft.step1 = {
        storeName: "Store 1",
        storeSlug: "store-1",
        businessType: "individual",
        ownerName: "Owner",
        contactEmail: "owner@store.com",
        contactPhone: "01700000000",
      };
      expect(getResumePath(draft)).toBe("/onboarding/business");

      draft.step2 = {
        businessAddress: "House 1, Road 2",
        district: "Dhaka",
        cityArea: "Mirpur",
        businessCategory: "clothing_fashion",
      };
      expect(getResumePath(draft)).toBe("/onboarding/storefront");

      draft.step3 = {
        brandColor: "#2563EB",
        themeId: "modern_clean",
        storeDescription: "Fashion boutique",
      };
      expect(getResumePath(draft)).toBe("/onboarding/products");

      draft.step4 = {
        productName: "T-Shirt",
        price: 500,
        initialStock: 20,
        category: "clothing_fashion",
      };
      expect(getResumePath(draft)).toBe("/onboarding/payments");

      draft.step5 = {
        cashOnDelivery: true,
        providerStatus: "unconfigured",
      };
      expect(getResumePath(draft)).toBe("/onboarding/shipping");

      draft.step6 = {
        insideDhakaRate: 60,
        outsideDhakaRate: 120,
      };
      expect(getResumePath(draft)).toBe("/onboarding/publish");
    });
  });
});
