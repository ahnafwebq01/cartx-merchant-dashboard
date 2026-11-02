"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Palette,
  Eye,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useThemesQuery,
  useActivateThemeMutation,
  useResetThemeCustomizationMutation,
} from "../hooks";
import type { StoreTheme } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";

export function ThemeLibraryView() {
  const { data: themes, isLoading, isError, error, refetch } = useThemesQuery();
  const activateThemeMutation = useActivateThemeMutation();
  const resetThemeMutation = useResetThemeCustomizationMutation();

  const [previewTheme, setPreviewTheme] = useState<StoreTheme | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Theme Library"
          description="স্টোরফ্রন্টের জন্য মানানসই থিম নির্বাচন ও কাস্টমাইজেশন"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Themes", href: "/dashboard/store/themes" },
          ]}
        />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (isError || !themes) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Theme Library"
          description="স্টোরফ্রন্টের জন্য মানানসই থিম নির্বাচন ও কাস্টমাইজেশন"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Themes", href: "/dashboard/store/themes" },
          ]}
        />
        <ErrorState
          title="Failed to load themes"
          message={error?.message || "Could not retrieve theme catalog"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const activeTheme = themes.find((t) => t.isActive) || themes[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Theme Library"
        description="স্টোরফ্রন্টের জন্য মানানসই থিম নির্বাচন ও কাস্টমাইজেশন"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Storefront", href: "/dashboard/store" },
          { label: "Themes", href: "/dashboard/store/themes" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/dashboard/store/themes/customize">
                <Palette className="h-4 w-4" />
                <span>Customize Active Theme</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Active Theme Highlight Banner */}
      <div className="p-4 sm:p-6 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-border shadow-xs bg-muted shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeTheme.thumbnail}
                alt={activeTheme.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active Theme
                </Badge>
                <h3 className="font-bold text-base text-foreground">
                  {activeTheme.name}
                </h3>
                <span className="text-xs text-muted-foreground font-bengali">
                  ({activeTheme.nameBn})
                </span>
                <span className="text-xs text-muted-foreground">
                  • Version {activeTheme.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                {activeTheme.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Button asChild size="sm" className="gap-1.5 w-full sm:w-auto">
              <Link href="/dashboard/store/themes/customize">
                <Palette className="h-4 w-4" />
                <span>Customize Theme</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewTheme(activeTheme)}
              className="gap-1.5"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Theme Catalog Gallery Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Available Themes</h3>
            <p className="text-xs text-muted-foreground">
              আপনার ব্যবসার ধরনের সাথে মানানসই যেকোনো থিম এক ক্লিকে সক্রিয় করুন।
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {themes.length} themes available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme) => {
            const isCurrentlyActive = theme.isActive;

            return (
              <Card
                key={theme.id}
                className={`border shadow-xs flex flex-col justify-between transition-all ${
                  isCurrentlyActive
                    ? "border-primary ring-2 ring-primary/20 bg-card"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-4/3 w-full bg-muted overflow-hidden rounded-t-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={theme.thumbnail}
                      alt={theme.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold bg-black/75 text-white backdrop-blur-xs"
                      >
                        {theme.tag}
                      </Badge>
                    </div>

                    {isCurrentlyActive && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-600 text-white text-[10px]">
                          ✓ Active
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between gap-1">
                      <CardTitle className="text-sm font-bold truncate">
                        {theme.name}
                      </CardTitle>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        v{theme.version}
                      </span>
                    </div>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 space-y-3">
                    {/* Features List */}
                    <div className="flex flex-wrap gap-1">
                      {theme.features.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <div
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.currentSettings.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.currentSettings.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.currentSettings.colors.accent }}
                        title="Accent"
                      />
                      <span className="text-[11px] text-muted-foreground ml-1 truncate">
                        {theme.currentSettings.typography.headingFont}
                      </span>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-4 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewTheme(theme)}
                    className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Preview
                  </Button>

                  {isCurrentlyActive ? (
                    <Button asChild size="sm" className="text-xs h-8">
                      <Link href="/dashboard/store/themes/customize">
                        <Palette className="h-3.5 w-3.5 mr-1" />
                        Customize
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => activateThemeMutation.mutate(theme.id)}
                      disabled={activateThemeMutation.isPending}
                    >
                      <span>Activate</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Theme Preview Modal Dialog */}
      <Dialog open={Boolean(previewTheme)} onOpenChange={() => setPreviewTheme(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{previewTheme?.name}</span>
              <span className="text-xs text-muted-foreground font-bengali">
                ({previewTheme?.nameBn})
              </span>
              <Badge variant="secondary" className="text-xs">
                {previewTheme?.tag}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {previewTheme?.description}
            </DialogDescription>
          </DialogHeader>

          {previewTheme && (
            <div className="space-y-4 pt-2">
              <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-border shadow-xs bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewTheme.thumbnail}
                  alt={previewTheme.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-foreground">Built-in Features:</span>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                    {previewTheme.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-foreground">Typography & Styles:</span>
                  <p className="text-muted-foreground">
                    Heading: {previewTheme.currentSettings.typography.headingFont}
                    <br />
                    Body: {previewTheme.currentSettings.typography.bodyFont}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-muted-foreground">Brand Palette:</span>
                    <div
                      className="h-5 w-5 rounded-md border"
                      style={{ backgroundColor: previewTheme.currentSettings.colors.primary }}
                    />
                    <div
                      className="h-5 w-5 rounded-md border"
                      style={{ backgroundColor: previewTheme.currentSettings.colors.secondary }}
                    />
                    <div
                      className="h-5 w-5 rounded-md border"
                      style={{ backgroundColor: previewTheme.currentSettings.colors.accent }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset to Defaults</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Theme Settings?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all colors, typography, and section customizations for {previewTheme.name} back to factory defaults.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          resetThemeMutation.mutate(previewTheme.id);
                          setPreviewTheme(null);
                        }}
                      >
                        Reset Settings
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewTheme(null)}>
                    Close
                  </Button>
                  {!previewTheme.isActive && (
                    <Button
                      size="sm"
                      onClick={() => {
                        activateThemeMutation.mutate(previewTheme.id);
                        setPreviewTheme(null);
                      }}
                    >
                      Activate Theme
                    </Button>
                  )}
                  {previewTheme.isActive && (
                    <Button asChild size="sm">
                      <Link href="/dashboard/store/themes/customize">
                        Customize Theme
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
