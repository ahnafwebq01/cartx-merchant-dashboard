"use client";

import React, { Suspense } from "react";
import { AppPreview } from "@/features/mobile-app/components/AppPreview";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MobileAppPreviewPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <AppPreview />
      </Suspense>
    </PermissionGuard>
  );
}

