import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { CustomerOverviewStats } from "../types";
import { Users, UserPlus, Award, TrendingUp } from "lucide-react";

interface CustomerStatsCardsProps {
  stats: CustomerOverviewStats;
}

export function CustomerStatsCards({ stats }: CustomerStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Customers */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Customers
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.totalCustomers}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Storewide client base
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Repeat Buyers */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Repeat Buyers
            </p>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {stats.repeatCustomers}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {stats.totalCustomers > 0
                ? `${Math.round(
                    (stats.repeatCustomers / stats.totalCustomers) * 100
                  )}% repeat rate`
                : "0%"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* High-Value VIPs */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              High-Value / VIPs
            </p>
            <div className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
              {stats.highValueCustomers}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Spent &gt; ৳10,000
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Customer Lifetime Value */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Avg Customer LTV
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              ৳{stats.averageCustomerLifetimeValue.toLocaleString("en-BD")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Total ৳{stats.totalRevenue.toLocaleString("en-BD")}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

