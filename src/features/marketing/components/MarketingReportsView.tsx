"use client";

import React, { useState } from "react";
import {
  Download,
  Search,
  Package,
  Percent,
  Ticket,
  Flame,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  useProductPerformanceReportQuery,
  useCampaignPerformanceReportQuery,
  useCouponUsageReportQuery,
  useDiscountPerformanceReportQuery,
} from "../hooks";
import {
  generateCsvContent,
  downloadCsvFile,
} from "../services/mockMarketing";
import { toast } from "sonner";

export function MarketingReportsView() {
  const [activeTab, setActiveTab] = useState<"products" | "campaigns" | "coupons" | "discounts">(
    "products"
  );
  const [search, setSearch] = useState("");

  const { data: productReports = [], isLoading: loadingProducts } =
    useProductPerformanceReportQuery({ tab: "products", search });

  const { data: campaignReports = [], isLoading: loadingCampaigns } =
    useCampaignPerformanceReportQuery({ tab: "campaigns", search });

  const { data: couponReports = [], isLoading: loadingCoupons } =
    useCouponUsageReportQuery({ tab: "coupons", search });

  const { data: discountReports = [], isLoading: loadingDiscounts } =
    useDiscountPerformanceReportQuery({ tab: "discounts", search });

  // Handle CSV Export based on currently active tab and filters
  const handleExportCsv = () => {
    const timestamp = new Date().toISOString().split("T")[0];

    if (activeTab === "products") {
      const headers = [
        "Product Title",
        "SKU",
        "Category",
        "Units Sold",
        "Gross Revenue (BDT)",
        "Discount Savings Given (BDT)",
        "Net Revenue (BDT)",
        "Campaign Attributed Orders",
      ];
      const rows = productReports.map((p) => [
        p.title,
        p.sku,
        p.category,
        p.unitsSold,
        p.grossRevenue,
        p.discountAmount,
        p.netRevenue,
        p.campaignAttributedOrders,
      ]);
      const csv = generateCsvContent(headers, rows);
      downloadCsvFile(`cartx_product_performance_${timestamp}.csv`, csv);
      toast.success(`Exported ${productReports.length} product performance records.`);
    } else if (activeTab === "campaigns") {
      const headers = [
        "Campaign Name",
        "Type",
        "Status",
        "Start Date",
        "End Date",
        "Orders",
        "Revenue (BDT)",
        "Discount Given (BDT)",
        "AOV (BDT)",
      ];
      const rows = campaignReports.map((c) => [
        c.name,
        c.type,
        c.status,
        c.startDate,
        c.endDate,
        c.orders,
        c.revenue,
        c.discountGiven,
        c.averageOrderValue,
      ]);
      const csv = generateCsvContent(headers, rows);
      downloadCsvFile(`cartx_campaign_performance_${timestamp}.csv`, csv);
      toast.success(`Exported ${campaignReports.length} campaign records.`);
    } else if (activeTab === "coupons") {
      const headers = [
        "Coupon Code",
        "Campaign Name",
        "Discount Type",
        "Discount Value",
        "Redemptions",
        "Total Savings Given (BDT)",
        "Average Order Value (BDT)",
        "Last Used Date",
      ];
      const rows = couponReports.map((cpn) => [
        cpn.code,
        cpn.campaignName,
        cpn.discountType,
        cpn.discountValue,
        cpn.redemptions,
        cpn.totalDiscountGiven,
        cpn.averageOrderValue,
        cpn.lastUsedDate,
      ]);
      const csv = generateCsvContent(headers, rows);
      downloadCsvFile(`cartx_coupon_usage_${timestamp}.csv`, csv);
      toast.success(`Exported ${couponReports.length} coupon usage records.`);
    } else if (activeTab === "discounts") {
      const headers = [
        "Campaign Name",
        "Scope",
        "Discount Value",
        "Status",
        "Orders Count",
        "Total Savings (BDT)",
        "Revenue Generated (BDT)",
      ];
      const rows = discountReports.map((d) => [
        d.name,
        d.scope,
        d.discountValue,
        d.status,
        d.ordersCount,
        d.totalSavings,
        d.revenueGenerated,
      ]);
      const csv = generateCsvContent(headers, rows);
      downloadCsvFile(`cartx_discount_performance_${timestamp}.csv`, csv);
      toast.success(`Exported ${discountReports.length} discount performance records.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing & Product Reports"
        description="Comprehensive sales, coupon redemption velocities, and discount ROI ledgers with UTF-8 CSV exports."
        breadcrumbs={[
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Reports" },
        ]}
        actions={
          <Button size="sm" onClick={handleExportCsv} className="h-9">
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV (UTF-8 BOM)
          </Button>
        }
      />

      {/* Tabs and Search Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as "products" | "campaigns" | "coupons" | "discounts");
              setSearch("");
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-9">
                <TabsTrigger value="products" className="text-xs">
                  <Package className="h-3.5 w-3.5 mr-1.5" />
                  Product Performance
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="text-xs">
                  <Flame className="h-3.5 w-3.5 mr-1.5" />
                  Campaign Performance
                </TabsTrigger>
                <TabsTrigger value="coupons" className="text-xs">
                  <Ticket className="h-3.5 w-3.5 mr-1.5" />
                  Coupon Usage
                </TabsTrigger>
                <TabsTrigger value="discounts" className="text-xs">
                  <Percent className="h-3.5 w-3.5 mr-1.5" />
                  Discount Rules
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab} report...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Data Tables */}
      <Card>
        {activeTab === "products" && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Product Title & SKU</TableHead>
                    <TableHead className="text-xs font-semibold">Category</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Units Sold</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Gross Sales (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Discounts (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Net Sales (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Promo Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingProducts ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        Loading product performance records...
                      </TableCell>
                    </TableRow>
                  ) : productReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        No matching product records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    productReports.map((item) => (
                      <TableRow key={item.id} className="text-xs">
                        <TableCell>
                          <div className="font-semibold text-foreground">{item.title}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{item.sku}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.category}</TableCell>
                        <TableCell className="text-right font-mono font-medium">{item.unitsSold}</TableCell>
                        <TableCell className="text-right font-medium">
                          ৳{item.grossRevenue.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right text-amber-600 font-medium">
                          ৳{item.discountAmount.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          ৳{item.netRevenue.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right font-mono">{item.campaignAttributedOrders}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block lg:hidden">
              {loadingProducts ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Loading product performance records...
                </div>
              ) : productReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No matching product records found.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {productReports.map((item) => (
                    <div key={item.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground block truncate">{item.title}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{item.sku} • {item.category}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                          {item.unitsSold} sold
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                        <div>
                          <span className="text-[10px] text-muted-foreground block uppercase">Gross</span>
                          <span className="font-mono font-medium text-foreground">৳{item.grossRevenue.toLocaleString("en-BD")}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-muted-foreground block uppercase">Discount</span>
                          <span className="font-mono font-medium text-amber-600">৳{item.discountAmount.toLocaleString("en-BD")}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block uppercase">Net</span>
                          <span className="font-mono font-bold text-foreground">৳{item.netRevenue.toLocaleString("en-BD")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                        <span className="text-[11px] text-muted-foreground">Promo-Attributed Orders</span>
                        <span className="font-mono font-semibold text-foreground">{item.campaignAttributedOrders} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "campaigns" && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Campaign Name</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Validity</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Orders</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Revenue (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Savings Given (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">AOV (৳)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCampaigns ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        Loading campaign performance...
                      </TableCell>
                    </TableRow>
                  ) : campaignReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        No matching campaigns found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaignReports.map((c) => (
                      <TableRow key={c.id} className="text-xs">
                        <TableCell className="font-semibold text-foreground">{c.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {c.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-[11px]">
                          {c.startDate} to {c.endDate}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">{c.orders}</TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          ৳{c.revenue.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right text-amber-600 font-medium">
                          ৳{c.discountGiven.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ৳{c.averageOrderValue.toLocaleString("en-BD")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block lg:hidden">
              {loadingCampaigns ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Loading campaign performance...
                </div>
              ) : campaignReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No matching campaigns found.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {campaignReports.map((c) => (
                    <div key={c.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground block truncate">{c.name}</span>
                          <span className="text-[10px] text-muted-foreground">{c.startDate} to {c.endDate}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {c.type}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                        <div>
                          <span className="text-[10px] text-muted-foreground block uppercase">Orders</span>
                          <span className="font-mono font-bold text-foreground">{c.orders}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-muted-foreground block uppercase">Revenue</span>
                          <span className="font-mono font-bold text-foreground">৳{c.revenue.toLocaleString("en-BD")}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block uppercase">Savings</span>
                          <span className="font-mono font-bold text-amber-600">৳{c.discountGiven.toLocaleString("en-BD")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                        <span className="text-[11px] text-muted-foreground">Average Order Value</span>
                        <span className="font-mono font-semibold text-foreground">৳{c.averageOrderValue.toLocaleString("en-BD")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "coupons" && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Coupon Code</TableHead>
                    <TableHead className="text-xs font-semibold">Campaign Name</TableHead>
                    <TableHead className="text-xs font-semibold">Discount</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Redemptions</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Total Savings (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">AOV (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Last Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCoupons ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        Loading coupon records...
                      </TableCell>
                    </TableRow>
                  ) : couponReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        No coupon redemptions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    couponReports.map((item) => (
                      <TableRow key={item.id} className="text-xs">
                        <TableCell className="font-mono font-bold text-primary">{item.code}</TableCell>
                        <TableCell className="font-medium text-foreground">{item.campaignName}</TableCell>
                        <TableCell className="font-semibold">{item.discountValue}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{item.redemptions}</TableCell>
                        <TableCell className="text-right text-amber-600 font-medium">
                          ৳{item.totalDiscountGiven.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ৳{item.averageOrderValue.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-[11px]">
                          {item.lastUsedDate}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block lg:hidden">
              {loadingCoupons ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Loading coupon records...
                </div>
              ) : couponReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No coupon redemptions found.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {couponReports.map((item) => (
                    <div key={item.id} className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <code className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {item.code}
                        </code>
                        <span className="font-semibold text-xs text-foreground">{item.discountValue}</span>
                      </div>

                      <div className="text-xs pt-1 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase block font-medium">Campaign</span>
                        <span className="font-medium text-foreground">{item.campaignName}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                        <div>
                          <span className="text-[10px] text-muted-foreground block uppercase">Redemptions</span>
                          <span className="font-mono font-bold text-foreground">{item.redemptions}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block uppercase">Savings Given</span>
                          <span className="font-mono font-bold text-amber-600">
                            ৳{item.totalDiscountGiven.toLocaleString("en-BD")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
                        <span>AOV: ৳{item.averageOrderValue.toLocaleString("en-BD")}</span>
                        <span>Used: {item.lastUsedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "discounts" && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Rule Name</TableHead>
                    <TableHead className="text-xs font-semibold">Scope</TableHead>
                    <TableHead className="text-xs font-semibold">Rate</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Orders</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Total Savings (৳)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Revenue (৳)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDiscounts ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        Loading discount performance...
                      </TableCell>
                    </TableRow>
                  ) : discountReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                        No discount records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    discountReports.map((d) => (
                      <TableRow key={d.id} className="text-xs">
                        <TableCell className="font-semibold text-foreground">{d.name}</TableCell>
                        <TableCell className="capitalize">{d.scope}</TableCell>
                        <TableCell className="font-semibold text-foreground">{d.discountValue}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">{d.ordersCount}</TableCell>
                        <TableCell className="text-right text-amber-600 font-medium">
                          ৳{d.totalSavings.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          ৳{d.revenueGenerated.toLocaleString("en-BD")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block lg:hidden">
              {loadingDiscounts ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Loading discount performance...
                </div>
              ) : discountReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No discount records found.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {discountReports.map((d) => (
                    <div key={d.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground block truncate">{d.name}</span>
                          <span className="text-[10px] text-muted-foreground capitalize">{d.scope}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {d.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">Discount Rate</span>
                        <span className="font-bold text-foreground">{d.discountValue}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                        <div>
                          <span className="text-[10px] text-muted-foreground block uppercase">Orders</span>
                          <span className="font-mono font-bold text-foreground">{d.ordersCount}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-muted-foreground block uppercase">Savings</span>
                          <span className="font-mono font-bold text-amber-600">৳{d.totalSavings.toLocaleString("en-BD")}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block uppercase">Revenue</span>
                          <span className="font-mono font-bold text-foreground">৳{d.revenueGenerated.toLocaleString("en-BD")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
