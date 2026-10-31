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
import type { PaymentTransaction } from "../types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  CreditCard,
  User,
  Phone,
  Calendar,
  Hash,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { RequestRefundDialog } from "./RequestRefundDialog";
import { useVerifyPaymentMutation } from "../hooks";

interface PaymentTransactionDetailsModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentTransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
}: PaymentTransactionDetailsModalProps) {
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const verifyMutation = useVerifyPaymentMutation();

  if (!transaction) return null;

  const handleVerifyNow = async () => {
    await verifyMutation.mutateAsync({
      transactionId: transaction.id,
      gatewayTransactionId:
        transaction.gatewayTransactionId ||
        `${transaction.provider.toUpperCase()}${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: "successful",
    });
  };

  const isEligibleForRefund =
    (transaction.status === "successful" ||
      transaction.status === "partially_refunded") &&
    transaction.amount - transaction.refundedAmount > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <DialogTitle className="text-base font-semibold">
                  Transaction {transaction.id}
                </DialogTitle>
              </div>
              <PaymentStatusBadge status={transaction.status} />
            </div>
            <DialogDescription className="text-xs">
              Gateway authorization record and customer settlement audit trail.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Amount Banner */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Payment Amount
                </span>
                <span className="text-lg font-bold font-mono text-primary">
                  ৳{transaction.amount.toLocaleString("en-BD")}
                </span>
              </div>
              <Badge variant="secondary" className="uppercase font-semibold tracking-wider">
                {transaction.provider}
              </Badge>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 p-2.5 rounded-md border border-border/60">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <Hash className="h-3 w-3 text-primary" />
                  Order Reference:
                </span>
                <Link
                  href={`/dashboard/orders/${transaction.orderId}`}
                  className="font-mono font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {transaction.orderNumber}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-1 p-2.5 rounded-md border border-border/60">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Gateway TrxID:
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {transaction.gatewayTransactionId || (
                    <span className="italic text-muted-foreground text-[11px]">
                      Pending Execution
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="p-3 rounded-md border border-border/60 space-y-2">
              <span className="font-semibold text-foreground block text-[11px]">
                Customer Information
              </span>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{transaction.customerName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{transaction.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Timestamps & Idempotency */}
            <div className="p-3 rounded-md bg-muted/20 border border-border/60 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Initiated:
                </span>
                <span className="text-foreground">
                  {new Date(transaction.initiatedAt).toLocaleString("en-BD")}
                </span>
              </div>
              {transaction.completedAt && (
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="h-3 w-3" />
                    Verified At:
                  </span>
                  <span className="text-foreground">
                    {new Date(transaction.completedAt).toLocaleString("en-BD")}
                  </span>
                </div>
              )}
              {transaction.refundedAmount > 0 && (
                <div className="flex justify-between text-purple-600 font-semibold pt-1 border-t border-border/40">
                  <span>Refunded to Date:</span>
                  <span>৳{transaction.refundedAmount.toLocaleString("en-BD")}</span>
                </div>
              )}
              <div className="text-[10px] text-muted-foreground/80 truncate pt-1">
                Idempotency Key: {transaction.idempotencyKey}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between border-t border-border pt-3 gap-2">
            <div>
              {transaction.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVerifyNow}
                  disabled={verifyMutation.isPending}
                  className="text-xs h-8 gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verify Demo Payment
                </Button>
              )}
              {isEligibleForRefund && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsRefundOpen(true)}
                  className="text-xs h-8 gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Request Refund
                </Button>
              )}
            </div>

            <Button size="sm" variant="secondary" onClick={onClose} className="text-xs h-8">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      {isEligibleForRefund && (
        <RequestRefundDialog
          transaction={transaction}
          isOpen={isRefundOpen}
          onClose={() => setIsRefundOpen(false)}
        />
      )}
    </>
  );
}

