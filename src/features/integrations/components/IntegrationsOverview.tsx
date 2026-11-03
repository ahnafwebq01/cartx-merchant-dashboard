"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plug,
  Webhook,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Info,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  useIntegrationsQuery,
  useIntegrationStatsQuery,
  useToggleIntegrationMutation,
} from "../hooks";
import { ConfigureIntegrationDialog } from "./ConfigureIntegrationDialog";
import type { Integration } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { mockIntegrationsService } from "../services/mockIntegrations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function IntegrationsOverview() {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [configTarget, setConfigTarget] = useState<Integration | null>(null);

  const { data: integrations, isLoading: integrationsLoading } = useIntegrationsQuery({
    category: categoryFilter,
    search,
  });
  const { data: stats, isLoading: statsLoading } = useIntegrationStatsQuery();
  const toggleMutation = useToggleIntegrationMutation();

  if (integrationsLoading || statsLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const handleReset = () => {
    mockIntegrationsService.resetToDefaults();
    queryClient.invalidateQueries({ queryKey: ["integrations"] });
    toast.success("Integrations restored to demo defaults (Demo Mode)");
  };

  const categories: { value: string; label: string }[] = [
    { value: "all", label: "All Integrations" },
    { value: "payments", label: "Payments" },
    { value: "shipping", label: "Shipping" },
    { value: "marketing", label: "Marketing" },
    { value: "analytics", label: "Analytics" },
    { value: "notifications", label: "Notifications" },
    { value: "storefront", label: "Storefront" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations & Gateways"
        description="Connect third-party Bangladesh payment gateways, domestic courier networks, and analytics telemetry"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Integrations" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/integrations/webhooks">
                <Webhook className="h-4 w-4" />
                Manage Webhooks
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Defaults
            </Button>
          </div>
        }
      />

      {/* Demo Disclosures Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Simulated Third-Party Integrations Environment</p>
          <p className="text-muted-foreground dark:text-sky-300">
            CartX Merchant Dashboard operates in zero-trust client Demo Mode. Integrations with bKash, Nagad, SSLCommerz, Steadfast, and Pathao demonstrate credential configuration and status states. No external API keys are saved in client storage or dispatched over third-party networks.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Catalog
            </CardTitle>
            <Plug className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalIntegrations ?? 13}</div>
            <p className="text-xs text-muted-foreground mt-1">Available service adapters</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Connected Services
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.connectedCount ?? 7} Active</div>
            <p className="text-xs text-muted-foreground mt-1">7 demo gateways operational</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Disconnected
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.disconnectedCount ?? 6} Ready</div>
            <p className="text-xs text-muted-foreground mt-1">Marketing & notification bridges</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Security Boundary
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Zero-Trust Vault
            </div>
            <p className="text-xs text-muted-foreground mt-1">No credentials in browser bundle</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations by name or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={categoryFilter === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat.value)}
              className="text-xs h-8 capitalize"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      {(!integrations || integrations.length === 0) ? (
        <EmptyState
          title="No Integrations Found"
          description="Try broadening your category filter or search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <Card
              key={item.id}
              className={`rounded-xl shadow-xs transition-all flex flex-col justify-between ${
                item.isEnabled
                  ? "border-primary/40 bg-card hover:border-primary"
                  : "border-border/70 bg-card/60 hover:border-border"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0 p-1 rounded-lg bg-muted/40">
                      {item.iconEmoji || "🔌"}
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold truncate leading-tight">
                        {item.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[9px] uppercase font-mono mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <Switch
                    checked={item.isEnabled}
                    onCheckedChange={() => toggleMutation.mutate(item.id)}
                    aria-label={`Toggle ${item.name}`}
                  />
                </div>
                <CardDescription className="text-xs line-clamp-2 mt-2 leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium capitalize ${
                      item.isEnabled
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200"
                    }`}
                  >
                    {item.isEnabled ? "Demo Connected" : "Disconnected"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfigTarget(item)}
                    className="h-7 text-xs gap-1 text-primary hover:text-primary"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Configure Modal */}
      <ConfigureIntegrationDialog
        open={Boolean(configTarget)}
        onOpenChange={(open) => !open && setConfigTarget(null)}
        integration={configTarget}
      />
    </div>
  );
}

