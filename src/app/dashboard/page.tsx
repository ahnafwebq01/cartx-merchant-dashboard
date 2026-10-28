"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <div className="text-2xl font-bold text-foreground">Phase 1 Complete</div>
            <p className="text-xs text-muted-foreground mt-1">
              Foundational setup & design tokens established
            </p>
            <div className="mt-3">
              <Badge variant="success" className="text-[10px]">
                Ready for Phase 2
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

      {/* Setup Checklist Foundation Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Merchant Onboarding Roadmap</CardTitle>
          <CardDescription>
            Foundational milestones per CARTX_MERCHANT_DASHBOARD.md specification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Phase 1: Project Setup & Architecture</h4>
                  <Badge variant="success" className="text-[10px]">Completed</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Next.js App Router, Tailwind CSS v4 design tokens, shadcn/ui components, typed API client, and responsive dashboard shell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="h-5 w-5 rounded-full border-2 border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Phase 2: Merchant Onboarding & Store Profile</h4>
                  <Badge variant="outline" className="text-[10px]">Up Next</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Multi-step store setup wizard (/onboarding/*), store business profile, and storefront preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-border opacity-70">
              <div className="h-5 w-5 rounded-full border-2 border-border flex items-center justify-center shrink-0 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Phase 3–5: Commerce Operations</h4>
                  <Badge variant="secondary" className="text-[10px]">Planned</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Product catalog CRUD, inventory movements, order fulfillment, local courier integrations (Steadfast, Pathao), and payment gateways.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
