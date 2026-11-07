"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Order } from "../../orders/types";
import { OrderStatusBadge } from "../../orders/components/OrderStatusBadge";
import { PaymentStatusBadge } from "../../orders/components/PaymentStatusBadge";
import { ShoppingBag, ArrowUpRight } from "lucide-react";

interface CustomerOrdersTableProps {
  orders: Order[];
  customerName: string;
}

export function CustomerOrdersTable({
  orders,
  customerName,
}: CustomerOrdersTableProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span>Order History ({orders.length})</span>
          </div>
          <span className="text-xs text-muted-foreground font-normal">
            Orders placed by {customerName}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead className="w-28">Order</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="min-w-[160px]">Items</TableHead>
                <TableHead className="w-28">Payment</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-24 text-right">Total</TableHead>
                <TableHead className="w-12 text-center"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-xs text-muted-foreground"
                  >
                    No orders placed yet by this customer.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
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
                      {new Date(o.createdAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      <p className="text-foreground truncate max-w-[180px]">
                        {o.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                      </p>
                    </TableCell>

                    <TableCell>
                      <PaymentStatusBadge
                        status={o.paymentStatus}
                        method={o.paymentMethod}
                      />
                    </TableCell>

                    <TableCell>
                      <OrderStatusBadge status={o.orderStatus} />
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-foreground">
                      ৳{o.grandTotal.toLocaleString("en-BD")}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                        <Link href={`/dashboard/orders/${o.id}`}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card-Based Transformation View */}
        <div className="block md:hidden">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No orders placed yet by this customer.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {orders.map((o) => (
                <div key={o.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/dashboard/orders/${o.id}`}
                        className="font-mono font-bold text-xs text-primary hover:underline block"
                      >
                        {o.orderNumber}
                      </Link>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <OrderStatusBadge status={o.orderStatus} />
                      <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                        <Link href={`/dashboard/orders/${o.id}`}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs pt-1 border-t border-border/40">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Items Purchased</span>
                    <p className="text-foreground text-xs leading-snug mt-0.5">
                      {o.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                    <PaymentStatusBadge
                      status={o.paymentStatus}
                      method={o.paymentMethod}
                    />
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Total</span>
                      <span className="font-mono font-bold text-sm text-foreground">
                        ৳{o.grandTotal.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

