"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Save,
  ArrowUp,
  ArrowDown,
  Info,
  ArrowLeft,
  Layers,
  Compass,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMobileAppConfigQuery, useUpdateContentMutation } from "../hooks";
import type { HomepageSection, NavigationItem, MobileAppConfig } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function ContentView() {
  const { data: config, isLoading } = useMobileAppConfigQuery();

  if (isLoading || !config) {
    return <LoadingSkeleton rows={6} />;
  }

  return <ContentViewForm key={config.lastSavedAt} config={config} />;
}

function ContentViewForm({ config }: { config: MobileAppConfig }) {
  const updateMutation = useUpdateContentMutation();

  const [sections, setSections] = useState<HomepageSection[]>(() =>
    [...config.homepageLayout].sort((a, b) => a.order - b.order)
  );
  const [navItems, setNavItems] = useState<NavigationItem[]>(() => [
    ...config.navigationItems,
  ]);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign orders
    const reordered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  const toggleSection = (id: string, enabled: boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    );
  };

  const updateSectionTitle = (id: string, title: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  };

  const toggleNavItem = (id: string, enabled: boolean) => {
    setNavItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
  };

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      homepageLayout: sections,
      navigationItems: navItems,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Content & Navigation"
        description="Arrange the homepage dynamic layout modules and customize bottom tab bar routes."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mobile App", href: "/dashboard/mobile-app" },
          { label: "Content & Navigation" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/mobile-app">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Hub
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {updateMutation.isPending ? "Saving..." : "Save Layout"}
            </Button>
          </div>
        }
      />

      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Dynamic Content Engine: </span>
          Sections configured below populate JSON schemas fetched by the mobile client app on startup. Enabled sections immediately appear in the responsive phone preview emulator.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Homepage Section Ordering */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Homepage Block Order
              </CardTitle>
              <CardDescription className="text-xs">
                Reorder or toggle sections to personalize customer landing feed on iOS and Android
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    section.enabled
                      ? "border-border bg-card shadow-xs"
                      : "border-dashed border-border/60 bg-muted/20 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[11px] font-bold text-muted-foreground shrink-0">
                      {index + 1}
                    </span>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {section.type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-xs font-semibold text-foreground truncate">
                          {section.title}
                        </span>
                      </div>
                      <div className="max-w-xs">
                        <Label htmlFor={`title-${section.id}`} className="sr-only">Title</Label>
                        <Input
                          id={`title-${section.id}`}
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          className="h-7 text-xs"
                          placeholder="Section Display Heading"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === 0}
                        onClick={() => moveSection(index, "up")}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === sections.length - 1}
                        onClick={() => moveSection(index, "down")}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="border-l pl-3 ml-1 flex items-center gap-2">
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={(val) => toggleSection(section.id, val)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Bottom Navigation Bar Tabs */}
        <div className="space-y-4">
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Bottom Navigation Bar
              </CardTitle>
              <CardDescription className="text-xs">
                Minimum 2 tabs required; up to 5 tabs supported
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <div className="font-semibold text-foreground">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{item.route}</div>
                    </div>
                  </div>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(val) => toggleNavItem(item.id, val)}
                  />
                </div>
              ))}

              <div className="pt-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Content & Nav
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
