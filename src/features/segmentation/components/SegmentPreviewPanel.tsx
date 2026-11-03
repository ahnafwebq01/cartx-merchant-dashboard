"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SegmentPreview } from "../types";
import { mockCustomerService } from "@/features/customers/services/mockCustomers";

interface SegmentPreviewPanelProps {
  preview: SegmentPreview;
}

export function SegmentPreviewPanel({ preview }: SegmentPreviewPanelProps) {
  const allCustomers = mockCustomerService.getCustomers({ limit: 100 }).customers;
  const matchedCustomers = allCustomers.filter((c) =>
    preview.matchingCustomerIds.includes(c.id)
  );

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Real-Time Segment Audience</span>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {preview.matchingCount} of {preview.totalCustomers} Matched ({preview.percentage}%)
        </Badge>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Audience Share of Customer Base</span>
          <span className="font-semibold text-foreground">{preview.percentage}%</span>
        </div>
        <Progress value={preview.percentage} className="h-2" />
      </div>

      {/* Matched Customer List Preview */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Matched Demo Shoppers ({matchedCustomers.length})
        </span>

        {matchedCustomers.length === 0 ? (
          <div className="p-3 rounded-lg border border-dashed border-border bg-background text-center text-xs text-muted-foreground">
            No customers match the current condition rules.
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {matchedCustomers.map((cust) => (
              <div
                key={cust.id}
                className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-background text-xs"
              >
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{cust.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {cust.city || "Dhaka"} • {cust.totalOrders} orders
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-primary">
                    ৳{cust.totalSpend.toLocaleString("en-BD")}
                  </div>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 capitalize">
                    {cust.segment.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        <span>Evaluated dynamically against local browser CRM records</span>
      </div>
    </div>
  );
}

