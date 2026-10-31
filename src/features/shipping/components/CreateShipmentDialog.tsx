"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "../../orders/types";
import {
  createShipmentSchema,
  type CreateShipmentInput,
} from "../schemas";
import { useCreateShipmentMutation, useCourierConnectionsQuery } from "../hooks";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";

function createShipmentIdempotencyKey(orderId: string): string {
  return `shp-idem-${orderId}-${Date.now().toString(36)}`;
}

interface CreateShipmentDialogProps {
  order?: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShipmentDialog({
  order,
  isOpen,
  onClose,
}: CreateShipmentDialogProps) {
  const createMutation = useCreateShipmentMutation();
  const { data: couriers } = useCourierConnectionsQuery();

  const enabledCouriers = couriers?.filter((c) => c.isEnabled) || [];
  const defaultCourierId = enabledCouriers[0]?.id || "steadfast";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateShipmentInput>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      orderId: order?.id || "",
      orderNumber: order?.orderNumber || "",
      courier: defaultCourierId,
      recipientName: order?.customerName || order?.shippingAddress?.fullName || "",
      recipientPhone: order?.customerPhone || order?.shippingAddress?.phone || "",
      deliveryAddress: order?.shippingAddress?.addressLine1 || "",
      city: order?.shippingAddress?.city || "Dhaka",
      district: order?.shippingAddress?.division || "Dhaka",
      weightKg: 0.5,
      codAmount: order ? order.amountDue : 0,
      deliveryCharge: order ? order.shippingFee : 60,
      deliveryType: "standard",
      pickupLocation: "Dhaka Central Warehouse (Uttara)",
      specialInstructions: order?.delivery?.deliveryNotes || "",
      idempotencyKey: `shp-idem-${order?.id || "manual"}`,
    },
  });

  const onSubmit = async (values: CreateShipmentInput) => {
    try {
      const uniqueIdempotencyKey = createShipmentIdempotencyKey(order?.id || "manual");
      await createMutation.mutateAsync({
        ...values,
        idempotencyKey: uniqueIdempotencyKey,
      });
      reset();
      onClose();
    } catch {
      // Handled by toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base font-semibold">
              Create Courier Consignment {order ? `for ${order.orderNumber}` : ""}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Generate an official courier booking with Steadfast, Pathao, or RedX.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 text-xs">
          {/* Order Details (if manual or pre-filled) */}
          {!order && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="orderId" className="text-xs font-medium">Order ID</Label>
                <Input id="orderId" {...register("orderId")} placeholder="ord-xxxx" className="text-xs h-9 font-mono" />
                {errors.orderId && <p className="text-[11px] text-destructive">{errors.orderId.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="orderNumber" className="text-xs font-medium">Order Number</Label>
                <Input id="orderNumber" {...register("orderNumber")} placeholder="CTX-xxxx" className="text-xs h-9 font-mono" />
                {errors.orderNumber && <p className="text-[11px] text-destructive">{errors.orderNumber.message}</p>}
              </div>
            </div>
          )}

          {/* Courier Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Select Courier Provider</Label>
            <Controller
              name="courier"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Choose Courier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steadfast">Steadfast Courier (Recommended for Nationwide)</SelectItem>
                    <SelectItem value="pathao">Pathao Courier (Express Dhaka & Inter-city)</SelectItem>
                    <SelectItem value="redx">RedX Delivery (Upazila & Rural Coverage)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="recipientName" className="text-xs font-medium">Recipient Name</Label>
              <Input id="recipientName" {...register("recipientName")} className="text-xs h-9" />
              {errors.recipientName && <p className="text-[11px] text-destructive">{errors.recipientName.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="recipientPhone" className="text-xs font-medium">Recipient Mobile (01...)</Label>
              <Input id="recipientPhone" {...register("recipientPhone")} className="text-xs h-9 font-mono" />
              {errors.recipientPhone && <p className="text-[11px] text-destructive">{errors.recipientPhone.message}</p>}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-1">
            <Label htmlFor="deliveryAddress" className="text-xs font-medium">Street Address / House / Area</Label>
            <Input id="deliveryAddress" {...register("deliveryAddress")} className="text-xs h-9" />
            {errors.deliveryAddress && <p className="text-[11px] text-destructive">{errors.deliveryAddress.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="city" className="text-xs font-medium">City / Area</Label>
              <Input id="city" {...register("city")} className="text-xs h-9" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="district" className="text-xs font-medium">District / Division</Label>
              <Input id="district" {...register("district")} className="text-xs h-9" />
            </div>
          </div>

          {/* Logistics Pricing & Weight */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <div className="space-y-1">
              <Label htmlFor="codAmount" className="text-xs font-medium">COD to Collect (৳)</Label>
              <Input
                id="codAmount"
                type="number"
                {...register("codAmount", { valueAsNumber: true })}
                className="text-xs h-8 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deliveryCharge" className="text-xs font-medium">Delivery Charge (৳)</Label>
              <Input
                id="deliveryCharge"
                type="number"
                {...register("deliveryCharge", { valueAsNumber: true })}
                className="text-xs h-8 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="weightKg" className="text-xs font-medium">Weight (kg)</Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                {...register("weightKg", { valueAsNumber: true })}
                className="text-xs h-8 font-mono"
              />
            </div>
          </div>

          {/* Pickup Hub & Special Notes */}
          <div className="space-y-1">
            <Label htmlFor="pickupLocation" className="text-xs font-medium">Merchant Pickup Location</Label>
            <Input id="pickupLocation" {...register("pickupLocation")} className="text-xs h-9" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="specialInstructions" className="text-xs font-medium">Delivery Notes / Instructions</Label>
            <Textarea
              id="specialInstructions"
              rows={2}
              {...register("specialInstructions")}
              placeholder="e.g. Call before delivery, handle with care"
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="text-xs h-8 gap-1.5"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Create Consignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
