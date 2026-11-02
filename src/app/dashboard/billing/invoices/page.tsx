"use client";

import React, { Suspense } from "react";
import { InvoicesListView } from "@/features/billing/components/InvoicesListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function InvoicesPage() {
  return (
    <PermissionGuard permission="billing.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <InvoicesListView />
      </Suspense>
    </PermissionGuard>
  );
}

