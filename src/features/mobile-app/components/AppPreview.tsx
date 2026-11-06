"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Apple,
  Info,
  ArrowLeft,
  Search,
  ShoppingCart,
  Home,
  Grid,
  Package,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMobileAppConfigQuery } from "../hooks";
import type { AppPreviewDevice } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function AppPreview() {
  const { data: config, isLoading } = useMobileAppConfigQuery();
  const [device, setDevice] = useState<AppPreviewDevice>("android");
  const [previewTab, setPreviewTab] = useState("home");

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const primaryColor = config?.brandColors.primary || "#2563EB";
  const secondaryColor = config?.brandColors.secondary || "#1D4ED8";
  const activeSections =
    config?.homepageLayout
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order) || [];
  const activeNavItems = config?.navigationItems.filter((n) => n.enabled) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Platform Preview"
        description="Experience your mobile storefront exactly as customers see it on native Android and iOS devices"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mobile App", href: "/dashboard/mobile-app" },
          { label: "Platform Preview" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/mobile-app">
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/mobile-app/branding">Customize Skin</Link>
            </Button>
          </div>
        }
      />

      {/* Demo Mode Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Simulated Device Emulator: </span>
          This emulator renders dynamic widgets, brand themes, and catalog
          products. No mobile binary build or App Store / Play Store
          verification is involved.
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
        {/* Device Controls */}
        <div className="w-full lg:w-72 space-y-4">
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Preview Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Select operating system skin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Operating Platform
                </span>
                <Tabs
                  value={device}
                  onValueChange={(v) => setDevice(v as AppPreviewDevice)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger
                      value="android"
                      className="flex items-center gap-2 text-xs"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      Android OS
                    </TabsTrigger>
                    <TabsTrigger
                      value="ios"
                      className="flex items-center gap-2 text-xs"
                    >
                      <Apple className="h-3.5 w-3.5" />
                      Apple iOS
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">App Name:</span>
                  <span className="font-medium text-foreground">
                    {config?.displayName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-medium text-foreground capitalize">
                    {config?.theme}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Widgets:</span>
                  <span className="font-medium text-foreground">
                    {activeSections.length} sections
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Link href="/dashboard/mobile-app/content">
                    Reorder Sections
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Link href="/dashboard/mobile-app/settings">
                    Push Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Mockup Shell */}
        <div className="relative w-full flex justify-center overflow-hidden">
          {/* Outer Phone Bezel */}
          <div
            className={`w-full max-w-[310px] xs:max-w-[360px] h-[640px] xs:h-[720px] rounded-[36px] xs:rounded-[48px] p-2.5 xs:p-3 shadow-2xl border-[5px] xs:border-[6px] transition-all relative overflow-hidden flex flex-col ${
              device === "ios"
                ? "border-slate-800 bg-slate-950 dark:border-slate-700"
                : "border-zinc-800 bg-zinc-950 dark:border-zinc-700"
            }`}
          >
            {/* Screen Inner Glass */}
            <div className="w-full h-full rounded-[38px] bg-white dark:bg-slate-900 overflow-hidden flex flex-col relative text-slate-900 dark:text-slate-100 font-sans select-none">
              {/* Top Notch / Dynamic Island */}
              <div className="h-9 w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-between px-6 shrink-0 relative z-20">
                <span className="text-[11px] font-semibold tracking-tight text-slate-800 dark:text-slate-200">
                  9:41
                </span>
                {device === "ios" ? (
                  <div className="h-4 w-24 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2 shadow-xs" />
                ) : (
                  <div className="h-3 w-3 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" />
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-700 dark:text-slate-300">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* App Bar / Header */}
              <div
                className="px-4 py-3 shrink-0 flex items-center justify-between shadow-xs text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                    {config?.displayName
                      ? config.displayName.slice(0, 2).toUpperCase()
                      : "GH"}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight truncate max-w-[170px]">
                      {config?.displayName || "Green Harvest BD"}
                    </div>
                    <div className="text-[9px] text-white/80 leading-tight">
                      ঢাকা ডেলিভারি ৳৬০
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center relative">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 text-black rounded-full text-[8px] font-bold flex items-center justify-center">
                      2
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
                {activeSections.map((sec) => {
                  if (sec.type === "hero_banner") {
                    return (
                      <div
                        key={sec.id}
                        className="rounded-xl p-3 text-white shadow-xs relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        <Badge className="bg-amber-400 text-black hover:bg-amber-400 text-[9px] font-bold uppercase mb-1">
                          ঈদ ধামাকা অফার
                        </Badge>
                        <h4 className="font-bold text-sm leading-snug">
                          {sec.title}
                        </h4>
                        <p className="text-[10px] text-white/80 mt-1">
                          সব পোশাকে ফ্ল্যাট ২৫% পর্যন্ত মূল্যছাড়!
                        </p>
                        <button
                          type="button"
                          className="mt-2.5 px-3 py-1 rounded-md text-[10px] font-semibold bg-white text-slate-900 shadow-2xs"
                        >
                          এখনই কিনুন
                        </button>
                      </div>
                    );
                  }

                  if (sec.type === "categories") {
                    return (
                      <div key={sec.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-semibold">
                          <span>{sec.title}</span>
                          <span
                            className="text-[10px] font-normal"
                            style={{ color: primaryColor }}
                          >
                            সবগুলো দেখুন
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {[
                            { name: "শাড়ি ও ফ্যাশন", icon: "👗" },
                            { name: "অর্গানিক ফুড", icon: "🍯" },
                            { name: "মধু ও ঘি", icon: "🧈" },
                            { name: "হ্যান্ডিক্রাফট", icon: "🧺" },
                          ].map((cat, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center"
                            >
                              <span className="text-base">{cat.icon}</span>
                              <span className="text-[9px] font-medium mt-1 truncate w-full">
                                {cat.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (
                    sec.type === "featured_products" ||
                    sec.type === "new_arrivals"
                  ) {
                    return (
                      <div key={sec.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-semibold">
                          <span>{sec.title}</span>
                          <span
                            className="text-[10px] font-normal"
                            style={{ color: primaryColor }}
                          >
                            সকল পণ্য
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              title: "ঢাকাই জামদানি শাড়ি",
                              price: "৳ ৭,৫০০",
                              old: "৳ ৮,৫০০",
                              tag: "বেস্ট সেলার",
                            },
                            {
                              title: "খাঁটি সুন্দরবন মধু (৫০০ গ্রাম)",
                              price: "৳ ৬৫০",
                              old: "৳ ৭৫০",
                              tag: "১০০% প্রাকৃতিক",
                            },
                          ].map((prod, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-800/50 space-y-1"
                            >
                              <div className="h-16 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500">
                                [পণ্য ছবি]
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[8px] py-0 px-1 border-primary text-primary"
                              >
                                {prod.tag}
                              </Badge>
                              <div className="font-semibold text-[10px] truncate leading-tight">
                                {prod.title}
                              </div>
                              <div className="flex items-center gap-1">
                                <span
                                  className="font-bold text-[11px]"
                                  style={{ color: primaryColor }}
                                >
                                  {prod.price}
                                </span>
                                <span className="text-[9px] text-muted-foreground line-through">
                                  {prod.old}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sec.type === "promotions") {
                    return (
                      <div
                        key={sec.id}
                        className="rounded-lg p-2.5 border border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-[10px] flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-amber-800 dark:text-amber-300">
                            ⚡ কুপন কোড: EID2026
                          </span>
                          <p className="text-amber-700 dark:text-amber-400">
                            সর্বনিম্ন ৳ ১,০০০ অর্ডারে ২০০ টাকা ছাড়
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[9px] px-2 border-amber-400 text-amber-800"
                        >
                          কপি করুন
                        </Button>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Bottom Navigation Bar */}
              <div className="h-14 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 flex items-center justify-around shrink-0 z-20">
                {activeNavItems.map((item) => {
                  const isActive =
                    previewTab === item.id ||
                    (previewTab === "home" && item.id === "nav_home");
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPreviewTab(item.id)}
                      className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                      style={{ color: isActive ? primaryColor : undefined }}
                    >
                      {item.icon === "Home" && <Home className="h-4 w-4" />}
                      {item.icon === "Grid" && <Grid className="h-4 w-4" />}
                      {item.icon === "ShoppingCart" && (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      {item.icon === "Package" && (
                        <Package className="h-4 w-4" />
                      )}
                      {item.icon === "User" && <User className="h-4 w-4" />}
                      <span className="text-[9px] mt-0.5">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Home Indicator bar for iOS */}
              {device === "ios" && (
                <div className="h-4 w-full bg-white dark:bg-slate-950 flex items-center justify-center pb-1">
                  <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
