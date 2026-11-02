import type {
  OnboardingDraft,
  SlugCheckResult,
  PublishStoreResult,
  StoreIdentityData,
  BusinessInfoData,
  StorefrontSetupData,
  FirstProductData,
  PaymentSetupData,
  ShippingSetupData,
} from "../types";
import { SLUG_REGEX } from "../schemas";
import { mockStoreSettingsService } from "@/features/store-settings/services/mockStoreSettings";

export const ONBOARDING_STORAGE_KEY = "cartx_demo_onboarding_draft_v1";

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "cartx",
  "dashboard",
  "demo",
  "app",
  "help",
  "support",
  "billing",
  "system",
  "staging",
  "dev",
  "root",
  "auth",
  "mail",
  "login",
  "checkout",
  "store",
  "greenharvest",
]);

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
  storeId: "store_demo_01",
  currentStep: 1,
  completedSteps: [],
  isPublished: false,
};

export class MockOnboardingService {
  private memoryDraft: OnboardingDraft = JSON.parse(JSON.stringify(INITIAL_ONBOARDING_DRAFT));

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
      console.warn(`[MockOnboardingService] LocalStorage set error for key ${key}:`, e);
    }
  }

  public getDraft(): OnboardingDraft {
    const draft = this.safeGetItem(ONBOARDING_STORAGE_KEY, this.memoryDraft);
    this.memoryDraft = JSON.parse(JSON.stringify(draft));
    return JSON.parse(JSON.stringify(draft));
  }

  public saveStep(step: number, data: unknown): OnboardingDraft {
    const draft = this.getDraft();

    switch (step) {
      case 1:
        draft.step1 = data as StoreIdentityData;
        // Synchronize store settings with store identity
        mockStoreSettingsService.updateSettings({
          name: draft.step1.storeName,
          slug: draft.step1.storeSlug,
          ownerName: draft.step1.ownerName,
          contactEmail: draft.step1.contactEmail,
          contactPhone: draft.step1.contactPhone,
        });
        break;
      case 2:
        draft.step2 = data as BusinessInfoData;
        // Synchronize address in store settings
        mockStoreSettingsService.updateSettings({
          businessAddress: draft.step2.businessAddress,
          district: draft.step2.district,
          cityArea: draft.step2.cityArea,
          postalCode: draft.step2.postalCode,
          tradeLicenseNo: draft.step2.tradeLicenseNo,
          businessCategory: draft.step2.businessCategory,
        });
        break;
      case 3:
        draft.step3 = data as StorefrontSetupData;
        if (draft.step3.storeDescription) {
          mockStoreSettingsService.updateSettings({
            description: draft.step3.storeDescription,
          });
        }
        break;
      case 4:
        draft.step4 = data as FirstProductData;
        break;
      case 5:
        draft.step5 = data as PaymentSetupData;
        break;
      case 6:
        draft.step6 = data as ShippingSetupData;
        break;
      default:
        break;
    }

    // Record step completion
    const completedSet = new Set(draft.completedSteps || []);
    completedSet.add(step);
    draft.completedSteps = Array.from(completedSet).sort((a, b) => a - b);

    // Advance currentStep to next step if applicable
    if (step < 7) {
      draft.currentStep = Math.max(draft.currentStep, step + 1);
    }

    this.memoryDraft = JSON.parse(JSON.stringify(draft));
    this.safeSetItem(ONBOARDING_STORAGE_KEY, draft);

    return JSON.parse(JSON.stringify(draft));
  }

  public checkSlugAvailability(slug: string): SlugCheckResult {
    const cleanSlug = slug.trim().toLowerCase();

    if (!cleanSlug || cleanSlug.length < 3) {
      return {
        available: false,
        slug: cleanSlug,
        message: "Slug must be at least 3 characters",
      };
    }

    if (!SLUG_REGEX.test(cleanSlug)) {
      return {
        available: false,
        slug: cleanSlug,
        message: "Invalid slug format. Use lowercase letters, numbers, and single hyphens.",
      };
    }

    if (RESERVED_SLUGS.has(cleanSlug)) {
      return {
        available: false,
        slug: cleanSlug,
        message: `Subdomain "${cleanSlug}" is reserved or unavailable (Simulated check)`,
      };
    }

    return {
      available: true,
      slug: cleanSlug,
      message: `Subdomain "${cleanSlug}" is available! (Simulated check)`,
    };
  }

  public publishStore(): PublishStoreResult {
    const draft = this.getDraft();
    const slug = draft.step1?.storeSlug || "demo-store";
    const storefrontUrl = `https://${slug}.cartx.com.bd`;
    const publishedAt = new Date().toISOString();

    draft.isPublished = true;
    draft.publishedAt = publishedAt;
    draft.storefrontUrl = storefrontUrl;

    const completedSet = new Set(draft.completedSteps || []);
    completedSet.add(7);
    draft.completedSteps = Array.from(completedSet).sort((a, b) => a - b);
    draft.currentStep = 7;

    this.memoryDraft = JSON.parse(JSON.stringify(draft));
    this.safeSetItem(ONBOARDING_STORAGE_KEY, draft);

    // Update store settings status
    mockStoreSettingsService.updateSettings({
      status: "active",
      storefrontUrl,
    });

    return {
      success: true,
      storefrontUrl,
      publishedAt,
      message: "Storefront published successfully (Demo Mode)",
    };
  }

  public resetOnboarding(): OnboardingDraft {
    this.memoryDraft = JSON.parse(JSON.stringify(INITIAL_ONBOARDING_DRAFT));
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      } catch (e) {
        console.warn("[MockOnboardingService] Failed to remove onboarding storage:", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_ONBOARDING_DRAFT));
  }
}

export const mockOnboardingService = new MockOnboardingService();

