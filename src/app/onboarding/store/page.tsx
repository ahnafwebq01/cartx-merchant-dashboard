"use client";

import { StepStoreIdentity } from "@/features/onboarding/components/StepStoreIdentity";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function OnboardingStorePage() {
  const { data: draft, isLoading } = useOnboardingDraft();

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  return <StepStoreIdentity draft={draft} />;
}

