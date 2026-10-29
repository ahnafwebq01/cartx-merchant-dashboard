"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storefrontSetupSchema, type StorefrontSetupFormValues } from "../schemas";
import { useSaveStep } from "../hooks";
import type { OnboardingDraft } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Info, Check } from "lucide-react";

interface StepStorefrontProps {
  draft?: OnboardingDraft;
}

const PRESET_COLORS = [
  { name: "CartX Blue (Default)", hex: "#2563EB" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Royal Purple", hex: "#8B5CF6" },
  { name: "Ruby Rose", hex: "#F43F5E" },
  { name: "Amber Gold", hex: "#F59E0B" },
  { name: "Slate Dark", hex: "#0F172A" },
];

const THEMES = [
  {
    id: "modern_clean",
    name: "Modern Commerce",
    description: "Clean, spacious grid layout designed for high-conversion retail.",
    tag: "Recommended",
  },
  {
    id: "minimal_boutique",
    name: "Minimal Boutique",
    description: "Elegant typography and generous whitespace for fashion and lifestyle.",
    tag: "Popular",
  },
  {
    id: "bold_express",
    name: "Express Superstore",
    description: "Dense, catalog-focused layout optimized for electronics and supermarkets.",
    tag: "Catalog",
  },
];

export function StepStorefront({ draft }: StepStorefrontProps) {
  const router = useRouter();
  const saveStepMutation = useSaveStep();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StorefrontSetupFormValues>({
    resolver: zodResolver(storefrontSetupSchema),
    defaultValues: {
      storeDescription: draft?.step3?.storeDescription || "",
      brandColor: draft?.step3?.brandColor || "#2563EB",
      themeId: draft?.step3?.themeId || "modern_clean",
      logoUrl: draft?.step3?.logoUrl || "",
    },
  });

  const watchedColor = watch("brandColor");
  const watchedTheme = watch("themeId");

  const onSubmit = async (values: StorefrontSetupFormValues) => {
    try {
      await saveStepMutation.mutateAsync({
        step: 3,
        data: values,
      });
      router.push("/onboarding/products");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Step 3 — Storefront & Branding</CardTitle>
        <CardDescription>
          স্টোরের ব্র্যান্ডিং রঙ, লোগো এবং থিম নির্বাচন করুন।
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
                  : "Failed to save storefront configuration. Please check your backend connection."}
              </span>
            </div>
          )}

          {/* Store Description */}
          <div className="space-y-1.5">
            <Label htmlFor="storeDescription">Store Description (স্টোরের বিবরণ) *</Label>
            <Textarea
              id="storeDescription"
              placeholder="e.g. Bangladesh's premier destination for authentic organic products, delivered directly to your doorstep."
              {...register("storeDescription")}
            />
            {errors.storeDescription && (
              <p className="text-xs text-destructive">{errors.storeDescription.message}</p>
            )}
          </div>

          {/* Brand Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="brandColor">Primary Brand Color (ব্র্যান্ডের মূল রঙ) *</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="brandColorPicker"
                value={watchedColor}
                onChange={(e) => setValue("brandColor", e.target.value, { shouldValidate: true })}
                className="h-10 w-12 rounded cursor-pointer border border-border p-1 bg-card"
                aria-label="Color Picker"
              />
              <Input
                id="brandColor"
                placeholder="#2563EB"
                className="font-mono text-sm max-w-[160px]"
                {...register("brandColor")}
              />
            </div>
            {/* Quick preset color chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setValue("brandColor", color.hex, { shouldValidate: true })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border border-border bg-card hover:bg-muted transition-colors"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
            {errors.brandColor && (
              <p className="text-xs text-destructive">{errors.brandColor.message}</p>
            )}
          </div>

          {/* Logo Notice & Input */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Store Logo Image (লোগো)</Label>
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground flex items-start gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Cloud Storage Upload Contract Notice</p>
                <p className="mt-0.5">
                  Direct local file upload requires backend presigned S3/Cloudinary URLs (documented in <code>API_GAPS.md</code>).
                  For now, you may provide an existing public logo image URL, or leave blank to use your store initials.
                </p>
              </div>
            </div>
            <Input
              id="logoUrl"
              placeholder="https://example.com/logo.png (optional)"
              {...register("logoUrl")}
            />
            {errors.logoUrl && (
              <p className="text-xs text-destructive">{errors.logoUrl.message}</p>
            )}
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label>Select Storefront Theme (ওয়েবসাইটের থিম নির্বাচন করুন) *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {THEMES.map((theme) => {
                const isSelected = watchedTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setValue("themeId", theme.id, { shouldValidate: true })}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground">{theme.name}</h4>
                      {isSelected ? (
                        <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          {theme.tag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                );
              })}
            </div>
            {errors.themeId && (
              <p className="text-xs text-destructive">{errors.themeId.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/business")}
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
