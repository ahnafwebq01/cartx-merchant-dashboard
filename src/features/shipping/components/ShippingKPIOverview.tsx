"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ShippingKPIStats } from "../types";
import { Truck, CheckCircle2, Clock, Banknote } from "lucide-react";

interface ShippingKPIOverviewProps {
  stats?: ShippingKPIStats;
  isLoading?: boolean;
}

export function ShippingKPIOverview({
  stats,
  isLoading = false,
}: ShippingKPIOverviewProps) {
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
      title: "In Transit Parcels",
      value: stats.inTransitCount.toString(),
      subtitle: "Active consignments on courier delivery trucks",
      icon: Truck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Successfully Delivered",
      value: stats.deliveredCount.toString(),
      subtitle: "Doorstep delivery confirmed",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Pending Pickup",
      value: stats.pendingPickupCount.toString(),
      subtitle: "Awaiting courier rider dispatch from hub",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      title: "Active COD to Collect",
      value: `৳${stats.totalCodToCollect.toLocaleString("en-BD")}`,
      subtitle: "Total Cash on Delivery receivables",
      icon: Banknote,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
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

