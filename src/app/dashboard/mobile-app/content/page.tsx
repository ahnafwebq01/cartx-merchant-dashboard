"use client";

import React, { Suspense } from "react";
import { ContentView } from "@/features/mobile-app/components/ContentView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function MobileAppContentPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <ContentView />
      </Suspense>
    </PermissionGuard>
  );
}

