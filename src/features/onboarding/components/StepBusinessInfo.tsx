"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessInfoSchema, type BusinessInfoFormValues } from "../schemas";
import { useSaveStep } from "../hooks";
import type { OnboardingDraft } from "../types";
import { BANGLADESH_DISTRICTS, BUSINESS_CATEGORIES } from "@/config/bangladesh";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface StepBusinessInfoProps {
  draft?: OnboardingDraft;
}

export function StepBusinessInfo({ draft }: StepBusinessInfoProps) {
  const router = useRouter();
  const saveStepMutation = useSaveStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessAddress: draft?.step2?.businessAddress || "",
      district: draft?.step2?.district || "Dhaka",
      cityArea: draft?.step2?.cityArea || "",
      postalCode: draft?.step2?.postalCode || "",
      businessCategory: draft?.step2?.businessCategory || "clothing_fashion",
      tradeLicenseNo: draft?.step2?.tradeLicenseNo || "",
    },
  });

  const onSubmit = async (values: BusinessInfoFormValues) => {
    try {
      await saveStepMutation.mutateAsync({
        step: 2,
        data: values,
      });
      router.push("/onboarding/storefront");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Step 2 — Business Information</CardTitle>
        <CardDescription>
          আপনার ব্যবসার ঠিকানা ও ক্যাটাগরি তথ্য দিন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {saveStepMutation.isError && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {saveStepMutation.error instanceof Error
                  ? saveStepMutation.error.message
                  : "Failed to save business information. Please check your backend connection."}
              </span>
            </div>
          )}

          {/* Business Category */}
          <div className="space-y-1.5">
            <Label htmlFor="businessCategory">Business Category (ব্যবসার ক্যাটাগরি) *</Label>
            <select
              id="businessCategory"
              {...register("businessCategory")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-card text-foreground">
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.businessCategory && (
              <p className="text-xs text-destructive">{errors.businessCategory.message}</p>
            )}
          </div>

          {/* Business Address */}
          <div className="space-y-1.5">
            <Label htmlFor="businessAddress">Physical Business Address (দোকান বা অফিসের পূর্ণ ঠিকানা) *</Label>
            <Textarea
              id="businessAddress"
              placeholder="e.g. Shop 42, Level 3, Eastern Plaza, Hatirpool"
              {...register("businessAddress")}
            />
            {errors.businessAddress && (
              <p className="text-xs text-destructive">{errors.businessAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* District */}
            <div className="space-y-1.5">
              <Label htmlFor="district">District (জেলা) *</Label>
              <select
                id="district"
                {...register("district")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-card text-foreground">
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-xs text-destructive">{errors.district.message}</p>
              )}
            </div>

            {/* City / Area */}
            <div className="space-y-1.5">
              <Label htmlFor="cityArea">City / Area (থানা বা এলাকা) *</Label>
              <Input
                id="cityArea"
                placeholder="e.g. Dhanmondi"
                {...register("cityArea")}
              />
              {errors.cityArea && (
                <p className="text-xs text-destructive">{errors.cityArea.message}</p>
              )}
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal Code (পোস্ট কোড)</Label>
              <Input
                id="postalCode"
                placeholder="e.g. 1205"
                {...register("postalCode")}
              />
            </div>
          </div>

          {/* Trade License (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="tradeLicenseNo">Trade License / BIN Number (ট্রেড লাইসেন্স নম্বর - ঐচ্ছিক)</Label>
            <Input
              id="tradeLicenseNo"
              placeholder="Optional identification"
              {...register("tradeLicenseNo")}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/store")}
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

