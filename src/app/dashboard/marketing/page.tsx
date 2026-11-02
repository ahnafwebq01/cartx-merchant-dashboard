"use client";

import React, { Suspense } from "react";
import { MarketingOverviewView } from "@/features/marketing/components/MarketingOverviewView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MarketingOverviewPage() {
  return (
    <PermissionGuard permission="marketing.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <MarketingOverviewView />
      </Suspense>
    </PermissionGuard>
  );
}

