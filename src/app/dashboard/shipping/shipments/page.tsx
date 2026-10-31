"use client";

import React, { useState, Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ShipmentListTable } from "@/features/shipping/components/ShipmentListTable";
import { useShipmentsQuery } from "@/features/shipping/hooks";
import type { ShipmentFilterParams } from "@/features/shipping/types";

function ShipmentsListingContent() {
  const [filterParams, setFilterParams] = useState<ShipmentFilterParams>({
    page: 1,
    limit: 10,
    status: "all",
  });

  const { data, isLoading } = useShipmentsQuery(filterParams);

  const handleFilterChange = (newParams: Partial<ShipmentFilterParams>) => {
    setFilterParams((prev) => ({ ...prev, ...newParams }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipments & Parcels"
        description="Monitor nationwide parcels across Steadfast, Pathao, and RedX with live status tracking and COD settlement verification."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shipping & Delivery", href: "/dashboard/shipping" },
          { label: "Shipments" },
        ]}
      />

      <ShipmentListTable
        shipments={data?.shipments || []}
        total={data?.total || 0}
        page={data?.page || 1}
        limit={data?.limit || 10}
        totalPages={data?.totalPages || 1}
        filterParams={filterParams}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function ShipmentsListingPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <ShipmentsListingContent />
    </Suspense>
  );
}

