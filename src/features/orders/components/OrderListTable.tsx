"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStatus } from "../types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  MoreHorizontal,
  Eye,
  Printer,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  CheckCircle2,
  Package,
} from "lucide-react";

interface OrderListTableProps {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onSortChange: (sortBy: string) => void;
  currentSort?: string;
  onQuickStatusChange: (orderId: string, targetStatus: OrderStatus) => void;
  onPrintInvoice: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
  onBulkStatusChange?: (status: OrderStatus) => void;
  onBulkCancel?: () => void;
  onExportCSV?: () => void;
  isLoading?: boolean;
}

export function OrderListTable({
  orders,
  total,
  page,
  limit,
  totalPages,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onPageChange,
  onLimitChange,
  onSortChange,
  currentSort = "date_desc",
  onQuickStatusChange,
  onPrintInvoice,
  onCancelOrder,
  onBulkStatusChange,
  onBulkCancel,
  onExportCSV,
  isLoading = false,
}: OrderListTableProps) {
  const isAllSelected =
    orders.length > 0 && orders.every((o) => selectedIds.includes(o.id));
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < orders.length;

  return (
    <div className="space-y-3">
      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/60 border border-border rounded-lg text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {selectedIds.length} order(s) selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onBulkStatusChange && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkStatusChange("confirmed")}
                  className="h-8 text-xs gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  Mark Confirmed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkStatusChange("processing")}
                  className="h-8 text-xs gap-1"
                >
                  <Package className="h-3.5 w-3.5 text-indigo-600" />
                  Mark Processing
                </Button>
              </>
            )}

            {onExportCSV && (
              <Button
                size="sm"
                variant="outline"
                onClick={onExportCSV}
                className="h-8 text-xs gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            )}

            {onBulkCancel && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onBulkCancel}
                className="h-8 text-xs gap-1"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel Selected
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Orders Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead className="w-10 text-center">
                  <Checkbox
                    checked={
                      isAllSelected ? true : isSomeSelected ? "indeterminate" : false
                    }
                    onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                    aria-label="Select all orders"
                  />
                </TableHead>
                <TableHead className="w-28">Order</TableHead>
                <TableHead className="w-36">
                  <button
                    onClick={() =>
                      onSortChange(
                        currentSort === "date_desc" ? "date_asc" : "date_desc",
                      )
                    }
                    className="flex items-center gap-1 hover:text-foreground font-semibold"
                  >
                    Date & Time
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[180px]">Customer</TableHead>
                <TableHead className="min-w-[160px]">Items</TableHead>
                <TableHead className="w-32">Payment</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-32 text-right">
                  <button
                    onClick={() =>
                      onSortChange(
                        currentSort === "total_desc"
                          ? "total_asc"
                          : "total_desc",
                      )
                    }
                    className="flex items-center justify-end gap-1 hover:text-foreground font-semibold ml-auto"
                  >
                    Total
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="w-12 text-center"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-36 text-center text-xs text-muted-foreground"
                  >
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-36 text-center text-xs text-muted-foreground"
                  >
                    No matching orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  const totalItemsCount = order.items.reduce(
                    (acc, i) => acc + i.quantity,
                    0,
                  );

                  return (
                    <TableRow
                      key={order.id}
                      className={`text-xs transition-colors ${
                        isSelected ? "bg-muted/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            onSelectOne(order.id, Boolean(checked))
                          }
                          aria-label={`Select order ${order.orderNumber}`}
                        />
                      </TableCell>

                      {/* Order Number */}
                      <TableCell>
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="font-mono font-semibold text-primary hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-muted-foreground whitespace-nowrap text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="block text-[10px] text-muted-foreground/80">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-BD",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {order.customerName}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {order.shippingAddress.city} • {order.customerPhone}
                          </span>
                        </div>
                      </TableCell>

                      {/* Items */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-medium text-foreground">
                            {totalItemsCount} item
                            {totalItemsCount > 1 ? "s" : ""}
                          </span>
                          <p className="text-muted-foreground text-[10px] truncate max-w-[180px]">
                            {order.items.map((i) => i.title).join(", ")}
                          </p>
                        </div>
                      </TableCell>

                      {/* Payment */}
                      <TableCell>
                        <PaymentStatusBadge
                          status={order.paymentStatus}
                          method={order.paymentMethod}
                        />
                      </TableCell>

                      {/* Order Status */}
                      <TableCell>
                        <OrderStatusBadge status={order.orderStatus} />
                      </TableCell>

                      {/* Total */}
                      <TableCell className="text-right font-mono font-semibold text-foreground">
                        ৳{order.grandTotal.toLocaleString("en-BD")}
                      </TableCell>

                      {/* Row Actions Menu */}
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="text-xs w-44"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/orders/${order.id}`}
                                className="gap-2 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View Details
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onPrintInvoice(order)}
                              className="gap-2 cursor-pointer"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              Print Invoice
                            </DropdownMenuItem>

                            {/* Quick status transition helpers */}
                            {order.orderStatus === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onQuickStatusChange(order.id, "confirmed")
                                }
                                className="gap-2 cursor-pointer text-blue-600"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Confirm Order
                              </DropdownMenuItem>
                            )}

                            {order.orderStatus === "confirmed" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onQuickStatusChange(order.id, "processing")
                                }
                                className="gap-2 cursor-pointer text-indigo-600"
                              >
                                <Package className="h-3.5 w-3.5" />
                                Start Processing
                              </DropdownMenuItem>
                            )}

                            {order.orderStatus === "processing" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onQuickStatusChange(order.id, "ready_to_ship")
                                }
                                className="gap-2 cursor-pointer text-purple-600"
                              >
                                <Package className="h-3.5 w-3.5" />
                                Ready to Ship
                              </DropdownMenuItem>
                            )}

                            {(order.orderStatus === "pending" ||
                              order.orderStatus === "confirmed" ||
                              order.orderStatus === "processing" ||
                              order.orderStatus === "ready_to_ship") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onCancelOrder(order)}
                                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-border text-xs text-muted-foreground bg-muted/20">
          <div className="flex items-center gap-2">
            <span>
              Showing {orders.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, total)} of {total} orders
            </span>
            <div className="flex items-center gap-1.5 ml-3">
              <span>Rows per page:</span>
              <Select
                value={String(limit)}
                onValueChange={(val) => onLimitChange(Number(val))}
              >
                <SelectTrigger className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 text-xs font-medium text-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
