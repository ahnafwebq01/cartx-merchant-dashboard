"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { PaymentTransactionStatus } from "../types";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: PaymentTransactionStatus;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  switch (status) {
    case "successful":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 font-medium",
            className
          )}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Successful</span>
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 gap-1 font-medium",
            className
          )}
        >
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 gap-1 font-medium",
            className
          )}
        >
          <XCircle className="h-3 w-3" />
          <span>Failed</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 gap-1 font-medium",
            className
          )}
        >
          <Ban className="h-3 w-3" />
          <span>Cancelled</span>
        </Badge>
      );
    case "expired":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 gap-1 font-medium",
            className
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Expired</span>
        </Badge>
      );
    case "refunded":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800 gap-1 font-medium",
            className
          )}
        >
          <RotateCcw className="h-3 w-3" />
          <span>Refunded</span>
        </Badge>
      );
    case "partially_refunded":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800 gap-1 font-medium",
            className
          )}
        >
          <RotateCcw className="h-3 w-3" />
          <span>Partial Refund</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={cn("capitalize", className)}>
          {status}
        </Badge>
      );
  }
}

