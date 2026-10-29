"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSetupSchema, type ShippingSetupFormValues } from "../schemas";
import { useSaveStep } from "../hooks";
import type { OnboardingDraft } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Truck, MapPin } from "lucide-react";

interface StepShippingSetupProps {
  draft?: OnboardingDraft;
}

export function StepShippingSetup({ draft }: StepShippingSetupProps) {
  const router = useRouter();
  const saveStepMutation = useSaveStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingSetupFormValues>({
    resolver: zodResolver(shippingSetupSchema),
    defaultValues: {
      insideDhakaRate: draft?.step6?.insideDhakaRate ?? 60,
      outsideDhakaRate: draft?.step6?.outsideDhakaRate ?? 120,
      freeShippingThreshold: draft?.step6?.freeShippingThreshold ?? 0,
      courierPartner: draft?.step6?.courierPartner || "manual",
    },
  });

  const onSubmit = async (values: ShippingSetupFormValues) => {
    try {
      await saveStepMutation.mutateAsync({
        step: 6,
        data: values,
      });
      router.push("/onboarding/publish");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Step 6 — Shipping & Delivery Zones</CardTitle>
        </div>
        <CardDescription>
          ঢাকা ও ঢাকার বাইরে ডেলিভারি চার্জ নির্ধারণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {saveStepMutation.isError && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {saveStepMutation.error instanceof Error
                  ? saveStepMutation.error.message
                  : "Failed to save shipping rates. Please check your backend connection."}
              </span>
            </div>
          )}

          {/* Delivery Charges by Zone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inside Dhaka */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <Label htmlFor="insideDhakaRate" className="font-semibold text-sm">
                  Inside Dhaka (ঢাকার ভেতরে) *
                </Label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-muted-foreground">
                  ৳
                </span>
                <Input
                  id="insideDhakaRate"
                  type="number"
                  placeholder="60"
                  className="pl-8"
                  {...register("insideDhakaRate", { valueAsNumber: true })}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Standard 24-48 hours delivery rate</p>
              {errors.insideDhakaRate && (
                <p className="text-xs text-destructive">{errors.insideDhakaRate.message}</p>
              )}
            </div>

            {/* Outside Dhaka */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <Label htmlFor="outsideDhakaRate" className="font-semibold text-sm">
                  Outside Dhaka (ঢাকার বাইরে সারা দেশ) *
                </Label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-muted-foreground">
                  ৳
                </span>
                <Input
                  id="outsideDhakaRate"
                  type="number"
                  placeholder="120"
                  className="pl-8"
                  {...register("outsideDhakaRate", { valueAsNumber: true })}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Standard 48-72 hours nationwide delivery</p>
              {errors.outsideDhakaRate && (
                <p className="text-xs text-destructive">{errors.outsideDhakaRate.message}</p>
              )}
            </div>
          </div>

          {/* Free Shipping Threshold */}
          <div className="space-y-1.5">
            <Label htmlFor="freeShippingThreshold">
              Free Delivery Threshold (ফ্রি ডেলিভারির ন্যূনতম অর্ডারের পরিমাণ - ঐচ্ছিক)
            </Label>
            <div className="relative max-w-sm">
              <span className="absolute left-3 top-2.5 text-xs font-semibold text-muted-foreground">
                ৳
              </span>
              <Input
                id="freeShippingThreshold"
                type="number"
                placeholder="2000"
                className="pl-8"
                {...register("freeShippingThreshold", { valueAsNumber: true })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              নির্দিষ্ট টাকার বেশি অর্ডার করলে ফ্রি ডেলিভারি অফার করতে চাইলে লিখুন। অন্যথায় ফাঁকা বা ০ রাখুন।
            </p>
          </div>

          {/* Courier Integration Status */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Supported Courier Logistics (কুরিয়ার সার্ভিস)</Label>
              <Badge variant="outline" className="text-[10px]">
                Phase 5 Automated Dispatch
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Steadfast Courier", type: "Nationwide COD", status: "Available in Phase 5" },
                { name: "Pathao Logistics", type: "Same-day / Express", status: "Available in Phase 5" },
                { name: "RedX Delivery", type: "Doorstep Delivery", status: "Available in Phase 5" },
              ].map((courier) => (
                <div
                  key={courier.name}
                  className="p-3 rounded-lg border border-border bg-card/60 flex flex-col justify-between space-y-1 opacity-80"
                >
                  <span className="text-xs font-medium text-foreground">{courier.name}</span>
                  <span className="text-[11px] text-muted-foreground">{courier.type}</span>
                  <Badge variant="secondary" className="text-[10px] w-fit mt-1">
                    {courier.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/payments")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={saveStepMutation.isPending}
              className="gap-2"
            >
              {saveStepMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save & Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
