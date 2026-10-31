"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useOrdersQuery } from "@/features/orders/hooks";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { PaymentStatusBadge } from "@/features/orders/components/PaymentStatusBadge";
import {
  RotateCcw,
  Eye,
  DollarSign,
  Package,
} from "lucide-react";

export default function OrderReturnsPage() {
  const { data, isLoading } = useOrdersQuery({ limit: 50 });
  const allOrders = data?.orders || [];

  // Filter returns & refunds
  const returnOrders = allOrders.filter(
    (o) =>
      o.orderStatus === "returned" ||
      o.orderStatus === "partially_returned" ||
      o.paymentStatus === "refunded" ||
      o.paymentStatus === "partially_refunded",
  );

  const totalRefunded = returnOrders.reduce((sum, o) => {
    if (o.paymentStatus === "refunded" || o.orderStatus === "returned") {
      return sum + o.grandTotal;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returns & Refunds"
        description="Track customer returns, inspect defective or returned merchandise, and verify refunds."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sales & Orders", href: "/dashboard/orders" },
          { label: "Returns & Refunds" },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Total Return Cases
              </p>
              <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {returnOrders.length}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Returned to origin or merchant
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Refund Value Issued
              </p>
              <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
                ৳{totalRefunded.toLocaleString("en-BD")}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Settled to customer accounts
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Inventory Restocked
              </p>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {returnOrders.reduce(
                  (sum, o) =>
                    sum + o.items.reduce((acc, i) => acc + i.quantity, 0),
                  0,
                )}{" "}
                units
              </div>
              <p className="text-[11px] text-muted-foreground">
                Reconciled in stock movements
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Returns Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead className="w-28">Order</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="min-w-[180px]">Customer</TableHead>
                <TableHead className="min-w-[200px]">Return Reason</TableHead>
                <TableHead className="w-32">Order Status</TableHead>
                <TableHead className="w-32">Refund Status</TableHead>
                <TableHead className="w-28 text-right">Value</TableHead>
                <TableHead className="w-16 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-xs text-muted-foreground"
                  >
                    Loading return records...
                  </TableCell>
                </TableRow>
              ) : returnOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-xs text-muted-foreground"
                  >
                    No return or refund cases recorded.
                  </TableCell>
                </TableRow>
              ) : (
                returnOrders.map((o) => (
                  <TableRow key={o.id} className="text-xs">
                    <TableCell>
                      <Link
                        href={`/dashboard/orders/${o.id}`}
                        className="font-mono font-semibold text-primary hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                      {new Date(o.updatedAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {o.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {o.customerPhone}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-foreground leading-tight text-xs">
                        {o.returnReason ||
                          o.cancellationReason ||
                          "Customer return processed by merchant desk"}
                      </p>
                    </TableCell>

                    <TableCell>
                      <OrderStatusBadge status={o.orderStatus} />
                    </TableCell>

                    <TableCell>
                      <PaymentStatusBadge
                        status={o.paymentStatus}
                        method={o.paymentMethod}
                      />
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-foreground">
                      ৳{o.grandTotal.toLocaleString("en-BD")}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-7 w-7"
                      >
                        <Link href={`/dashboard/orders/${o.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
