"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, CheckCircle2 } from "lucide-react";

interface FlashSaleCountdownProps {
  startTime: string;
  endTime: string;
  status: "draft" | "scheduled" | "active" | "ended";
  claimedStock: number;
  allocatedStock: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUpcoming: boolean;
}

function calculateRemaining(startStr: string, endStr: string): TimeRemaining {
  const now = Date.now();
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();

  if (now < start) {
    const diff = start - now;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
      isUpcoming: true,
    };
  }

  if (now > end) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isUpcoming: false,
    };
  }

  const diff = end - now;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
    isUpcoming: false,
  };
}

export function FlashSaleCountdown({
  startTime,
  endTime,
  status,
  claimedStock,
  allocatedStock,
}: FlashSaleCountdownProps) {
  const [time, setTime] = useState<TimeRemaining>(() =>
    calculateRemaining(startTime, endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateRemaining(startTime, endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const percentageClaimed = Math.min(
    100,
    Math.round((claimedStock / (allocatedStock || 1)) * 100)
  );

  const pad = (n: number) => String(n).padStart(2, "0");

  let statusBadgeVariant: "default" | "secondary" | "outline" | "success" | "warning" = "default";
  let statusLabel = "Active";

  if (status === "draft") {
    statusBadgeVariant = "secondary";
    statusLabel = "Draft";
  } else if (time.isExpired || status === "ended") {
    statusBadgeVariant = "outline";
    statusLabel = "Ended";
  } else if (time.isUpcoming || status === "scheduled") {
    statusBadgeVariant = "warning";
    statusLabel = "Scheduled";
  } else {
    statusBadgeVariant = "success";
    statusLabel = "Live Now";
  }

  return (
    <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/70">
      {/* Header with status badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          {statusLabel === "Live Now" ? (
            <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          ) : (
            <Clock className="h-3.5 w-3.5" />
          )}
          {time.isUpcoming ? "Starts In" : time.isExpired ? "Campaign Closed" : "Ends In"}
        </span>
        <Badge variant={statusBadgeVariant} className="text-[10px] uppercase font-bold tracking-wider">
          {statusLabel}
        </Badge>
      </div>

      {/* Countdown Timer Display */}
      {!time.isExpired ? (
        <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
          <div className="bg-background rounded border border-border p-1.5">
            <div className="text-sm font-bold text-foreground">{pad(time.days)}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Days</div>
          </div>
          <div className="bg-background rounded border border-border p-1.5">
            <div className="text-sm font-bold text-foreground">{pad(time.hours)}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Hours</div>
          </div>
          <div className="bg-background rounded border border-border p-1.5">
            <div className="text-sm font-bold text-foreground">{pad(time.minutes)}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Mins</div>
          </div>
          <div className="bg-background rounded border border-border p-1.5">
            <div className="text-sm font-bold text-foreground">{pad(time.seconds)}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Secs</div>
          </div>
        </div>
      ) : (
        <div className="py-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Flash sale has concluded
        </div>
      )}

      {/* Quota Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Claimed Quota</span>
          <span className="font-semibold text-foreground">
            {claimedStock} / {allocatedStock} units ({percentageClaimed}%)
          </span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              percentageClaimed >= 90
                ? "bg-rose-500"
                : percentageClaimed >= 60
                ? "bg-amber-500"
                : "bg-primary"
            }`}
            style={{ width: `${percentageClaimed}%` }}
          />
        </div>
      </div>
    </div>
  );
}

