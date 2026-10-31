"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PaymentMethodCard } from "@/features/payments/components/PaymentMethodCard";
import { usePaymentMethodsQuery } from "@/features/payments/hooks";
import { Info } from "lucide-react";

function PaymentMethodsContent() {
  const { data: methods, isLoading } = usePaymentMethodsQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Methods & Gateway Integrations"
        description="Configure Bangladesh payment channels including bKash Tokenized, Nagad Direct, SSLCommerz, and Cash on Delivery."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payments & Finance", href: "/dashboard/payments" },
          { label: "Payment Methods" },
        ]}
      />

      {/* Security Guidance Callout */}
      <div className="p-4 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-950 dark:text-blue-200">
          <Info className="h-4 w-4 text-primary" />
          <span>Payment Gateway Architecture & Security Baseline</span>
        </div>
        <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
          CartX strictly follows zero-trust security principles. Private gateway credentials, API secret keys, and webhook signing certificates are managed solely through encrypted server-side proxy boundaries and are never exposed in browser storage or client networks.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods?.map((method) => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PaymentMethodsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <PaymentMethodsContent />
    </Suspense>
  );
}
