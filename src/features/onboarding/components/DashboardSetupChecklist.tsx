"use client";

import React from "react";
import Link from "next/link";
import { useOnboardingDraft, ONBOARDING_QUERY_KEY } from "../hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { mockOnboardingService } from "../services/mockOnboarding";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Store,
  Palette,
  Package,
  CreditCard,
  Truck,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

export function DashboardSetupChecklist() {
  const { data: draft, isLoading, isError, error, refetch } = useOnboardingDraft();
  const queryClient = useQueryClient();

  // Evaluate genuine completion derived strictly from draft state
  const isProfileComplete = Boolean(
    draft?.step1?.storeName && draft?.step1?.storeSlug && draft?.step2?.district
  );
  const isThemeSelected = Boolean(draft?.step3?.themeId && draft?.step3?.brandColor);
  const isProductAdded = Boolean(draft?.step4?.productName && (draft?.step4?.price ?? 0) > 0);
  const isImageUploaded = Boolean(draft?.step4?.imageUrl && draft.step4.imageUrl.length > 0);
  const isPaymentConfigured = Boolean(
    draft?.step5?.cashOnDelivery !== undefined || draft?.step5?.providerStatus === "connected"
  );
  const isShippingConfigured = Boolean(
    draft?.step6?.insideDhakaRate !== undefined && draft?.step6?.outsideDhakaRate !== undefined
  );
  const isStorePublished = Boolean(draft?.isPublished);

  const checklistItems = [
    {
      id: "profile",
      title: "Store Profile & Identity",
      titleBn: "স্টোরের পরিচয় ও ঠিকানা",
      isComplete: isProfileComplete,
      isRequired: true,
      link: "/onboarding/store",
      icon: Store,
    },
    {
      id: "theme",
      title: "Storefront Theme & Branding",
      titleBn: "ব্র্যান্ডিং কালার ও থিম নির্বাচন",
      isComplete: isThemeSelected,
      isRequired: true,
      link: "/onboarding/storefront",
      icon: Palette,
    },
    {
      id: "product",
      title: "First Product Added",
      titleBn: "প্রথম পণ্য যুক্ত করা",
      isComplete: isProductAdded,
      isRequired: true,
      link: "/onboarding/products",
      icon: Package,
    },
    {
      id: "product_image",
      title: "Product Image Uploaded",
      titleBn: "পণ্যের ছবি আপলোড",
      isComplete: isImageUploaded,
      isRequired: false,
      link: "/onboarding/products",
      icon: Package,
      note: "Optional",
    },
    {
      id: "payment",
      title: "Payment Method Configured",
      titleBn: "ক্যাশ অন ডেলিভারি বা পেমেন্ট গেটওয়ে",
      isComplete: isPaymentConfigured,
      isRequired: true,
      link: "/onboarding/payments",
      icon: CreditCard,
    },
    {
      id: "shipping",
      title: "Delivery Rates Configured",
      titleBn: "ডেলিভারি চার্জ নির্ধারণ",
      isComplete: isShippingConfigured,
      isRequired: true,
      link: "/onboarding/shipping",
      icon: Truck,
    },
    {
      id: "publish",
      title: "Storefront Published",
      titleBn: "স্টোরফ্রন্ট লাইভ করা",
      isComplete: isStorePublished,
      isRequired: true,
      link: "/onboarding/publish",
      icon: Sparkles,
    },
  ];

  const totalRequired = checklistItems.filter((i) => i.isRequired).length;
  const completedRequired = checklistItems.filter((i) => i.isRequired && i.isComplete).length;
  const progressPercent = Math.round((completedRequired / totalRequired) * 100);

  // Resume Setup points directly to the first incomplete step
  const getResumePath = () => {
    if (!draft?.step1?.storeName || !draft?.step1?.storeSlug) return "/onboarding/store";
    if (!draft?.step2?.businessAddress || !draft?.step2?.district) return "/onboarding/business";
    if (!draft?.step3?.brandColor || !draft?.step3?.themeId) return "/onboarding/storefront";
    if (!draft?.step4?.productName || !draft?.step4?.price) return "/onboarding/products";
    if (draft?.step5?.cashOnDelivery === undefined && draft?.step5?.providerStatus !== "connected") return "/onboarding/payments";
    if (draft?.step6?.insideDhakaRate === undefined) return "/onboarding/shipping";
    return "/onboarding/publish";
  };
  const resumePath = getResumePath();

  const handleResetOnboarding = () => {
    mockOnboardingService.resetOnboarding();
    queryClient.invalidateQueries({ queryKey: ONBOARDING_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["stores", "current"] });
    toast.success("Onboarding draft reset", {
      description: "Onboarding progress has been cleared back to Step 1.",
    });
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Merchant Setup Checklist</CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {progressPercent}% Complete
            </Badge>
          </div>
          <CardDescription className="mt-1">
            Track your store setup journey. Persisted safely across browser refreshes in Demo Mode.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 animate-spin" /> Syncing...
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-xs text-muted-foreground gap-1 h-8"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </Button>
          )}

          {!isStorePublished && (
            <Button size="sm" asChild className="gap-1.5 h-8">
              <Link href={resumePath}>
                Resume Setup
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Demo Mode Reassurance Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-medium text-foreground">Demo Mode Active:</span>
            <span className="text-muted-foreground">Setup progress is saved locally in this browser.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetOnboarding}
            className="h-6 text-[11px] text-muted-foreground hover:text-foreground self-start sm:self-auto"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset Setup
          </Button>
        </div>

        {/* API Offline Notice if real backend was attempted but unavailable */}
        {isError && (
          <div className="p-3 text-xs rounded-lg border border-warning/30 bg-warning/5 text-warning flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Backend Synchronization Notice</p>
              <p className="text-muted-foreground mt-0.5">
                {error instanceof Error ? error.message : "Operating in offline demo mode."}
                Checklist reflects simulated in-browser state.
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between p-3 rounded-lg border transition-colors ${
                item.isComplete
                  ? "border-success/20 bg-success/5"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                {item.isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                )}
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-medium leading-tight truncate ${
                        item.isComplete ? "text-foreground line-through opacity-80" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.note && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ({item.note})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{item.titleBn}</p>
                </div>
              </div>

              {!item.isComplete ? (
                <Link
                  href={item.link}
                  className="text-primary hover:underline text-xs font-medium shrink-0 ml-2"
                >
                  Configure
                </Link>
              ) : (
                <Link
                  href={item.link}
                  className="text-muted-foreground hover:text-foreground text-xs shrink-0 ml-2"
                >
                  Edit
                </Link>
              )}
            </div>
          ))}
        </div>

        {isStorePublished && draft?.storefrontUrl && (
          <div className="pt-2 flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs">
            <span className="text-foreground font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Store is live at {draft.storefrontUrl}
            </span>
            <Button size="sm" variant="outline" asChild className="h-7 text-xs">
              <a href={draft.storefrontUrl} target="_blank" rel="noreferrer" className="gap-1">
                <ExternalLink className="h-3 w-3" /> Visit Storefront
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
