import React from "react";
import { Badge } from "@/components/ui/badge";
import type { PaymentMethod, PaymentStatus } from "../types";
import { Check, Clock, AlertTriangle, RefreshCw } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  method?: PaymentMethod;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  method,
  className,
}: PaymentStatusBadgeProps) {
  const getBadge = () => {
    switch (status) {
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px] font-semibold uppercase tracking-wider"
          >
            <Check className="h-2.5 w-2.5" />
            Paid
          </Badge>
        );
      case "unpaid":
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-border text-[10px] font-semibold uppercase tracking-wider"
          >
            Unpaid
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[10px] font-semibold uppercase tracking-wider"
          >
            <Clock className="h-2.5 w-2.5" />
            Pending
          </Badge>
        );
      case "refunded":
      case "partially_refunded":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1 text-[10px] font-semibold uppercase tracking-wider"
          >
            <RefreshCw className="h-2.5 w-2.5" />
            {status === "partially_refunded" ? "Partially Refunded" : "Refunded"}
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="destructive"
            className="gap-1 text-[10px] font-semibold uppercase tracking-wider"
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] uppercase">
            {status}
          </Badge>
        );
    }
  };

  const formatMethod = (m?: PaymentMethod) => {
    if (!m) return "";
    switch (m) {
      case "cod":
        return "COD";
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "rocket":
        return "Rocket";
      case "sslcommerz":
        return "SSLCommerz";
      case "bank_transfer":
        return "Bank";
      default:
        return m;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className || ""}`}>
      {getBadge()}
      {method && (
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          via {formatMethod(method)}
        </span>
      )}
    </div>
  );
}

