"use client";

import React, { Suspense } from "react";
import { IntegrationsOverview } from "@/features/integrations/components/IntegrationsOverview";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function IntegrationsPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <IntegrationsOverview />
      </Suspense>
    </PermissionGuard>
  );
}

