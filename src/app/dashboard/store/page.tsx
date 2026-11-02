"use client";

import React, { Suspense } from "react";
import { StoreOverviewView } from "@/features/storefront/components/StoreOverviewView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function StoreOverviewPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <StoreOverviewView />
      </Suspense>
    </PermissionGuard>
  );
}
