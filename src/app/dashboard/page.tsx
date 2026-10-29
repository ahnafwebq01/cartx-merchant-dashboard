"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  Layers,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSetupChecklist } from "@/features/onboarding/components/DashboardSetupChecklist";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Merchant Overview"
        description="Welcome to your CartX merchant administration panel."
        breadcrumbs={[{ label: "Overview" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/settings">
                <Store className="h-4 w-4 mr-2" />
                Store Settings
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/onboarding">
                Setup Store
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        }
      />

      {/* Architecture Foundation Status Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Architecture Phase</CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Phase 2 Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              Onboarding wizard & store settings operational
            </p>
            <div className="mt-3">
              <Badge variant="success" className="text-[10px]">
                Phase 2 Complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tenant Context</CardTitle>
            <Store className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">CartX Store</div>
            <p className="text-xs text-muted-foreground mt-1">
              Multi-tenant boundary with Express API prepared
            </p>
            <div className="mt-3">
              <Badge variant="outline" className="text-[10px] font-mono">
                Currency: BDT (৳)
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Role & Permissions</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Store Owner</div>
            <p className="text-xs text-muted-foreground mt-1">
              Full administrative authority across 16 modules
            </p>
            <div className="mt-3">
              <Badge variant="secondary" className="text-[10px]">
                RBAC Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real Backend-Driven Setup Checklist */}
      <DashboardSetupChecklist />
    </div>
  );
}
