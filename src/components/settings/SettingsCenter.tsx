"use client";

import React, { useState } from "react";
import {
  Store,
  User,
  Palette,
  Shield,
  Bell,
  Globe,
  Database,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoreSettingsView } from "@/features/store-settings/components/StoreSettingsView";
import { ProfileSettings } from "./ProfileSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { SecuritySettings } from "./SecuritySettings";
import { NotificationSettings } from "./NotificationSettings";
import { RegionalSettings } from "./RegionalSettings";
import { DataPrivacySettings } from "./DataPrivacySettings";
import { useCurrentStore } from "@/features/store-settings/hooks";

export function SettingsCenter() {
  const [activeTab, setActiveTab] = useState("general");
  const { data: store } = useCurrentStore();

  const NAV_ITEMS = [
    { id: "general", label: "Store Settings", icon: Store },
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "regional", label: "Regional", icon: Globe },
    { id: "data", label: "Data & Privacy", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <PageHeader
        title="Settings Center"
        description="Configure store parameters, administrator profile, glass theme aesthetics, and regional preferences."
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          store?.slug ? (
            <Button variant="outline" size="sm" asChild className="gap-1.5 cursor-pointer">
              <a
                href={`https://${store.slug}.cartx.com.bd`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Storefront</span>
              </a>
            </Button>
          ) : undefined
        }
      />

      {/* Structured Responsive Settings Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Horizontal Navigation List */}
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="inline-flex h-auto p-1.5 rounded-xl border border-border/70 bg-card/75 dark:bg-card/65 backdrop-blur-md gap-1 min-w-full sm:min-w-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab 1: General / Store Settings (Preserves full StoreSettingsView) */}
        <TabsContent value="general" className="mt-0 focus-visible:outline-none">
          <StoreSettingsView embedded={true} />
        </TabsContent>

        {/* Tab 2: Profile Settings */}
        <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
          <ProfileSettings />
        </TabsContent>

        {/* Tab 3: Appearance Settings */}
        <TabsContent value="appearance" className="mt-0 focus-visible:outline-none">
          <AppearanceSettings />
        </TabsContent>

        {/* Tab 4: Security Settings */}
        <TabsContent value="security" className="mt-0 focus-visible:outline-none">
          <SecuritySettings />
        </TabsContent>

        {/* Tab 5: Notification Preferences */}
        <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
          <NotificationSettings />
        </TabsContent>

        {/* Tab 6: Regional Preferences */}
        <TabsContent value="regional" className="mt-0 focus-visible:outline-none">
          <RegionalSettings />
        </TabsContent>

        {/* Tab 7: Data & Privacy */}
        <TabsContent value="data" className="mt-0 focus-visible:outline-none">
          <DataPrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsCenter;
