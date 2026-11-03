"use client";

import React, { Suspense } from "react";
import { CustomerAnalyticsView } from "@/features/analytics/components/CustomerAnalyticsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function CustomerAnalyticsPage() {
  return (
    <PermissionGuard permission="reports.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <CustomerAnalyticsView />
      </Suspense>
    </PermissionGuard>
  );
}

