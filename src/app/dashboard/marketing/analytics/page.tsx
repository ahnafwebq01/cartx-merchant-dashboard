"use client";

import React, { Suspense } from "react";
import { MarketingAnalyticsView } from "@/features/marketing/components/MarketingAnalyticsView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MarketingAnalyticsPage() {
  return (
    <PermissionGuard permission="marketing.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <MarketingAnalyticsView />
      </Suspense>
    </PermissionGuard>
  );
}

