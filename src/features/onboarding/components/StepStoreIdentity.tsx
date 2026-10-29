"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeIdentitySchema, type StoreIdentityFormValues } from "../schemas";
import { useSaveStep, useSlugCheck } from "../hooks";
import type { OnboardingDraft } from "../types";
import { BUSINESS_TYPES } from "@/config/bangladesh";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface StepStoreIdentityProps {
  draft?: OnboardingDraft;
}

export function StepStoreIdentity({ draft }: StepStoreIdentityProps) {
  const router = useRouter();
  const saveStepMutation = useSaveStep();
  const [debouncedSlug, setDebouncedSlug] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StoreIdentityFormValues>({
    resolver: zodResolver(storeIdentitySchema),
    defaultValues: {
      storeName: draft?.step1?.storeName || "",
      storeSlug: draft?.step1?.storeSlug || "",
      businessType: draft?.step1?.businessType || "individual",
      ownerName: draft?.step1?.ownerName || "",
      contactEmail: draft?.step1?.contactEmail || "",
      contactPhone: draft?.step1?.contactPhone || "",
    },
  });

  const watchedSlug = watch("storeSlug");
  const watchedName = watch("storeName");

  // Auto-generate slug from store name if slug is untouched
  useEffect(() => {
    if (!draft?.step1?.storeSlug && watchedName && (!watchedSlug || watchedSlug.length === 0)) {
      const generated = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("storeSlug", generated, { shouldValidate: true });
    }
  }, [watchedName, watchedSlug, setValue, draft?.step1?.storeSlug]);

  // Debounce slug input for availability query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(watchedSlug || "");
    }, 400);
    return () => clearTimeout(timer);
  }, [watchedSlug]);

  const {
    data: slugResult,
    isLoading: isCheckingSlug,
    isError: isSlugError,
  } = useSlugCheck(debouncedSlug, {
    enabled: Boolean(debouncedSlug && debouncedSlug.length >= 3),
  });

  const onSubmit = async (values: StoreIdentityFormValues) => {
    try {
      await saveStepMutation.mutateAsync({
        step: 1,
        data: values,
      });
      router.push("/onboarding/business");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Step 1 — Store & Account Identity</CardTitle>
        <CardDescription>
          দোকানের নাম, সাবডোমেইন এবং মূল যোগাযোগের তথ্য দিন।
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
                  : "Failed to save store identity. Please check your backend connection."}
              </span>
            </div>
          )}

          {/* Store Name */}
          <div className="space-y-1.5">
            <Label htmlFor="storeName">Store Name (দোকানের নাম) *</Label>
            <Input
              id="storeName"
              placeholder="e.g. Dhaka Clothings"
              {...register("storeName")}
            />
            {errors.storeName && (
              <p className="text-xs text-destructive">{errors.storeName.message}</p>
            )}
          </div>

          {/* Store Subdomain Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="storeSlug">Store Subdomain Slug (সাবডোমেইন) *</Label>
            <div className="flex rounded-md shadow-sm">
              <Input
                id="storeSlug"
                placeholder="dhaka-clothings"
                className="rounded-r-none font-mono text-sm lowercase"
                {...register("storeSlug")}
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-xs font-mono">
                .cartx.com.bd
              </span>
            </div>

            {/* Slug verification indicator */}
            <div className="flex items-center gap-1.5 text-xs mt-1">
              {isCheckingSlug ? (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking availability...
                </span>
              ) : isSlugError ? (
                <span className="text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-warning" />
                  Subdomain availability service currently offline (can proceed)
                </span>
              ) : slugResult ? (
                slugResult.available ? (
                  <span className="text-success flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Subdomain is available!
                  </span>
                ) : (
                  <span className="text-destructive flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Subdomain is already taken. Please choose another.
                  </span>
                )
              ) : null}
            </div>

            {errors.storeSlug && (
              <p className="text-xs text-destructive">{errors.storeSlug.message}</p>
            )}
          </div>

          {/* Business Type */}
          <div className="space-y-1.5">
            <Label htmlFor="businessType">Business Structure (ব্যবসার ধরন) *</Label>
            <select
              id="businessType"
              {...register("businessType")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type.id} value={type.id} className="bg-card text-foreground">
                  {type.label}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="text-xs text-destructive">{errors.businessType.message}</p>
            )}
          </div>

          {/* Owner Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ownerName">Owner Name (মালিকের নাম) *</Label>
            <Input
              id="ownerName"
              placeholder="e.g. Tanvir Ahmed"
              {...register("ownerName")}
            />
            {errors.ownerName && (
              <p className="text-xs text-destructive">{errors.ownerName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Email */}
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Contact Email (ইমেইল) *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="store@example.com"
                {...register("contactEmail")}
              />
              {errors.contactEmail && (
                <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Mobile Number (মোবাইল নম্বর) *</Label>
              <Input
                id="contactPhone"
                placeholder="01700000000"
                {...register("contactPhone")}
              />
              {errors.contactPhone && (
                <p className="text-xs text-destructive">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-border">
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

