"use client";

import React, { Suspense } from "react";
import { MarketingAnalyticsView } from "@/features/analytics/components/MarketingAnalyticsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MarketingAnalyticsPage() {
  return (
    <PermissionGuard permission="reports.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <MarketingAnalyticsView />
      </Suspense>
    </PermissionGuard>
  );
}

