"use client";

import React, { Suspense } from "react";
import { WorkflowsListView } from "@/features/automation/components/WorkflowsListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function WorkflowsPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <WorkflowsListView />
      </Suspense>
    </PermissionGuard>
  );
}

