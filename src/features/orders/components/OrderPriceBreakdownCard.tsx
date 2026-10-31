"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Order } from "../types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Receipt, Check, RotateCcw, ExternalLink } from "lucide-react";
import { mockPaymentService } from "@/features/payments/services/mockPayments";
import { RequestRefundDialog } from "@/features/payments/components/RequestRefundDialog";
import { PaymentTransactionDetailsModal } from "@/features/payments/components/PaymentTransactionDetailsModal";
import type { PaymentTransaction } from "@/features/payments/types";

interface OrderPriceBreakdownCardProps {
  order: Order;
  onMarkPaid?: () => void;
  isLoading?: boolean;
}

export function OrderPriceBreakdownCard({
  order,
  onMarkPaid,
  isLoading = false,
}: OrderPriceBreakdownCardProps) {
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  // Lookup linked transaction
  const linkedTx = mockPaymentService.getTransactionByOrderId(order.id);

  // Synthetic transaction if none exists in storage yet
  const effectiveTx: PaymentTransaction = linkedTx || {
    id: `trx-synth-${order.id}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    provider: (order.paymentMethod === "bkash" ||
    order.paymentMethod === "nagad" ||
    order.paymentMethod === "sslcommerz"
      ? order.paymentMethod
      : "cod"),
    amount: order.grandTotal,
    currency: "BDT",
    status: order.paymentStatus === "paid" ? "successful" : "pending",
    gatewayTransactionId: order.paymentReference,
    gatewayReference: `REF-${order.orderNumber}`,
    idempotencyKey: `synth-idem-${order.id}`,
    refundedAmount: order.paymentStatus === "refunded" ? order.grandTotal : 0,
    initiatedAt: order.createdAt,
    completedAt: order.paymentStatus === "paid" ? order.updatedAt : undefined,
  };

  const isEligibleForRefund =
    (order.paymentStatus === "paid" || order.paymentStatus === "partially_paid") &&
    order.amountPaid > 0;

  return (
    <>
      <Card className="border border-border shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              <span>Financial Summary</span>
            </div>
            <PaymentStatusBadge
              status={order.paymentStatus}
              method={order.paymentMethod}
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-3 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono">৳{order.subtotal.toLocaleString("en-BD")}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>
                Discount {order.couponCode ? `(${order.couponCode})` : ""}
              </span>
              <span className="font-mono">-৳{order.discount.toLocaleString("en-BD")}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Delivery / Shipping Charge</span>
            <span className="font-mono">৳{order.shippingFee.toLocaleString("en-BD")}</span>
          </div>

          {order.tax > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax / VAT (Included)</span>
              <span className="font-mono">৳{order.tax.toLocaleString("en-BD")}</span>
            </div>
          )}

          <div className="border-t border-border pt-2 flex justify-between font-bold text-sm text-foreground">
            <span>Grand Total</span>
            <span className="font-mono text-primary text-base">
              ৳{order.grandTotal.toLocaleString("en-BD")}
            </span>
          </div>

          {/* Payment Balance Transitions */}
          <div className="bg-muted/40 p-2.5 rounded-md border border-border/60 space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Amount Paid:</span>
              <span className="font-mono font-medium text-foreground">
                ৳{order.amountPaid.toLocaleString("en-BD")}
              </span>
            </div>

            {order.amountDue > 0 ? (
              <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <span>Amount Due (Upon Delivery):</span>
                <span className="font-mono">
                  ৳{order.amountDue.toLocaleString("en-BD")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium pt-0.5">
                <Check className="h-3 w-3" />
                <span>Paid in full</span>
              </div>
            )}

            {order.paymentReference && (
              <div className="text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40 flex items-center justify-between">
                <span>Gateway TrxID: {order.paymentReference}</span>
                {linkedTx && (
                  <button
                    onClick={() => setIsTxModalOpen(true)}
                    className="text-primary hover:underline flex items-center gap-0.5"
                  >
                    View Trx <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            )}

            {order.paymentStatus === "refunded" && (
              <div className="text-[10px] text-purple-600 font-semibold pt-1 border-t border-border/40 flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                <span>Full order refund issued</span>
              </div>
            )}
          </div>

          {/* Quick Payment Action */}
          {order.paymentStatus === "unpaid" && onMarkPaid && (
            <Button
              size="sm"
              variant="outline"
              onClick={onMarkPaid}
              disabled={isLoading}
              className="w-full text-xs h-8 gap-1.5 font-medium border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            >
              <Check className="h-3.5 w-3.5" />
              Mark as Paid (Receive Cash / Confirmation)
            </Button>
          )}

          {/* Refund Action */}
          {isEligibleForRefund && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRefundOpen(true)}
              className="w-full text-xs h-8 gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Issue Gateway Refund
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      {isEligibleForRefund && (
        <RequestRefundDialog
          transaction={effectiveTx}
          isOpen={isRefundOpen}
          onClose={() => setIsRefundOpen(false)}
        />
      )}

      {/* Transaction Details Modal */}
      {linkedTx && (
        <PaymentTransactionDetailsModal
          transaction={linkedTx}
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
        />
      )}
    </>
  );
}
