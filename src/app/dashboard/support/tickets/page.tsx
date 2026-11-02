"use client";

import React, { Suspense } from "react";
import { TicketsListView } from "@/features/support/components/TicketsListView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export default function TicketsListPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={5} />}>
      <TicketsListView />
    </Suspense>
  );
}

