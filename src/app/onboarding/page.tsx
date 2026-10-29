"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { ONBOARDING_STEPS } from "@/features/onboarding/constants";
import { Loader2 } from "lucide-react";

export default function OnboardingIndexPage() {
  const router = useRouter();
  const { data: draft, isLoading } = useOnboardingDraft();

  useEffect(() => {
    if (!isLoading) {
      const targetStep = draft?.currentStep || 1;
      const stepConfig = ONBOARDING_STEPS.find((s) => s.step === targetStep) || ONBOARDING_STEPS[0];
      router.replace(stepConfig.path);
    }
  }, [draft, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading onboarding session...</p>
    </div>
  );
}

