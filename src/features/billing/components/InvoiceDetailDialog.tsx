"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, Receipt, Building2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import type { Invoice } from "../types";
import { toast } from "sonner";

interface InvoiceDetailDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownload = () => {
    toast.success(`Downloaded ${invoice.invoiceNumber}.pdf (Demo Mode simulated)`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <div>
              <DialogTitle className="text-lg">
                Tax Invoice {invoice.invoiceNumber}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detailed printable VAT tax invoice breakdown for CartX subscription.
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 h-8">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5 h-8">
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Invoice Container */}
        <div className="space-y-6 py-3 text-sm">
          {/* Simulated Disclaimer Banner */}
          <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary shrink-0" />
              <span>Simulated demo invoice for testing and platform accounting reconciliation.</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              DEMO VOUCHER
            </Badge>
          </div>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg text-primary">
                <Building2 className="h-5 w-5" />
                <span>CartX Technologies BD Ltd.</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Level 8, Tower 71, Mohakhali C/A, Dhaka 1212, Bangladesh
              </p>
              <p className="text-xs text-muted-foreground">
                BIN: 001928374-0101 • support@cartx.com.bd
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-muted-foreground uppercase font-semibold">
                Invoice Status
              </div>
              <div className="mt-1">
                {invoice.status === "paid" && (
                  <Badge variant="success" className="text-xs gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Paid in Full
                  </Badge>
                )}
                {invoice.status === "pending" && (
                  <Badge variant="warning" className="text-xs gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Payment Pending
                  </Badge>
                )}
                {invoice.status === "failed" && (
                  <Badge variant="destructive" className="text-xs gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Payment Failed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Bill To & Invoice Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Billed To:
              </p>
              <p className="font-bold text-foreground text-sm">Green Harvest Organic BD Ltd.</p>
              <p className="text-muted-foreground mt-0.5">BIN: 002819472-0101</p>
              <p className="text-muted-foreground">House 42, Road 11, Block D, Banani</p>
              <p className="text-muted-foreground">Dhaka 1213, Bangladesh</p>
              <p className="text-muted-foreground">accounts@greenharvest.com.bd</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <div>
                <span className="text-muted-foreground">Invoice Number: </span>
                <span className="font-mono font-semibold text-foreground">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Issue Date: </span>
                <span className="font-medium text-foreground">{formatDate(invoice.date)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Due Date: </span>
                <span className="font-medium text-foreground">{formatDate(invoice.dueDate)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method: </span>
                <span className="font-medium text-foreground">{invoice.paymentMethod}</span>
              </div>
              {invoice.transactionId && (
                <div>
                  <span className="text-muted-foreground">Gateway Ref: </span>
                  <span className="font-mono text-[11px] text-foreground">{invoice.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Item Description</th>
                  <th className="text-right p-3 font-semibold text-foreground">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.lineItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-3 text-foreground font-medium">{item.description}</td>
                    <td className="p-3 text-right font-mono text-foreground font-semibold">
                      ৳{item.amountBDT.toLocaleString("bn-BD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between py-1 border-b border-border text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono font-medium text-foreground">
                  ৳{invoice.subtotalBDT.toLocaleString("bn-BD")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border text-muted-foreground">
                <span>VAT / Tax (0% SaaS):</span>
                <span className="font-mono font-medium text-foreground">৳0</span>
              </div>
              <div className="flex justify-between py-1.5 text-sm font-bold text-foreground">
                <span>Total Amount:</span>
                <span className="font-mono text-primary text-base">
                  ৳{invoice.totalBDT.toLocaleString("bn-BD")}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border text-center text-[11px] text-muted-foreground">
            Thank you for building on CartX Merchant Platform. Questions? Contact{" "}
            <strong>billing@cartx.com.bd</strong> or open a ticket in Help Center.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

