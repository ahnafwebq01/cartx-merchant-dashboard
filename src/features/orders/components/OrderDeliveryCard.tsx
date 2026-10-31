"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderDelivery, OrderStatus, Order } from "../types";
import { Truck, Navigation, Calendar, Info, Plus, Eye } from "lucide-react";
import { useShipmentByOrderQuery } from "@/features/shipping/hooks";
import { ShipmentDetailsModal } from "@/features/shipping/components/ShipmentDetailsModal";
import { CreateShipmentDialog } from "@/features/shipping/components/CreateShipmentDialog";
import { ShipmentStatusBadge } from "@/features/shipping/components/ShipmentStatusBadge";

interface OrderDeliveryCardProps {
  delivery: OrderDelivery;
  orderStatus?: OrderStatus;
  order?: Order;
}

export function OrderDeliveryCard({
  delivery,
  orderStatus,
  order,
}: OrderDeliveryCardProps) {
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: shipment } = useShipmentByOrderQuery(order?.id || "");

  const canCreateShipment =
    order &&
    ["confirmed", "processing", "ready_to_ship"].includes(order.orderStatus) &&
    (!shipment || shipment.status === "cancelled");

  return (
    <>
      <Card className="border border-border shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Courier & Logistics</span>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] font-medium font-mono"
            >
              {shipment ? shipment.courierName : delivery.courier}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Assigned Courier:</span>
            <span className="font-semibold text-foreground">
              {shipment ? shipment.courierName : delivery.courier}
            </span>
          </div>

          {orderStatus && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Fulfillment Stage:</span>
              <span className="capitalize font-medium text-foreground">
                {orderStatus.replace(/_/g, " ")}
              </span>
            </div>
          )}

          {/* Consignment ID if available */}
          {(shipment?.consignmentId || delivery.consignmentId) && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Consignment ID:</span>
              <span className="font-mono font-semibold text-foreground">
                {shipment?.consignmentId || delivery.consignmentId}
              </span>
            </div>
          )}

          {/* Tracking Number */}
          {shipment?.trackingId || delivery.trackingNumber ? (
            <div className="flex justify-between items-center bg-muted/40 p-2 rounded border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-primary" />
                Tracking Number:
              </span>
              <span className="font-mono font-semibold text-primary">
                {shipment?.trackingId || delivery.trackingNumber}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Tracking Number:</span>
              <span className="italic text-[11px]">
                Pending courier booking
              </span>
            </div>
          )}

          {/* Shipment Live Status */}
          {shipment && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Parcel Status:</span>
              <ShipmentStatusBadge status={shipment.status} />
            </div>
          )}

          {delivery.estimatedDays && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Estimated Delivery:
              </span>
              <span className="text-foreground">{delivery.estimatedDays}</span>
            </div>
          )}

          {delivery.dispatchedAt && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Dispatched At:</span>
              <span className="font-mono text-[11px] text-foreground">
                {new Date(delivery.dispatchedAt).toLocaleDateString("en-BD", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {delivery.deliveredAt && (
            <div className="flex justify-between items-center text-emerald-600 font-medium">
              <span>Delivered At:</span>
              <span className="font-mono text-[11px]">
                {new Date(delivery.deliveredAt).toLocaleDateString("en-BD", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {delivery.deliveryNotes && (
            <div className="pt-2 border-t border-border/60 flex items-start gap-1.5 text-muted-foreground text-[11px]">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
              <span>Note: {delivery.deliveryNotes}</span>
            </div>
          )}

          {/* Action Buttons: Track Parcel or Create Consignment */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
            {shipment ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTrackOpen(true)}
                className="w-full text-xs h-8 gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                Track Courier Timeline
              </Button>
            ) : canCreateShipment ? (
              <Button
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="w-full text-xs h-8 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Consignment
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Shipment Details & Tracking Modal */}
      {shipment && (
        <ShipmentDetailsModal
          shipment={shipment}
          isOpen={isTrackOpen}
          onClose={() => setIsTrackOpen(false)}
        />
      )}

      {/* Create Shipment Dialog */}
      {order && (
        <CreateShipmentDialog
          order={order}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </>
  );
}
