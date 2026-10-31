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
import { Switch } from "@/components/ui/switch";
import type { CourierConnection } from "../types";
import {
  configureCourierSchema,
  type ConfigureCourierInput,
} from "../schemas";
import { useUpdateCourierConnectionMutation } from "../hooks";
import { Truck, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";

interface ConfigureCourierDialogProps {
  courier: CourierConnection;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigureCourierDialog({
  courier,
  isOpen,
  onClose,
}: ConfigureCourierDialogProps) {
  const updateMutation = useUpdateCourierConnectionMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ConfigureCourierInput>({
    resolver: zodResolver(configureCourierSchema),
    defaultValues: {
      courierId: courier.id,
      isEnabled: courier.isEnabled,
      accountIdentifier: courier.accountIdentifier || "",
      defaultPickupAddress: courier.defaultPickupAddress,
      pickupPhone: courier.pickupPhone,
    },
  });

  const onSubmit = async (values: ConfigureCourierInput) => {
    try {
      await updateMutation.mutateAsync(values);
      onClose();
    } catch {
      // Handled by toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base">
              Configure {courier.name} ({courier.displayNameBn})
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Manage merchant pickup location and courier account identifier.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 text-xs">
          {/* Zero-Trust Security Callout */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Zero-Trust API Key Storage</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              Courier API Secret Keys and Bearer Tokens are encrypted and stored solely within the shared backend API vault. They are never kept in browser memory or localStorage.
            </p>
          </div>

          {/* Toggle Enable/Disable */}
          <div className="flex items-center justify-between p-3 rounded-md border border-border">
            <div>
              <Label className="text-xs font-semibold">Enable {courier.name}</Label>
              <p className="text-[11px] text-muted-foreground">
                Allow dispatching customer shipments via {courier.name}.
              </p>
            </div>
            <Controller
              name="isEnabled"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Merchant Account Code */}
          <div className="space-y-1.5">
            <Label htmlFor="accountIdentifier" className="text-xs font-medium">
              Merchant Store ID / Client Code (Public)
            </Label>
            <Input
              id="accountIdentifier"
              {...register("accountIdentifier")}
              placeholder="e.g. STDF-MER-8910"
              className="text-xs font-mono h-9"
            />
          </div>

          {/* Default Pickup Address */}
          <div className="space-y-1.5">
            <Label htmlFor="defaultPickupAddress" className="text-xs font-medium">
              Default Warehouse / Store Pickup Address
            </Label>
            <Input
              id="defaultPickupAddress"
              {...register("defaultPickupAddress")}
              className="text-xs h-9"
            />
            {errors.defaultPickupAddress && (
              <p className="text-[11px] text-destructive">
                {errors.defaultPickupAddress.message}
              </p>
            )}
          </div>

          {/* Pickup Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="pickupPhone" className="text-xs font-medium">
              Warehouse Contact Phone (+880...)
            </Label>
            <Input
              id="pickupPhone"
              {...register("pickupPhone")}
              className="text-xs font-mono h-9"
            />
            {errors.pickupPhone && (
              <p className="text-[11px] text-destructive">
                {errors.pickupPhone.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="text-xs h-8"
            >
              Cancel
            </Button>
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
              Save Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

