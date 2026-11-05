"use client";

import React, { useState } from "react";
import { Globe, Calendar, DollarSign, Clock, Hash, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const REGIONAL_STORAGE_KEY = "cartx_regional_preferences_v1";

export interface RegionalPreferences {
  currency: string;
  language: string;
  dateFormat: string;
  timezone: string;
  numberFormat: string;
}

const DEFAULT_REGIONAL: RegionalPreferences = {
  currency: "BDT",
  language: "en-BD",
  dateFormat: "DD/MM/YYYY",
  timezone: "Asia/Dhaka",
  numberFormat: "lakh_crore",
};

export function RegionalSettings() {
  const [prefs, setPrefs] = useState<RegionalPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_REGIONAL;
    try {
      const stored = window.localStorage.getItem(REGIONAL_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_REGIONAL, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_REGIONAL;
  });
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field: keyof RegionalPreferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem(REGIONAL_STORAGE_KEY, JSON.stringify(prefs));
      setIsDirty(false);
      toast.success("Regional preferences saved", {
        description: "Currency, locale, and timezone settings updated successfully.",
      });
    } catch {
      toast.error("Failed to save regional preferences");
    }
  };

  const formattedAmountPreview =
    prefs.numberFormat === "lakh_crore"
      ? "৳14,50,000.00"
      : "$1,450,000.00";

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Regional & Localization Preferences
              </CardTitle>
              <CardDescription className="text-xs">
                Configure currency, time zone, date formatting, and language conventions.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Default: Bangladesh (bn-BD)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Store Currency
              </Label>
              <Select
                value={prefs.currency}
                onValueChange={(val) => updateField("currency", val)}
              >
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="BDT">BDT (৳) — Bangladeshi Taka</SelectItem>
                  <SelectItem value="USD">USD ($) — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR (€) — Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Dashboard Language
              </Label>
              <Select
                value={prefs.language}
                onValueChange={(val) => updateField("language", val)}
              >
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="en-BD">English (Bangladesh - en-BD)</SelectItem>
                  <SelectItem value="bn-BD">বাংলা (Bengali - bn-BD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Date Representation Format
              </Label>
              <Select
                value={prefs.dateFormat}
                onValueChange={(val) => updateField("dateFormat", val)}
              >
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (e.g. 04/11/2026 - BD Standard)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-11-04 - ISO 8601)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/04/2026 - US Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Store Operations Timezone
              </Label>
              <Select
                value={prefs.timezone}
                onValueChange={(val) => updateField("timezone", val)}
              >
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                  <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number Format */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                Numeric Representation Convention
              </Label>
              <Select
                value={prefs.numberFormat}
                onValueChange={(val) => updateField("numberFormat", val)}
              >
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select numeric grouping" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="lakh_crore">
                    South Asian Lakh/Crore Format (e.g. 14,50,000.00 — Recommended for Bangladesh)
                  </SelectItem>
                  <SelectItem value="international">
                    International Standard Format (e.g. 1,450,000.00)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 space-y-2 mt-4">
            <h5 className="text-xs font-semibold text-foreground">Live Telemetry Preview</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[10px] block">Sample Currency Output</span>
                <span className="font-mono font-semibold text-foreground">{formattedAmountPreview}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px] block">Current Timezone</span>
                <span className="font-mono font-semibold text-foreground">{prefs.timezone}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px] block">Date Convention</span>
                <span className="font-mono font-semibold text-foreground">{prefs.dateFormat}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Action */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card/80 backdrop-blur-md">
        {isDirty ? (
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Unsaved regional changes</span>
        ) : (
          <span className="text-xs text-muted-foreground">Using active store localization defaults</span>
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty}
          className="gap-1.5 cursor-pointer shadow-xs"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Regional Preferences</span>
        </Button>
      </div>
    </div>
  );
}

export default RegionalSettings;
