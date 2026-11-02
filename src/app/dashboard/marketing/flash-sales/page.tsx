"use client";

import React, { Suspense } from "react";
import { FlashSalesView } from "@/features/marketing/components/FlashSalesView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function FlashSalesPage() {
  return (
    <PermissionGuard permission="discounts.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <FlashSalesView />
      </Suspense>
    </PermissionGuard>
  );
}

