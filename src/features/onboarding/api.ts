import { apiClient } from "@/lib/api/client";
import { env } from "@/config/env";
import type {
  OnboardingDraft,
  SlugCheckResult,
  PublishStoreResult,
} from "./types";
import { mockOnboardingService } from "./services/mockOnboarding";

function isMixedContentBlocked(): boolean {
  if (typeof window !== "undefined") {
    if (window.location.protocol === "https:" && env.apiBaseUrl.startsWith("http://localhost")) {
      return true;
    }
  }
  return false;
}

/**
 * Fetches the active onboarding draft with automatic Demo Mode fallback.
 * Route: GET /stores/onboarding
 */
export async function getOnboardingDraft(): Promise<OnboardingDraft> {
  if (isMixedContentBlocked()) {
    return mockOnboardingService.getDraft();
  }
  try {
    const response = await apiClient.get<OnboardingDraft>("/stores/onboarding");
    return response.data;
  } catch {
    return mockOnboardingService.getDraft();
  }
}

/**
 * Saves/persists progress for a specific onboarding step with automatic Demo Mode fallback.
 * Route: PATCH /stores/onboarding/:step
 */
export async function saveOnboardingStep(
  step: number,
  data: unknown
): Promise<OnboardingDraft> {
  if (isMixedContentBlocked()) {
    return mockOnboardingService.saveStep(step, data);
  }
  try {
    const response = await apiClient.patch<OnboardingDraft>(
      `/stores/onboarding/${step}`,
      data
    );
    return response.data;
  } catch {
    return mockOnboardingService.saveStep(step, data);
  }
}

/**
 * Validates store subdomain slug availability with simulated Demo Mode registry check.
 * Route: GET /stores/check-slug?slug=...
 */
export async function checkSlugAvailability(
  slug: string
): Promise<SlugCheckResult> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug || cleanSlug.length < 3) {
    return {
      available: false,
      slug: cleanSlug,
      message: "Slug must be at least 3 characters",
    };
  }
  if (isMixedContentBlocked()) {
    return mockOnboardingService.checkSlugAvailability(cleanSlug);
  }
  try {
    const response = await apiClient.get<SlugCheckResult>("/stores/check-slug", {
      params: { slug: cleanSlug },
    });
    return response.data;
  } catch {
    return mockOnboardingService.checkSlugAvailability(cleanSlug);
  }
}

/**
 * Publishes the store and activates public storefront access in Demo Mode.
 * Route: POST /stores/current/publish
 */
export async function publishStore(): Promise<PublishStoreResult> {
  if (isMixedContentBlocked()) {
    return mockOnboardingService.publishStore();
  }
  try {
    const response = await apiClient.post<PublishStoreResult>(
      "/stores/current/publish",
      {}
    );
    return response.data;
  } catch {
    return mockOnboardingService.publishStore();
  }
}
