"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  Sparkles,
  Info,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mobileAppBrandingSchema,
  type MobileAppBrandingFormValues,
} from "../schemas";
import { useMobileAppConfigQuery, useUpdateBrandingMutation } from "../hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function BrandingView() {
  const { data: config, isLoading } = useMobileAppConfigQuery();
  const updateMutation = useUpdateBrandingMutation();

  const form = useForm<MobileAppBrandingFormValues>({
    resolver: zodResolver(mobileAppBrandingSchema),
    defaultValues: {
      displayName: "",
      description: "",
      appIcon: "",
      appLogo: "",
      splashScreen: "",
      brandColors: {
        primary: "#2563EB",
        secondary: "#1D4ED8",
        accent: "#38BDF8",
        background: "#FFFFFF",
      },
      theme: "light",
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        displayName: config.displayName,
        description: config.description || "",
        appIcon: config.appIcon,
        appLogo: config.appLogo,
        splashScreen: config.splashScreen,
        brandColors: config.brandColors,
        theme: config.theme,
      });
    }
  }, [config, form]);

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const onSubmit = async (values: MobileAppBrandingFormValues) => {
    await updateMutation.mutateAsync(values);
  };

  const currentValues = form.watch();

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Branding & Identity"
        description="Configure your mobile app's name, brand colors, visual themes, and launcher graphics"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mobile App", href: "/dashboard/mobile-app" },
          { label: "Branding" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/mobile-app">
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={form.handleSubmit(onSubmit)}
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4" />
              {updateMutation.isPending ? "Saving..." : "Save Branding"}
            </Button>
          </div>
        }
      />

      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Simulated Branding: </span>
          Colors and assets applied here instantly reflect in the in-dashboard interactive device emulator. No cloud compiler or Android Studio/Xcode builds are executed.
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-xl shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Store App Identity</CardTitle>
              <CardDescription className="text-xs">
                Visible to customers on their home screens and mobile app stores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs font-medium">
                  Mobile App Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="displayName"
                  placeholder="e.g. Green Harvest BD"
                  {...form.register("displayName")}
                  className="text-sm"
                />
                {form.formState.errors.displayName && (
                  <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-medium">
                  Tagline / App Description
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="আপনার প্রিয় পণ্য অর্ডার করুন ঘরে বসেই..."
                  {...form.register("description")}
                  className="text-sm resize-none"
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Visual Theme Mode</Label>
                <Select
                  value={form.watch("theme")}
                  onValueChange={(val: "light" | "dark" | "auto") => form.setValue("theme", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Mode (Clean White)</SelectItem>
                    <SelectItem value="dark">Dark Mode (OLED Slate)</SelectItem>
                    <SelectItem value="auto">System Automatic (Match OS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Brand Color Palette</CardTitle>
              <CardDescription className="text-xs">
                Theme colors utilized across buttons, header bars, badges, and tab highlights
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="primaryColor" className="text-xs font-medium">Primary Accent</Label>
                  <span className="text-[11px] font-mono text-muted-foreground">{currentValues.brandColors?.primary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="primaryColor"
                    value={currentValues.brandColors?.primary || "#2563EB"}
                    onChange={(e) => form.setValue("brandColors.primary", e.target.value)}
                    className="h-8 w-12 rounded cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <Input
                    {...form.register("brandColors.primary")}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="secondaryColor" className="text-xs font-medium">Secondary / Deep</Label>
                  <span className="text-[11px] font-mono text-muted-foreground">{currentValues.brandColors?.secondary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={currentValues.brandColors?.secondary || "#1D4ED8"}
                    onChange={(e) => form.setValue("brandColors.secondary", e.target.value)}
                    className="h-8 w-12 rounded cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <Input
                    {...form.register("brandColors.secondary")}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="accentColor" className="text-xs font-medium">Highlight / Badges</Label>
                  <span className="text-[11px] font-mono text-muted-foreground">{currentValues.brandColors?.accent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="accentColor"
                    value={currentValues.brandColors?.accent || "#38BDF8"}
                    onChange={(e) => form.setValue("brandColors.accent", e.target.value)}
                    className="h-8 w-12 rounded cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <Input
                    {...form.register("brandColors.accent")}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bgColor" className="text-xs font-medium">Canvas Background</Label>
                  <span className="text-[11px] font-mono text-muted-foreground">{currentValues.brandColors?.background}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="bgColor"
                    value={currentValues.brandColors?.background || "#FFFFFF"}
                    onChange={(e) => form.setValue("brandColors.background", e.target.value)}
                    className="h-8 w-12 rounded cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <Input
                    {...form.register("brandColors.background")}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Visual Assets & Icons</CardTitle>
              <CardDescription className="text-xs">
                Launcher app icon, navigation bar logo, and full-screen launch splash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appIcon" className="text-xs font-medium">
                  Launcher App Icon URL (Square 512x512) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="appIcon"
                  placeholder="https://..."
                  {...form.register("appIcon")}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appLogo" className="text-xs font-medium">
                  In-App Header Logo URL (Horizontal) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="appLogo"
                  placeholder="https://..."
                  {...form.register("appLogo")}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="splashScreen" className="text-xs font-medium">
                  Splash Screen Background Graphic URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="splashScreen"
                  placeholder="https://..."
                  {...form.register("splashScreen")}
                  className="text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Visual Card Preview - 1 col */}
        <div className="space-y-4">
          <Card className="rounded-xl shadow-xs sticky top-20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <CardTitle className="text-sm font-semibold">Live Brand Specimen</CardTitle>
              </div>
              <CardDescription className="text-xs">Real-time simulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* App Icon Mockup */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-md shrink-0 border border-border/60"
                  style={{ backgroundColor: currentValues.brandColors?.primary || "#2563EB" }}
                >
                  {currentValues.appIcon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentValues.appIcon}
                      alt="App Icon"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {currentValues.displayName || "App Name"}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    CartX Mobile v1.0.0
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">
                    {currentValues.theme?.toUpperCase()} THEME
                  </span>
                </div>
              </div>

              {/* Sample Action Button */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Button & Accent Preview
                </span>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg font-medium text-xs text-white shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: currentValues.brandColors?.primary || "#2563EB" }}
                >
                  <span>অর্ডার কনফার্ম করুন (৳ ১,৫০০)</span>
                </button>
                <div
                  className="py-1 px-2 rounded text-[11px] font-medium text-center"
                  style={{
                    backgroundColor: currentValues.brandColors?.accent + "33",
                    color: currentValues.brandColors?.secondary,
                  }}
                >
                  ⚡ ২০% বিশেষ মূল্যছাড় ভাউচার
                </div>
              </div>

              <Button
                type="button"
                className="w-full mt-2"
                onClick={form.handleSubmit(onSubmit)}
                disabled={updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save & Apply to Emulator
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

