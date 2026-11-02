"use client";

import React, { Suspense } from "react";
import { CouponEditorView } from "@/features/marketing/components/CouponEditorView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function NewCouponPage() {
  return (
    <PermissionGuard permission="discounts.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <CouponEditorView />
      </Suspense>
    </PermissionGuard>
  );
}

