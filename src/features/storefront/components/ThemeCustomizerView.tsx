"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  themeCustomizationSchema,
  type ThemeCustomizationFormValues,
} from "../schemas";
import {
  useActiveThemeQuery,
  useUpdateThemeCustomizationMutation,
  useResetThemeCustomizationMutation,
} from "../hooks";
import { PRESET_BRAND_COLORS, HEADING_FONTS, BODY_FONTS } from "../constants";
import type {
  ViewportMode,
  ThemeCustomizationSettings,
  HeadingFont,
  BodyFont,
  FontSizeScale,
} from "../types";
import { StorefrontLivePreview } from "./StorefrontLivePreview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  RotateCcw,
  Palette,
  Type,
  Layout,
  Sliders,
  Check,
  Sparkles,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";

export function ThemeCustomizerView() {
  const { data: theme, isLoading, isError, error, refetch } = useActiveThemeQuery();
  const updateMutation = useUpdateThemeCustomizationMutation();
  const resetMutation = useResetThemeCustomizationMutation();

  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [activeTab, setActiveTab] = useState("colors");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Theme Customizer"
          description="স্টোরফ্রন্ট ব্র্যান্ডিং, কালার ও লেআউট পরিবর্তন"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Themes", href: "/dashboard/store/themes" },
            { label: "Customize", href: "/dashboard/store/themes/customize" },
          ]}
        />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (isError || !theme) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Theme Customizer"
          description="স্টোরফ্রন্ট ব্র্যান্ডিং, কালার ও লেআউট পরিবর্তন"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Themes", href: "/dashboard/store/themes" },
            { label: "Customize", href: "/dashboard/store/themes/customize" },
          ]}
        />
        <ErrorState
          title="Failed to load theme customization"
          message={error?.message || "Could not load current theme"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <ThemeCustomizerForm
      theme={theme}
      viewport={viewport}
      setViewport={setViewport}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSave={(values) =>
        updateMutation.mutateAsync({
          themeId: theme.id,
          settings: values as unknown as ThemeCustomizationSettings,
        })
      }
      onReset={() => resetMutation.mutateAsync(theme.id)}
      isSaving={updateMutation.isPending}
      isResetting={resetMutation.isPending}
    />
  );
}

interface ThemeCustomizerFormProps {
  theme: NonNullable<ReturnType<typeof useActiveThemeQuery>["data"]>;
  viewport: ViewportMode;
  setViewport: (v: ViewportMode) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  onSave: (values: ThemeCustomizationFormValues) => Promise<unknown>;
  onReset: () => Promise<unknown>;
  isSaving: boolean;
  isResetting: boolean;
}

