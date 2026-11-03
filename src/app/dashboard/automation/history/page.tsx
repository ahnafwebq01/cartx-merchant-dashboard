"use client";

import React, { Suspense } from "react";
import { ExecutionHistoryView } from "@/features/automation/components/ExecutionHistoryView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function AutomationHistoryPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <ExecutionHistoryView />
      </Suspense>
    </PermissionGuard>
  );
}

