"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PaymentRefund, RefundStatus } from "../types";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface RefundsTableProps {
  refunds: PaymentRefund[];
  total?: number;
  isLoading?: boolean;
}

export function RefundsTable({
  refunds,
  isLoading = false,
}: RefundsTableProps) {
  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case "processed":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1 text-[10px]"
          >
            <CheckCircle2 className="h-2.5 w-2.5" />
            Processed
          </Badge>
        );
      case "pending":
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 gap-1 text-[10px]"
          >
            <Clock className="h-2.5 w-2.5" />
            {status === "approved" ? "Approved" : "Pending Approval"}
          </Badge>
        );
      case "rejected":
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 gap-1 text-[10px]"
          >
            <XCircle className="h-2.5 w-2.5" />
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold">Refund ID</TableHead>
            <TableHead className="text-xs font-semibold">Order #</TableHead>
            <TableHead className="text-xs font-semibold">Customer</TableHead>
            <TableHead className="text-xs font-semibold">Refund Amount</TableHead>
            <TableHead className="text-xs font-semibold">Reason</TableHead>
            <TableHead className="text-xs font-semibold">Gateway Ref</TableHead>
            <TableHead className="text-xs font-semibold">Status</TableHead>
            <TableHead className="text-xs font-semibold">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                <RotateCcw className="h-4 w-4 animate-spin mx-auto mb-2 text-primary" />
                Loading refund records...
              </TableCell>
            </TableRow>
          ) : refunds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                No refund requests or records found.
              </TableCell>
            </TableRow>
          ) : (
            refunds.map((ref) => (
              <TableRow key={ref.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-semibold text-foreground">
                  {ref.id}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <Link
                    href={`/dashboard/orders/${ref.orderId}`}
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    {ref.orderNumber}
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </Link>
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground">
                  {ref.customerName}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-purple-600">
                  ৳{ref.amount.toLocaleString("en-BD")}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                  {ref.reason}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {ref.gatewayRefundId || "N/A"}
                </TableCell>
                <TableCell>{getStatusBadge(ref.status)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {new Date(ref.requestedAt).toLocaleDateString("en-BD", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
