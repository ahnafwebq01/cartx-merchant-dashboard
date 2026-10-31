"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomerSegmentsCard } from "@/features/customers/components/CustomerSegmentsCard";
import { useCustomerStatsQuery } from "@/features/customers/hooks";
import { Users, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export default function CustomerGroupsPage() {
  const { data: stats } = useCustomerStatsQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Groups & Segments"
        description="Automated customer classification based on order count, purchase recency, and lifetime spending."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Customers", href: "/dashboard/customers" },
          { label: "Groups & Segments" },
        ]}
        actions={
          <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
            <Link href="/dashboard/customers">
              <Users className="h-3.5 w-3.5" />
              All Customers
            </Link>
          </Button>
        }
      />

      {/* Segments Cards */}
      {stats && <CustomerSegmentsCard stats={stats} />}

      {/* Merchandising & Marketing Playbooks for Bangladesh Merchants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <CardTitle className="text-sm font-semibold">
                VIP & High-Value Customer Retention
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              High-value customers who have spent over ৳10,000 generate the highest profit
              margins. Consider offering complimentary gift packaging on festival orders (e.g. Eid
              Ul Fitr, Durga Puja) and early-access privileges to new seasonal drops.
            </p>
            <div className="pt-1">
              <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1">
                <Link href="/dashboard/customers?segment=high_value">
                  <span>Browse {stats?.highValueCustomers || 0} VIP Customers</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <MessageCircle className="h-4 w-4" />
              <CardTitle className="text-sm font-semibold">
                Inactive Buyer Re-Engagement
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              Re-engage dormant shoppers with personalized SMS promo coupons or free shipping inside
              Dhaka. Win-back campaigns typically boast an 18-24% return checkout rate.
            </p>
            <div className="pt-1">
              <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1">
                <Link href="/dashboard/customers?segment=inactive">
                  <span>Browse Inactive Customers</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

