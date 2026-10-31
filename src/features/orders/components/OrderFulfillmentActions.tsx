"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "../types";
import {
  CheckCircle2,
  Package,
  Truck,
  Send,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { CancelOrderDialog } from "./CancelOrderDialog";

interface OrderFulfillmentActionsProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => Promise<void>;
  onCancelOrder: (reason: string, restockInventory: boolean) => Promise<void>;
  onReturnOrder?: (reason: string, restockInventory: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function OrderFulfillmentActions({
  order,
  onStatusChange,
  onCancelOrder,
  onReturnOrder,
  isLoading = false,
}: OrderFulfillmentActionsProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleTransition = async (status: OrderStatus) => {
    setIsActionLoading(true);
    try {
      await onStatusChange(status);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReturn = async () => {
    setIsActionLoading(true);
    try {
      if (onReturnOrder) {
        await onReturnOrder("Customer return processed by merchant", true);
      } else {
        await onStatusChange("returned");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const currentStatus = order.orderStatus;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Pending -> Confirmed or Cancel */}
        {currentStatus === "pending" && (
          <>
            <Button
              size="sm"
              onClick={() => handleTransition("confirmed")}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirm Order
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCancelOpen(true)}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel Order
            </Button>
          </>
        )}

        {/* Confirmed -> Processing or Cancel */}
        {currentStatus === "confirmed" && (
          <>
            <Button
              size="sm"
              onClick={() => handleTransition("processing")}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Package className="h-3.5 w-3.5" />
              Start Processing
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCancelOpen(true)}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel Order
            </Button>
          </>
        )}

        {/* Processing -> Ready to Ship or Cancel */}
        {currentStatus === "processing" && (
          <>
            <Button
              size="sm"
              onClick={() => handleTransition("ready_to_ship")}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 font-medium bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Truck className="h-3.5 w-3.5" />
              Mark Ready to Ship
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCancelOpen(true)}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel Order
            </Button>
          </>
        )}

        {/* Ready to Ship -> Shipped */}
        {currentStatus === "ready_to_ship" && (
          <>
            <Button
              size="sm"
              onClick={() => handleTransition("shipped")}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 font-medium bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Send className="h-3.5 w-3.5" />
              Dispatch Shipment (Mark Shipped)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCancelOpen(true)}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel Order
            </Button>
          </>
        )}

        {/* Shipped -> Delivered or Return */}
        {currentStatus === "shipped" && (
          <>
            <Button
              size="sm"
              onClick={() => handleTransition("delivered")}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark as Delivered
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReturn}
              disabled={isLoading || isActionLoading}
              className="text-xs h-8 gap-1.5 text-rose-600 hover:bg-rose-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Record Return / RTO
            </Button>
          </>
        )}

        {/* Delivered -> Return */}
        {currentStatus === "delivered" && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReturn}
            disabled={isLoading || isActionLoading}
            className="text-xs h-8 gap-1.5 text-rose-600 hover:bg-rose-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Process Customer Return
          </Button>
        )}
      </div>

      {/* Cancel Dialog */}
      <CancelOrderDialog
        order={order}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={onCancelOrder}
        isLoading={isLoading}
      />
    </>
  );
}

