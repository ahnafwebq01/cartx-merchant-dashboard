import React from "react";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "../types";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Send,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className={`bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "confirmed":
      return (
        <Badge
          variant="outline"
          className={`bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          Confirmed
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className={`bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <Package className="h-3 w-3" />
          Processing
        </Badge>
      );
    case "ready_to_ship":
      return (
        <Badge
          variant="outline"
          className={`bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <Truck className="h-3 w-3" />
          Ready to Ship
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          variant="outline"
          className={`bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <Send className="h-3 w-3" />
          Shipped
        </Badge>
      );
    case "delivered":
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="destructive"
          className={`gap-1 font-medium text-[11px] ${className || ""}`}
        >
          <XCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    case "returned":
    case "partially_returned":
      return (
        <Badge
          variant="outline"
          className={`bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1 font-medium text-[11px] ${
            className || ""
          }`}
        >
          <RotateCcw className="h-3 w-3" />
          {status === "partially_returned" ? "Partially Returned" : "Returned"}
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={`text-[11px] ${className || ""}`}>
          {status}
        </Badge>
      );
  }
}

