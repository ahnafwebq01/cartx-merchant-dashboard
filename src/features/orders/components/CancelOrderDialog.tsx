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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Order } from "../types";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface CancelOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, restockInventory: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function CancelOrderDialog({
  order,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");
  const [restockInventory, setRestockInventory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 3) {
      setError("Please provide a valid cancellation reason (min 3 characters).");
      return;
    }

    setError(null);
    try {
      await onConfirm(reason.trim(), restockInventory);
      setReason("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to cancel order.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Cancel Order {order.orderNumber}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Cancelling this order will mark it as cancelled, stop fulfillment, and notify
            the customer. This action cannot be reversed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cancel-reason" className="text-xs font-semibold">
              Cancellation Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="e.g. Customer requested cancellation due to travel..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              className="text-xs"
              autoFocus
            />
            <p className="text-[10px] text-muted-foreground">
              Required for store audit trail. Minimum 3 characters.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="restock-items"
              checked={restockInventory}
              onCheckedChange={(checked) => setRestockInventory(Boolean(checked))}
            />
            <Label
              htmlFor="restock-items"
              className="text-xs font-normal text-foreground cursor-pointer"
            >
              Automatically restock {order.items.length} item(s) back into inventory
            </Label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Keep Order
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isLoading || reason.trim().length < 3}
              className="text-xs font-medium"
            >
              {isLoading ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

