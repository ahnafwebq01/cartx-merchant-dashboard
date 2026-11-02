"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Palette,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Settings,
  Layers,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useStorefrontOverviewQuery,
  useUpdateStorefrontStatusMutation,
  useResetStorefrontDemoMutation,
} from "../hooks";
import type { StorefrontStatus } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { toast } from "sonner";

export function StoreOverviewView() {
  const { data: overview, isLoading, isError, error, refetch } = useStorefrontOverviewQuery();
  const updateStatusMutation = useUpdateStorefrontStatusMutation();
  const resetDemoMutation = useResetStorefrontDemoMutation();
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Storefront & Website Overview"
          description="স্টোরফ্রন্ট স্ট্যাটাস, থিম এবং ডোমেইন পরিচালনা"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
          ]}
        />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Storefront & Website Overview"
          description="স্টোরফ্রন্ট স্ট্যাটাস, থিম এবং ডোমেইন পরিচালনা"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
          ]}
        />
        <ErrorState
          title="Failed to load storefront data"
          message={error?.message || "Could not retrieve storefront overview"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const {
    status,
    defaultUrl,
    customDomain,
    activeTheme,
    totalThemes,
    totalPublishedPages,
    totalDraftPages,
    recentActivities,
  } = overview;

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Storefront URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStoreUrl = customDomain ? `https://${customDomain}` : defaultUrl;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Storefront Overview"
        description="স্টোরফ্রন্ট প্রকাশনা, লাইভ প্রিভিউ, থিম কাস্টমাইজেশন ও ডোমেইন ব্যবস্থাপনা"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Storefront", href: "/dashboard/store" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyUrl(activeStoreUrl)}
              className="gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied" : "Copy Store Link"}</span>
            </Button>

            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/dashboard/store/themes/customize">
                <Palette className="h-4 w-4 text-primary" />
                <span>Customize Theme</span>
              </Link>
            </Button>

            <Button asChild size="sm" className="gap-1.5">
              <Link href="/dashboard/store/themes">
                <Layers className="h-4 w-4" />
                <span>Theme Library</span>
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Storefront Demo Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your storefront theme customizations, domains, pages, and recent activity logs back to the default demo baseline.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => resetDemoMutation.mutate()}>
                    Reset Demo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm text-foreground">
                Live Storefront Link:
              </h3>
              <a
                href={activeStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>{activeStoreUrl}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                Default Subdomain Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              All product catalog updates, collections, and pricing changes reflect on this storefront.
            </p>
          </div>
        </div>

        {/* Storefront Publishing Status Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Status:
          </span>
          <Select
            value={status}
            onValueChange={(val) => updateStatusMutation.mutate(val as StorefrontStatus)}
            disabled={updateStatusMutation.isPending}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="text-xs">
                🟢 Active (অনলাইন)
              </SelectItem>
              <SelectItem value="draft" className="text-xs">
                🟡 Draft Mode
              </SelectItem>
              <SelectItem value="maintenance" className="text-xs">
                🟠 Maintenance
              </SelectItem>
              <SelectItem value="offline" className="text-xs">
                🔴 Offline
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4 Metric / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Storefront Status */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Storefront State
            </CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold capitalize flex items-center gap-2">
              <span>{status}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Publicly accessible to shoppers
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Active Theme */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Current Theme
            </CardTitle>
            <Palette className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {activeTheme.name}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {totalThemes} themes in library
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: CMS & Policies */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Published CMS Pages
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {totalPublishedPages}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {totalDraftPages} draft page{totalDraftPages === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Custom Domain */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Domain Connection
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold truncate">
              {customDomain ? "Demo Pending" : "Default Only"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {customDomain ? customDomain : "No custom domain configured"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Two Columns: Active Theme Card & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Theme Details Card */}
        <Card className="lg:col-span-2 border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Active Storefront Theme</CardTitle>
                <CardDescription>
                  আপনার গ্রাহকরা স্টোরফ্রন্টে এই থিমটির ডিজাইন দেখতে পান।
                </CardDescription>
              </div>
              <Badge variant="secondary" className="font-medium text-xs">
                Active Theme
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-border bg-muted/20">
              {/* Theme Thumbnail Preview */}
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-border shadow-xs bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeTheme.thumbnail}
                  alt={activeTheme.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/75 text-white">
                  v{activeTheme.version}
                </span>
              </div>

              {/* Theme Specs & Description */}
              <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-foreground">
                      {activeTheme.name}
                    </h4>
                    <span className="text-xs text-muted-foreground font-bengali">
                      ({activeTheme.nameBn})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {activeTheme.description}
                  </p>
                </div>

                {/* Color Palette Preview Swatches */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Active Color Swatches:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-md shadow-xs border border-black/10"
                      style={{ backgroundColor: activeTheme.currentSettings.colors.primary }}
                      title={`Primary: ${activeTheme.currentSettings.colors.primary}`}
                    />
                    <div
                      className="h-6 w-6 rounded-md shadow-xs border border-black/10"
                      style={{ backgroundColor: activeTheme.currentSettings.colors.secondary }}
                      title={`Secondary: ${activeTheme.currentSettings.colors.secondary}`}
                    />
                    <div
                      className="h-6 w-6 rounded-md shadow-xs border border-black/10"
                      style={{ backgroundColor: activeTheme.currentSettings.colors.accent }}
                      title={`Accent: ${activeTheme.currentSettings.colors.accent}`}
                    />
                    <div
                      className="h-6 w-6 rounded-md shadow-xs border border-black/10"
                      style={{ backgroundColor: activeTheme.currentSettings.colors.footerBg }}
                      title={`Footer: ${activeTheme.currentSettings.colors.footerBg}`}
                    />
                    <span className="text-xs text-muted-foreground ml-2">
                      Font: {activeTheme.currentSettings.typography.headingFont}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" className="gap-1.5">
                    <Link href="/dashboard/store/themes/customize">
                      <Palette className="h-4 w-4" />
                      <span>Customize Theme Styles</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/store/themes">
                      <span>Change Theme ({totalThemes} available)</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeTheme.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] bg-secondary text-secondary-foreground font-medium"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Customization Shortcuts */}
        <Card className="border-border shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">Storefront Shortcuts</CardTitle>
            <CardDescription>
              স্টোর ম্যানেজমেন্টের দ্রুত লিংক
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/dashboard/store/themes/customize"
              className="p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold group-hover:text-primary transition-colors">
                    Theme Customizer
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    রং, ফন্ট এবং হোমপেজ সেকশন পরিবর্তন
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/store/pages"
              className="p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold group-hover:text-primary transition-colors">
                    Pages & Legal Policies
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    প্রাইভেসি, রিটার্ন ও ডেলিভারি নীতি
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/store/domains"
              className="p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold group-hover:text-primary transition-colors">
                    Domain Configuration
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    কাস্টম ডোমেইন ও ডিএনএস সেটিংস
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/settings"
              className="p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold group-hover:text-primary transition-colors">
                    Store Settings
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    ঠিকানা, মোবাইল ও মুদ্রা সেটিংস
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Domain Summary & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Configuration Summary */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Domain Configuration Summary</CardTitle>
              <CardDescription>
                ডোমেইন সংযোগ ও সিকিউরিটি সারসংক্ষেপ
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/store/domains">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Default Subdomain */}
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Default Platform Subdomain:
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  green-harvest.cartx.com.bd
                </span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                Connected & Active
              </Badge>
            </div>

            {/* Custom Domain */}
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Custom Domain:
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {customDomain || "None configured"}
                </span>
              </div>
              {customDomain ? (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Demo Mode — Verification Pending
                </Badge>
              ) : (
                <Badge variant="outline">Not Configured</Badge>
              )}
            </div>

            {/* SSL Notice */}
            <div className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-start gap-2.5 text-xs text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>SSL & Security Notice:</strong> Platform subdomains are covered by CartX Managed Edge SSL. Custom domain SSL issuance is executed server-side by Let&apos;s Encrypt upon authoritative DNS resolution.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Storefront Activity Trail */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Recent Storefront Changes</CardTitle>
            <CardDescription>
              সাম্প্রতিক থিম, পেইজ ও ডোমেইন পরিবর্তনসমূহ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No recent activity recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="p-1.5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">
                        {act.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span>{act.actor}</span>
                        <span>•</span>
                        <span>{new Date(act.timestamp).toLocaleString("en-BD")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
