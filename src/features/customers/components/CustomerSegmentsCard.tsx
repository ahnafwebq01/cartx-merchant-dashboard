"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CustomerOverviewStats } from "../types";
import { Users, Award, TrendingUp, UserX, ArrowRight } from "lucide-react";

interface CustomerSegmentsCardProps {
  stats: CustomerOverviewStats;
}

export function CustomerSegmentsCard({ stats }: CustomerSegmentsCardProps) {
  const segments = [
    {
      id: "new",
      title: "New Customers",
      count: stats.newCustomers,
      description: "First-time buyers with exactly 1 completed or pending order.",
      icon: Users,
      color: "text-blue-600 bg-blue-500/10",
      query: "new",
    },
    {
      id: "repeat",
      title: "Repeat Buyers",
      count: stats.repeatCustomers,
      description: "Loyal customers with 2 or more orders placed across the store.",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-500/10",
      query: "repeat",
    },
    {
      id: "high_value",
      title: "High-Value / VIPs",
      count: stats.highValueCustomers,
      description: "Top spenders with cumulative lifetime purchases exceeding ৳10,000.",
      icon: Award,
      color: "text-purple-600 bg-purple-500/10",
      query: "high_value",
    },
    {
      id: "inactive",
      title: "Inactive Buyers",
      count: Math.max(
        0,
        stats.totalCustomers -
          (stats.newCustomers + stats.repeatCustomers)
      ),
      description: "Dormant accounts with no purchase activity recorded in over 60 days.",
      icon: UserX,
      color: "text-muted-foreground bg-muted",
      query: "inactive",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {segments.map((seg) => {
        const Icon = seg.icon;
        return (
          <Card key={seg.id} className="border border-border/80 shadow-xs flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${seg.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold font-mono text-foreground">
                  {seg.count}
                </span>
              </div>
              <CardTitle className="text-sm font-semibold pt-2">
                {seg.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {seg.description}
              </p>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full text-xs h-8 justify-between px-2 text-primary hover:text-primary hover:bg-primary/5"
              >
                <Link href={`/dashboard/customers?segment=${seg.query}`}>
                  <span>View Customers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

