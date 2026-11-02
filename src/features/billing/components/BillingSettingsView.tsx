"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Building,
  Trash2,
  Info,
  Smartphone,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  billingSettingsSchema,
  type BillingSettingsFormValues,
} from "../schemas";
import {
  useBillingSettingsQuery,
  useUpdateBillingSettingsMutation,
  useSetDefaultPaymentMethodMutation,
  useRemovePaymentMethodMutation,
} from "../hooks";
import { PaymentMethodDialog } from "./PaymentMethodDialog";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function BillingSettingsView() {
  const { data: settings, isLoading } = useBillingSettingsQuery();
  const updateSettingsMutation = useUpdateBillingSettingsMutation();
  const setDefaultMutation = useSetDefaultPaymentMethodMutation();
  const removePaymentMutation = useRemovePaymentMethodMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BillingSettingsFormValues>({
    resolver: zodResolver(billingSettingsSchema) as Resolver<BillingSettingsFormValues>,
    defaultValues: {
      billingEmail: "",
      companyName: "",
      businessIdentificationNumber: "",
      taxRegistrationNumber: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Bangladesh",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        billingEmail: settings.billingEmail,
        companyName: settings.companyName,
        businessIdentificationNumber: settings.businessIdentificationNumber || "",
        taxRegistrationNumber: settings.taxRegistrationNumber || "",
        street: settings.street,
        city: settings.city,
        state: settings.state,
        postalCode: settings.postalCode,
        country: settings.country || "Bangladesh",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (values: BillingSettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync(values);
    } catch {
      // Handled by hook toast
    }
  };

  if (isLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  const paymentMethods = settings?.paymentMethods || [];

  return (
    <div className="space-y-6">
      {/* Payment Methods Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods & Auto-Debit
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Connected accounts used for CartX subscription fees and platform usage.
              </CardDescription>
            </div>
            <PaymentMethodDialog />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Simulated Auto-Renewal:</strong> In demo mode, recurring charges are simulated.
              You can toggle defaults or add dummy payment instruments to test reconciliation flows.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`p-4 rounded-lg border flex flex-col justify-between transition-colors ${
                  pm.isDefault
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {pm.type === "bkash" || pm.type === "nagad" ? (
                        <div className="h-8 w-8 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-xs">
                          <Smartphone className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          <CreditCard className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-semibold text-xs text-foreground">{pm.label}</h5>
                        <p className="font-mono text-xs text-muted-foreground">{pm.identifier}</p>
                      </div>
                    </div>

                    {pm.isDefault && (
                      <Badge variant="default" className="text-[10px] px-2 py-0">
                        Default
                      </Badge>
                    )}
                  </div>

                  {pm.accountHolderName && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Cardholder / Account: <strong>{pm.accountHolderName}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-3">
                  {!pm.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefaultMutation.mutate(pm.id)}
                      disabled={setDefaultMutation.isPending}
                      className="text-xs h-7 px-2"
                    >
                      Set as Default
                    </Button>
                  )}
                  {!pm.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentMutation.mutate(pm.id)}
                      disabled={removePaymentMutation.isPending}
                      className="text-xs h-7 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Entity & Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Billing Contact & Legal Entity
          </CardTitle>
          <CardDescription className="text-xs">
            This information appears on your monthly tax invoices and VAT reconciliation ledgers.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Legal Company / Store Name *</Label>
                <Input id="companyName" {...register("companyName")} />
                {errors.companyName && (
                  <p className="text-xs text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="billingEmail">Accounts Billing Email *</Label>
                <Input id="billingEmail" type="email" {...register("billingEmail")} />
                {errors.billingEmail && (
                  <p className="text-xs text-destructive">{errors.billingEmail.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="businessIdentificationNumber">
                  Bangladesh BIN (Business Identification Number)
                </Label>
                <Input
                  id="businessIdentificationNumber"
                  placeholder="e.g. 002819472-0101"
                  {...register("businessIdentificationNumber")}
                />
                <p className="text-[11px] text-muted-foreground">
                  Used for VAT compliance under Bangladesh NBR regulations
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="taxRegistrationNumber">TIN (Tax Identification Number)</Label>
                <Input
                  id="taxRegistrationNumber"
                  placeholder="e.g. TIN-8492048102"
                  {...register("taxRegistrationNumber")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="street">Street Address *</Label>
              <Input id="street" {...register("street")} />
              {errors.street && (
                <p className="text-xs text-destructive">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">City / Area *</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">District / Division *</Label>
                <Input id="state" {...register("state")} />
                {errors.state && (
                  <p className="text-xs text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input id="postalCode" {...register("postalCode")} />
                {errors.postalCode && (
                  <p className="text-xs text-destructive">{errors.postalCode.message}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border flex justify-end">
            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending || !isDirty}
              className="gap-2 text-xs"
            >
              <Save className="h-4 w-4" />
              {updateSettingsMutation.isPending ? "Saving Changes..." : "Save Billing Information"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
