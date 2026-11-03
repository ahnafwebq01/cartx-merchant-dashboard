"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { WorkflowEditor } from "@/features/automation/components/WorkflowEditor";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

function EditWorkflowInner() {
  const params = useParams();
  const workflowId = params?.workflowId as string;

  return <WorkflowEditor workflowId={workflowId} />;
}

export default function EditWorkflowPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <EditWorkflowInner />
      </Suspense>
    </PermissionGuard>
  );
}

