"use client";

import React, { Suspense } from "react";
import { BillingOverviewView } from "@/features/billing/components/BillingOverviewView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function BillingOverviewPage() {
  return (
    <PermissionGuard permission="billing.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <BillingOverviewView />
      </Suspense>
    </PermissionGuard>
  );
}

