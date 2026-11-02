"use client";

import React, { Suspense } from "react";
import { DomainManagementView } from "@/features/storefront/components/DomainManagementView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function DomainsPage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <DomainManagementView />
      </Suspense>
    </PermissionGuard>
  );
}
