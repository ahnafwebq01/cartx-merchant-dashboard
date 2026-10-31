"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { OrderStatus, OrderTimelineEvent } from "../types";
import {
  Check,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
}

const STAGES: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "ready_to_ship", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export function OrderTimeline({
  currentStatus,
  timeline,
}: OrderTimelineProps) {
  const isCancelled = currentStatus === "cancelled";
  const isReturned = currentStatus === "returned" || currentStatus === "partially_returned";

  // Calculate current stage index
  const currentIndex = STAGES.findIndex((s) => s.status === currentStatus);

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Order Fulfillment Journey</span>
          <span className="text-[11px] font-normal text-muted-foreground">
            {timeline.length} recorded events
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {/* Horizontal Visual Stepper (21st.dev inspired process timeline) */}
        {!isCancelled && !isReturned ? (
          <div className="relative py-2">
            <div className="flex items-center justify-between w-full">
              {STAGES.map((stage, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={stage.status}
                    className="flex flex-col items-center relative z-10 flex-1"
                  >
                    {/* Circle Node */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Stage Label */}
                    <span
                      className={`mt-1.5 text-[10px] text-center font-medium truncate max-w-[65px] ${
                        isCurrent
                          ? "text-primary font-bold"
                          : isPassed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting progress track line */}
            <div className="absolute top-[18px] left-[8%] right-[8%] h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${
                    currentIndex >= 0
                      ? (currentIndex / (STAGES.length - 1)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ) : isCancelled ? (
          <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
            <XCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">This order has been cancelled.</p>
              <p className="text-[11px] text-destructive/90">
                Fulfillment workflow was halted and items returned to inventory.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-700 dark:text-rose-400">
            <RotateCcw className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">This order was returned to origin.</p>
              <p className="text-[11px]">
                Return logistics handled and inventory reconciliation logged.
              </p>
            </div>
          </div>
        )}

        {/* Detailed Vertical Event History */}
        <div className="space-y-4 pt-2 border-t border-border/60">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Activity Timeline & Audit Trail
          </h4>

          <div className="relative pl-6 space-y-4 border-l-2 border-border ml-2">
            {[...timeline].reverse().map((event) => (
              <div key={event.id} className="relative group text-xs">
                {/* Timeline node pip */}
                <div className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-card border-2 border-primary" />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">
                      {event.title}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(event.timestamp).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-[11px]">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80 pt-0.5">
                    <span>By: {event.actor}</span>
                    {event.note && (
                      <span className="italic font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                        &quot;{event.note}&quot;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

