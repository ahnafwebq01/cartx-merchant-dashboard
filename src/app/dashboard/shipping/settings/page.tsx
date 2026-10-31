"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ShippingRatesForm } from "@/features/shipping/components/ShippingRatesForm";
import { useShippingRatesQuery } from "@/features/shipping/hooks";

function ShippingSettingsContent() {
  const { data: rates, isLoading } = useShippingRatesQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipping Zones & Rate Settings"
        description="Set standard flat rates for Dhaka Metropolitan, nationwide districts, free shipping thresholds, and COD fees."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shipping & Delivery", href: "/dashboard/shipping" },
          { label: "Settings" },
        ]}
      />

      <ShippingRatesForm rates={rates} isLoading={isLoading} />
    </div>
  );
}

export default function ShippingSettingsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <ShippingSettingsContent />
    </Suspense>
  );
}

