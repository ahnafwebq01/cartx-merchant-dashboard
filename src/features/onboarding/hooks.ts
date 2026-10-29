"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOnboardingDraft,
  saveOnboardingStep,
  checkSlugAvailability,
  publishStore,
} from "./api";

export const ONBOARDING_QUERY_KEY = ["onboarding", "draft"];

/**
 * Hook to retrieve the current onboarding state from the backend.
 */
export function useOnboardingDraft() {
  return useQuery({
    queryKey: ONBOARDING_QUERY_KEY,
    queryFn: getOnboardingDraft,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

/**
 * Hook to save step data to the backend.
 */
export function useSaveStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ step, data }: { step: number; data: unknown }) =>
      saveOnboardingStep(step, data),
    onSuccess: (updatedDraft) => {
      queryClient.setQueryData(ONBOARDING_QUERY_KEY, updatedDraft);
      queryClient.invalidateQueries({ queryKey: ONBOARDING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["stores", "current"] });
    },
  });
}

/**
 * Hook to check subdomain slug availability.
 */
export function useSlugCheck(slug: string, options: { enabled?: boolean } = {}) {
  const cleanSlug = slug.trim().toLowerCase();
  const isValidSlug = cleanSlug.length >= 3 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug);

  return useQuery({
    queryKey: ["stores", "check-slug", cleanSlug],
    queryFn: () => checkSlugAvailability(cleanSlug),
    enabled: (options.enabled ?? true) && isValidSlug,
    staleTime: 10 * 1000,
    retry: false,
  });
}

/**
 * Hook to finalize and publish the store.
 */
export function usePublishStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONBOARDING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["stores", "current"] });
    },
  });
}
