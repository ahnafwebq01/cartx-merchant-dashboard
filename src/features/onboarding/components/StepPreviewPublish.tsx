"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePublishStore } from "../hooks";
import type { OnboardingDraft } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  MapPin,
  Palette,
  Package,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

interface StepPreviewPublishProps {
  draft?: OnboardingDraft;
}

export function StepPreviewPublish({ draft }: StepPreviewPublishProps) {
  const publishMutation = usePublishStore();
  const [publishedData, setPublishedData] = useState<{
    storefrontUrl: string;
    publishedAt: string;
  } | null>(null);

  // Check required steps completion
  const hasStep1 = Boolean(draft?.step1?.storeName && draft?.step1?.storeSlug);
  const hasStep2 = Boolean(draft?.step2?.businessAddress && draft?.step2?.district);
  const hasStep3 = Boolean(draft?.step3?.brandColor && draft?.step3?.themeId);
  const hasStep4 = Boolean(draft?.step4?.productName && draft?.step4?.price);

  const isReadyToPublish = hasStep1 && hasStep2 && hasStep3 && hasStep4;

  const handlePublish = async () => {
    try {
      const result = await publishMutation.mutateAsync();
      setPublishedData({
        storefrontUrl: result.storefrontUrl || `https://${draft?.step1?.storeSlug || "store"}.cartx.com.bd`,
        publishedAt: result.publishedAt || new Date().toISOString(),
      });
    } catch {
      // Error handled by mutation state
    }
  };

  // If already published in draft state or just published
  const isPublished = Boolean(publishedData || draft?.isPublished);
  const storefrontUrl =
    publishedData?.storefrontUrl ||
    draft?.storefrontUrl ||
    (draft?.step1?.storeSlug ? `https://${draft.step1.storeSlug}.cartx.com.bd` : null);

  if (isPublished) {
    return (
      <Card className="border-success/30 bg-success/5 shadow-sm text-center py-8 px-4 sm:px-8">
        <CardContent className="space-y-5 max-w-lg mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success mx-auto">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Congratulations! Your Store is Published!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              আপনার ই-কমার্স স্টোরটি সফলভাবে সক্রিয় হয়েছে। এখন থেকে গ্রাহকেরা আপনার স্টোর ভিজিট করে অর্ডার করতে পারবেন।
            </p>
          </div>

          {storefrontUrl && (
            <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between gap-3 text-left">
              <div className="truncate">
                <p className="text-xs text-muted-foreground">Storefront Public URL</p>
                <p className="text-sm font-semibold text-primary truncate font-mono">
                  {storefrontUrl}
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={storefrontUrl} target="_blank" rel="noreferrer" className="gap-1.5 shrink-0">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit
                </a>
              </Button>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="w-full sm:w-auto gap-2">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Go to Merchant Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Step 7 — Review & Publish Store</CardTitle>
        <CardDescription>
          স্টোরের সকল কনফিগারেশন যাচাই করুন এবং স্টোরফ্রন্ট লাইভ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readiness Alert or Missing Requirements */}
        {!isReadyToPublish ? (
          <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 text-warning flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-foreground">
                Incomplete Required Steps Before Publishing (অসম্পূর্ণ ধাপসমূহ)
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {!hasStep1 && <li>Step 1: Store name & subdomain slug missing</li>}
                {!hasStep2 && <li>Step 2: Business address & district missing</li>}
                {!hasStep3 && <li>Step 3: Theme or brand color missing</li>}
                {!hasStep4 && <li>Step 4: Initial product missing</li>}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-success/30 bg-success/5 text-success flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-xs text-foreground font-medium">
              All essential requirements are verified. Your store is ready to launch!
            </p>
          </div>
        )}

        {/* Mutation Error */}
        {publishMutation.isError && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {publishMutation.error instanceof Error
                ? publishMutation.error.message
                : "Publication request failed. Shared API endpoint /stores/current/publish may be offline."}
            </span>
          </div>
        )}

        {/* Configuration Review Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 1. Identity */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Store className="h-4 w-4 text-primary" /> Store Identity
              </span>
              <Link href="/onboarding/store" className="text-primary hover:underline font-medium">
                Edit
              </Link>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Name: <span className="text-foreground font-medium">{draft?.step1?.storeName || "Not set"}</span></p>
              <p>Subdomain: <span className="font-mono text-foreground">{draft?.step1?.storeSlug ? `${draft.step1.storeSlug}.cartx.com.bd` : "Not set"}</span></p>
              <p>Owner: <span className="text-foreground">{draft?.step1?.ownerName || "Not set"}</span></p>
            </div>
          </div>

          {/* 2. Business Info */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> Business Details
              </span>
              <Link href="/onboarding/business" className="text-primary hover:underline font-medium">
                Edit
              </Link>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Location: <span className="text-foreground">{draft?.step2?.cityArea ? `${draft.step2.cityArea}, ${draft.step2.district}` : "Not set"}</span></p>
              <p>Category: <span className="text-foreground capitalize">{draft?.step2?.businessCategory?.replace(/_/g, " ") || "Not set"}</span></p>
            </div>
          </div>

          {/* 3. Branding & Theme */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-primary" /> Storefront Design
              </span>
              <Link href="/onboarding/storefront" className="text-primary hover:underline font-medium">
                Edit
              </Link>
            </div>
            <div className="text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <span>Brand Color:</span>
                <span
                  className="h-3 w-3 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: draft?.step3?.brandColor || "#2563EB" }}
                />
                <span className="font-mono text-foreground">{draft?.step3?.brandColor || "#2563EB"}</span>
              </div>
              <p>Theme: <span className="text-foreground capitalize">{draft?.step3?.themeId?.replace(/_/g, " ") || "Modern Commerce"}</span></p>
            </div>
          </div>

          {/* 4. First Product */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Package className="h-4 w-4 text-primary" /> Initial Product
              </span>
              <Link href="/onboarding/products" className="text-primary hover:underline font-medium">
                Edit
              </Link>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Product: <span className="text-foreground font-medium">{draft?.step4?.productName || "None"}</span></p>
              <p>Price: <span className="text-foreground font-medium">৳{draft?.step4?.price ?? 0} BDT</span></p>
              <p>Initial Stock: <span className="text-foreground">{draft?.step4?.initialStock ?? 0} units</span></p>
            </div>
          </div>

          {/* 5. Payments */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-primary" /> Payment Method
              </span>
              <Link href="/onboarding/payments" className="text-primary hover:underline font-medium">
                Edit
              </Link>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Cash on Delivery: <Badge variant="success" className="text-[10px]">Active</Badge></p>
              <p>Online Gateways: <span className="text-muted-foreground">Configurable in Phase 5</span></p>
            </div>
          </div>

          {/* 6. Shipping */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" /> Delivery Charges
              </span>
              <Link href="/onboarding/shipping" className="text-primary hover:underline font-medium">
                Edit
              </Link>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Inside Dhaka: <span className="text-foreground font-medium">৳{draft?.step6?.insideDhakaRate ?? 60}</span></p>
              <p>Outside Dhaka: <span className="text-foreground font-medium">৳{draft?.step6?.outsideDhakaRate ?? 120}</span></p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            asChild
          >
            <Link href="/onboarding/shipping" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>

          <Button
            type="button"
            disabled={!isReadyToPublish || publishMutation.isPending}
            onClick={handlePublish}
            className="gap-2 bg-success text-success-foreground hover:bg-success/90"
          >
            {publishMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing Store...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Publish Storefront Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

