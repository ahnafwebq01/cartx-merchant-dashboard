"use client";

import { StepPaymentSetup } from "@/features/onboarding/components/StepPaymentSetup";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function OnboardingPaymentsPage() {
  const { data: draft, isLoading } = useOnboardingDraft();

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  return <StepPaymentSetup draft={draft} />;
}

