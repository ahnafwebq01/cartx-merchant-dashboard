"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Shipment } from "../types";
import { ShipmentStatusBadge } from "./ShipmentStatusBadge";
import {
  Truck,
  MapPin,
  Phone,
  User,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useCancelShipmentMutation } from "../hooks";

interface ShipmentDetailsModalProps {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShipmentDetailsModal({
  shipment,
  isOpen,
  onClose,
}: ShipmentDetailsModalProps) {
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const cancelMutation = useCancelShipmentMutation();

  if (!shipment) return null;

  const canCancel =
    shipment.status !== "delivered" &&
    shipment.status !== "cancelled" &&
    shipment.status !== "returned";

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({
        shipmentId: shipment.id,
        reason: "Cancelled by merchant from dashboard",
      });
      setIsConfirmCancelOpen(false);
    } catch {
      // Handled by toast
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <DialogTitle className="text-base font-semibold">
                  Consignment {shipment.consignmentId}
                </DialogTitle>
              </div>
              <ShipmentStatusBadge status={shipment.status} />
            </div>
            <DialogDescription className="text-xs">
              Live courier consignment record and transit timeline with {shipment.courierName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Courier & Tracking Banner */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Courier Tracking ID
                </span>
                <span className="text-base font-bold font-mono text-primary">
                  {shipment.trackingId}
                </span>
              </div>
              <Badge variant="secondary" className="font-semibold text-xs">
                {shipment.courierName}
              </Badge>
            </div>

            {/* Recipient & Delivery Address */}
            <div className="p-3 rounded-md border border-border/60 space-y-2">
              <span className="font-semibold text-foreground block text-[11px]">
                Recipient & Delivery Destination
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{shipment.recipientName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{shipment.recipientPhone}</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-muted-foreground pt-1 border-t border-border/40">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground leading-relaxed">
                  {shipment.deliveryAddress}, {shipment.city}, {shipment.district}
                </span>
              </div>
            </div>

            {/* Logistics & Financial Parameters */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-md border border-border/60 text-center space-y-0.5">
                <span className="text-muted-foreground text-[10px] block">
                  Delivery Charge
                </span>
                <span className="font-mono font-bold text-foreground">
                  ৳{shipment.deliveryCharge.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="p-2.5 rounded-md border border-border/60 text-center space-y-0.5">
                <span className="text-muted-foreground text-[10px] block">
                  COD Amount
                </span>
                <span className="font-mono font-bold text-purple-600">
                  {shipment.codAmount > 0
                    ? `৳${shipment.codAmount.toLocaleString("en-BD")}`
                    : "Paid (৳0)"}
                </span>
              </div>

              <div className="p-2.5 rounded-md border border-border/60 text-center space-y-0.5">
                <span className="text-muted-foreground text-[10px] block">
                  Parcel Weight
                </span>
                <span className="font-mono font-bold text-foreground">
                  {shipment.weightKg} kg
                </span>
              </div>
            </div>

            {/* Order Reference */}
            <div className="p-2.5 rounded-md bg-muted/20 border border-border/60 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Order Reference:</span>
              <Link
                href={`/dashboard/orders/${shipment.orderId}`}
                className="font-mono font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {shipment.orderNumber}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {/* Tracking Events Timeline */}
            <div className="space-y-2 pt-2">
              <span className="font-semibold text-foreground block text-[11px]">
                Shipment Transit Timeline
              </span>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {shipment.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-xs">
                          {event.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(event.timestamp).toLocaleTimeString("en-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {event.description}
                      </p>
                      {event.location && (
                        <span className="inline-block text-[10px] font-mono text-primary/80">
                          Location: {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between border-t border-border pt-3">
            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsConfirmCancelOpen(true)}
                className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel Shipment
              </Button>
            )}

            <Button size="sm" variant="secondary" onClick={onClose} className="text-xs h-8">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Cancellation */}
      {isConfirmCancelOpen && (
        <Dialog open={isConfirmCancelOpen} onOpenChange={setIsConfirmCancelOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">
                Cancel Consignment {shipment.consignmentId}?
              </DialogTitle>
              <DialogDescription className="text-xs">
                This will recall the parcel from the courier before rider pickup. This action cannot be reversed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmCancelOpen(false)}
                className="text-xs h-8"
              >
                Keep Active
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="text-xs h-8"
              >
                Yes, Cancel Shipment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
