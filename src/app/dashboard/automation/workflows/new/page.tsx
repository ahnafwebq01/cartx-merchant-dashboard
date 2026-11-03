"use client";

import React, { Suspense } from "react";
import { WorkflowEditor } from "@/features/automation/components/WorkflowEditor";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function NewWorkflowPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <WorkflowEditor />
      </Suspense>
    </PermissionGuard>
  );
}

