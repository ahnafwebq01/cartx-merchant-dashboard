"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShippingKPIOverview } from "@/features/shipping/components/ShippingKPIOverview";
import { ShipmentListTable } from "@/features/shipping/components/ShipmentListTable";
import {
  useShippingKPIsQuery,
  useShipmentsQuery,
  useCourierConnectionsQuery,
  useResetDemoShippingMutation,
} from "@/features/shipping/hooks";
import type { ShipmentFilterParams } from "@/features/shipping/types";
import {
  Truck,
  ArrowRight,
  RotateCcw,
  Sliders,
  Boxes,
} from "lucide-react";

function ShippingOverviewContent() {
  const [filterParams, setFilterParams] = useState<ShipmentFilterParams>({
    page: 1,
    limit: 5,
    status: "all",
  });

  const { data: stats, isLoading: isStatsLoading } = useShippingKPIsQuery();
  const { data: shipmentData, isLoading: isShipmentsLoading } = useShipmentsQuery(filterParams);
  const { data: couriers } = useCourierConnectionsQuery();
  const resetMutation = useResetDemoShippingMutation();

  const handleFilterChange = (newParams: Partial<ShipmentFilterParams>) => {
    setFilterParams((prev) => ({ ...prev, ...newParams }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipping & Delivery"
        description="Manage Bangladesh courier integrations (Steadfast, Pathao, RedX), track active consignments, and monitor COD collections."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shipping & Delivery" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Logistics Demo
            </Button>
            <Link href="/dashboard/shipping/couriers">
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Courier Partners
              </Button>
            </Link>
            <Link href="/dashboard/shipping/shipments">
              <Button size="sm" className="text-xs h-8 gap-1.5">
                <Boxes className="h-3.5 w-3.5" />
                All Shipments
              </Button>
            </Link>
          </div>
        }
      />

      {/* Courier Integrations Callout Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
              Courier Network Connected (Steadfast, Pathao & RedX Adapters Ready)
            </h4>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
              Automated consignment generation, tracking number assignment, and door-to-door COD collection tracking are enabled.
            </p>
          </div>
        </div>

        <Link href="/dashboard/shipping/settings">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 text-emerald-700 border-emerald-300 hover:bg-emerald-100/50 dark:text-emerald-300 dark:border-emerald-800"
          >
            Delivery Rates & Zones
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <ShippingKPIOverview stats={stats} isLoading={isStatsLoading} />

      {/* Main Grid: Shipments Table + Courier Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Shipments (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Active Consignments
            </h3>
            <Link
              href="/dashboard/shipping/shipments"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              View All Shipments
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ShipmentListTable
            shipments={shipmentData?.shipments || []}
            total={shipmentData?.total || 0}
            page={shipmentData?.page || 1}
            limit={shipmentData?.limit || 5}
            totalPages={shipmentData?.totalPages || 1}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
            isLoading={isShipmentsLoading}
          />
        </div>

        {/* Right: Courier Network Status */}
        <div className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Courier Partners</span>
                <Link
                  href="/dashboard/shipping/couriers"
                  className="text-xs text-primary font-normal hover:underline"
                >
                  Configure
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {couriers?.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {c.displayNameBn}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      c.isEnabled
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.isEnabled ? "Connected" : "Disabled"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ShippingOverviewPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <ShippingOverviewContent />
    </Suspense>
  );
}
