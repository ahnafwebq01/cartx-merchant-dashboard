"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShippingRatesConfig } from "../types";
import {
  shippingRatesSchema,
  type ShippingRatesInput,
} from "../schemas";
import { useUpdateShippingRatesMutation } from "../hooks";
import { Truck, CheckCircle2, Loader2, MapPin } from "lucide-react";

interface ShippingRatesFormProps {
  rates?: ShippingRatesConfig;
  isLoading?: boolean;
}

export function ShippingRatesForm({
  rates,
  isLoading = false,
}: ShippingRatesFormProps) {
  const updateMutation = useUpdateShippingRatesMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShippingRatesInput>({
    resolver: zodResolver(shippingRatesSchema),
    values: rates || {
      insideDhakaRate: 60,
      outsideDhakaRate: 120,
      freeShippingThreshold: 5000,
      codFeePercentage: 1,
      defaultCourier: "steadfast",
    },
  });

  const onSubmit = async (values: ShippingRatesInput) => {
    try {
      await updateMutation.mutateAsync(values);
    } catch {
      // Handled by toast
    }
  };

  if (isLoading && !rates) {
    return (
      <Card className="animate-pulse border-border">
        <CardContent className="h-64 bg-muted/20" />
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            Shipping Rates & Delivery Rules
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Configure default delivery charges for inside/outside Dhaka and free shipping thresholds.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Inside Dhaka */}
            <div className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Inside Dhaka Delivery (৳)</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Standard flat rate charged for deliveries within Dhaka Metropolitan.
              </p>
              <Input
                type="number"
                {...register("insideDhakaRate", { valueAsNumber: true })}
                className="text-xs font-mono h-9 bg-background"
              />
              {errors.insideDhakaRate && (
                <p className="text-[11px] text-destructive">
                  {errors.insideDhakaRate.message}
                </p>
              )}
            </div>

            {/* Outside Dhaka */}
            <div className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Outside Dhaka Delivery (৳)</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Standard flat rate for 63 districts outside Dhaka.
              </p>
              <Input
                type="number"
                {...register("outsideDhakaRate", { valueAsNumber: true })}
                className="text-xs font-mono h-9 bg-background"
              />
              {errors.outsideDhakaRate && (
                <p className="text-[11px] text-destructive">
                  {errors.outsideDhakaRate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Free Shipping Threshold */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Free Shipping Minimum (৳)</Label>
              <Input
                type="number"
                {...register("freeShippingThreshold", { valueAsNumber: true })}
                className="text-xs font-mono h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Set to 0 to disable free delivery offers.
              </p>
              {errors.freeShippingThreshold && (
                <p className="text-[11px] text-destructive">
                  {errors.freeShippingThreshold.message}
                </p>
              )}
            </div>

            {/* COD Fee Percentage */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">COD Collection Fee (%)</Label>
              <Input
                type="number"
                step="0.5"
                {...register("codFeePercentage", { valueAsNumber: true })}
                className="text-xs font-mono h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Standard Bangladesh courier COD fee (typically 1%).
              </p>
              {errors.codFeePercentage && (
                <p className="text-[11px] text-destructive">
                  {errors.codFeePercentage.message}
                </p>
              )}
            </div>

            {/* Default Courier Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Default Courier Partner</Label>
              <Controller
                name="defaultCourier"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Default Courier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steadfast">Steadfast Courier</SelectItem>
                      <SelectItem value="pathao">Pathao Courier</SelectItem>
                      <SelectItem value="redx">RedX Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[10px] text-muted-foreground">
                Selected by default when generating consignments.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={updateMutation.isPending}
              className="text-xs h-8 gap-1.5"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Save Delivery Rules
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

