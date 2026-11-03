"use client";

import React, { Suspense } from "react";
import { WebhooksListView } from "@/features/integrations/components/WebhooksListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function WebhooksPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <WebhooksListView />
      </Suspense>
    </PermissionGuard>
  );
}

