"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ArrowLeft, HelpCircle } from "lucide-react";
import { OnboardingStepper } from "@/features/onboarding/components/OnboardingStepper";
import { useOnboardingDraft } from "@/features/onboarding/hooks";
import { Button } from "@/components/ui/button";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: draft } = useOnboardingDraft();

  // Determine current step index from route
  const getStepNumber = (path: string) => {
    if (path.includes("/store")) return 1;
    if (path.includes("/business")) return 2;
    if (path.includes("/storefront")) return 3;
    if (path.includes("/products")) return 4;
    if (path.includes("/payments")) return 5;
    if (path.includes("/shipping")) return 6;
    if (path.includes("/publish")) return 7;
    return draft?.currentStep || 1;
  };

  const currentStep = getStepNumber(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-sm leading-tight text-foreground block">
              CartX Onboarding
            </span>
            <span className="text-[11px] text-muted-foreground">
              New Merchant Setup Wizard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
            <Link href="/dashboard/support">
              <HelpCircle className="h-4 w-4 mr-1.5" />
              Need Help?
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <OnboardingStepper
        currentStep={currentStep}
        completedSteps={draft?.completedSteps || []}
      />

      {/* Main Form Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}

