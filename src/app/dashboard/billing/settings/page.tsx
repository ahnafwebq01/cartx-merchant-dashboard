"use client";

import React, { Suspense } from "react";
import { BillingSettingsView } from "@/features/billing/components/BillingSettingsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function BillingSettingsPage() {
  return (
    <PermissionGuard permission="billing.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <BillingSettingsView />
      </Suspense>
    </PermissionGuard>
  );
}

