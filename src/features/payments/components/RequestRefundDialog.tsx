"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PaymentTransaction } from "../types";
import { requestRefundSchema, type RequestRefundInput } from "../schemas";
import { useRequestRefundMutation } from "../hooks";
import { RotateCcw, AlertCircle, Loader2 } from "lucide-react";

function createRefundIdempotencyKey(txId: string): string {
  return `ref-idem-${txId}-${Date.now().toString(36)}`;
}

interface RequestRefundDialogProps {
  transaction: PaymentTransaction;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestRefundDialog({
  transaction,
  isOpen,
  onClose,
}: RequestRefundDialogProps) {
  const maxRefundable = transaction.amount - transaction.refundedAmount;
  const refundMutation = useRequestRefundMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestRefundInput>({
    resolver: zodResolver(requestRefundSchema),
    defaultValues: {
      transactionId: transaction.id,
      orderId: transaction.orderId,
      orderNumber: transaction.orderNumber,
      customerName: transaction.customerName,
      amount: maxRefundable,
      reason: "",
      idempotencyKey: `ref-idem-${transaction.id}`,
      requestedBy: "Merchant Admin",
    },
  });

  const onSubmit = async (values: RequestRefundInput) => {
    if (values.amount > maxRefundable) {
      return;
    }
    try {
      const uniqueIdempotencyKey = createRefundIdempotencyKey(transaction.id);
      await refundMutation.mutateAsync({
        ...values,
        idempotencyKey: uniqueIdempotencyKey,
      });
      reset();
      onClose();
    } catch {
      // Handled by mutation toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-purple-600" />
            <DialogTitle className="text-base">
              Issue Refund for {transaction.orderNumber}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Initiate a reversal back to the customer&apos;s {transaction.provider.toUpperCase()} account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 text-xs">
          {/* Max refundable notice */}
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex justify-between items-center">
            <span className="text-purple-700 dark:text-purple-300 font-medium">
              Available Refundable Balance:
            </span>
            <span className="text-base font-bold font-mono text-purple-700 dark:text-purple-300">
              ৳{maxRefundable.toLocaleString("en-BD")}
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-medium">
              Refund Amount (BDT ৳)
            </Label>
            <Input
              id="amount"
              type="number"
              step="any"
              {...register("amount", { valueAsNumber: true })}
              className="font-mono text-xs"
              placeholder="e.g. 500"
            />
            {errors.amount && (
              <p className="text-[11px] text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-medium">
              Refund Reason (Required for Audit)
            </Label>
            <Textarea
              id="reason"
              rows={3}
              {...register("reason")}
              className="text-xs"
              placeholder="e.g. Defective merchandise received / Customer requested cancellation before dispatch."
            />
            {errors.reason && (
              <p className="text-[11px] text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="p-2 rounded bg-muted/30 border border-border/40 text-[10px] text-muted-foreground font-mono truncate">
            Idempotency Key: {transaction.idempotencyKey}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={refundMutation.isPending}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={refundMutation.isPending}
              className="text-xs h-8 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {refundMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              Confirm & Issue Refund
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
