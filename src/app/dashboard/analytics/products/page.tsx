"use client";

import React, { Suspense } from "react";
import { ProductAnalyticsView } from "@/features/analytics/components/ProductAnalyticsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function ProductAnalyticsPage() {
  return (
    <PermissionGuard permission="reports.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <ProductAnalyticsView />
      </Suspense>
    </PermissionGuard>
  );
}

