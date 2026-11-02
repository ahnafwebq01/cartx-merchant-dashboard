"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { CouponEditorView } from "@/features/marketing/components/CouponEditorView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

function EditCouponInner() {
  const params = useParams();
  const couponId = params?.couponId as string;

  return <CouponEditorView couponId={couponId} />;
}

export default function EditCouponPage() {
  return (
    <PermissionGuard permission="discounts.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <EditCouponInner />
      </Suspense>
    </PermissionGuard>
  );
}

