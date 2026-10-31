"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { CourierCard } from "@/features/shipping/components/CourierCard";
import { useCourierConnectionsQuery } from "@/features/shipping/hooks";
import { Info } from "lucide-react";

function CourierIntegrationsContent() {
  const { data: couriers, isLoading } = useCourierConnectionsQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courier Integrations"
        description="Connect with Bangladesh delivery networks including Steadfast, Pathao, and RedX for automated parcel booking."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shipping & Delivery", href: "/dashboard/shipping" },
          { label: "Courier Integrations" },
        ]}
      />

      {/* Security and Architectural Notice */}
      <div className="p-4 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-950 dark:text-blue-200">
          <Info className="h-4 w-4 text-primary" />
          <span>Courier Adapter Architecture & Security</span>
        </div>
        <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
          Courier API keys and merchant tokens are safeguarded in server-side vaults. Consignment creation requests are dispatched via typed adapters ensuring consistent tracking IDs and error normalization across providers.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {couriers?.map((courier) => (
            <CourierCard key={courier.id} courier={courier} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourierIntegrationsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <CourierIntegrationsContent />
    </Suspense>
  );
}
