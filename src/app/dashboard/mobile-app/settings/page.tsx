"use client";

import React, { Suspense } from "react";
import { MobileAppSettings } from "@/features/mobile-app/components/MobileAppSettings";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MobileAppSettingsPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <MobileAppSettings />
      </Suspense>
    </PermissionGuard>
  );
}

