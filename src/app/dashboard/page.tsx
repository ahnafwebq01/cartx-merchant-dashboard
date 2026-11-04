"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Truck,
  ArrowRight,
  Store,
  Layers,
  ShieldCheck,
  Plus,
  Boxes,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { DashboardSetupChecklist } from "@/features/onboarding/components/DashboardSetupChecklist";
import { DateRangeSelector } from "@/features/analytics/components/DateRangeSelector";
import { useAnalyticsOverviewQuery } from "@/features/analytics/hooks";
import { getDateRangeFromPreset } from "@/features/analytics/constants";
import type { DateRange } from "@/features/analytics/types";
import { useOrdersQuery } from "@/features/orders/hooks";
import { SectionLoader } from "@/components/ui/loader-spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import {
  containerVariants,
  cardVariants,
  microInteractions,
} from "@/lib/animations";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset("30d"));
  const shouldReduceMotion = useReducedMotion();

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useAnalyticsOverviewQuery(dateRange);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useOrdersQuery({ limit: 5 });

  const recentOrders = ordersData?.orders ?? [];

  return (
    <div className="space-y-6">
      {/* Header with Title, Welcome Message, Date Range Selector & Actions */}
      <PageHeader
        title="Merchant Overview"
        description="Welcome to your CartX merchant administration panel. Real-time store performance, catalog health, and order telemetry."
        breadcrumbs={[{ label: "Overview" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/onboarding">
                Setup Store
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        }
      />

      {/* Loading & Error States */}
      {isAnalyticsLoading && (
        <SectionLoader
          message="Synchronizing live merchant metrics and analytics..."
          minHeight="min-h-[220px]"
        />
      )}

      {isAnalyticsError && (
        <ErrorState
          title="Could not load analytics metrics"
          message="An error occurred while aggregating store telemetry. Please refresh."
          onRetry={() => refetchAnalytics()}
        />
      )}

      {analytics && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Key Statistics KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Settled Revenue */}
            <motion.div
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : microInteractions.subtleLift}
            >
              <Card className="rounded-xl border-border shadow-xs hover:border-primary/40 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Settled Revenue
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ৳{analytics.sales.totalRevenue.toLocaleString("en-BD")}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono px-1 py-0 flex items-center gap-0.5 ${
                        analytics.sales.revenueChange >= 0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                      }`}
                    >
                      {analytics.sales.revenueChange >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {analytics.sales.revenueChange >= 0
                        ? `+${analytics.sales.revenueChange}%`
                        : `${analytics.sales.revenueChange}%`}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      vs prior period
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    AOV: ৳{analytics.sales.averageOrderValue.toLocaleString("en-BD")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Orders */}
            <motion.div
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : microInteractions.subtleLift}
            >
              <Card className="rounded-xl border-border shadow-xs hover:border-primary/40 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Orders
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {analytics.sales.totalOrders} Orders
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono px-1 py-0 flex items-center gap-0.5 ${
                        analytics.sales.ordersChange >= 0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                      }`}
                    >
                      {analytics.sales.ordersChange >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {analytics.sales.ordersChange >= 0
                        ? `+${analytics.sales.ordersChange}%`
                        : `${analytics.sales.ordersChange}%`}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Prev: {analytics.sales.previousPeriodOrders} orders
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Checkout velocity active
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Products & Catalog Health */}
            <motion.div
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : microInteractions.subtleLift}
            >
              <Card className="rounded-xl border-border shadow-xs hover:border-primary/40 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Active Catalog
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {analytics.products.activeProducts} SKUs
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {analytics.products.lowStockProducts.length > 0 ? (
                      <Badge variant="warning" className="text-[10px] gap-1 px-1.5">
                        <AlertTriangle className="h-3 w-3" />
                        {analytics.products.lowStockProducts.length} Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px] gap-1 px-1.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Stock Optimal
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      of {analytics.products.totalProducts} total
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Multi-variant inventory synced
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer Community & Retention */}
            <motion.div
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : microInteractions.subtleLift}
            >
              <Card className="rounded-xl border-border shadow-xs hover:border-primary/40 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer Retention
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {analytics.customers.retentionRate}%
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {analytics.customers.highValueCustomers} VIP Spenders
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {analytics.customers.totalCustomers} total
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Acquisition rate: {analytics.customers.customerAcquisitionRate}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Interactive Visualizations: Sales Trajectory & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Settlement Bar Chart */}
            <motion.div variants={cardVariants} className="lg:col-span-2">
              <Card className="rounded-xl border-border shadow-xs h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Daily Sales & Volume Trajectory
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Daily revenue and order checkouts recorded across the selected timeframe
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-[11px] gap-1 font-mono">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {analytics.sales.dailyRevenue.length} Days Recorded
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {analytics.sales.dailyRevenue.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
                      No sales data recorded for this duration.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Responsive SVG / Column Bar Chart */}
                      <div className="h-48 w-full flex items-end gap-1.5 pt-6 pb-2 px-1 border-b border-border/80">
                        {(() => {
                          const maxRevenue = Math.max(
                            ...analytics.sales.dailyRevenue.map((d) => d.revenue),
                            1
                          );

                          return analytics.sales.dailyRevenue.map((d, idx) => {
                            const heightPercent = Math.max(
                              Math.round((d.revenue / maxRevenue) * 100),
                              6
                            );

                            return (
                              <div
                                key={d.date}
                                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                              >
                                {/* Tooltip */}
                                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-popover text-popover-foreground border border-border shadow-md rounded-md p-1.5 text-[10px] whitespace-nowrap pointer-events-none">
                                  <span className="font-semibold">
                                    ৳{d.revenue.toLocaleString("en-BD")}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {d.orders} orders ({d.date.slice(5)})
                                  </span>
                                </div>

                                {/* Animated Column */}
                                <motion.div
                                  initial={
                                    shouldReduceMotion ? { height: `${heightPercent}%` } : { height: 0 }
                                  }
                                  animate={{ height: `${heightPercent}%` }}
                                  transition={{
                                    duration: 0.35,
                                    delay: idx * 0.02,
                                    ease: "easeOut",
                                  }}
                                  className="w-full rounded-t-sm bg-primary/80 group-hover:bg-primary transition-colors cursor-pointer"
                                />
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Timeline Date Bounds & Summary */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                        <span>
                          From: {analytics.sales.dailyRevenue[0]?.date || "Start"}
                        </span>
                        <span className="font-medium text-foreground">
                          Avg: ৳
                          {analytics.sales.dailyRevenue.length > 0
                            ? Math.round(
                                analytics.sales.totalRevenue /
                                  analytics.sales.dailyRevenue.length
                              ).toLocaleString("en-BD")
                            : 0}
                          /day
                        </span>
                        <span>
                          To:{" "}
                          {analytics.sales.dailyRevenue[
                            analytics.sales.dailyRevenue.length - 1
                          ]?.date || "End"}
                        </span>
                      </div>

                      {/* Screen Reader Accessible Table Summary */}
                      <details className="text-xs text-muted-foreground pt-1">
                        <summary className="cursor-pointer hover:text-foreground transition-colors">
                          View accessible data summary table
                        </summary>
                        <div className="mt-2 max-h-36 overflow-y-auto border border-border rounded-md text-[11px]">
                          <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border">
                              <tr>
                                <th className="p-1.5">Date</th>
                                <th className="p-1.5">Orders</th>
                                <th className="p-1.5 text-right">Settled Revenue</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {analytics.sales.dailyRevenue.map((d) => (
                                <tr key={d.date}>
                                  <td className="p-1.5 font-mono">{d.date}</td>
                                  <td className="p-1.5">{d.orders}</td>
                                  <td className="p-1.5 text-right font-medium">
                                    ৳{d.revenue.toLocaleString("en-BD")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Performance Breakdown */}
            <motion.div variants={cardVariants}>
              <Card className="rounded-xl border-border shadow-xs h-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Category Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Revenue distribution across merchandise categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.products.categoryPerformance.map((cat, idx) => {
                    const totalCatRevenue = analytics.products.categoryPerformance.reduce(
                      (acc, c) => acc + c.revenue,
                      0
                    );
                    const percentage =
                      totalCatRevenue > 0
                        ? Math.round((cat.revenue / totalCatRevenue) * 100)
                        : 0;

                    return (
                      <div key={cat.category} className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {cat.category}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            ৳{cat.revenue.toLocaleString("en-BD")} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={
                              shouldReduceMotion ? { width: `${percentage}%` } : { width: 0 }
                            }
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              duration: 0.4,
                              delay: idx * 0.05,
                              ease: "easeOut",
                            }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {cat.products} products cataloged
                        </span>
                      </div>
                    );
                  })}

                  <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <Link href="/dashboard/products/categories">
                      <span>Manage Categories</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Orders & Activity Table */}
          <motion.div variants={cardVariants}>
            <Card className="rounded-xl border-border shadow-xs overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Recent Merchant Orders
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Latest checkouts processed through the CartX checkout engine
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                  <Link href="/dashboard/orders">
                    <span>View All Orders</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {isOrdersLoading ? (
                  <div className="p-6">
                    <SectionLoader message="Loading latest orders..." minHeight="min-h-[120px]" />
                  </div>
                ) : isOrdersError || recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No orders available yet. Orders placed on your store will appear here in real time.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs font-semibold">Order</TableHead>
                        <TableHead className="text-xs font-semibold">Customer</TableHead>
                        <TableHead className="text-xs font-semibold">Method</TableHead>
                        <TableHead className="text-xs font-semibold">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-xs font-semibold font-mono">
                            <Link
                              href="/dashboard/orders"
                              className="text-primary hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="font-medium text-foreground">
                              {order.customerName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {order.shippingAddress.city}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase font-mono px-1.5 py-0"
                            >
                              {order.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge
                              variant={
                                order.orderStatus === "delivered"
                                  ? "success"
                                  : order.orderStatus === "cancelled"
                                  ? "destructive"
                                  : order.orderStatus === "shipped"
                                  ? "info"
                                  : "secondary"
                              }
                              className="text-[10px] capitalize px-1.5 py-0"
                            >
                              {order.orderStatus.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-right font-mono">
                            ৳{order.grandTotal.toLocaleString("en-BD")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Shortcuts Grid */}
          <motion.div variants={cardVariants} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Super Admin Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link
                href="/dashboard/products/new"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-center group"
              >
                <Plus className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium text-foreground">Add SKU</span>
                <span className="text-[10px] text-muted-foreground">New Product</span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-center group"
              >
                <ShoppingCart className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium text-foreground">Orders</span>
                <span className="text-[10px] text-muted-foreground">Fulfillment</span>
              </Link>
              <Link
                href="/dashboard/inventory"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-center group"
              >
                <Boxes className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium text-foreground">Inventory</span>
                <span className="text-[10px] text-muted-foreground">Adjust Stock</span>
              </Link>
              <Link
                href="/dashboard/shipping"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-center group"
              >
                <Truck className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium text-foreground">Shipping</span>
                <span className="text-[10px] text-muted-foreground">Couriers</span>
              </Link>
              <Link
                href="/dashboard/marketing/coupons"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-center group"
              >
                <Tag className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium text-foreground">Coupons</span>
                <span className="text-[10px] text-muted-foreground">Promotions</span>
              </Link>
              <Link
                href="/dashboard/store/themes"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-center group"
              >
                <Store className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium text-foreground">Storefront</span>
                <span className="text-[10px] text-muted-foreground">Themes</span>
              </Link>
            </div>
          </motion.div>

          {/* Architecture Foundation Status Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Architecture Phase</CardTitle>
                <Layers className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">Phases 1–9 Complete</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All 16 dashboard modules, mobile app, and automation workflows operational
                </p>
                <div className="mt-3">
                  <Badge variant="success" className="text-[10px]">
                    Production Ready • High-Fidelity Demo Mode
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
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

            <Card className="border-border shadow-xs">
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
        </motion.div>
      )}
    </div>
  );
}
