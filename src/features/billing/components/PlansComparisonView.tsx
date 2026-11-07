"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SUBSCRIPTION_PLANS,
  PLAN_COMPARISON_MATRIX,
} from "../constants";
import { calculatePlanPricing } from "../services/mockBilling";
import { useSubscriptionQuery } from "../hooks";
import { UpgradePlanDialog } from "./UpgradePlanDialog";
import type { SubscriptionPlanId, BillingCycle } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function PlansComparisonView() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [targetPlanId, setTargetPlanId] = useState<SubscriptionPlanId | null>(null);

  const { data: subscription, isLoading } = useSubscriptionQuery();
  const currentPlanId = subscription?.planId || "growth";

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  const plansList: SubscriptionPlanId[] = ["starter", "growth", "pro"];

  return (
    <div className="space-y-8">
      {/* Header & Cycle Switcher */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="border-primary/40 text-primary text-xs">
          CARTX SAAS PLANS
        </Badge>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Flexible Plans Tailored for Bangladesh E-Commerce
        </h2>
        <p className="text-sm text-muted-foreground">
          Scale your online storefront with high-performance infrastructure, local courier automations, and zero platform transaction fees.
        </p>

        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center p-1 rounded-lg border border-border bg-muted/60">
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                cycle === "monthly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setCycle("annual")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                cycle === "annual"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual Billing</span>
              <Badge variant="default" className="text-[10px] px-1 py-0 bg-emerald-600 hover:bg-emerald-600">
                Save 17%
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Tier Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansList.map((id) => {
          const plan = SUBSCRIPTION_PLANS[id];
          const pricing = calculatePlanPricing(id, cycle);
          const isCurrent = currentPlanId === id;
          const isPopular = plan.isPopular;

          return (
            <Card
              key={id}
              className={`relative flex flex-col justify-between transition-all ${
                isCurrent
                  ? "border-primary ring-2 ring-primary/20 shadow-md"
                  : isPopular
                  ? "border-primary/60 shadow-sm"
                  : "border-border"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-2.5 py-0.5 shadow">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  {isCurrent && (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400 text-[10px]">
                      Current Plan
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs min-h-[36px] mt-1">
                  {plan.tagline}
                </CardDescription>

                <div className="pt-4 border-t border-border mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">
                      ৳{pricing.billedAmount.toLocaleString("bn-BD")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {cycle === "annual" ? "year" : "month"}
                    </span>
                  </div>
                  {cycle === "annual" && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      ৳{pricing.monthlyEquivalent.toLocaleString("bn-BD")}/mo equivalent (Save ৳{pricing.annualSavingsAmount.toLocaleString("bn-BD")})
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-6 flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Key Capabilities:
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4 border-t border-border">
                <Button
                  className="w-full text-xs"
                  variant={isCurrent ? "outline" : isPopular ? "default" : "secondary"}
                  disabled={isCurrent}
                  onClick={() => setTargetPlanId(id)}
                >
                  {isCurrent ? "Current Plan Active" : `Select ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Detailed Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Comprehensive Feature Comparison
          </CardTitle>
          <CardDescription className="text-xs">
            Detailed technical and capacity breakdown across all CartX subscription tiers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[200px]">Feature & Capability</TableHead>
                    <TableHead className="text-center min-w-[120px]">Starter</TableHead>
                    <TableHead className="text-center min-w-[120px] bg-primary/5">
                      Growth
                    </TableHead>
                    <TableHead className="text-center min-w-[120px]">Pro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PLAN_COMPARISON_MATRIX.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20">
                      <TableCell className="py-2.5 font-medium text-xs">
                        <div>{row.name}</div>
                        <div className="text-[10px] text-muted-foreground">{row.category}</div>
                      </TableCell>
                      <TableCell className="text-center py-2.5 text-xs text-muted-foreground">
                        {row.starter}
                      </TableCell>
                      <TableCell className="text-center py-2.5 text-xs font-semibold text-primary bg-primary/5">
                        {row.growth}
                      </TableCell>
                      <TableCell className="text-center py-2.5 text-xs text-foreground">
                        {row.pro}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-border/60">
              {PLAN_COMPARISON_MATRIX.map((row, idx) => (
                <div key={idx} className="p-3.5 space-y-2 hover:bg-muted/10 transition-colors">
                  <div>
                    <p className="font-medium text-xs text-foreground">{row.name}</p>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{row.category}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                    <div className="p-1.5 rounded bg-muted/40 border border-border/50">
                      <span className="text-[10px] text-muted-foreground block font-medium">Starter</span>
                      <span className="text-xs text-muted-foreground font-medium">{row.starter}</span>
                    </div>
                    <div className="p-1.5 rounded bg-primary/10 border border-primary/20">
                      <span className="text-[10px] text-primary block font-semibold">Growth</span>
                      <span className="text-xs text-primary font-bold">{row.growth}</span>
                    </div>
                    <div className="p-1.5 rounded bg-muted/40 border border-border/50">
                      <span className="text-[10px] text-foreground block font-medium">Pro</span>
                      <span className="text-xs text-foreground font-semibold">{row.pro}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plan Modal */}
      <UpgradePlanDialog
        planId={targetPlanId}
        initialCycle={cycle}
        open={Boolean(targetPlanId)}
        onOpenChange={(open) => !open && setTargetPlanId(null)}
      />
    </div>
  );
}
