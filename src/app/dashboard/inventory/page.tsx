"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { InventoryStatsCards } from "@/features/inventory/components/InventoryStatsCards";
import { InventoryTable } from "@/features/inventory/components/InventoryTable";
import { StockAdjustmentDialog } from "@/features/inventory/components/StockAdjustmentDialog";
import {
  useInventoryStatsQuery,
  useInventoryItemsQuery,
} from "@/features/inventory/hooks";
import { Button } from "@/components/ui/button";
import { History, SlidersHorizontal, Info } from "lucide-react";

export default function InventoryOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useInventoryStatsQuery();
  const { data: items = [], isLoading: itemsLoading } = useInventoryItemsQuery();
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Stocks & Inventory" }]} />
          <PageHeader
            title="Stocks & Inventory"
            description="Real-time multi-location warehouse stock tracking, threshold monitors, and stock level controls."
          />
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="text-xs h-9">
            <Link href="/dashboard/inventory/adjustments">
              <History className="h-3.5 w-3.5 mr-1.5" /> Movement Logs
            </Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowAdjustModal(true)}
            className="text-xs h-9"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" /> Adjust Stock
          </Button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="flex items-center gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <div>
          <strong className="text-foreground">Inventory Concurrency Rule:</strong> Available stock is calculated as <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">Available = On-hand - Reserved</code>. In this demo, adjustments immediately update your local catalog with audit logging.
        </div>
      </div>

      {/* KPI Metric Cards */}
      {statsLoading || !stats ? (
        <LoadingSkeleton rows={2} className="h-28" />
      ) : (
        <InventoryStatsCards stats={stats} />
      )}

      {/* Main Stock Table */}
      {itemsLoading ? (
        <LoadingSkeleton rows={6} className="h-96" />
      ) : (
        <InventoryTable items={items} />
      )}

      {/* Global Stock Adjustment Modal */}
      <StockAdjustmentDialog
        item={null}
        allItems={items}
        open={showAdjustModal}
        onOpenChange={setShowAdjustModal}
      />
    </div>
  );
}
