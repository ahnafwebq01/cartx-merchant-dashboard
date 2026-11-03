"use client";

import React, { Suspense } from "react";
import { SegmentsListView } from "@/features/segmentation/components/SegmentsListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function CustomerSegmentsPage() {
  return (
    <PermissionGuard permission="marketing.view" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <SegmentsListView />
      </Suspense>
    </PermissionGuard>
  );
}

