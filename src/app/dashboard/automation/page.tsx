"use client";

import React, { Suspense } from "react";
import { AutomationOverview } from "@/features/automation/components/AutomationOverview";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function AutomationPage() {
  return (
    <PermissionGuard permission="integrations.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <AutomationOverview />
      </Suspense>
    </PermissionGuard>
  );
}

