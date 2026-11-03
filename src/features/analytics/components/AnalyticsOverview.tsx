"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector } from "./DateRangeSelector";
import { AnalyticsExportButton } from "./AnalyticsExportButton";
import { useAnalyticsOverviewQuery } from "../hooks";
import { getDateRangeFromPreset } from "../constants";
import type { DateRange } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function AnalyticsOverview() {
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset("30d"));
  const { data, isLoading } = useAnalyticsOverviewQuery(dateRange);

  if (isLoading || !data) {
    return <LoadingSkeleton rows={6} />;
  }

  const { sales, customers, products, marketing } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Analytics Hub"
        description="Comprehensive business intelligence across sales velocity, customer cohorts, catalog performance, and marketing attribution"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <AnalyticsExportButton tab="sales" dateRange={dateRange} />
          </div>
        }
      />

      {/* Demo Disclosure Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Simulated Business Intelligence: </span>
          All metrics, comparisons, and velocity calculations are computed on-the-fly from the local demo orders, customer database, and product catalog. No mock numbers are fabricated.
        </div>
      </div>

      {/* Primary KPI Grid with Previous Period Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Settled Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{sales.totalRevenue.toLocaleString("en-BD")}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge
                variant="outline"
                className={`text-[10px] font-mono px-1 py-0 flex items-center gap-0.5 ${
                  sales.revenueChange >= 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                }`}
              >
                {sales.revenueChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {sales.revenueChange >= 0 ? `+${sales.revenueChange}%` : `${sales.revenueChange}%`}
              </Badge>
              <span className="text-[11px] text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.totalOrders} Orders</div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge
                variant="outline"
                className={`text-[10px] font-mono px-1 py-0 flex items-center gap-0.5 ${
                  sales.ordersChange >= 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                }`}
              >
                {sales.ordersChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {sales.ordersChange >= 0 ? `+${sales.ordersChange}%` : `${sales.ordersChange}%`}
              </Badge>
              <span className="text-[11px] text-muted-foreground">AOV: ৳{sales.averageOrderValue.toLocaleString("en-BD")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Customer Retention
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.retentionRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {customers.totalCustomers} total • {customers.highValueCustomers} VIP spenders
            </p>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Catalog Health
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.activeProducts} Active</div>
            <p className="text-xs text-muted-foreground mt-2">
              {products.lowStockProducts.length} items near reorder threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4 Deep Analytics Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sales */}
        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Sales & Revenue Trends</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <CardDescription className="text-xs">
              Daily settlement trajectory, order volumes, and average basket sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 text-xs flex justify-between items-center">
              <span className="text-muted-foreground">Average Order Value (AOV):</span>
              <span className="font-semibold text-foreground">৳{sales.averageOrderValue.toLocaleString("en-BD")}</span>
            </div>
            <Button asChild className="w-full justify-between" variant="outline" size="sm">
              <Link href="/dashboard/analytics/sales">
                <span>View Full Sales Report</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Customer Cohorts & LTV</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <CardDescription className="text-xs">
              Segment distribution, acquisition rates, and top customer lifetime values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 text-xs flex justify-between items-center">
              <span className="text-muted-foreground">Top Buyer:</span>
              <span className="font-semibold text-foreground">
                {customers.topCustomers[0]?.name} (৳{customers.topCustomers[0]?.spend.toLocaleString("en-BD")})
              </span>
            </div>
            <Button asChild className="w-full justify-between" variant="outline" size="sm">
              <Link href="/dashboard/analytics/customers">
                <span>View Customer Breakdown</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Product & Category Performance</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <CardDescription className="text-xs">
              Top selling SKUs, low inventory alerts, and revenue per category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 text-xs flex justify-between items-center">
              <span className="text-muted-foreground">Top Category:</span>
              <span className="font-semibold text-foreground">
                {products.categoryPerformance[0]?.category || "Apparel"} (৳{products.categoryPerformance[0]?.revenue.toLocaleString("en-BD")})
              </span>
            </div>
            <Button asChild className="w-full justify-between" variant="outline" size="sm">
              <Link href="/dashboard/analytics/products">
                <span>View Product Rankings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Marketing */}
        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Promotion Attribution</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardDescription className="text-xs">
              Campaign conversions, coupon redemption velocity, and discount ROI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 text-xs flex justify-between items-center">
              <span className="text-muted-foreground">Attributed Sales:</span>
              <span className="font-semibold text-foreground">৳{marketing.attributedRevenue.toLocaleString("en-BD")}</span>
            </div>
            <Button asChild className="w-full justify-between" variant="outline" size="sm">
              <Link href="/dashboard/analytics/marketing">
                <span>View Promotion ROI</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

