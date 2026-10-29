"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { InventoryMovementHistory } from "@/features/inventory/components/InventoryMovementHistory";
import { StockAdjustmentDialog } from "@/features/inventory/components/StockAdjustmentDialog";
import {
  useInventoryMovementsQuery,
  useInventoryItemsQuery,
} from "@/features/inventory/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

export default function StockAdjustmentsPage() {
  const { data: movements = [], isLoading: movementsLoading } = useInventoryMovementsQuery();
  const { data: items = [] } = useInventoryItemsQuery();
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: "Stocks & Inventory", href: "/dashboard/inventory" },
              { label: "Stock Adjustments" },
            ]}
          />
          <PageHeader
            title="Stock Movements & Audit Trail"
            description="Complete tamper-evident log of all stock increases, damages, losses, and manual reconciliations."
          />
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="text-xs h-9">
            <Link href="/dashboard/inventory">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Inventory
            </Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowAdjustModal(true)}
            className="text-xs h-9"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Adjustment
          </Button>
        </div>
      </div>

      {movementsLoading ? (
        <LoadingSkeleton rows={6} className="h-96" />
      ) : (
        <InventoryMovementHistory movements={movements} />
      )}

      <StockAdjustmentDialog
        item={null}
        allItems={items}
        open={showAdjustModal}
        onOpenChange={setShowAdjustModal}
      />
    </div>
  );
}
