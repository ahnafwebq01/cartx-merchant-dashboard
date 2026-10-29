"use client";

import { StepShippingSetup } from "@/features/onboarding/components/StepShippingSetup";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function OnboardingShippingPage() {
  const { data: draft, isLoading } = useOnboardingDraft();

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  return <StepShippingSetup draft={draft} />;
}

