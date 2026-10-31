"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Order } from "../types";
import { Printer, Store } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PrintInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
}

export function PrintInvoiceModal({
  order,
  isOpen,
  onClose,
  storeName = "CartX Merchant Store",
}: PrintInvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Printer className="h-4 w-4 text-primary" />
            Invoice — {order.orderNumber}
          </DialogTitle>
          <Button
            size="sm"
            onClick={handlePrint}
            className="text-xs gap-1.5 h-8 font-medium"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Invoice
          </Button>
        </DialogHeader>

        {/* Printable Paper Area */}
        <div id="printable-invoice" className="p-8 bg-card text-foreground space-y-6 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  <Store className="h-4 w-4" />
                </div>
                <h1 className="text-base font-bold tracking-tight text-foreground">
                  {storeName}
                </h1>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Dhaka, Bangladesh • info@cartx.com.bd
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="font-mono text-sm font-bold text-foreground block">
                INVOICE #{order.orderNumber}
              </span>
              <p className="text-[11px] text-muted-foreground">
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="pt-1 flex justify-end">
                <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg border border-border/60">
            <div className="space-y-1">
              <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
                Customer & Shipping Address
              </span>
              <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.division}
              </p>
              <p className="text-muted-foreground font-mono text-[11px]">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="space-y-1 text-right">
              <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
                Fulfillment & Logistics
              </span>
              <p className="text-foreground">
                Courier: <span className="font-medium">{order.delivery.courier}</span>
              </p>
              {order.delivery.trackingNumber && (
                <p className="font-mono text-muted-foreground">
                  Tracking #: {order.delivery.trackingNumber}
                </p>
              )}
              {order.paymentReference && (
                <p className="font-mono text-muted-foreground">
                  Trx ID: {order.paymentReference}
                </p>
              )}
              <p className="text-muted-foreground">
                Status: <span className="capitalize font-medium">{order.orderStatus.replace(/_/g, " ")}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground">
                  <th className="p-3">Item Details</th>
                  <th className="p-3 text-center">SKU</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.id} className="text-xs">
                    <td className="p-3 font-medium text-foreground">
                      {item.title}
                      {item.variantName && (
                        <span className="block text-[10px] text-muted-foreground">
                          {item.variantName}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono text-[11px] text-muted-foreground">
                      {item.sku}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ৳{item.price.toLocaleString("en-BD")}
                    </td>
                    <td className="p-3 text-center font-mono">{item.quantity}</td>
                    <td className="p-3 text-right font-mono font-medium text-foreground">
                      ৳{item.total.toLocaleString("en-BD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 border-t border-border pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono">৳{order.subtotal.toLocaleString("en-BD")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span className="font-mono">-৳{order.discount.toLocaleString("en-BD")}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee:</span>
                <span className="font-mono">৳{order.shippingFee.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
                <span>Grand Total:</span>
                <span className="font-mono text-primary">৳{order.grandTotal.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono">৳{order.amountPaid.toLocaleString("en-BD")}</span>
              </div>
              {order.amountDue > 0 && (
                <div className="flex justify-between text-[11px] text-amber-600 font-semibold">
                  <span>Amount Due:</span>
                  <span className="font-mono">৳{order.amountDue.toLocaleString("en-BD")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
            Thank you for shopping with {storeName}. For inquiries, contact support at 01410767729.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

