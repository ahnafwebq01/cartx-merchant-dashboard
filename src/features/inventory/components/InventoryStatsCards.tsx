"use client";

import React from "react";
import { Package, Boxes, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { InventoryOverviewStats } from "../types";

interface InventoryStatsCardsProps {
  stats: InventoryOverviewStats;
}

export function InventoryStatsCards({ stats }: InventoryStatsCardsProps) {
  const cards = [
    {
      title: "Tracked Products",
      value: stats.totalTrackedProducts,
      subtitle: "Items with stock tracking enabled",
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Total Units in Stock",
      value: stats.totalUnitsAvailable.toLocaleString("en-BD"),
      subtitle: "Available on-hand units to sell",
      icon: Boxes,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockCount,
      subtitle: "Items at or below reorder threshold",
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? "text-amber-600" : "text-muted-foreground",
      bg: stats.lowStockCount > 0 ? "bg-amber-500/10" : "bg-muted",
      border: stats.lowStockCount > 0 ? "border-amber-500/30" : "border-border",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockCount,
      subtitle: "Products with 0 available units",
      icon: XCircle,
      color: stats.outOfStockCount > 0 ? "text-destructive" : "text-muted-foreground",
      bg: stats.outOfStockCount > 0 ? "bg-destructive/10" : "bg-muted",
      border: stats.outOfStockCount > 0 ? "border-destructive/30" : "border-border",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`border ${card.border} bg-card transition-shadow hover:shadow-xs`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </span>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bg} ${card.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
