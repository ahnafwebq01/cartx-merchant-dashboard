"use client";

import { StepBusinessInfo } from "@/features/onboarding/components/StepBusinessInfo";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function OnboardingBusinessPage() {
  const { data: draft, isLoading } = useOnboardingDraft();

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  return <StepBusinessInfo draft={draft} />;
}

