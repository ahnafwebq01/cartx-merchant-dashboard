"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { TicketDetailView } from "@/features/support/components/TicketDetailView";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

function TicketDetailInner() {
  const params = useParams();
  const ticketId = params?.ticketId as string;

  return <TicketDetailView ticketId={ticketId} />;
}

export default function TicketDetailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={5} />}>
      <TicketDetailInner />
    </Suspense>
  );
}

