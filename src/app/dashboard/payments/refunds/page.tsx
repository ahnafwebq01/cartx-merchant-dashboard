"use client";

import React, { useState, Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { RefundsTable } from "@/features/payments/components/RefundsTable";
import { useRefundsQuery } from "@/features/payments/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function PaymentRefundsContent() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useRefundsQuery({ search });

  const totalRefundAmount =
    data?.refunds?.reduce((acc, r) => acc + (r.status === "processed" ? r.amount : 0), 0) || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Requests & Ledger"
        description="Audit customer refunds processed through MFS gateways, bank reversals, and COD returns."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payments & Finance", href: "/dashboard/payments" },
          { label: "Refunds" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">
                Total Refunded (Settled)
              </span>
              <span className="text-xl font-bold font-mono text-purple-600">
                ৳{totalRefundAmount.toLocaleString("en-BD")}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40">
              <RotateCcw className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs sm:col-span-2">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-semibold text-foreground block">
                Authoritative Refund Protection
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Refunds in CartX enforce idempotency keys to eliminate double-reversals, validate against original payment balances, and preserve inventory reconciliation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search by refund ID, order #, customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 text-xs h-9"
        />
      </div>

      <RefundsTable
        refunds={data?.refunds || []}
        total={data?.total || 0}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function PaymentRefundsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <PaymentRefundsContent />
    </Suspense>
  );
}
