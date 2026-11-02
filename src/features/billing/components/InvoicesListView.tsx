"use client";

import React, { useState } from "react";
import {
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCw,
  Eye,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvoicesQuery, usePayInvoiceMutation } from "../hooks";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";
import type { Invoice } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function InvoicesListView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const { data: invoices = [], isLoading } = useInvoicesQuery(statusFilter);
  const payMutation = usePayInvoiceMutation();

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.planName.toLowerCase().includes(q) ||
      inv.paymentMethod.toLowerCase().includes(q)
    );
  });

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const handlePayOrRetry = async (invoiceId: string) => {
    try {
      await payMutation.mutateAsync(invoiceId);
    } catch {
      // Handled by hook toast
    }
  };

  if (isLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Subscription & Platform Invoices
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Tax-compliant settlement receipts for CartX subscriptions and add-on services.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Simulated Disclaimer Banner */}
          <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Simulated Billing Records:</strong> Invoices represent demonstration receipts.
              Payments and retries are executed in client demo mode.
            </span>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-3">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs h-7">All Invoices</TabsTrigger>
                <TabsTrigger value="paid" className="text-xs h-7">Paid</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs h-7">Pending</TabsTrigger>
                <TabsTrigger value="failed" className="text-xs h-7">Failed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          {/* Invoices Table */}
          {filteredInvoices.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-dashed border-border">
              <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium text-foreground">No invoices found</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No billing statements match your current filter selection.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Billing Method</TableHead>
                    <TableHead>Amount (BDT)</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono font-medium text-xs text-foreground">
                        {inv.invoiceNumber}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(inv.date)}
                      </TableCell>

                      <TableCell className="text-xs text-foreground font-medium">
                        {inv.planName}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {inv.paymentMethod}
                      </TableCell>

                      <TableCell className="font-mono font-semibold text-xs text-foreground">
                        ৳{inv.totalBDT.toLocaleString("bn-BD")}
                      </TableCell>

                      <TableCell>
                        {inv.status === "paid" && (
                          <Badge variant="success" className="text-[11px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </Badge>
                        )}
                        {inv.status === "pending" && (
                          <Badge variant="warning" className="text-[11px] gap-1">
                            <AlertCircle className="h-3 w-3" /> Pending
                          </Badge>
                        )}
                        {inv.status === "failed" && (
                          <Badge variant="destructive" className="text-[11px] gap-1">
                            <XCircle className="h-3 w-3" /> Failed
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(inv.status === "pending" || inv.status === "failed") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayOrRetry(inv.id)}
                              disabled={payMutation.isPending}
                              className="h-7 text-xs px-2 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                            >
                              <RotateCw className="h-3 w-3" />
                              {inv.status === "failed" ? "Retry" : "Pay Now"}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvoice(inv)}
                            className="h-7 text-xs px-2 gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={Boolean(selectedInvoice)}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      />
    </div>
  );
}
