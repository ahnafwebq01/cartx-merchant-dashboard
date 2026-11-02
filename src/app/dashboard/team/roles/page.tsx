"use client";

import React, { Suspense } from "react";
import { RolesPermissionsMatrixView } from "@/features/team/components/RolesPermissionsMatrixView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function RolesPermissionsPage() {
  return (
    <PermissionGuard permission="team.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <RolesPermissionsMatrixView />
      </Suspense>
    </PermissionGuard>
  );
}

