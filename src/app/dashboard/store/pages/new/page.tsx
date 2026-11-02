"use client";

import React, { Suspense } from "react";
import { PageEditorView } from "@/features/storefront/components/PageEditorView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function NewStorePage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <PageEditorView />
      </Suspense>
    </PermissionGuard>
  );
}
