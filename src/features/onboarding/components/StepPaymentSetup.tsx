"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSetupSchema, type PaymentSetupFormValues } from "../schemas";
import { useSaveStep } from "../hooks";
import type { OnboardingDraft } from "../types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Banknote, ShieldAlert, CreditCard } from "lucide-react";

interface StepPaymentSetupProps {
  draft?: OnboardingDraft;
}

export function StepPaymentSetup({ draft }: StepPaymentSetupProps) {
  const router = useRouter();
  const saveStepMutation = useSaveStep();

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm<PaymentSetupFormValues>({
    resolver: zodResolver(paymentSetupSchema),
    defaultValues: {
      cashOnDelivery: draft?.step5?.cashOnDelivery ?? true,
      onlineProvider: draft?.step5?.onlineProvider || "none",
      providerStatus: draft?.step5?.providerStatus || "unconfigured",
    },
  });

  const onSubmit = async (values: PaymentSetupFormValues) => {
    try {
      await saveStepMutation.mutateAsync({
        step: 5,
        data: values,
      });
      router.push("/onboarding/shipping");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Step 5 — Payment Configuration</CardTitle>
        </div>
        <CardDescription>
          গ্রাহকদের কাছ থেকে পেমেন্ট গ্রহণের নিয়ম সেট করুন। বাংলাদেশে ৯০% এর বেশি নতুন স্টোর Cash on Delivery দিয়ে শুরু করে।
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
                  : "Failed to save payment setup. Please check your backend connection."}
              </span>
            </div>
          )}

          {/* Cash on Delivery (COD) Option */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Cash on Delivery / COD (ক্যাশ অন ডেলিভারি)
                </span>
                <Badge variant="success" className="text-[10px]">
                  Recommended
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                পণ্য গ্রাহকের কাছে পৌঁছে দেওয়ার সময় নগদ টাকা বা ডেলিভারি ম্যানেকে মোবাইল পেমেন্টে অর্থ গ্রহণ।
              </p>
            </div>
            <Controller
              control={control}
              name="cashOnDelivery"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Toggle Cash on Delivery"
                />
              )}
            />
          </div>

          {/* Digital Payment Gateways (bKash, Nagad, SSLCommerz) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Digital Payment Gateway (ডিজিটাল পেমেন্ট গেটওয়ে - ঐচ্ছিক)</Label>
              <Badge variant="outline" className="text-[10px]">
                Phase 5 Feature
              </Badge>
            </div>

            {/* Zero-Trust Security Notice */}
            <div className="p-3.5 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldAlert className="h-4 w-4 text-warning shrink-0" />
                <span>Zero-Trust Credential Security Policy</span>
              </div>
              <p className="leading-relaxed">
                পেমেন্ট গেটওয়ের গোপন মার্চেন্ট কী (bKash App Secret, SSLCommerz Store Password) কখনোই ব্রাউজারে বা ফ্রন্টএন্ডে সেভ করা হয় না। 
                লাইভ গেটওয়ে ইন্টিগ্রেশন ব্যাকএন্ড সার্ভারে সুরক্ষিতভাবে কনফিগার করতে হয়।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "bkash", name: "bKash Direct", status: "Unconfigured" },
                { id: "nagad", name: "Nagad Gateway", status: "Unconfigured" },
                { id: "sslcommerz", name: "SSLCommerz / Cards", status: "Unconfigured" },
              ].map((provider) => (
                <div
                  key={provider.id}
                  className="p-3 rounded-lg border border-border bg-card/60 flex flex-col justify-between space-y-2 opacity-80"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{provider.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] w-fit">
                    {provider.status}
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
              onClick={() => router.push("/onboarding/products")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setValue("cashOnDelivery", true);
                  setValue("providerStatus", "unconfigured");
                  onSubmit({
                    cashOnDelivery: true,
                    onlineProvider: "none",
                    providerStatus: "unconfigured",
                  });
                }}
              >
                Skip for now
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

