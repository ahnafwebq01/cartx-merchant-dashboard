"use client";

import React, { Suspense } from "react";
import { SalesAnalyticsView } from "@/features/analytics/components/SalesAnalyticsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function SalesAnalyticsPage() {
  return (
    <PermissionGuard permission="reports.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <SalesAnalyticsView />
      </Suspense>
    </PermissionGuard>
  );
}

