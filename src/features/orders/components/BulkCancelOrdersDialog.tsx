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
import { AlertCircle, AlertTriangle } from "lucide-react";

interface BulkCancelOrdersDialogProps {
  orderCount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export function BulkCancelOrdersDialog({
  orderCount,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: BulkCancelOrdersDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 3) {
      setError("Please provide a valid cancellation reason.");
      return;
    }

    try {
      await onConfirm(reason.trim());
      setReason("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Cancel {orderCount} Selected Orders</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Any selected orders that are eligible for cancellation will be cancelled,
            items restocked, and customer records synchronized. Orders already shipped
            cannot be cancelled.
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
            <Label htmlFor="bulk-cancel-reason" className="text-xs font-semibold">
              Cancellation Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bulk-cancel-reason"
              placeholder="e.g. Stock discrepancy or bulk merchant cancellation..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              className="text-xs"
              autoFocus
            />
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isLoading || reason.trim().length < 3}
              className="text-xs font-medium"
            >
              {isLoading ? "Cancelling..." : `Confirm Cancel (${orderCount})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

