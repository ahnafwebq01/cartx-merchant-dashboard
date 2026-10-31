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
        <div className="overflow-x-auto">
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
      </CardContent>
    </Card>
  );
}

