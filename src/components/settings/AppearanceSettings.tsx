"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check, RotateCcw, Palette, Layout, Scaling } from "lucide-react";
import { useAppearance, type AccentColor } from "@/components/theme/AppearanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const {
    accentColor,
    sidebarStyle,
    density,
    setAccentColor,
    setSidebarStyle,
    setDensity,
    resetAppearance,
  } = useAppearance();

  const handleReset = () => {
    setTheme("system");
    resetAppearance();
    toast.success("Appearance reset", {
      description: "Default visual theme and styling preferences restored.",
    });
  };

  const THEMES = [
    {
      id: "light",
      label: "Light Mode",
      desc: "Clean, high-contrast daytime interface",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Dark Mode",
      desc: "Deep OLED dark glass aesthetics",
      icon: Moon,
    },
    {
      id: "system",
      label: "System Preference",
      desc: "Automatically syncs with OS dark/light mode",
      icon: Laptop,
    },
  ];

  const ACCENTS: Array<{ id: AccentColor; label: string; hex: string }> = [
    { id: "blue", label: "CartX Blue", hex: "#2563eb" },
    { id: "emerald", label: "Emerald Green", hex: "#059669" },
    { id: "violet", label: "Royal Violet", hex: "#7c3aed" },
    { id: "amber", label: "Amber Sunset", hex: "#d97706" },
    { id: "rose", label: "Rose Crimson", hex: "#e11d48" },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Mode Card */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Theme Mode</CardTitle>
              <CardDescription className="text-xs">
                Select your preferred color theme or match your device operating system.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono uppercase">
              Current: {theme || "system"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEMES.map((item) => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : "border-border/70 bg-background/50 hover:bg-muted/60 hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="h-8 w-8 rounded-lg bg-card border border-border/80 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && (
                      <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">{item.label}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Accent Color Palette */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Accent Color
              </CardTitle>
              <CardDescription className="text-xs">
                Personalize primary action buttons, active navigation indicators, and focus rings.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ACCENTS.map((accent) => {
              const isSelected = accentColor === accent.id;
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => setAccentColor(accent.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : "border-border/70 bg-background/50 hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="h-5 w-5 rounded-full shadow-xs"
                      style={{ backgroundColor: accent.hex }}
                    />
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <span className="text-xs font-medium text-foreground">{accent.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar & UI Density Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Sidebar Appearance */}
        <Card className="border-border/70 bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layout className="h-4 w-4 text-primary" />
              Sidebar Appearance
            </CardTitle>
            <CardDescription className="text-xs">
              Configure navigation panel translucency and backdrop effects.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSidebarStyle("glass")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  sidebarStyle === "glass"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Glassmorphism</span>
                  {sidebarStyle === "glass" && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Translucent blur with subtle frosted glass</p>
              </button>

              <button
                type="button"
                onClick={() => setSidebarStyle("solid")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  sidebarStyle === "solid"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Solid Card</span>
                  {sidebarStyle === "solid" && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Opaque surface for high-contrast viewing</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* UI Density */}
        <Card className="border-border/70 bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scaling className="h-4 w-4 text-primary" />
              UI Density
            </CardTitle>
            <CardDescription className="text-xs">
              Adjust spacing scale for tables, forms, and cards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDensity("comfortable")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  density === "comfortable"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Comfortable</span>
                  {density === "comfortable" && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Standard padding and spacious touch targets</p>
              </button>

              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  density === "compact"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Compact</span>
                  {density === "compact" && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Information-dense layout for large datasets</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset to Defaults Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-card/80 backdrop-blur-md">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Restore Visual Defaults</h4>
          <p className="text-[11px] text-muted-foreground">Reset theme mode, accent colors, and density to original presets.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 cursor-pointer shrink-0">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </Button>
      </div>
    </div>
  );
}

export default AppearanceSettings;
