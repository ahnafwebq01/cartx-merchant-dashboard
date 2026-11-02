"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Receipt,
  Calendar,
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
import { Progress } from "@/components/ui/progress";
import { SUBSCRIPTION_PLANS } from "../constants";
import {
  useSubscriptionQuery,
  useUsageMetricsQuery,
  useInvoicesQuery,
} from "../hooks";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";
import { UpgradePlanDialog } from "./UpgradePlanDialog";
import type { Invoice, SubscriptionPlanId } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function BillingOverviewView() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [upgradePlanId, setUpgradePlanId] = useState<SubscriptionPlanId | null>(null);

  const { data: subscription, isLoading: isLoadingSub } = useSubscriptionQuery();
  const { data: usageMetrics = [], isLoading: isLoadingUsage } = useUsageMetricsQuery();
  const { data: invoices = [], isLoading: isLoadingInvoices } = useInvoicesQuery();

  const planId = subscription?.planId || "growth";
  const plan = SUBSCRIPTION_PLANS[planId];
  const recentInvoices = invoices.slice(0, 3);

  // Check if any metric is at warning or critical threshold
  const nearLimitMetrics = usageMetrics.filter(
    (m) => m.status === "warning" || m.status === "critical"
  );

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  if (isLoadingSub || isLoadingUsage || isLoadingInvoices) {
    return <LoadingSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Hero Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/40 font-mono text-[11px]">
                  CURRENT PLAN
                </Badge>
                {subscription?.status === "active" && (
                  <Badge variant="success" className="text-[11px] gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-extrabold mt-2 text-foreground">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {plan.tagline}
              </CardDescription>
            </div>

            <div className="flex flex-col sm:items-end">
              <div className="flex items-baseline gap-1 text-foreground">
                <span className="text-3xl font-black">
                  ৳{(subscription?.currentPriceBDT ?? plan.monthlyPriceBDT).toLocaleString("bn-BD")}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  / {subscription?.billingCycle === "annual" ? "year" : "month"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Renews on {formatDate(subscription?.nextBillingDate)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>
                Payment Method: <strong>{subscription?.paymentMethodSummary}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                Billing Cycle:{" "}
                <strong className="capitalize">{subscription?.billingCycle || "Monthly"}</strong>
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Looking to expand? Upgrade anytime with prorated billing adjustments.
          </p>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/billing/settings">
              <Button variant="outline" size="sm" className="text-xs">
                Billing Settings
              </Button>
            </Link>
            <Link href="/dashboard/billing/plans">
              <Button size="sm" className="gap-1.5 text-xs">
                <Zap className="h-3.5 w-3.5" />
                Compare & Switch Plans
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Plan Usage Warnings (If any limit >= 70%) */}
      {nearLimitMetrics.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block text-sm">Plan Usage Advisory</strong>
            <p className="mt-0.5">
              Your store is approaching capacity for{" "}
              {nearLimitMetrics.map((m) => `${m.label} (${m.percentUsed}%)`).join(", ")}.
              Consider upgrading to <strong>CartX Pro</strong> to unlock unlimited product capacity and up to 15 team staff accounts.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setUpgradePlanId("pro")}
            className="shrink-0 text-xs border-amber-600/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20"
          >
            Upgrade to Pro
          </Button>
        </div>
      )}

      {/* Usage Limits & Progress Indicators */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Resource Usage & Quotas
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Real-time consumption statistics for your {plan.name} subscription.
              </CardDescription>
            </div>
            <Link href="/dashboard/billing/plans">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Upgrade Limits <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usageMetrics.map((metric) => {
              const isUnlimited = metric.limit === -1;
              const isWarning = metric.status === "warning";
              const isCritical = metric.status === "critical";

              return (
                <div
                  key={metric.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isCritical
                      ? "border-destructive/40 bg-destructive/5"
                      : isWarning
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-xs text-foreground">
                      {metric.label}
                    </span>
                    {isCritical ? (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Critical ({metric.percentUsed}%)
                      </Badge>
                    ) : isWarning ? (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                        Near Limit ({metric.percentUsed}%)
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {isUnlimited ? "Unlimited" : `${metric.percentUsed}%`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl font-bold text-foreground">
                      {metric.current}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {isUnlimited ? "∞ Unlimited" : `${metric.limit} ${metric.unit}`}
                    </span>
                  </div>

                  {!isUnlimited && (
                    <Progress
                      value={metric.percentUsed}
                      max={100}
                      className="h-2"
                      indicatorClassName={
                        isCritical
                          ? "bg-destructive"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-primary"
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Recent Invoices
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Latest settlement records for your CartX subscription and platform services.
              </CardDescription>
            </div>
            <Link href="/dashboard/billing/invoices">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All Invoices <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Invoice #</th>
                  <th className="text-left p-3 font-semibold text-foreground">Date</th>
                  <th className="text-left p-3 font-semibold text-foreground">Plan / Cycle</th>
                  <th className="text-left p-3 font-semibold text-foreground">Amount (BDT)</th>
                  <th className="text-left p-3 font-semibold text-foreground">Status</th>
                  <th className="text-right p-3 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-medium text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3 text-muted-foreground">{formatDate(inv.date)}</td>
                    <td className="p-3 text-foreground">{inv.planName}</td>
                    <td className="p-3 font-mono font-semibold text-foreground">
                      ৳{inv.totalBDT.toLocaleString("bn-BD")}
                    </td>
                    <td className="p-3">
                      {inv.status === "paid" && (
                        <Badge variant="success" className="text-[10px]">Paid</Badge>
                      )}
                      {inv.status === "pending" && (
                        <Badge variant="warning" className="text-[10px]">Pending</Badge>
                      )}
                      {inv.status === "failed" && (
                        <Badge variant="destructive" className="text-[10px]">Failed</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedInvoice(inv)}
                        className="h-7 text-xs px-2"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={Boolean(selectedInvoice)}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanDialog
        planId={upgradePlanId}
        open={Boolean(upgradePlanId)}
        onOpenChange={(open) => !open && setUpgradePlanId(null)}
      />
    </div>
  );
}
