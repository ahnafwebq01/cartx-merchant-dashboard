"use client";

import React, { Suspense } from "react";
import { DiscountsListView } from "@/features/marketing/components/DiscountsListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function DiscountsPage() {
  return (
    <PermissionGuard permission="discounts.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <DiscountsListView />
      </Suspense>
    </PermissionGuard>
  );
}

