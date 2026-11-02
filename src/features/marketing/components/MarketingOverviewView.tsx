"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tag,
  Percent,
  Flame,
  BarChart3,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Ticket,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useMarketingOverviewQuery,
  useMarketingAnalyticsQuery,
  useResetMarketingDemoDataMutation,
} from "../hooks";
import { CampaignPerformanceChart } from "./CampaignPerformanceChart";

export function MarketingOverviewView() {
  const { data: overview, isLoading } = useMarketingOverviewQuery();
  const { data: analytics } = useMarketingAnalyticsQuery("30d");
  const resetMutation = useResetMarketingDemoDataMutation();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleReset = async () => {
    await resetMutation.mutateAsync();
    setResetDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing & Promotions"
        description="Drive store revenue with coupons, automated discount campaigns, flash sales, and customer promotions."
        breadcrumbs={[{ label: "Marketing", href: "/dashboard/marketing" }]}
        actions={
          <div className="flex items-center gap-2">
            <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reset Demo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Marketing Demo Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will restore all coupons, discount campaigns, flash sales, and activity logs
                    back to the initial baseline presets. Custom entries created in this session will be removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                    Reset to Baseline
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button size="sm" asChild className="h-9">
              <Link href="/dashboard/marketing/coupons/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Coupon
              </Link>
            </Button>
          </div>
        }
      />

      {/* Demo Mode Notice */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span>
            <strong>Marketing Demo Mode:</strong> Realistic promotional data and BDT currency metrics are stored locally in your browser session.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px] bg-background">
            Currency: BDT (৳)
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            SSR-Safe Mock Engine
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : overview?.totalActiveCampaigns ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview?.activeCouponCount ?? 0} coupons • Live discounts & flash sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Coupons
            </CardTitle>
            <Ticket className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : overview?.activeCouponCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for customer checkout redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Attributed Sales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ৳{isLoading ? "..." : (overview?.totalAttributedRevenue ?? 0).toLocaleString("en-BD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue driven via promotions & coupons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Discount Savings
            </CardTitle>
            <Tag className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ৳{isLoading ? "..." : (overview?.totalDiscountAmount ?? 0).toLocaleString("en-BD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cumulative merchant discounts provided
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/marketing/coupons"
          className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Ticket className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Coupon Codes</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Create percentage or fixed-amount vouchers with usage caps and minimum spends.
          </p>
        </Link>

        <Link
          href="/dashboard/marketing/discounts"
          className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Percent className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Discounts & Markdowns</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Storewide, category-specific, or product promotions applied automatically in cart.
          </p>
        </Link>

        <Link
          href="/dashboard/marketing/flash-sales"
          className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Flame className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Flash Sales</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Time-limited rush drops with live countdown timers and allocated stock quotas.
          </p>
        </Link>

        <Link
          href="/dashboard/marketing/reports"
          className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Marketing Reports</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Product breakdowns, coupon redemptions, and downloadable UTF-8 CSV exports.
          </p>
        </Link>
      </div>

      {/* Performance Chart & Recent Activities Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Column (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Promotion Performance Trend</CardTitle>
              <CardDescription className="text-xs">
                Comparing attributed sales revenue vs merchant discount savings over the past 30 days.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
              <Link href="/dashboard/marketing/analytics">
                <BarChart3 className="h-3.5 w-3.5 mr-1" />
                Full Analytics
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {analytics?.timeline ? (
              <CampaignPerformanceChart data={analytics.timeline} height={250} />
            ) : (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                Loading performance metrics...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Marketing Activities Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription className="text-xs">
              Audit trail of marketing campaigns and redemptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview?.recentActivities && overview.recentActivities.length > 0 ? (
                overview.recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <div className="font-medium text-foreground">{act.title}</div>
                      <div className="text-muted-foreground line-clamp-2">{act.description}</div>
                      <div className="text-[10px] text-muted-foreground/80 flex items-center gap-2 pt-0.5">
                        <span>{new Date(act.timestamp).toLocaleDateString("en-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <span>•</span>
                        <span>{act.actor}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground py-6 text-center">
                  No marketing activities recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

