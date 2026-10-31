"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { OrderStatsCards } from "@/features/orders/components/OrderStatsCards";
import { OrderFilterToolbar } from "@/features/orders/components/OrderFilterToolbar";
import { OrderListTable } from "@/features/orders/components/OrderListTable";
import { PrintInvoiceModal } from "@/features/orders/components/PrintInvoiceModal";
import { CancelOrderDialog } from "@/features/orders/components/CancelOrderDialog";
import { BulkCancelOrdersDialog } from "@/features/orders/components/BulkCancelOrdersDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useOrdersQuery,
  useOrderStatsQuery,
  useTransitionOrderStatusMutation,
  useCancelOrderMutation,
  useBulkUpdateStatusMutation,
  useBulkCancelOrdersMutation,
  useResetDemoOrdersMutation,
} from "@/features/orders/hooks";
import type {
  Order,
  OrderFilterParams,
  OrderStatus,
} from "@/features/orders/types";
import { mockOrderService } from "@/features/orders/services/mockOrders";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilterParams>({
    page: 1,
    limit: 10,
    search: "",
    orderStatus: "all",
    paymentStatus: "all",
    paymentMethod: "all",
    fulfillmentStatus: "all",
    sortBy: "date_desc",
    datePreset: "all",
  });

  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [isBulkCancelOpen, setIsBulkCancelOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Queries
  const { data, isLoading } = useOrdersQuery(filters);
  const { data: stats } = useOrderStatsQuery();

  // Mutations
  const transitionMutation = useTransitionOrderStatusMutation();
  const cancelMutation = useCancelOrderMutation();
  const bulkStatusMutation = useBulkUpdateStatusMutation();
  const bulkCancelMutation = useBulkCancelOrdersMutation();
  const resetMutation = useResetDemoOrdersMutation();

  const orders = data?.orders || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const limit = data?.limit || 10;
  const totalPages = data?.totalPages || 1;

  // Tab Filtering Handlers
  const handleStatusTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedIds([]);

    if (tabId === "all") {
      setFilters((prev) => ({ ...prev, orderStatus: "all", page: 1 }));
    } else if (tabId === "pending") {
      setFilters((prev) => ({ ...prev, orderStatus: "pending", page: 1 }));
    } else if (tabId === "delivered") {
      setFilters((prev) => ({ ...prev, orderStatus: "delivered", page: 1 }));
    } else if (tabId === "processing_group") {
      setFilters((prev) => ({ ...prev, orderStatus: "processing", page: 1 }));
    } else if (tabId === "shipped_group") {
      setFilters((prev) => ({ ...prev, orderStatus: "shipped", page: 1 }));
    } else if (tabId === "cancelled_group") {
      setFilters((prev) => ({ ...prev, orderStatus: "cancelled", page: 1 }));
    }
  };

  const handleFilterChange = (updates: Partial<OrderFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      orderStatus: "all",
      paymentStatus: "all",
      paymentMethod: "all",
      fulfillmentStatus: "all",
      sortBy: "date_desc",
      datePreset: "all",
    });
    setSelectedIds([]);
  };

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  // Single Actions
  const handleQuickStatusChange = async (
    orderId: string,
    targetStatus: OrderStatus,
  ) => {
    await transitionMutation.mutateAsync({
      orderId,
      status: targetStatus,
      actor: "Merchant Admin",
    });
  };

  const handleCancelOrder = async (
    reason: string,
    restockInventory: boolean,
  ) => {
    if (!cancellingOrder) return;
    await cancelMutation.mutateAsync({
      orderId: cancellingOrder.id,
      reason,
      actor: "Merchant Admin",
      restockInventory,
    });
  };

  // Bulk Actions
  const handleBulkStatusChange = async (status: OrderStatus) => {
    if (selectedIds.length === 0) return;
    await bulkStatusMutation.mutateAsync({
      orderIds: selectedIds,
      status,
      actor: "Merchant Admin",
    });
    setSelectedIds([]);
  };

  const handleBulkCancel = async (reason: string) => {
    if (selectedIds.length === 0) return;
    await bulkCancelMutation.mutateAsync({
      orderIds: selectedIds,
      reason,
      actor: "Merchant Admin",
    });
    setSelectedIds([]);
  };

  // CSV Export
  const handleExportCSV = (ordersToExport?: Order[]) => {
    const list =
      ordersToExport ||
      (selectedIds.length > 0
        ? orders.filter((o) => selectedIds.includes(o.id))
        : orders);

    if (list.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const csvContent = mockOrderService.exportOrdersToCSV(list);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cartx_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${list.length} orders to CSV.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales & Orders"
        description="Receive, track fulfillment, manage shipments, and generate invoices."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sales & Orders", href: "/dashboard/orders" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportCSV()}
              className="text-xs h-8 gap-1.5 font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Demo
            </Button>
          </div>
        }
      />

      {/* KPI Stats Cards */}
      {stats && <OrderStatsCards stats={stats} />}

      {/* Filter Toolbar */}
      <OrderFilterToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeStatusTab={activeTab}
        onStatusTabChange={handleStatusTabChange}
        totalOrders={total}
      />

      {/* Orders Table */}
      <OrderListTable
        orders={orders}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onPageChange={(p) => handleFilterChange({ page: p })}
        onLimitChange={(l) => handleFilterChange({ limit: l, page: 1 })}
        onSortChange={(s) =>
          handleFilterChange({
            sortBy: s as OrderFilterParams["sortBy"],
            page: 1,
          })
        }
        currentSort={filters.sortBy}
        onQuickStatusChange={handleQuickStatusChange}
        onPrintInvoice={(order) => setPrintingOrder(order)}
        onCancelOrder={(order) => setCancellingOrder(order)}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkCancel={() => setIsBulkCancelOpen(true)}
        onExportCSV={() => handleExportCSV()}
        isLoading={isLoading}
      />

      {/* Print Invoice Modal */}
      <PrintInvoiceModal
        order={printingOrder}
        isOpen={Boolean(printingOrder)}
        onClose={() => setPrintingOrder(null)}
      />

      {/* Cancel Order Dialog */}
      <CancelOrderDialog
        order={cancellingOrder}
        isOpen={Boolean(cancellingOrder)}
        onClose={() => setCancellingOrder(null)}
        onConfirm={handleCancelOrder}
        isLoading={cancelMutation.isPending}
      />

      {/* Bulk Cancel Orders Dialog */}
      <BulkCancelOrdersDialog
        orderCount={selectedIds.length}
        isOpen={isBulkCancelOpen}
        onClose={() => setIsBulkCancelOpen(false)}
        onConfirm={handleBulkCancel}
        isLoading={bulkCancelMutation.isPending}
      />

      {/* Reset Demo Data Confirmation Dialog */}
      <AlertDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-semibold flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Reset Orders Demo Data?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This will restore all 15 authentic Bangladesh demo orders, order
              timelines, and delivery statuses to their baseline state.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetMutation.mutate();
                setIsResetConfirmOpen(false);
              }}
              className="text-xs font-medium"
            >
              Reset to Baseline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
