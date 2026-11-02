"use client";

import React, { Suspense } from "react";
import { PagesListView } from "@/features/storefront/components/PagesListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function PagesListPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <PagesListView />
      </Suspense>
    </PermissionGuard>
  );
}
