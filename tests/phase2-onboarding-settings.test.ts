import { describe, it, expect } from "vitest";
import {
  storeIdentitySchema,
  businessInfoSchema,
  firstProductSchema,
  shippingSetupSchema,
  SLUG_REGEX,
} from "@/features/onboarding/schemas";
import { storeSettingsSchema } from "@/features/store-settings/schemas";
import { DEFAULT_ROLE_PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import type { OnboardingDraft } from "@/features/onboarding/types";

describe("Phase 2 — Onboarding & Store Settings Test Suite", () => {
  describe("1. Store Identity & Slug Validation", () => {
    it("should accept valid store identity payload", () => {
      const validPayload = {
        storeName: "Dhaka Fashion House",
        storeSlug: "dhaka-fashion-house",
        businessType: "individual",
        ownerName: "Rahim Ahmed",
        contactEmail: "rahim@example.com",
        contactPhone: "01712345678",
      };

      const result = storeIdentitySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email or phone number", () => {
      const invalidPayload = {
        storeName: "Dhaka Store",
        storeSlug: "dhaka-store",
        businessType: "individual",
        ownerName: "Rahim",
        contactEmail: "invalid-email",
        contactPhone: "12345", // Not a valid BD mobile number
      };

      const result = storeIdentitySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        expect(fieldErrors.contactEmail).toBeDefined();
        expect(fieldErrors.contactPhone).toBeDefined();
      }
    });

    it("should strictly validate subdomain slugs per SLUG_REGEX", () => {
      // Valid slugs
      expect(SLUG_REGEX.test("my-store")).toBe(true);
      expect(SLUG_REGEX.test("cartx123")).toBe(true);
      expect(SLUG_REGEX.test("bangladesh-artisan-crafts")).toBe(true);

      // Invalid slugs
      expect(SLUG_REGEX.test("My-Store")).toBe(false); // Uppercase
      expect(SLUG_REGEX.test("my store")).toBe(false); // Space
      expect(SLUG_REGEX.test("-mystore")).toBe(false); // Leading hyphen
      expect(SLUG_REGEX.test("mystore-")).toBe(false); // Trailing hyphen
      expect(SLUG_REGEX.test("my--store")).toBe(false); // Consecutive hyphens
      expect(SLUG_REGEX.test("store@123")).toBe(false); // Special character
    });
  });

  describe("2. Business Info & First Product Schemas", () => {
    it("should enforce physical address and district selection", () => {
      const invalidBusiness = {
        businessAddress: "abc", // Less than 5 chars
        district: "", // Empty
        cityArea: "Gulshan",
        businessCategory: "clothing_fashion",
      };

      const result = businessInfoSchema.safeParse(invalidBusiness);
      expect(result.success).toBe(false);
    });

    it("should validate first product BDT price and stock", () => {
      const validProduct = {
        productName: "Silk Saree",
        price: 4500,
        initialStock: 15,
        category: "clothing_fashion",
      };

      const result = firstProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);

      // Zero or negative price must fail
      const zeroPriceProduct = { ...validProduct, price: 0 };
      expect(firstProductSchema.safeParse(zeroPriceProduct).success).toBe(false);

      // Negative stock must fail
      const negativeStock = { ...validProduct, initialStock: -5 };
      expect(firstProductSchema.safeParse(negativeStock).success).toBe(false);
    });

    it("should validate shipping delivery rates", () => {
      const validShipping = {
        insideDhakaRate: 60,
        outsideDhakaRate: 120,
        freeShippingThreshold: 2000,
        courierPartner: "manual",
      };
      expect(shippingSetupSchema.safeParse(validShipping).success).toBe(true);

      const negativeRate = { ...validShipping, insideDhakaRate: -10 };
      expect(shippingSetupSchema.safeParse(negativeRate).success).toBe(false);
    });
  });

  describe("3. Store Settings Schema Validation", () => {
    it("should accept valid full store settings payload", () => {
      const validSettings = {
        name: "CartX Organic Foods",
        slug: "cartx-organic-foods",
        description: "Fresh organic groceries and honey delivered across Dhaka city.",
        businessCategory: "groceries_food",
        businessAddress: "House 12, Road 4, Sector 7, Uttara",
        district: "Dhaka",
        cityArea: "Uttara",
        postalCode: "1230",
        ownerName: "Kamal Hossain",
        contactEmail: "kamal@organic.com.bd",
        contactPhone: "01811223344",
        currency: "BDT",
        locale: "bn-BD",
        timezone: "Asia/Dhaka",
      };

      const result = storeSettingsSchema.safeParse(validSettings);
      expect(result.success).toBe(true);
    });

    it("should reject store settings with short description", () => {
      const shortDesc = {
        name: "Store",
        slug: "valid-slug",
        description: "Too short", // Less than 10 characters
        businessCategory: "general_ecommerce",
        businessAddress: "Full Address Road 1",
        district: "Dhaka",
        cityArea: "Banani",
        ownerName: "Owner Name",
        contactEmail: "test@store.com",
        contactPhone: "01711000000",
      };

      const result = storeSettingsSchema.safeParse(shortDesc);
      expect(result.success).toBe(false);
    });
  });

  describe("4. RBAC Settings Access Guard", () => {
    it("should grant settings.manage to owner and admin roles", () => {
      expect(hasPermission(DEFAULT_ROLE_PERMISSIONS.owner, "settings.manage")).toBe(true);
      expect(hasPermission(DEFAULT_ROLE_PERMISSIONS.admin, "settings.manage")).toBe(true);
    });

    it("should restrict settings.manage from order_manager, product_manager, and support", () => {
      expect(hasPermission(DEFAULT_ROLE_PERMISSIONS.order_manager, "settings.manage")).toBe(false);
      expect(hasPermission(DEFAULT_ROLE_PERMISSIONS.product_manager, "settings.manage")).toBe(false);
      expect(hasPermission(DEFAULT_ROLE_PERMISSIONS.support, "settings.manage")).toBe(false);
      expect(hasPermission(DEFAULT_ROLE_PERMISSIONS.accountant, "settings.manage")).toBe(false);
    });
  });

  describe("5. Setup Checklist State Derivation & Truthfulness", () => {
    it("should derive full completion only when all required steps exist in draft", () => {
      const fullDraft: OnboardingDraft = {
        currentStep: 7,
        completedSteps: [1, 2, 3, 4, 5, 6, 7],
        step1: {
          storeName: "My Shop",
          storeSlug: "my-shop",
          businessType: "individual",
          ownerName: "Owner",
          contactEmail: "owner@shop.com",
          contactPhone: "01700000000",
        },
        step2: {
          businessAddress: "123 Shop Lane",
          district: "Dhaka",
          cityArea: "Mirpur",
          businessCategory: "clothing_fashion",
        },
        step3: {
          storeDescription: "Quality products online store.",
          brandColor: "#2563EB",
          themeId: "modern_clean",
        },
        step4: {
          productName: "First Product",
          price: 999,
          initialStock: 10,
          category: "clothing_fashion",
        },
        step5: {
          cashOnDelivery: true,
          providerStatus: "unconfigured",
        },
        step6: {
          insideDhakaRate: 60,
          outsideDhakaRate: 120,
        },
        isPublished: true,
        storefrontUrl: "https://my-shop.cartx.com.bd",
      };

      const isProfileDone = Boolean(fullDraft.step1?.storeName && fullDraft.step2?.district);
      const isThemeDone = Boolean(fullDraft.step3?.themeId && fullDraft.step3?.brandColor);
      const isProductDone = Boolean(fullDraft.step4?.productName && (fullDraft.step4?.price ?? 0) > 0);
      const isPaymentDone = Boolean(fullDraft.step5?.cashOnDelivery !== undefined);
      const isShippingDone = Boolean(fullDraft.step6?.insideDhakaRate !== undefined);
      const isPublished = Boolean(fullDraft.isPublished);

      expect(isProfileDone).toBe(true);
      expect(isThemeDone).toBe(true);
      expect(isProductDone).toBe(true);
      expect(isPaymentDone).toBe(true);
      expect(isShippingDone).toBe(true);
      expect(isPublished).toBe(true);
    });

    it("should prevent false completion when draft is empty or partial", () => {
      const emptyDraft: OnboardingDraft = {
        currentStep: 1,
        completedSteps: [],
      };

      const isProfileDone = Boolean(emptyDraft.step1?.storeName && emptyDraft.step2?.district);
      const isProductDone = Boolean(emptyDraft.step4?.productName);
      const isPublished = Boolean(emptyDraft.isPublished);

      expect(isProfileDone).toBe(false);
      expect(isProductDone).toBe(false);
      expect(isPublished).toBe(false);
    });
  });
});

