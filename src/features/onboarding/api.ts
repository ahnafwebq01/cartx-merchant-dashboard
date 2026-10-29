import { apiClient } from "@/lib/api/client";
import type {
  OnboardingDraft,
  SlugCheckResult,
  PublishStoreResult,
} from "./types";

/**
 * Fetches the active onboarding draft from the backend API.
 * Route: GET /stores/onboarding
 */
export async function getOnboardingDraft(): Promise<OnboardingDraft> {
  const response = await apiClient.get<OnboardingDraft>("/stores/onboarding");
  return response.data;
}

/**
 * Saves/persists progress for a specific onboarding step.
 * Route: PATCH /stores/onboarding/:step
 */
export async function saveOnboardingStep(
  step: number,
  data: unknown
): Promise<OnboardingDraft> {
  const response = await apiClient.patch<OnboardingDraft>(
    `/stores/onboarding/${step}`,
    data
  );
  return response.data;
}

/**
 * Validates store subdomain slug availability against the backend registry.
 * Route: GET /stores/check-slug?slug=...
 */
export async function checkSlugAvailability(
  slug: string
): Promise<SlugCheckResult> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug || cleanSlug.length < 3) {
    return { available: false, slug: cleanSlug, message: "Slug must be at least 3 characters" };
  }
  const response = await apiClient.get<SlugCheckResult>("/stores/check-slug", {
    params: { slug: cleanSlug },
  });
  return response.data;
}

/**
 * Publishes the store and activates public storefront access.
 * Route: POST /stores/current/publish
 */
export async function publishStore(): Promise<PublishStoreResult> {
  const response = await apiClient.post<PublishStoreResult>(
    "/stores/current/publish",
    {}
  );
  return response.data;
}

