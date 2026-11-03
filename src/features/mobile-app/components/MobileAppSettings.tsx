"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  ArrowLeft,
  Bell,
  Smartphone,
  Apple,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  mobileAppSettingsSchema,
  type MobileAppSettingsFormValues,
} from "../schemas";
import { useMobileAppConfigQuery, useUpdateSettingsMutation } from "../hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function MobileAppSettings() {
  const { data: config, isLoading } = useMobileAppConfigQuery();
  const updateMutation = useUpdateSettingsMutation();

  const form = useForm<MobileAppSettingsFormValues>({
    resolver: zodResolver(mobileAppSettingsSchema),
    defaultValues: {
      pushNotificationPrefs: {
        orderUpdates: true,
        promotions: true,
        shipping: true,
        general: false,
      },
      platformSettings: {
        android: {
          packageName: "com.cartx.greenharvest",
          versionName: "1.0.0",
        },
        ios: {
          bundleId: "bd.com.cartx.greenharvest",
          versionString: "1.0.0",
        },
      },
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        pushNotificationPrefs: config.pushNotificationPrefs,
        platformSettings: config.platformSettings,
      });
    }
  }, [config, form]);

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const onSubmit = async (values: MobileAppSettingsFormValues) => {
    await updateMutation.mutateAsync(values);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Settings & Push Notifications"
        description="Manage customer notification channels and native mobile store package identifiers"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mobile App", href: "/dashboard/mobile-app" },
          { label: "Settings" },
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
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        }
      />

      {/* Demo Disclosures Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Demo Mode Operational Boundaries</p>
          <p className="text-muted-foreground dark:text-amber-300">
            • <strong>No Real Push Alerts:</strong> Push notification toggles are simulated preferences. No Firebase Cloud Messaging (FCM) or Apple Push Notification service (APNs) keys are required or dispatched.
          </p>
          <p className="text-muted-foreground dark:text-amber-300">
            • <strong>No Real Store Publishing:</strong> Package identifiers (APK/IPA) do not compile or upload to Google Play Console or Apple App Store Connect.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Push Notification Preferences */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-base font-semibold">Push Notification Channels</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Determine which automated transactional and promotional alerts your customer mobile apps receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="pushOrder" className="text-xs font-semibold">
                  Order Status Updates
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Send immediate notifications when an order is confirmed, packed, or out for delivery.
                </p>
              </div>
              <Switch
                id="pushOrder"
                checked={form.watch("pushNotificationPrefs.orderUpdates")}
                onCheckedChange={(val) => form.setValue("pushNotificationPrefs.orderUpdates", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="pushShipping" className="text-xs font-semibold">
                  Courier Dispatch & Delivery Alerts
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Alert customers with Steadfast, Pathao, or RedX consignment tracking milestones.
                </p>
              </div>
              <Switch
                id="pushShipping"
                checked={form.watch("pushNotificationPrefs.shipping")}
                onCheckedChange={(val) => form.setValue("pushNotificationPrefs.shipping", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="pushPromo" className="text-xs font-semibold">
                  Promotional Offers & Flash Sales
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Broadcast seasonal discount campaigns, Eid vouchers, and limited-time price drops.
                </p>
              </div>
              <Switch
                id="pushPromo"
                checked={form.watch("pushNotificationPrefs.promotions")}
                onCheckedChange={(val) => form.setValue("pushNotificationPrefs.promotions", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="pushGeneral" className="text-xs font-semibold">
                  Store News & General Announcements
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Holiday notices, shop address changes, and customer support announcements.
                </p>
              </div>
              <Switch
                id="pushGeneral"
                checked={form.watch("pushNotificationPrefs.general")}
                onCheckedChange={(val) => form.setValue("pushNotificationPrefs.general", val)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Platform Package Identifiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-xl shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Android Build Package</CardTitle>
              </div>
              <CardDescription className="text-xs">Google Play Store bundle metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="androidPackage" className="text-xs font-medium">
                  Application ID (Package Name)
                </Label>
                <Input
                  id="androidPackage"
                  placeholder="com.cartx.yourstore"
                  {...form.register("platformSettings.android.packageName")}
                  className="font-mono text-xs"
                />
                {form.formState.errors.platformSettings?.android?.packageName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.platformSettings.android.packageName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="androidVersion" className="text-xs font-medium">
                  Target Release Version
                </Label>
                <Input
                  id="androidVersion"
                  placeholder="1.0.0"
                  {...form.register("platformSettings.android.versionName")}
                  className="font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Apple iOS Bundle</CardTitle>
              </div>
              <CardDescription className="text-xs">Apple App Store Connect bundle ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="iosBundle" className="text-xs font-medium">
                  Bundle Identifier
                </Label>
                <Input
                  id="iosBundle"
                  placeholder="bd.com.cartx.yourstore"
                  {...form.register("platformSettings.ios.bundleId")}
                  className="font-mono text-xs"
                />
                {form.formState.errors.platformSettings?.ios?.bundleId && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.platformSettings.ios.bundleId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iosVersion" className="text-xs font-medium">
                  Marketing Version String
                </Label>
                <Input
                  id="iosVersion"
                  placeholder="1.0.0"
                  {...form.register("platformSettings.ios.versionString")}
                  className="font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Saving..." : "Save App Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

