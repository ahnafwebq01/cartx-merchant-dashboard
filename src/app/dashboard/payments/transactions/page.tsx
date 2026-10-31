"use client";

import React, { useState, Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PaymentTransactionsTable } from "@/features/payments/components/PaymentTransactionsTable";
import { usePaymentTransactionsQuery } from "@/features/payments/hooks";
import type { PaymentFilterParams } from "@/features/payments/types";

function PaymentTransactionsContent() {
  const [filterParams, setFilterParams] = useState<PaymentFilterParams>({
    page: 1,
    limit: 10,
    status: "all",
  });

  const { data, isLoading } = usePaymentTransactionsQuery(filterParams);

  const handleFilterChange = (newParams: Partial<PaymentFilterParams>) => {
    setFilterParams((prev) => ({ ...prev, ...newParams }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transactions"
        description="Comprehensive audit ledger of all customer checkouts, MFS transactions (bKash/Nagad), and card settlements."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payments & Finance", href: "/dashboard/payments" },
          { label: "Transactions" },
        ]}
      />

      <PaymentTransactionsTable
        transactions={data?.transactions || []}
        total={data?.total || 0}
        page={data?.page || 1}
        limit={data?.limit || 10}
        totalPages={data?.totalPages || 1}
        filterParams={filterParams}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function PaymentTransactionsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <PaymentTransactionsContent />
    </Suspense>
  );
}

