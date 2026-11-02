"use client";

import React, { Suspense } from "react";
import { PlansComparisonView } from "@/features/billing/components/PlansComparisonView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function PlansPricingPage() {
  return (
    <PermissionGuard permission="billing.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <PlansComparisonView />
      </Suspense>
    </PermissionGuard>
  );
}

