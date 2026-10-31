"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  PaymentFilterParams,
  PaymentProviderId,
  PaymentTransaction,
  PaymentTransactionStatus,
} from "../types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { mockPaymentService } from "../services/mockPayments";
import { PaymentTransactionDetailsModal } from "./PaymentTransactionDetailsModal";

interface PaymentTransactionsTableProps {
  transactions: PaymentTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filterParams: PaymentFilterParams;
  onFilterChange: (newParams: Partial<PaymentFilterParams>) => void;
  isLoading?: boolean;
}

export function PaymentTransactionsTable({
  transactions,
  total,
  page,
  limit,
  totalPages,
  filterParams,
  onFilterChange,
  isLoading = false,
}: PaymentTransactionsTableProps) {
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const handleExportCSV = () => {
    const csvData = mockPaymentService.exportTransactionsToCSV(transactions);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cartx-transactions-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusTabs: { label: string; value: PaymentTransactionStatus | "all" }[] = [
    { label: "All Transactions", value: "all" },
    { label: "Successful", value: "successful" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
    { label: "Refunded", value: "refunded" },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
        {statusTabs.map((tab) => {
          const isSelected =
            (filterParams.status || "all") === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ status: tab.value, page: 1 })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by order #, TrxID, customer, phone..."
              value={filterParams.search || ""}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Provider Filter */}
          <Select
            value={filterParams.provider || "all"}
            onValueChange={(val) =>
              onFilterChange({
                provider: val as PaymentProviderId | "all",
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px] text-xs h-9">
              <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gateways</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Preset */}
          <Select
            value={filterParams.datePreset || "all"}
            onValueChange={(val) =>
              onFilterChange({
                datePreset: val as PaymentFilterParams["datePreset"],
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[130px] text-xs h-9">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* Export CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-9 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold">Trx ID / Ref</TableHead>
              <TableHead className="text-xs font-semibold">Order #</TableHead>
              <TableHead className="text-xs font-semibold">Customer</TableHead>
              <TableHead className="text-xs font-semibold">Gateway</TableHead>
              <TableHead className="text-xs font-semibold">Amount (BDT)</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-primary" />
                  Loading payment transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  No payment transactions found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    <span className="font-semibold text-foreground block">{tx.id}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {tx.gatewayTransactionId ? (
                        `TrxID: ${tx.gatewayTransactionId}`
                      ) : (
                        <span className="italic">Ref: {tx.gatewayReference || "N/A"}</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/dashboard/orders/${tx.orderId}`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      {tx.orderNumber}
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">{tx.customerName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {tx.customerPhone}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="secondary" className="uppercase font-semibold tracking-wider text-[10px]">
                      {tx.provider}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    ৳{tx.amount.toLocaleString("en-BD")}
                    {tx.refundedAmount > 0 && (
                      <span className="block text-[10px] font-normal text-purple-600">
                        -৳{tx.refundedAmount.toLocaleString("en-BD")} refunded
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(tx.initiatedAt).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTx(tx)}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Clamped Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          <div>
            Showing {transactions.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} transactions
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFilterChange({ page: page - 1 })}
              disabled={page <= 1}
              className="h-7 px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFilterChange({ page: page + 1 })}
              disabled={page >= totalPages}
              className="h-7 px-2"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedTx && (
        <PaymentTransactionDetailsModal
          transaction={selectedTx}
          isOpen={Boolean(selectedTx)}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}

