"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Percent,
  Coins,
  Sparkles,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  couponFormSchema,
  type CouponFormValues,
} from "../schemas";
import {
  useCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "../hooks";

interface CouponEditorViewProps {
  couponId?: string;
}

export function CouponEditorView({ couponId }: CouponEditorViewProps) {
  const router = useRouter();
  const isEditing = Boolean(couponId);

  const { data: existingCoupon, isLoading: isFetching } = useCouponQuery(couponId || "");
  const createMutation = useCreateCouponMutation();
  const updateMutation = useUpdateCouponMutation();

  const [initialDates] = useState(() => {
    const start = new Date().toISOString().split("T")[0];
    const end = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0];
    return { start, end };
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema) as Resolver<CouponFormValues>,
    defaultValues: {
      code: "",
      campaignName: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscountCap: 500,
      usageLimit: 200,
      perCustomerLimit: 1,
      startDate: initialDates.start,
      endDate: initialDates.end,
      customerEligibility: "all",
      status: "active",
      applicableCategories: [],
      applicableProducts: [],
    },
  });

  // Load existing coupon data into form on edit
  useEffect(() => {
    if (existingCoupon) {
      reset({
        code: existingCoupon.code,
        campaignName: existingCoupon.campaignName,
        discountType: existingCoupon.discountType,
        discountValue: existingCoupon.discountValue,
        minOrderAmount: existingCoupon.minOrderAmount,
        maxDiscountCap: existingCoupon.maxDiscountCap,
        usageLimit: existingCoupon.usageLimit,
        perCustomerLimit: existingCoupon.perCustomerLimit || 1,
        startDate: existingCoupon.startDate.split("T")[0],
        endDate: existingCoupon.endDate.split("T")[0],
        customerEligibility: existingCoupon.customerEligibility,
        status: existingCoupon.status,
        applicableCategories: existingCoupon.applicableCategories || [],
        applicableProducts: existingCoupon.applicableProducts || [],
      });
    }
  }, [existingCoupon, reset]);

  // Live values for real-time coupon card preview
  const watchedCode = useWatch({ control, name: "code" });
  const watchedCampaign = useWatch({ control, name: "campaignName" });
  const watchedType = useWatch({ control, name: "discountType" });
  const watchedValue = useWatch({ control, name: "discountValue" });
  const watchedMin = useWatch({ control, name: "minOrderAmount" });
  const watchedCap = useWatch({ control, name: "maxDiscountCap" });
  const watchedEnd = useWatch({ control, name: "endDate" });

  const onSubmit = async (values: CouponFormValues) => {
    try {
      if (isEditing && couponId) {
        await updateMutation.mutateAsync({ id: couponId, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push("/dashboard/marketing/coupons");
    } catch {
      // Error handled by query mutation toast
    }
  };

  const setCodePrefix = (prefix: string) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setValue("code", `${prefix}${randomNum}`, { shouldValidate: true });
  };

  if (isEditing && isFetching) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Loading coupon details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? `Edit Coupon: ${existingCoupon?.code || ""}` : "Create New Coupon"}
        description="Set up promotional codes with discount rates, spending thresholds, and usage caps."
        breadcrumbs={[
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Coupons", href: "/dashboard/marketing/coupons" },
          { label: isEditing ? "Edit" : "New" },
        ]}
        actions={
          <Button variant="outline" size="sm" asChild className="h-9">
            <Link href="/dashboard/marketing/coupons">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Coupons
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Fields Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Coupon Identity</CardTitle>
                <CardDescription className="text-xs">
                  Shoppers will enter this code at checkout to unlock savings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code" className="text-xs font-semibold">
                      Coupon Code *
                    </Label>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <span>Presets:</span>
                      <button
                        type="button"
                        onClick={() => setCodePrefix("EID")}
                        className="text-primary hover:underline"
                      >
                        EID
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setCodePrefix("BOISHAKHI")}
                        className="text-primary hover:underline"
                      >
                        BOISHAKHI
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setCodePrefix("SAVE")}
                        className="text-primary hover:underline"
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                  <Input
                    id="code"
                    placeholder="e.g. EID2026, SUMMER25"
                    {...register("code")}
                    className="font-mono uppercase tracking-wider text-sm"
                  />
                  {errors.code && (
                    <p className="text-xs text-destructive">{errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaignName" className="text-xs font-semibold">
                    Campaign / Promotion Name *
                  </Label>
                  <Input
                    id="campaignName"
                    placeholder="e.g. Eid Ul Fitr Festive Celebration"
                    {...register("campaignName")}
                  />
                  {errors.campaignName && (
                    <p className="text-xs text-destructive">{errors.campaignName.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Discount Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Discount Calculation</CardTitle>
                <CardDescription className="text-xs">
                  Choose between percentage or fixed Taka discount rate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Discount Type *</Label>
                  <Tabs
                    value={watchedType}
                    onValueChange={(val) =>
                      setValue("discountType", val as "percentage" | "fixed", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="percentage" className="text-xs">
                        <Percent className="h-3.5 w-3.5 mr-1.5" />
                        Percentage Discount (%)
                      </TabsTrigger>
                      <TabsTrigger value="fixed" className="text-xs">
                        <Coins className="h-3.5 w-3.5 mr-1.5" />
                        Fixed Amount (৳ BDT)
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountValue" className="text-xs font-semibold">
                      {watchedType === "percentage" ? "Percentage Off (%) *" : "Fixed Discount (৳) *"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step="any"
                      placeholder={watchedType === "percentage" ? "e.g. 15" : "e.g. 500"}
                      {...register("discountValue")}
                    />
                    {errors.discountValue && (
                      <p className="text-xs text-destructive">{errors.discountValue.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount" className="text-xs font-semibold">
                      Minimum Order Spend (৳)
                    </Label>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      placeholder="e.g. 2000 (0 for no minimum)"
                      {...register("minOrderAmount")}
                    />
                    {errors.minOrderAmount && (
                      <p className="text-xs text-destructive">{errors.minOrderAmount.message}</p>
                    )}
                  </div>
                </div>

                {watchedType === "percentage" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountCap" className="text-xs font-semibold">
                      Maximum Discount Cap (৳ BDT)
                    </Label>
                    <Input
                      id="maxDiscountCap"
                      type="number"
                      placeholder="e.g. 1000 (leave blank for uncapped)"
                      {...register("maxDiscountCap")}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Limits the maximum savings in Taka when applying percentage discounts to large orders.
                    </p>
                    {errors.maxDiscountCap && (
                      <p className="text-xs text-destructive">{errors.maxDiscountCap.message}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Limits & Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Limits & Schedule</CardTitle>
                <CardDescription className="text-xs">
                  Set total campaign quota and validity timeframe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit" className="text-xs font-semibold">
                      Total Usage Limit
                    </Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      placeholder="e.g. 500 (blank for unlimited)"
                      {...register("usageLimit")}
                    />
                    {errors.usageLimit && (
                      <p className="text-xs text-destructive">{errors.usageLimit.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="perCustomerLimit" className="text-xs font-semibold">
                      Usage Limit Per Customer
                    </Label>
                    <Input
                      id="perCustomerLimit"
                      type="number"
                      placeholder="e.g. 1"
                      {...register("perCustomerLimit")}
                    />
                    {errors.perCustomerLimit && (
                      <p className="text-xs text-destructive">{errors.perCustomerLimit.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-xs font-semibold">
                      Start Date *
                    </Label>
                    <Input id="startDate" type="date" {...register("startDate")} />
                    {errors.startDate && (
                      <p className="text-xs text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-xs font-semibold">
                      Expiration Date *
                    </Label>
                    <Input id="endDate" type="date" {...register("endDate")} />
                    {errors.endDate && (
                      <p className="text-xs text-destructive">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Customer Eligibility</Label>
                    <Select
                      defaultValue="all"
                      onValueChange={(val) =>
                        setValue(
                          "customerEligibility",
                          val as "all" | "first_time" | "vip" | "returning"
                        )
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Eligibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="first_time">First-Time Customers Only</SelectItem>
                        <SelectItem value="vip">VIP / High-Value Customers</SelectItem>
                        <SelectItem value="returning">Returning Repeat Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Initial Status</Label>
                    <Select
                      defaultValue="active"
                      onValueChange={(val) =>
                        setValue("status", val as "active" | "inactive" | "expired")
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active (Available)</SelectItem>
                        <SelectItem value="inactive">Inactive (Draft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard/marketing/coupons">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </div>

          {/* Live Preview Side Column (1 col) */}
          <div className="space-y-6">
            <Card className="sticky top-6 border-primary/30">
              <CardHeader className="bg-muted/40 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Live Coupon Preview
                </CardTitle>
                <CardDescription className="text-[11px]">
                  How this coupon appears on your storefront checkout voucher bar.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Simulated Coupon Ticket */}
                <div className="relative rounded-xl border-2 border-dashed border-primary/40 bg-card p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      CartX Promo
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Until {watchedEnd || "End Date"}
                    </span>
                  </div>

                  <div className="text-center py-2 space-y-1">
                    <div className="text-2xl font-black tracking-tight text-foreground">
                      {watchedType === "percentage"
                        ? `${watchedValue || 0}% OFF`
                        : `৳${(watchedValue || 0).toLocaleString("en-BD")} OFF`}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {watchedCampaign || "Campaign Title"}
                    </div>
                  </div>

                  <div className="bg-muted/60 p-2.5 rounded-lg border border-border text-center space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Promo Code
                    </div>
                    <div className="text-base font-mono font-bold text-primary tracking-widest">
                      {watchedCode || "COUPONCODE"}
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1 border-t border-border/50">
                    <div>
                      • {watchedMin && Number(watchedMin) > 0
                        ? `Valid on orders over ৳${Number(watchedMin).toLocaleString("en-BD")}`
                        : "No minimum spend required"}
                    </div>
                    {watchedType === "percentage" && watchedCap && Number(watchedCap) > 0 && (
                      <div>• Maximum discount cap: ৳{Number(watchedCap).toLocaleString("en-BD")}</div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 bg-muted/20 p-3 rounded-lg border border-border">
                  <div className="font-semibold text-foreground flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                    Validation & Cart Rules
                  </div>
                  <div>• Percentage must be 1% to 100%.</div>
                  <div>• Fixed discounts cannot exceed subtotal.</div>
                  <div>• Backend checks coupon uniqueness and expiry before checkout completion.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
