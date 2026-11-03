"use client";

import React, { Suspense } from "react";
import { MobileAppOverview } from "@/features/mobile-app/components/MobileAppOverview";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MobileAppPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <MobileAppOverview />
      </Suspense>
    </PermissionGuard>
  );
}

