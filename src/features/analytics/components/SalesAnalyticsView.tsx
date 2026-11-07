"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowLeft,
  Calendar,
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
import { useSalesAnalyticsQuery } from "../hooks";
import { getDateRangeFromPreset } from "../constants";
import type { DateRange } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";

export function SalesAnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset("30d"));
  const { data: sales, isLoading } = useSalesAnalyticsQuery(dateRange);

  if (isLoading || !sales) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales & Revenue Analytics"
        description="Detailed breakdown of sales trajectories, daily settlements, and transaction volumes"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/dashboard/analytics" },
          { label: "Sales" },
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
            <AnalyticsExportButton tab="sales" dateRange={dateRange} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Settled Volume
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{sales.totalRevenue.toLocaleString("en-BD")}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge
                variant="outline"
                className={`text-[10px] font-mono px-1 py-0 ${
                  sales.revenueChange >= 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                }`}
              >
                {sales.revenueChange >= 0 ? `+${sales.revenueChange}%` : `${sales.revenueChange}%`}
              </Badge>
              <span className="text-[11px] text-muted-foreground">vs prev period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Orders Processed
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Previous period: {sales.previousPeriodOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Average Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{sales.averageOrderValue.toLocaleString("en-BD")}</div>
            <p className="text-xs text-muted-foreground mt-2">Per confirmed checkout</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Prev Period Total
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-muted-foreground">
              ৳{sales.previousPeriodRevenue.toLocaleString("en-BD")}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Prior matching duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Daily Settlement Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Daily order volumes and revenue totals within the selected timeframe
          </CardDescription>
        </CardHeader>
        {sales.dailyRevenue.length === 0 ? (
          <EmptyState
            title="No Sales Recorded in Timeframe"
            description="Adjust your date filter to view orders placed across other periods."
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Orders Placed</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Daily Revenue</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Average Ticket</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.dailyRevenue.map((d) => (
                    <TableRow key={d.date} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-medium font-mono">{d.date}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="font-mono">
                          {d.orders} {d.orders === 1 ? "order" : "orders"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-right text-primary">
                        ৳{d.revenue.toLocaleString("en-BD")}
                      </TableCell>
                      <TableCell className="text-xs text-right font-mono text-muted-foreground">
                        ৳{d.orders > 0 ? Math.round(d.revenue / d.orders).toLocaleString("en-BD") : 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block md:hidden divide-y divide-border/60">
              {sales.dailyRevenue.map((d) => (
                <div key={d.date} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-xs text-foreground">{d.date}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {d.orders} {d.orders === 1 ? "order" : "orders"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase">Avg Ticket</span>
                      <span className="font-mono text-muted-foreground">
                        ৳{d.orders > 0 ? Math.round(d.revenue / d.orders).toLocaleString("en-BD") : 0}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block uppercase">Daily Revenue</span>
                      <span className="font-mono font-bold text-sm text-primary">
                        ৳{d.revenue.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

