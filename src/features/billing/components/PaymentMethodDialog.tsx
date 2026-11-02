"use client";

import React, { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { CreditCard, Plus, AlertCircle } from "lucide-react";
import {
  paymentMethodSchema,
  type PaymentMethodFormValues,
} from "../schemas";
import { useAddPaymentMethodMutation } from "../hooks";
import type { PaymentMethodType } from "../types";

interface PaymentMethodDialogProps {
  trigger?: React.ReactNode;
}

export function PaymentMethodDialog({ trigger }: PaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const addMutation = useAddPaymentMethodMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema) as Resolver<PaymentMethodFormValues>,
    defaultValues: {
      type: "bkash",
      label: "bKash Auto-Debit Agreement",
      identifier: "017",
      accountHolderName: "",
      isDefault: true,
    },
  });

  const selectedType = useWatch({ control, name: "type" });
  const isDefault = useWatch({ control, name: "isDefault" });

  const handleTypeChange = (type: PaymentMethodType) => {
    setValue("type", type);
    if (type === "bkash") {
      setValue("label", "bKash Auto-Debit Agreement");
      setValue("identifier", "017");
    } else if (type === "nagad") {
      setValue("label", "Nagad Direct Debit");
      setValue("identifier", "018");
    } else {
      setValue("label", "Visa / Mastercard Corporate");
      setValue("identifier", "•••• 4242");
    }
  };

  const onSubmit = async (values: PaymentMethodFormValues) => {
    try {
      await addMutation.mutateAsync(values);
      setOpen(false);
      reset();
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Connect a mobile wallet or credit card for automatic subscription renewal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Simulated Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong>Demo Payment Tokenization:</strong> In demo mode, no real payment gateway tokenization occurs.
              Card numbers or wallet OTPs are neither requested nor stored.
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type">Payment Provider</Label>
            <Select value={selectedType} onValueChange={(v) => handleTypeChange(v as PaymentMethodType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bkash">bKash (Auto-Debit Token)</SelectItem>
                <SelectItem value="nagad">Nagad (Direct Debit)</SelectItem>
                <SelectItem value="card">Visa / Mastercard / AMEX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="label">Display Label *</Label>
            <Input id="label" {...register("label")} />
            {errors.label && (
              <p className="text-xs text-destructive">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="identifier">
              {selectedType === "card" ? "Card Ending (e.g. •••• 4242)" : "Mobile Wallet Number"} *
            </Label>
            <Input
              id="identifier"
              placeholder={selectedType === "card" ? "•••• 4242" : "017XXXXXXXX"}
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-xs text-destructive">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountHolderName">Account / Cardholder Name *</Label>
            <Input
              id="accountHolderName"
              placeholder="e.g. Tariqul Islam"
              {...register("accountHolderName")}
            />
            {errors.accountHolderName && (
              <p className="text-xs text-destructive">{errors.accountHolderName.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div>
              <span className="text-xs font-medium text-foreground block">
                Set as Default Payment Method
              </span>
              <span className="text-[11px] text-muted-foreground">
                Automatically bill this method for plan renewals
              </span>
            </div>
            <Switch
              checked={isDefault}
              onCheckedChange={(checked) => setValue("isDefault", checked)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Connecting..." : "Connect Method"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
