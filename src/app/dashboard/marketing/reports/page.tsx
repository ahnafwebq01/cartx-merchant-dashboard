"use client";

import React, { Suspense } from "react";
import { MarketingReportsView } from "@/features/marketing/components/MarketingReportsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MarketingReportsPage() {
  return (
    <PermissionGuard permission="reports.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <MarketingReportsView />
      </Suspense>
    </PermissionGuard>
  );
}

