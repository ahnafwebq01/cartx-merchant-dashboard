"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PaymentKPIOverview } from "@/features/payments/components/PaymentKPIOverview";
import { PaymentTransactionsTable } from "@/features/payments/components/PaymentTransactionsTable";
import {
  usePaymentKPIsQuery,
  usePaymentTransactionsQuery,
  usePaymentMethodsQuery,
  useResetDemoPaymentsMutation,
} from "@/features/payments/hooks";
import type { PaymentFilterParams } from "@/features/payments/types";
import {
  CreditCard,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Sliders,
  Receipt,
} from "lucide-react";

function PaymentsOverviewContent() {
  const [filterParams, setFilterParams] = useState<PaymentFilterParams>({
    page: 1,
    limit: 5,
    status: "all",
  });

  const { data: stats, isLoading: isStatsLoading } = usePaymentKPIsQuery();
  const { data: txData, isLoading: isTxLoading } = usePaymentTransactionsQuery(filterParams);
  const { data: methods } = usePaymentMethodsQuery();
  const resetMutation = useResetDemoPaymentsMutation();

  const handleFilterChange = (newParams: Partial<PaymentFilterParams>) => {
    setFilterParams((prev) => ({ ...prev, ...newParams }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Finance"
        description="Monitor verified merchant transactions, bKash/Nagad gateways, COD collections, and customer refunds."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payments & Finance" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Demo Data
            </Button>
            <Link href="/dashboard/payments/methods">
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Payment Methods
              </Button>
            </Link>
            <Link href="/dashboard/payments/transactions">
              <Button size="sm" className="text-xs h-8 gap-1.5">
                <Receipt className="h-3.5 w-3.5" />
                All Transactions
              </Button>
            </Link>
          </div>
        }
      />

      {/* Demo Mode & Zero-Trust Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-blue-950 dark:text-blue-200">
              Bangladesh Payment Gateways Active (High-Fidelity Demo Simulation)
            </h4>
            <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
              Adapters for bKash Tokenized, Nagad Direct, SSLCommerz, and Cash on Delivery are initialized. Merchant credentials remain secured server-side.
            </p>
          </div>
        </div>

        <Link href="/dashboard/payments/settings">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 text-blue-700 border-blue-300 hover:bg-blue-100/50 dark:text-blue-300 dark:border-blue-800"
          >
            Gateway Security Info
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <PaymentKPIOverview stats={stats} isLoading={isStatsLoading} />

      {/* Quick Summary Split: Recent Transactions + Active Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Transactions Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Recent Payment Transactions
            </h3>
            <Link
              href="/dashboard/payments/transactions"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <PaymentTransactionsTable
            transactions={txData?.transactions || []}
            total={txData?.total || 0}
            page={txData?.page || 1}
            limit={txData?.limit || 5}
            totalPages={txData?.totalPages || 1}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
            isLoading={isTxLoading}
          />
        </div>

        {/* Right: Payment Channels Summary Card */}
        <div className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Configured Gateways</span>
                <Link
                  href="/dashboard/payments/methods"
                  className="text-xs text-primary font-normal hover:underline"
                >
                  Manage
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {methods?.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg border border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {m.displayNameBn} • {m.environment.toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      m.isEnabled
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.isEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsOverviewPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <PaymentsOverviewContent />
    </Suspense>
  );
}

