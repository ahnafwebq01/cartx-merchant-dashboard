"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { NormalizedShipmentStatus } from "../types";
import {
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShipmentStatusBadgeProps {
  status: NormalizedShipmentStatus;
  className?: string;
}

export function ShipmentStatusBadge({
  status,
  className,
}: ShipmentStatusBadgeProps) {
  switch (status) {
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
          <span>Pending Pickup</span>
        </Badge>
      );
    case "picked_up":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800 gap-1 font-medium",
            className
          )}
        >
          <PackageCheck className="h-3 w-3" />
          <span>Picked Up</span>
        </Badge>
      );
    case "in_transit":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 gap-1 font-medium",
            className
          )}
        >
          <Truck className="h-3 w-3" />
          <span>In Transit</span>
        </Badge>
      );
    case "delivered":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 font-medium",
            className
          )}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Delivered</span>
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
          <XCircle className="h-3 w-3" />
          <span>Cancelled</span>
        </Badge>
      );
    case "returned":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 gap-1 font-medium",
            className
          )}
        >
          <RotateCcw className="h-3 w-3" />
          <span>Returned (RTO)</span>
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 gap-1 font-medium",
            className
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Delivery Failed</span>
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

