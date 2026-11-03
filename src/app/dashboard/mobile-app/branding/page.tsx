"use client";

import React, { Suspense } from "react";
import { BrandingView } from "@/features/mobile-app/components/BrandingView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MobileAppBrandingPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <BrandingView />
      </Suspense>
    </PermissionGuard>
  );
}

