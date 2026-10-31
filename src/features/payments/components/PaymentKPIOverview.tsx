"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { PaymentKPIStats } from "../types";
import {
  CreditCard,
  Clock,
  RotateCcw,
  Sliders,
} from "lucide-react";

interface PaymentKPIOverviewProps {
  stats?: PaymentKPIStats;
  isLoading?: boolean;
}

export function PaymentKPIOverview({
  stats,
  isLoading = false,
}: PaymentKPIOverviewProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-border">
            <CardContent className="p-4 h-24 bg-muted/30" />
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Gross Settled Volume",
      value: `৳${stats.totalGrossVolume.toLocaleString("en-BD")}`,
      subtitle: `${stats.successfulTransactionsCount} verified successful payments`,
      icon: CreditCard,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Pending Payments",
      value: stats.pendingTransactionsCount.toString(),
      subtitle: "Awaiting gateway execution or COD delivery",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      title: "Refunds Processed",
      value: `৳${stats.totalRefundedAmount.toLocaleString("en-BD")}`,
      subtitle: "Total refunded back to customer wallets",
      icon: RotateCcw,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      title: "Active Gateways",
      value: `${stats.activeMethodsCount} Enabled`,
      subtitle: "Configured payment channels",
      icon: Sliders,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="border-border shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {kpi.title}
                </span>
                <div className="text-xl font-bold font-mono text-foreground">
                  {kpi.value}
                </div>
                <p className="text-[11px] text-muted-foreground">{kpi.subtitle}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
