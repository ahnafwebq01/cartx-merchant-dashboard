"use client";

import React, { Suspense } from "react";
import { CouponsListView } from "@/features/marketing/components/CouponsListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function CouponsPage() {
  return (
    <PermissionGuard permission="discounts.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <CouponsListView />
      </Suspense>
    </PermissionGuard>
  );
}

