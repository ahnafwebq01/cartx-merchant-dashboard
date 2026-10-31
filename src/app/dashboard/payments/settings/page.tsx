"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Key, Lock, CheckCircle2 } from "lucide-react";

function PaymentSettingsContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment & Finance Settings"
        description="Configure platform currency standards, webhook callback endpoints, and security policies."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payments & Finance", href: "/dashboard/payments" },
          { label: "Settings" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency & Locale */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Store Currency & Formats</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Primary currency and numeric conventions for customer billing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded bg-muted/30 border border-border/40">
              <span className="text-muted-foreground">Primary Currency:</span>
              <span className="font-bold font-mono text-foreground">Bangladeshi Taka (BDT ৳)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded bg-muted/30 border border-border/40">
              <span className="text-muted-foreground">Number Formatting:</span>
              <span className="font-mono text-foreground">en-BD (1,00,000 / 12,500)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded bg-muted/30 border border-border/40">
              <span className="text-muted-foreground">Timezone:</span>
              <span className="font-mono text-foreground">Asia/Dhaka (GMT+6)</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Disclosures */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base">Gateway Security Policy</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Zero-trust architecture enforcing PCI-DSS and Bangladesh Bank regulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>All secret keys stored solely in server-side encrypted key-vaults.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Frontend payment verification is never treated as authoritative without backend cryptographic validation.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Every refund is bound by unique idempotency keys to eliminate double debits.</span>
            </div>
          </CardContent>
        </Card>

        {/* Webhooks & Callbacks Reference (Full width) */}
        <Card className="border-border shadow-xs md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Authorized Webhook & IPN Callbacks</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Backend listener URLs for payment provider server-to-server notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">bKash Webhook Listener</span>
                <Badge variant="outline" className="text-[10px] font-mono">POST</Badge>
              </div>
              <code className="text-[11px] font-mono text-primary block break-all">
                https://api.cartx.com.bd/v1/payments/webhooks/bkash
              </code>
            </div>

            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Nagad IPN Verification</span>
                <Badge variant="outline" className="text-[10px] font-mono">POST</Badge>
              </div>
              <code className="text-[11px] font-mono text-primary block break-all">
                https://api.cartx.com.bd/v1/payments/webhooks/nagad
              </code>
            </div>

            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">SSLCommerz IPN (Instant Payment Notification)</span>
                <Badge variant="outline" className="text-[10px] font-mono">POST</Badge>
              </div>
              <code className="text-[11px] font-mono text-primary block break-all">
                https://api.cartx.com.bd/v1/payments/webhooks/sslcommerz
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSettingsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <PaymentSettingsContent />
    </Suspense>
  );
}
