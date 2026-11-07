"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  Layers,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
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
import { DateRangeSelector } from "./DateRangeSelector";
import { AnalyticsExportButton } from "./AnalyticsExportButton";
import { useProductAnalyticsQuery } from "../hooks";
import { getDateRangeFromPreset } from "../constants";
import type { DateRange } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function ProductAnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRange>(
    getDateRangeFromPreset("30d"),
  );
  const { data: products, isLoading } = useProductAnalyticsQuery(dateRange);

  if (isLoading || !products) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product & Catalog Performance"
        description="Monitor best-selling SKUs, inventory health monitors, and category revenue share"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/dashboard/analytics" },
          { label: "Products" },
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
            <AnalyticsExportButton tab="products" dateRange={dateRange} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {products.activeProducts} published in storefront
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.lowStockProducts.length} Items
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Below safety reorder threshold
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Categories Tracked
            </CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.categoryPerformance.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Merchandising taxonomies
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Top SKU Units Sold
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.topSellingProducts[0]?.sales || 0} Units
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate">
              {products.topSellingProducts[0]?.name || "Catalog leader"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Top Selling Products by Revenue
          </CardTitle>
          <CardDescription className="text-xs">
            Performance rankings calculated from processed orders
          </CardDescription>
        </CardHeader>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">SKU</TableHead>
                <TableHead className="text-xs font-semibold">
                  Product Title
                </TableHead>
                <TableHead className="text-xs font-semibold text-center">
                  Units Sold
                </TableHead>
                <TableHead className="text-xs font-semibold text-right">
                  Attributed Revenue
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.topSellingProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-mono font-medium">
                    {p.sku}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {p.name}
                  </TableCell>
                  <TableCell className="text-xs text-center font-mono">
                    <Badge variant="outline">{p.sales} units</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-right text-primary">
                    ৳{p.revenue.toLocaleString("en-BD")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card-Based Transformation View */}
        <div className="block md:hidden divide-y divide-border/60">
          {products.topSellingProducts.map((p) => (
            <div key={p.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-xs text-foreground block truncate">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{p.sku}</span>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                  {p.sales} units
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                <span className="text-[11px] text-muted-foreground">Revenue Generated</span>
                <span className="font-mono font-bold text-primary">৳{p.revenue.toLocaleString("en-BD")}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Two-Column: Low Stock & Category Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-xs overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Stock Warnings
            </CardTitle>
            <CardDescription className="text-xs">
              SKUs requiring warehouse replenishment
            </CardDescription>
          </CardHeader>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">SKU</TableHead>
                  <TableHead className="text-xs font-semibold">Title</TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Current Stock
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.lowStockProducts.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-mono">
                      {item.sku}
                    </TableCell>
                    <TableCell className="text-xs font-medium truncate max-w-[140px]">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <Badge
                        variant="destructive"
                        className="font-mono text-[10px]"
                      >
                        {item.stock} left (reorder at {item.threshold})
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card-Based Transformation View */}
          <div className="block sm:hidden divide-y divide-border/60">
            {products.lowStockProducts.map((item) => (
              <div key={item.id} className="p-3.5 space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-foreground block truncate">{item.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">{item.sku}</span>
                </div>
                <div className="pt-1 border-t border-border/40">
                  <Badge variant="destructive" className="font-mono text-[10px] w-full justify-center">
                    {item.stock} left (reorder at {item.threshold})
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl shadow-xs overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Category Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Product catalog share and gross sales per category
            </CardDescription>
          </CardHeader>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-center">
                    Products
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Gross Sales
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.categoryPerformance.map((cat) => (
                  <TableRow key={cat.category} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-semibold text-foreground">
                      {cat.category}
                    </TableCell>
                    <TableCell className="text-xs text-center font-mono">
                      <Badge variant="secondary">{cat.products}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-right text-primary">
                      ৳{cat.revenue.toLocaleString("en-BD")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card-Based Transformation View */}
          <div className="block sm:hidden divide-y divide-border/60">
            {products.categoryPerformance.map((cat) => (
              <div key={cat.category} className="p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">{cat.category}</span>
                  <Badge variant="secondary" className="text-[10px]">{cat.products} SKUs</Badge>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground">Gross Sales</span>
                  <span className="font-mono font-bold text-primary">৳{cat.revenue.toLocaleString("en-BD")}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
