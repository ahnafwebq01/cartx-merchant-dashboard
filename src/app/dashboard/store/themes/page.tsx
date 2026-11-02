"use client";

import React, { Suspense } from "react";
import { ThemeLibraryView } from "@/features/storefront/components/ThemeLibraryView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function ThemeLibraryPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <ThemeLibraryView />
      </Suspense>
    </PermissionGuard>
  );
}
