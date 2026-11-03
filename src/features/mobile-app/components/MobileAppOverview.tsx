"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Palette,
  Layout,
  Eye,
  Settings,
  RotateCcw,
  Info,
  CheckCircle2,
  Clock,
  Bell,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useMobileAppConfigQuery, useMobileAppStatsQuery, useResetMobileAppMutation } from "../hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function MobileAppOverview() {
  const { data: config, isLoading: configLoading } = useMobileAppConfigQuery();
  const { data: stats, isLoading: statsLoading } = useMobileAppStatsQuery();
  const resetMutation = useResetMobileAppMutation();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  if (configLoading || statsLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const handleReset = async () => {
    await resetMutation.mutateAsync();
    setResetDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mobile App Management"
        description="Configure your store's white-label mobile shopping application for Android and iOS"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mobile App" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/mobile-app/preview">
                <Eye className="h-4 w-4" />
                Live Preview
              </Link>
            </Button>
            <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                  <RotateCcw className="h-4 w-4" />
                  Reset Defaults
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Mobile App Configuration?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will revert all app branding, homepage sections, navigation, and push settings back to standard demo defaults. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                    Reset to Defaults
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {/* Demo Mode Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Demo Mode — Simulated Mobile App Ecosystem</p>
          <p className="text-muted-foreground dark:text-sky-300">
            CartX Merchant Dashboard allows merchants to customize branding, color themes, and homepage navigation for native mobile apps. In Demo Mode, APK/IPA builds, App Store submissions, and push notification relays are simulated. No actual app store binary is compiled or submitted.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              App Status
            </CardTitle>
            <Smartphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 font-medium capitalize">
                {stats?.status === "configured" ? "Simulated Draft Ready" : stats?.status || "Configured"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate">
              {config?.displayName || "Green Harvest BD"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Sections
            </CardTitle>
            <Layout className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sectionsConfigured ?? 5} / 6</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.navigationItemsEnabled ?? 5} bottom navigation tabs active
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Push Channels
            </CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pushNotificationsEnabled ?? 3} / 4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Order, shipping & promo alerts enabled
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Configured
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold truncate">
              {stats?.lastSavedAt ? new Date(stats.lastSavedAt).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" }) : "Today"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              2 platforms configured (Android & iOS)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Brand Identity & Colors</CardTitle>
                <CardDescription className="text-xs">
                  Configure app name, brand color palettes, app icons, and splash screens
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config?.brandColors.primary || "#2563EB" }} />
                <span>Primary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config?.brandColors.accent || "#38BDF8" }} />
                <span>Accent</span>
              </div>
              <span className="text-muted-foreground capitalize ml-auto">Theme: {config?.theme || "light"}</span>
            </div>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/dashboard/mobile-app/branding">
                <span>Customize App Branding</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Homepage & Navigation Layout</CardTitle>
                <CardDescription className="text-xs">
                  Reorder dynamic widgets, carousel banners, and bottom navigation tabs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Top Section:</span>
                <span className="font-medium text-foreground">{config?.homepageLayout[0]?.title || "Hero Banner"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Active Sections:</span>
                <span className="font-medium text-foreground">{config?.homepageLayout.filter((s) => s.enabled).length} widgets</span>
              </div>
            </div>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/dashboard/mobile-app/content">
                <span>Manage App Content</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Interactive Platform Preview</CardTitle>
                <CardDescription className="text-xs">
                  Simulate Android & iOS device viewports with live responsive skinning
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Simulated rendering with real demo store catalog</span>
            </div>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/dashboard/mobile-app/preview">
                <span>Open Device Emulator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Push Alerts & App Packages</CardTitle>
                <CardDescription className="text-xs">
                  Package names, bundle identifiers, and automated push notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Android:</span>
                <span className="font-mono text-[11px] text-foreground">{config?.platformSettings.android.packageName}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>iOS:</span>
                <span className="font-mono text-[11px] text-foreground">{config?.platformSettings.ios.bundleId}</span>
              </div>
            </div>
            <Button asChild className="w-full justify-between" variant="outline">
              <Link href="/dashboard/mobile-app/settings">
                <span>Configure App Settings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