function ThemeCustomizerForm({
  theme,
  viewport,
  setViewport,
  activeTab,
  setActiveTab,
  onSave,
  onReset,
  isSaving,
  isResetting,
}: ThemeCustomizerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<ThemeCustomizationFormValues>({
    resolver: zodResolver(themeCustomizationSchema),
    defaultValues: theme.currentSettings,
  });

  // Real-time live watch for instant canvas preview
  const watchedSettings = useWatch({ control });

  const onSubmit = async (values: ThemeCustomizationFormValues) => {
    await onSave(values);
    reset(values);
  };

  const handleReset = async () => {
    await onReset();
    reset(theme.defaultSettings);
  };

  const currentSettings = (
    watchedSettings.colors ? watchedSettings : theme.currentSettings
  ) as unknown as ThemeCustomizationSettings;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Top Header Bar */}
      <PageHeader
        title={`Customizing: ${theme.name}`}
        description="রং, টাইপোগ্রাফি এবং হোমপেজ সেকশন সমন্বয় করে লাইভ প্রিভিউ দেখুন"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Storefront", href: "/dashboard/store" },
          { label: "Themes", href: "/dashboard/store/themes" },
          { label: "Customize", href: "/dashboard/store/themes/customize" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Viewport switchers */}
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-xs">
              <Button
                type="button"
                variant={viewport === "desktop" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewport("desktop")}
                className="h-7 px-2.5 text-xs"
                title="Desktop View (100%)"
              >
                <Monitor className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
              <Button
                type="button"
                variant={viewport === "tablet" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewport("tablet")}
                className="h-7 px-2.5 text-xs"
                title="Tablet View (768px)"
              >
                <Tablet className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Tablet</span>
              </Button>
              <Button
                type="button"
                variant={viewport === "mobile" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewport("mobile")}
                className="h-7 px-2.5 text-xs"
                title="Mobile View (375px)"
              >
                <Smartphone className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
            </div>

            {/* Reset confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  disabled={isResetting}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Defaults</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Theme Settings?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to revert all customizations back to factory theme defaults? Any unsaved edits will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Save Button */}
            <Button
              type="submit"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              disabled={isSaving}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving..." : "Save Customization"}</span>
            </Button>
          </div>
        }
      />

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls Panel (5 Columns on XL) */}
        <div className="xl:col-span-5 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="p-4 pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="colors" className="text-xs flex items-center gap-1">
                    <Palette className="h-3.5 w-3.5" />
                    <span>Colors</span>
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="text-xs flex items-center gap-1">
                    <Type className="h-3.5 w-3.5" />
                    <span>Typography</span>
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="text-xs flex items-center gap-1">
                    <Layout className="h-3.5 w-3.5" />
                    <span>Sections</span>
                  </TabsTrigger>
                  <TabsTrigger value="header" className="text-xs flex items-center gap-1">
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Header</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              {/* TAB 1: COLORS */}
              {activeTab === "colors" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1.5">
                      Brand Color Presets
                    </h4>
                    <p className="text-[11px] text-muted-foreground mb-2">
                      অনবোর্ডিং বা ব্র্যান্ড গাইডলাইন অনুযায়ী প্রাথমিক রং নির্বাচন করুন:
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_BRAND_COLORS.map((preset) => {
                        const isSelected = currentSettings.colors.primary.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setValue("colors.primary", preset.hex, { shouldDirty: true })}
                            className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                              isSelected
                                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            <span
                              className="h-6 w-6 rounded-full shadow-xs border border-black/10 flex items-center justify-center"
                              style={{ backgroundColor: preset.hex }}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                            </span>
                            <span className="text-[10px] font-medium truncate w-full text-center">
                              {preset.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="colors.primary" className="text-xs">
                          Primary Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="colors.primary.picker"
                            value={currentSettings.colors.primary}
                            onChange={(e) => setValue("colors.primary", e.target.value, { shouldDirty: true })}
                            className="h-8 w-8 rounded border border-border cursor-pointer p-0.5"
                          />
                          <Input
                            id="colors.primary"
                            {...register("colors.primary")}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="colors.secondary" className="text-xs">
                          Secondary Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="colors.secondary.picker"
                            value={currentSettings.colors.secondary}
                            onChange={(e) => setValue("colors.secondary", e.target.value, { shouldDirty: true })}
                            className="h-8 w-8 rounded border border-border cursor-pointer p-0.5"
                          />
                          <Input
                            id="colors.secondary"
                            {...register("colors.secondary")}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="colors.accent" className="text-xs">
                          Accent / Promo Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="colors.accent.picker"
                            value={currentSettings.colors.accent}
                            onChange={(e) => setValue("colors.accent", e.target.value, { shouldDirty: true })}
                            className="h-8 w-8 rounded border border-border cursor-pointer p-0.5"
                          />
                          <Input
                            id="colors.accent"
                            {...register("colors.accent")}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="colors.footerBg" className="text-xs">
                          Footer Background
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="colors.footerBg.picker"
                            value={currentSettings.colors.footerBg}
                            onChange={(e) => setValue("colors.footerBg", e.target.value, { shouldDirty: true })}
                            className="h-8 w-8 rounded border border-border cursor-pointer p-0.5"
                          />
                          <Input
                            id="colors.footerBg"
                            {...register("colors.footerBg")}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TYPOGRAPHY */}
              {activeTab === "typography" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="typography.headingFont" className="text-xs">
                      Heading Font (শিরোনাম ফন্ট)
                    </Label>
                    <Select
                      value={currentSettings.typography.headingFont}
                      onValueChange={(val) =>
                        setValue("typography.headingFont", val as HeadingFont, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger id="typography.headingFont" className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HEADING_FONTS.map((font) => (
                          <SelectItem key={font.id} value={font.id} className="text-xs">
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground">
                      বাংলা হেডলাইনের জন্য Noto Sans Bengali বা Hind Siliguri আদর্শ।
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="typography.bodyFont" className="text-xs">
                      Body Font (মূল টেক্সট ফন্ট)
                    </Label>
                    <Select
                      value={currentSettings.typography.bodyFont}
                      onValueChange={(val) =>
                        setValue("typography.bodyFont", val as BodyFont, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger id="typography.bodyFont" className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BODY_FONTS.map((font) => (
                          <SelectItem key={font.id} value={font.id} className="text-xs">
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="typography.baseFontSize" className="text-xs">
                      Base Font Size
                    </Label>
                    <Select
                      value={currentSettings.typography.baseFontSize}
                      onValueChange={(val) =>
                        setValue("typography.baseFontSize", val as FontSizeScale, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger id="typography.baseFontSize" className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm" className="text-xs">Small (14px - Compact)</SelectItem>
                        <SelectItem value="md" className="text-xs">Medium (16px - Standard)</SelectItem>
                        <SelectItem value="lg" className="text-xs">Large (18px - Editorial)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* TAB 3: SECTIONS */}
              {activeTab === "sections" && (
                <div className="space-y-5">
                  {/* Hero Banner Controls */}
                  <div className="space-y-3 p-3 rounded-lg border border-border/80 bg-muted/10">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hero.enabled" className="text-xs font-bold">
                        Hero Banner Section
                      </Label>
                      <Switch
                        id="hero.enabled"
                        checked={currentSettings.hero.enabled}
                        onCheckedChange={(checked) =>
                          setValue("hero.enabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    {currentSettings.hero.enabled && (
                      <div className="space-y-3 pt-2 border-t border-border/60">
                        <div className="space-y-1">
                          <Label htmlFor="hero.headline" className="text-[11px]">
                            English Headline
                          </Label>
                          <Input
                            id="hero.headline"
                            {...register("hero.headline")}
                            className="h-8 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="hero.headlineBn" className="text-[11px]">
                            বাংলা শিরোনাম (Headline Bengali)
                          </Label>
                          <Input
                            id="hero.headlineBn"
                            {...register("hero.headlineBn")}
                            className="h-8 text-xs font-bengali"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="hero.subheadingBn" className="text-[11px]">
                            বাংলা সাব-টাইটেল (Subheading)
                          </Label>
                          <Input
                            id="hero.subheadingBn"
                            {...register("hero.subheadingBn")}
                            className="h-8 text-xs font-bengali"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor="hero.buttonText" className="text-[11px]">
                              CTA Button Text
                            </Label>
                            <Input
                              id="hero.buttonText"
                              {...register("hero.buttonText")}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="hero.bannerStyle" className="text-[11px]">
                              Banner Layout
                            </Label>
                            <Select
                              value={currentSettings.hero.bannerStyle}
                              onValueChange={(val) =>
                                setValue(
                                  "hero.bannerStyle",
                                  val as "split" | "centered" | "full",
                                  { shouldDirty: true }
                                )
                              }
                            >
                              <SelectTrigger id="hero.bannerStyle" className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="split" className="text-xs">Split Grid</SelectItem>
                                <SelectItem value="centered" className="text-xs">Centered</SelectItem>
                                <SelectItem value="full" className="text-xs">Full Bleed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Categories Section */}
                  <div className="space-y-3 p-3 rounded-lg border border-border/80 bg-muted/10">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="categories.enabled" className="text-xs font-bold">
                        Featured Categories
                      </Label>
                      <Switch
                        id="categories.enabled"
                        checked={currentSettings.categories.enabled}
                        onCheckedChange={(checked) =>
                          setValue("categories.enabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    {currentSettings.categories.enabled && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="space-y-1">
                          <Label htmlFor="categories.titleBn" className="text-[11px]">
                            Section Title (বাংলা)
                          </Label>
                          <Input
                            id="categories.titleBn"
                            {...register("categories.titleBn")}
                            className="h-8 text-xs font-bengali"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Products Section */}
                  <div className="space-y-3 p-3 rounded-lg border border-border/80 bg-muted/10">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="products.enabled" className="text-xs font-bold">
                        Featured Best Sellers
                      </Label>
                      <Switch
                        id="products.enabled"
                        checked={currentSettings.products.enabled}
                        onCheckedChange={(checked) =>
                          setValue("products.enabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    {currentSettings.products.enabled && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="space-y-1">
                          <Label htmlFor="products.titleBn" className="text-[11px]">
                            Section Title (বাংলা)
                          </Label>
                          <Input
                            id="products.titleBn"
                            {...register("products.titleBn")}
                            className="h-8 text-xs font-bengali"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Promo Banner */}
                  <div className="space-y-3 p-3 rounded-lg border border-border/80 bg-muted/10">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promo.enabled" className="text-xs font-bold">
                        Promotional / Discount Bar
                      </Label>
                      <Switch
                        id="promo.enabled"
                        checked={currentSettings.promo.enabled}
                        onCheckedChange={(checked) =>
                          setValue("promo.enabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    {currentSettings.promo.enabled && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor="promo.couponCode" className="text-[11px]">
                              Coupon Code
                            </Label>
                            <Input
                              id="promo.couponCode"
                              {...register("promo.couponCode")}
                              className="h-8 text-xs font-mono uppercase"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="promo.discountText" className="text-[11px]">
                              Discount Text
                            </Label>
                            <Input
                              id="promo.discountText"
                              {...register("promo.discountText")}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: HEADER & ANNOUNCEMENT */}
              {activeTab === "header" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="header.logoText" className="text-xs">
                      Store Brand Name (Logo Text)
                    </Label>
                    <Input
                      id="header.logoText"
                      {...register("header.logoText")}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="header.announcementEnabled" className="text-xs font-semibold">
                        Top Announcement Bar
                      </Label>
                      <Switch
                        id="header.announcementEnabled"
                        checked={currentSettings.header.announcementEnabled}
                        onCheckedChange={(checked) =>
                          setValue("header.announcementEnabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    {currentSettings.header.announcementEnabled && (
                      <div className="space-y-2 pt-1">
                        <Label htmlFor="header.announcementText" className="text-[11px]">
                          Announcement Text
                        </Label>
                        <Input
                          id="header.announcementText"
                          {...register("header.announcementText")}
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="header.sticky" className="text-xs">
                        Sticky Navbar on Scroll
                      </Label>
                      <Switch
                        id="header.sticky"
                        checked={currentSettings.header.sticky}
                        onCheckedChange={(checked) =>
                          setValue("header.sticky", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="header.showSearch" className="text-xs">
                        Show Search Bar
                      </Label>
                      <Switch
                        id="header.showSearch"
                        checked={currentSettings.header.showSearch}
                        onCheckedChange={(checked) =>
                          setValue("header.showSearch", checked, { shouldDirty: true })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="header.showCart" className="text-xs">
                        Show Shopping Cart Counter
                      </Label>
                      <Switch
                        id="header.showCart"
                        checked={currentSettings.header.showCart}
                        onCheckedChange={(checked) =>
                          setValue("header.showCart", checked, { shouldDirty: true })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Live Interactive Storefront Preview Canvas (7 Columns on XL) */}
        <div className="xl:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Live Interactive Preview
              </span>
              <span className="text-[11px] text-muted-foreground">
                (Updates in real-time)
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {viewport.toUpperCase()} • {viewport === "desktop" ? "1080px" : viewport === "tablet" ? "768px" : "375px"}
            </span>
          </div>

          <div className="bg-muted/40 rounded-xl p-2 sm:p-4 border border-border/80 overflow-x-auto min-h-[600px] flex justify-center items-start">
            <StorefrontLivePreview
              settings={currentSettings}
              viewport={viewport}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
