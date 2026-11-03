"use client";

import React, { Suspense } from "react";
import { AnalyticsOverview } from "@/features/analytics/components/AnalyticsOverview";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function AnalyticsPage() {
  return (
    <PermissionGuard permission="reports.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <AnalyticsOverview />
      </Suspense>
    </PermissionGuard>
  );
}

