"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ONBOARDING_STEPS } from "../constants";
import { cn } from "@/lib/utils";

interface OnboardingStepperProps {
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export function OnboardingStepper({
  currentStep,
  completedSteps = [],
  className,
}: OnboardingStepperProps) {
  return (
    <nav
      aria-label="Onboarding Progress"
      className={cn("w-full bg-card border-b border-border py-4 px-4 sm:px-8", className)}
    >
      <div className="max-w-5xl mx-auto">
        <ol className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 gap-2 sm:gap-4">
          {ONBOARDING_STEPS.map((stepDef) => {
            const isCompleted = completedSteps.includes(stepDef.step);
            const isCurrent = currentStep === stepDef.step;
            const isPast = stepDef.step < currentStep || isCompleted;

            return (
              <li key={stepDef.step} className="flex-1 min-w-[110px] sm:min-w-0">
                <Link
                  href={isPast ? stepDef.path : "#"}
                  className={cn(
                    "group flex flex-col items-center sm:items-start transition-all",
                    !isPast && "cursor-not-allowed opacity-60"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div className="flex items-center w-full">
                    {/* Step indicator circle */}
                    <div
                      className={cn(
                        "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-semibold shrink-0 transition-colors",
                        isCompleted
                          ? "bg-success text-success-foreground"
                          : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <span>{stepDef.step}</span>
                      )}
                    </div>

                    {/* Step connecting line for larger screens */}
                    {stepDef.step < ONBOARDING_STEPS.length && (
                      <div
                        className={cn(
                          "hidden sm:block flex-1 h-[2px] mx-2 transition-colors",
                          isCompleted ? "bg-success" : "bg-border"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Title and subtitle */}
                  <div className="mt-2 text-center sm:text-left">
                    <p
                      className={cn(
                        "text-xs font-medium leading-tight",
                        isCurrent
                          ? "text-primary font-semibold"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {stepDef.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground hidden md:block">
                      {stepDef.titleBn}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

