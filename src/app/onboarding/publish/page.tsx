"use client";

import { StepPreviewPublish } from "@/features/onboarding/components/StepPreviewPublish";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function OnboardingPublishPage() {
  const { data: draft, isLoading } = useOnboardingDraft();

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  return <StepPreviewPublish draft={draft} />;
}

