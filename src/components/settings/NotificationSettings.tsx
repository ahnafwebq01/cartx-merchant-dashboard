"use client";

import React, { useState } from "react";
import { Bell, Smartphone, ShoppingCart, CreditCard, Boxes, Tag, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const NOTIFICATIONS_STORAGE_KEY = "cartx_notification_preferences_v1";

export interface NotificationPreferences {
  emailOrders: boolean;
  emailPayments: boolean;
  emailInventory: boolean;
  emailMarketing: boolean;
  pushOrders: boolean;
  pushPayments: boolean;
  pushInventory: boolean;
  smsUrgent: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailOrders: true,
  emailPayments: true,
  emailInventory: true,
  emailMarketing: false,
  pushOrders: true,
  pushPayments: true,
  pushInventory: true,
  smsUrgent: true,
};

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const stored = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_PREFERENCES;
  });
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field: keyof NotificationPreferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(prefs));
      setIsDirty(false);
      toast.success("Notification preferences saved", {
        description: "Your notification settings have been updated.",
      });
    } catch {
      toast.error("Failed to save notification preferences");
    }
  };

  const handleReset = () => {
    setPrefs(DEFAULT_PREFERENCES);
    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    } catch {
      // ignore
    }
    setIsDirty(false);
    toast.info("Reset to default notification preferences");
  };

  return (
    <div className="space-y-6">
      {/* Category Toggles */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alert Subscriptions
          </CardTitle>
          <CardDescription className="text-xs">
            Choose which store events trigger automated merchant alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y divide-border/60 space-y-3.5">
            {/* Orders */}
            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                  Order Confirmations & Status Updates
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Receive instant alerts when checkouts are placed or customer returns are requested.
                </p>
              </div>
              <Switch
                checked={prefs.emailOrders}
                onCheckedChange={(checked) => updateField("emailOrders", checked)}
              />
            </div>

            {/* Payments */}
            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  bKash, Nagad & Card Payment Telemetry
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Get notified when MFS digital payments or cards settle into merchant escrow.
                </p>
              </div>
              <Switch
                checked={prefs.emailPayments}
                onCheckedChange={(checked) => updateField("emailPayments", checked)}
              />
            </div>

            {/* Inventory */}
            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-primary" />
                  Low Stock & Inventory Reorder Alerts
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Triggers when SKU count drops below the safety reorder threshold (≤ 5 units).
                </p>
              </div>
              <Switch
                checked={prefs.emailInventory}
                onCheckedChange={(checked) => updateField("emailInventory", checked)}
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  Campaign Performance & Marketing Digests
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Weekly performance reports on coupon redemption, flash sales, and customer cohorts.
                </p>
              </div>
              <Switch
                checked={prefs.emailMarketing}
                onCheckedChange={(checked) => updateField("emailMarketing", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Channels */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            Communication Channels
          </CardTitle>
          <CardDescription className="text-xs">
            Configure delivery methods for merchant alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="divide-y divide-border/60">
            <div className="flex items-center justify-between py-2.5">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  In-App Notification Center
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Display badges and popups inside the topbar notification bell.
                </p>
              </div>
              <Switch
                checked={prefs.pushOrders}
                onCheckedChange={(checked) => updateField("pushOrders", checked)}
              />
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                  SMS Dispatch for Critical Events (+880 Bangladesh)
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Send urgent SMS via local telco gateways for high-priority stockouts or large orders.
                </p>
              </div>
              <Switch
                checked={prefs.smsUrgent}
                onCheckedChange={(checked) => updateField("smsUrgent", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save & Reset Actions */}
      <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-card/80 backdrop-blur-md">
        <Button variant="ghost" size="sm" onClick={handleReset} className="cursor-pointer text-xs justify-center">
          Reset to Defaults
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty}
          className="gap-1.5 cursor-pointer shadow-xs justify-center"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Notification Preferences</span>
        </Button>
      </div>
    </div>
  );
}

export default NotificationSettings;
