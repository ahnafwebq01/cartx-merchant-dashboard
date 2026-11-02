"use client";

import React, { Suspense } from "react";
import { HelpCenterView } from "@/features/support/components/HelpCenterView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function HelpCenterPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={5} />}>
      <HelpCenterView />
    </Suspense>
  );
}

