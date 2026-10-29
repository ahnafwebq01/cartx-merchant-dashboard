"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockAdjustmentFormSchema, type StockAdjustmentFormValues } from "../schemas";
import { useStockAdjustmentMutation } from "../hooks";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Boxes, Calculator, ArrowRight } from "lucide-react";
import type { InventoryItem } from "../types";

interface StockAdjustmentDialogProps {
  item: InventoryItem | null;
  allItems?: InventoryItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockAdjustmentDialog({
  item,
  allItems = [],
  open,
  onOpenChange,
}: StockAdjustmentDialogProps) {
  const mutation = useStockAdjustmentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: {
      productId: item?.id || allItems[0]?.id || "",
      type: "restock",
      quantity: 5,
      reason: "",
      referenceId: "",
      note: "",
    },
  });

  const selectedProductId = watch("productId");
  const selectedType = watch("type");
  const quantityWatch = watch("quantity") || 0;

  // Find active selected product object
  const activeItem = item || allItems.find((i) => i.id === selectedProductId);
  const currentStock = activeItem?.stock ?? 0;

  // Calculate resulting stock
  let resultingStock = currentStock;
  if (selectedType === "restock" || selectedType === "return_restock") {
    resultingStock = currentStock + Math.abs(quantityWatch);
  } else if (selectedType === "damaged" || selectedType === "lost") {
    resultingStock = Math.max(0, currentStock - Math.abs(quantityWatch));
  } else if (selectedType === "manual_correction") {
    resultingStock = Math.max(0, quantityWatch);
  }

  const stockDiff = resultingStock - currentStock;

  useEffect(() => {
    if (item) {
      setValue("productId", item.id);
    } else if (allItems.length > 0 && !selectedProductId) {
      setValue("productId", allItems[0].id);
    }
  }, [item, allItems, selectedProductId, setValue]);

  const onSubmit = (values: StockAdjustmentFormValues) => {
    mutation.mutate(
      {
        productId: values.productId,
        type: values.type,
        quantityChange: values.quantity,
        reason: values.reason,
        referenceId: values.referenceId,
        note: values.note,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" /> Adjust Inventory Stock
          </DialogTitle>
          <DialogDescription className="text-xs">
            Log inventory restocks, damages, returns, or audit corrections with full audit logging.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
          {/* Target Product */}
          {!item && allItems.length > 0 ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Select Product</label>
              <Select
                value={selectedProductId}
                onValueChange={(val) => setValue("productId", val, { shouldValidate: true })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {allItems.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} ({p.sku}) — Stock: {p.stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="p-3 bg-muted/40 rounded-lg border border-border flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-foreground block">{activeItem?.title}</span>
                <span className="text-muted-foreground text-[11px]">SKU: {activeItem?.sku}</span>
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                Current: {currentStock} units
              </Badge>
            </div>
          )}

          {/* Adjustment Type */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Reason / Adjustment Type</label>
            <Select
              value={selectedType}
              onValueChange={(val) =>
                setValue("type", val as StockAdjustmentFormValues["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restock">Restock (+) — Supplier batch / arrival</SelectItem>
                <SelectItem value="return_restock">Return Restock (+) — Customer return (sellable)</SelectItem>
                <SelectItem value="damaged">Damaged (-) — Defective / transit damage</SelectItem>
                <SelectItem value="lost">Lost / Shrinkage (-) — Missing inventory</SelectItem>
                <SelectItem value="manual_correction">Manual Correction (=) — Exact count adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Change */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              {selectedType === "manual_correction" ? "New Exact Stock Count" : "Quantity Change"}
            </label>
            <Input
              type="number"
              min={selectedType === "manual_correction" ? "0" : "1"}
              step="1"
              {...register("quantity", { valueAsNumber: true })}
              className="text-xs"
              placeholder="e.g. 10"
            />
            {errors.quantity && (
              <p className="text-[11px] text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          {/* Live Calculation Preview Banner */}
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calculator className="h-3.5 w-3.5 text-primary" />
              <span>Stock Calculation:</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-muted-foreground">{currentStock}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-bold text-foreground">{resultingStock} units</span>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  stockDiff > 0
                    ? "text-emerald-600 bg-emerald-50 border-emerald-300"
                    : stockDiff < 0
                    ? "text-destructive bg-destructive/10 border-destructive/30"
                    : ""
                }`}
              >
                {stockDiff > 0 ? `+${stockDiff}` : stockDiff}
              </Badge>
            </div>
          </div>

          {/* Reason explanation */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Reason / Justification <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("reason")}
              placeholder="e.g. Received shipment from Narayanganj warehouse"
              className="text-xs"
            />
            {errors.reason && (
              <p className="text-[11px] text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {/* Reference ID (PO, Invoice, etc) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Reference Document # (Optional)
            </label>
            <Input
              {...register("referenceId")}
              placeholder="e.g. PO-2026-104 or INV-089"
              className="text-xs font-mono"
            />
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Confirm Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
