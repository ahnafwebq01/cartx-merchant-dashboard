"use client";

import React, { Suspense } from "react";
import { TeamMembersListView } from "@/features/team/components/TeamMembersListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function TeamManagementPage() {
  return (
    <PermissionGuard permission="team.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={5} />}>
        <TeamMembersListView />
      </Suspense>
    </PermissionGuard>
  );
}

