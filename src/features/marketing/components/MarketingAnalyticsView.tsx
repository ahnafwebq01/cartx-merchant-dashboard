"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Percent,
  Tag,
  Ticket,
  Calendar,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMarketingAnalyticsQuery } from "../hooks";
import { CampaignPerformanceChart } from "./CampaignPerformanceChart";
import type { AnalyticsDatePreset } from "../types";

export function MarketingAnalyticsView() {
  const [preset, setPreset] = useState<AnalyticsDatePreset>("30d");
  const { data: analytics, isLoading } = useMarketingAnalyticsQuery(preset);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Analytics"
        description="Track promotion-attributed revenues, redemption velocities, and discount ROI across campaigns."
        breadcrumbs={[
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Analytics" },
        ]}
      />

      {/* Date Range Preset Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Active Reporting Window:</span>
          <Badge variant="outline" className="font-mono text-[11px] bg-background">
            {analytics?.startDate} to {analytics?.endDate}
          </Badge>
        </div>

        <Tabs
          value={preset}
          onValueChange={(val) => setPreset(val as AnalyticsDatePreset)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 sm:w-auto h-8 text-xs">
            <TabsTrigger value="today" className="text-xs px-3">
              Today
            </TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-3">
              Last 7D
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-3">
              Last 30D
            </TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-3">
              Last 90D
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Campaign Attributed Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ৳{isLoading ? "..." : (analytics?.revenueGenerated ?? 0).toLocaleString("en-BD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sales involving coupons, discounts or flash sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Coupon Redemption Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : `${analytics?.couponRedemptionRate ?? 0}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Percentage of checkout carts applying coupons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Coupon Redemptions
            </CardTitle>
            <Ticket className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : analytics?.totalCouponUsage ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Individual customer coupon applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Discount Expenditure
            </CardTitle>
            <Tag className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ৳{isLoading ? "..." : (analytics?.discountExpenditure ?? 0).toLocaleString("en-BD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total savings absorbed across promotions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Promotion Revenue & Savings Trajectory</CardTitle>
          <CardDescription className="text-xs">
            Visualizing daily sales generated compared with customer discount savings given during the {preset} window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics?.timeline ? (
            <CampaignPerformanceChart data={analytics.timeline} height={270} />
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
              Loading timeline trajectory...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attribution Methodology Callout */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs space-y-2">
        <div className="font-semibold text-foreground flex items-center gap-1.5">
          <Info className="h-4 w-4 text-primary shrink-0" />
          Attribution Calculation Methodology (Demo Mode Documentation)
        </div>
        <p className="text-muted-foreground leading-relaxed">
          In CartX Demo Mode, promotion attribution follows a multi-touch first-order baseline. Orders placed with an active coupon code or containing items under category/product automatic markdowns attribute their gross subtotal directly to the campaign ID. Conversion rate denotes the simulated proportion of storefront sessions featuring coupon code entry that result in completed checkout orders. No fake live telemetry is injected; all data maps to deterministic mock customer orders.
        </p>
      </div>

      {/* Performance Tables Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Best-Performing Campaigns</CardTitle>
            <CardDescription className="text-xs">
              Ranked by total revenue generated and checkout conversions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Campaign Name</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Orders</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Revenue (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.topCampaigns?.map((camp) => (
                    <TableRow key={camp.id} className="text-xs">
                      <TableCell>
                        <div className="font-medium text-foreground line-clamp-1">{camp.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{camp.type}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{camp.orders}</TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        ৳{camp.revenue.toLocaleString("en-BD")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" className="text-[10px] font-mono">
                          {camp.conversionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block md:hidden divide-y divide-border/60">
              {analytics?.topCampaigns?.map((camp) => (
                <div key={camp.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-foreground block truncate">
                        {camp.name}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground font-mono">
                        {camp.type}
                      </span>
                    </div>
                    <Badge variant="success" className="text-[10px] font-mono shrink-0">
                      {camp.conversionRate}% Conv.
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <span className="text-muted-foreground text-[11px]">Orders: <strong className="text-foreground font-mono">{camp.orders}</strong></span>
                    <span className="font-mono font-bold text-foreground">
                      ৳{camp.revenue.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Redeemed Coupons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Redeemed Coupons</CardTitle>
            <CardDescription className="text-xs">
              Highest-velocity promo codes redeemed by shoppers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Coupon Code</TableHead>
                    <TableHead className="text-xs font-semibold">Discount</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Times Used</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Savings Given (৳)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.topCoupons?.map((cpn) => (
                    <TableRow key={cpn.id} className="text-xs">
                      <TableCell className="font-mono font-bold text-primary">
                        {cpn.code}
                      </TableCell>
                      <TableCell className="font-semibold">{cpn.discountDisplay}</TableCell>
                      <TableCell className="text-right font-mono font-bold">{cpn.usedCount}</TableCell>
                      <TableCell className="text-right text-amber-600 font-medium">
                        ৳{cpn.totalSavings.toLocaleString("en-BD")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block md:hidden divide-y divide-border/60">
              {analytics?.topCoupons?.map((cpn) => (
                <div key={cpn.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {cpn.code}
                    </code>
                    <span className="font-semibold text-xs text-foreground">{cpn.discountDisplay}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <span className="text-muted-foreground text-[11px]">Times Used: <strong className="text-foreground font-mono">{cpn.usedCount}</strong></span>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">Total Saved</span>
                      <span className="font-mono font-bold text-amber-600">
                        ৳{cpn.totalSavings.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
