"use client";

import { StepStorefront } from "@/features/onboarding/components/StepStorefront";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function OnboardingStorefrontPage() {
  const { data: draft, isLoading } = useOnboardingDraft();

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  return <StepStorefront draft={draft} />;
}

