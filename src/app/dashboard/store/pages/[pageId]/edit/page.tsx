"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { PageEditorView } from "@/features/storefront/components/PageEditorView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

function EditPageInner() {
  const params = useParams();
  const pageId = params?.pageId as string;

  return <PageEditorView pageId={pageId} />;
}

export default function EditStorePage() {
  return (
    <PermissionGuard permission="storefront.manage" showAccessDenied>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <EditPageInner />
      </Suspense>
    </PermissionGuard>
  );
}
