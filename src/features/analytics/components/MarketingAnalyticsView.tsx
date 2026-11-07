"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  DollarSign,
  ArrowLeft,
  Percent,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DateRangeSelector } from "./DateRangeSelector";
import { AnalyticsExportButton } from "./AnalyticsExportButton";
import { useMarketingAnalyticsQuery } from "../hooks";
import { getDateRangeFromPreset } from "../constants";
import type { DateRange } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function MarketingAnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset("30d"));
  const { data: marketing, isLoading } = useMarketingAnalyticsQuery(dateRange);

  if (isLoading || !marketing) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Attribution & ROI"
        description="Track conversion velocity, discount voucher expenditure, and coupon revenue attribution"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/dashboard/analytics" },
          { label: "Marketing" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/analytics">
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <AnalyticsExportButton tab="marketing" dateRange={dateRange} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Campaigns
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketing.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-2">Coupons, discounts & flash sales</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Redemptions
            </CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketing.totalCouponsRedeemed} Claims</div>
            <p className="text-xs text-muted-foreground mt-2">Voucher checkouts completed</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Attributed Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{marketing.attributedRevenue.toLocaleString("en-BD")}</div>
            <p className="text-xs text-muted-foreground mt-2">Sales linked to promo codes</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Discount Cost
            </CardTitle>
            <Percent className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{marketing.discountExpenditure.toLocaleString("en-BD")}</div>
            <p className="text-xs text-muted-foreground mt-2">Merchant customer savings given</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns ROI Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Promotion Performance Rankings</CardTitle>
          <CardDescription className="text-xs">
            Revenue generated versus redemption counts for active promotional tools
          </CardDescription>
        </CardHeader>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Campaign Name</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold text-center">Redemptions</TableHead>
                <TableHead className="text-xs font-semibold text-right">Attributed Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketing.campaignPerformance.map((c, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-semibold text-foreground">{c.name}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="secondary" className="text-[10px]">
                      {c.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-center font-mono">{c.redemptions}</TableCell>
                  <TableCell className="text-xs font-bold text-right text-primary">
                    ৳{c.revenue.toLocaleString("en-BD")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card-Based Transformation View */}
        <div className="block md:hidden divide-y divide-border/60">
          {marketing.campaignPerformance.map((c, idx) => (
            <div key={idx} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs text-foreground block truncate">{c.name}</span>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {c.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                <span className="text-[11px] text-muted-foreground">
                  Redemptions: <strong className="text-foreground font-mono">{c.redemptions}</strong>
                </span>
                <span className="font-mono font-bold text-primary">
                  ৳{c.revenue.toLocaleString("en-BD")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

