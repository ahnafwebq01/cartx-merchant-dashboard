"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  TrendingUp,
  Award,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useCustomerAnalyticsQuery } from "../hooks";
import { getDateRangeFromPreset } from "../constants";
import type { DateRange } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function CustomerAnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset("30d"));
  const { data: customers, isLoading } = useCustomerAnalyticsQuery(dateRange);

  if (isLoading || !customers) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Cohorts & Retention"
        description="Analyze customer lifetime value, cohort segmentation distribution, and top buyer relationships"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/dashboard/analytics" },
          { label: "Customers" },
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
            <AnalyticsExportButton tab="customers" dateRange={dateRange} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Shoppers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-2">Active database accounts</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Retention Rate
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.retentionRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">Shoppers with ≥2 orders</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Acquisition Share
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.customerAcquisitionRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {customers.newCustomers} first-time shoppers
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              VIP High-Spenders
            </CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.highValueCustomers}</div>
            <p className="text-xs text-muted-foreground mt-2">Lifetime spend ≥ ৳10,000</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Segment Distribution */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cohort Distribution</CardTitle>
            <CardDescription className="text-xs">
              Categorization across customer lifecycle stages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customers.segmentDistribution.map((item) => (
              <div key={item.segment} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted-foreground font-mono">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right 2 Cols: Top Customers Table */}
        <Card className="lg:col-span-2 rounded-xl shadow-xs overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Customers by Lifetime Spend</CardTitle>
            <CardDescription className="text-xs">
              Highest contributing shoppers and their regional locations
            </CardDescription>
          </CardHeader>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">Customer</TableHead>
                  <TableHead className="text-xs font-semibold">District</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Orders</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Lifetime Spend</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Average Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.topCustomers.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-semibold">{c.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.city}</TableCell>
                    <TableCell className="text-xs text-center font-mono">{c.orders}</TableCell>
                    <TableCell className="text-xs font-bold text-right text-primary">
                      ৳{c.spend.toLocaleString("en-BD")}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono text-muted-foreground">
                      ৳{c.aov.toLocaleString("en-BD")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card-Based Transformation View */}
          <div className="block md:hidden divide-y divide-border/60">
            {customers.topCustomers.map((c) => (
              <div key={c.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-foreground">{c.name}</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    {c.city}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Orders</span>
                    <span className="font-mono font-bold text-foreground">{c.orders}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Spend</span>
                    <span className="font-mono font-bold text-primary">৳{c.spend.toLocaleString("en-BD")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">AOV</span>
                    <span className="font-mono font-semibold text-muted-foreground">৳{c.aov.toLocaleString("en-BD")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

