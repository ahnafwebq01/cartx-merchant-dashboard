"use client";

import React, { Suspense } from "react";
import { ThemeCustomizerView } from "@/features/storefront/components/ThemeCustomizerView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function ThemeCustomizePage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <ThemeCustomizerView />
      </Suspense>
    </PermissionGuard>
  );
}
