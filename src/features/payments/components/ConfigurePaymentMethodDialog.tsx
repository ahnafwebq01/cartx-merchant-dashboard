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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentMethodConfig } from "../types";
import {
  configurePaymentMethodSchema,
  type ConfigurePaymentMethodInput,
} from "../schemas";
import { useUpdatePaymentMethodMutation } from "../hooks";
import { Settings, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";

interface ConfigurePaymentMethodDialogProps {
  method: PaymentMethodConfig;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurePaymentMethodDialog({
  method,
  isOpen,
  onClose,
}: ConfigurePaymentMethodDialogProps) {
  const updateMutation = useUpdatePaymentMethodMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ConfigurePaymentMethodInput>({
    resolver: zodResolver(configurePaymentMethodSchema),
    defaultValues: {
      provider: method.id,
      isEnabled: method.isEnabled,
      environment: method.environment,
      merchantId: method.merchantId || "",
      accountIdentifier: method.accountIdentifier || "",
    },
  });

  const onSubmit = async (values: ConfigurePaymentMethodInput) => {
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
            <Settings className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base">
              Configure {method.name} ({method.displayNameBn})
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Manage gateway environment mode and merchant account identifiers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 text-xs">
          {/* Zero-Trust Security Callout */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Zero-Trust Credential Security</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              Merchant API secrets (App Secret, Store Password, Private Keys) are stored only in the shared backend API vault. They are never transmitted to or saved in the browser.
            </p>
          </div>

          {/* Toggle Enable/Disable */}
          <div className="flex items-center justify-between p-3 rounded-md border border-border">
            <div>
              <Label className="text-xs font-semibold">Enable {method.name}</Label>
              <p className="text-[11px] text-muted-foreground">
                Display this gateway option to customers at checkout.
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

          {/* Environment Mode */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Gateway Environment</Label>
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Select Environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox / Demo Simulation</SelectItem>
                    <SelectItem value="live">Live Production (Backend Verified)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Merchant Account Identifier / Shortcode */}
          {method.id !== "cod" && (
            <div className="space-y-1.5">
              <Label htmlFor="accountIdentifier" className="text-xs font-medium">
                Merchant Mobile Number / Store ID (Public)
              </Label>
              <Input
                id="accountIdentifier"
                {...register("accountIdentifier")}
                placeholder="e.g. 01700000000 or cartx_store_01"
                className="text-xs font-mono h-9"
              />
              {errors.accountIdentifier && (
                <p className="text-[11px] text-destructive">
                  {errors.accountIdentifier.message}
                </p>
              )}
            </div>
          )}

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
              Save Configuration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

