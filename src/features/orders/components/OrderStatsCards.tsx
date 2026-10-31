import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { OrderKPIStats } from "../types";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";

interface OrderStatsCardsProps {
  stats: OrderKPIStats;
}

export function OrderStatsCards({ stats }: OrderStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Orders */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.totalOrders}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Across all channels
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Confirmation */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Pending Orders
            </p>
            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {stats.pendingOrders}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Requires merchant review
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* In Transit / Processing */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Processing & Shipped
            </p>
            <div className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              {stats.processingOrders + stats.shippedOrders}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {stats.shippedOrders} with couriers
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Truck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Delivered Revenue */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Net Order Revenue
            </p>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
              ৳{stats.totalRevenue.toLocaleString("en-BD")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              AOV: ৳{stats.averageOrderValue.toLocaleString("en-BD")}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

