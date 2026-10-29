"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firstProductSchema, type FirstProductFormValues } from "../schemas";
import { useSaveStep } from "../hooks";
import type { OnboardingDraft } from "../types";
import { BUSINESS_CATEGORIES } from "@/config/bangladesh";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, PackagePlus } from "lucide-react";

interface StepFirstProductProps {
  draft?: OnboardingDraft;
}

export function StepFirstProduct({ draft }: StepFirstProductProps) {
  const router = useRouter();
  const saveStepMutation = useSaveStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstProductFormValues>({
    resolver: zodResolver(firstProductSchema),
    defaultValues: {
      productName: draft?.step4?.productName || "",
      price: draft?.step4?.price || 500,
      initialStock: draft?.step4?.initialStock ?? 10,
      category: draft?.step4?.category || "clothing_fashion",
      imageUrl: draft?.step4?.imageUrl || "",
    },
  });

  const onSubmit = async (values: FirstProductFormValues) => {
    try {
      await saveStepMutation.mutateAsync({
        step: 4,
        data: values,
      });
      router.push("/onboarding/payments");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Step 4 — Add Your First Product</CardTitle>
        </div>
        <CardDescription>
          আপনার স্টোরের প্রথম পণ্যটি যুক্ত করুন। পরবর্তীতে ড্যাশবোর্ড থেকে আরও বিস্তারিত ও ভ্যারিয়েন্ট যোগ করা যাবে।
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
                  : "Failed to save initial product. Please check your backend connection."}
              </span>
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="productName">Product Name (পণ্যের নাম) *</Label>
            <Input
              id="productName"
              placeholder="e.g. Premium Cotton Panjabi"
              {...register("productName")}
            />
            {errors.productName && (
              <p className="text-xs text-destructive">{errors.productName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price in BDT */}
            <div className="space-y-1.5">
              <Label htmlFor="price">Selling Price (মূল্য - BDT ৳) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-muted-foreground">
                  ৳
                </span>
                <Input
                  id="price"
                  type="number"
                  step="any"
                  placeholder="1250"
                  className="pl-8"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>

            {/* Initial Stock */}
            <div className="space-y-1.5">
              <Label htmlFor="initialStock">Initial Stock Quantity (প্রাথমিক স্টক) *</Label>
              <Input
                id="initialStock"
                type="number"
                placeholder="25"
                {...register("initialStock", { valueAsNumber: true })}
              />
              {errors.initialStock && (
                <p className="text-xs text-destructive">{errors.initialStock.message}</p>
              )}
            </div>
          </div>

          {/* Product Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category (ক্যাটাগরি) *</Label>
            <select
              id="category"
              {...register("category")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-card text-foreground">
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Image URL (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Product Image URL (পণ্যের ছবির লিঙ্ক - ঐচ্ছিক)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/images/product.jpg"
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/storefront")}
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
