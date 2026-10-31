"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { PaymentStatusBadge } from "@/features/orders/components/PaymentStatusBadge";
import { OrderTimeline } from "@/features/orders/components/OrderTimeline";
import { OrderItemsCard } from "@/features/orders/components/OrderItemsCard";
import { OrderPriceBreakdownCard } from "@/features/orders/components/OrderPriceBreakdownCard";
import { OrderCustomerCard } from "@/features/orders/components/OrderCustomerCard";
import { OrderDeliveryCard } from "@/features/orders/components/OrderDeliveryCard";
import { OrderNotesCard } from "@/features/orders/components/OrderNotesCard";
import { OrderFulfillmentActions } from "@/features/orders/components/OrderFulfillmentActions";
import { PrintInvoiceModal } from "@/features/orders/components/PrintInvoiceModal";
import {
  useOrderQuery,
  useTransitionOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useMarkPaymentStatusMutation,
  useAddOrderNoteMutation,
} from "@/features/orders/hooks";
import type { OrderStatus } from "@/features/orders/types";
import { ArrowLeft, Printer } from "lucide-react";

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { data: order, isLoading, error } = useOrderQuery(orderId);

  const transitionMutation = useTransitionOrderStatusMutation();
  const cancelMutation = useCancelOrderMutation();
  const returnMutation = useReturnOrderMutation();
  const markPaymentMutation = useMarkPaymentStatusMutation();
  const addNoteMutation = useAddOrderNoteMutation();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Order Not Found"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sales & Orders", href: "/dashboard/orders" },
            { label: "Order Details" },
          ]}
        />
        <ErrorState
          title="Order Not Found"
          message={`Could not locate order ID "${orderId}". It may have been deleted or the link is incorrect.`}
          onRetry={() => router.push("/dashboard/orders")}
        />
      </div>
    );
  }

  const handleStatusChange = async (status: OrderStatus) => {
    await transitionMutation.mutateAsync({
      orderId: order.id,
      status,
      actor: "Merchant Admin",
    });
  };

  const handleCancelOrder = async (
    reason: string,
    restockInventory: boolean,
  ) => {
    await cancelMutation.mutateAsync({
      orderId: order.id,
      reason,
      actor: "Merchant Admin",
      restockInventory,
    });
  };

  const handleReturnOrder = async (
    reason: string,
    restockInventory: boolean,
  ) => {
    await returnMutation.mutateAsync({
      orderId: order.id,
      reason,
      actor: "Merchant Admin",
      restockInventory,
    });
  };

  const handleMarkPaid = async () => {
    await markPaymentMutation.mutateAsync({
      orderId: order.id,
      paymentStatus: "paid",
      actor: "Merchant Admin",
    });
  };

  const handleAddNote = async (note: string) => {
    await addNoteMutation.mutateAsync({
      orderId: order.id,
      note,
      actor: "Merchant Admin",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${new Date(order.createdAt).toLocaleDateString(
          "en-BD",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        )}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sales & Orders", href: "/dashboard/orders" },
          { label: order.orderNumber },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInvoiceOpen(true)}
              className="text-xs h-8 gap-1.5 font-medium"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Invoice
            </Button>

            <OrderFulfillmentActions
              order={order}
              onStatusChange={handleStatusChange}
              onCancelOrder={handleCancelOrder}
              onReturnOrder={handleReturnOrder}
              isLoading={
                transitionMutation.isPending ||
                cancelMutation.isPending ||
                returnMutation.isPending
              }
            />
          </div>
        }
      />

      {/* Status Bar Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-card border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Fulfillment Status:
            </span>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Payment Status:
            </span>
            <PaymentStatusBadge
              status={order.paymentStatus}
              method={order.paymentMethod}
            />
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-muted-foreground block">
            Grand Total
          </span>
          <span className="text-lg font-bold font-mono text-primary">
            ৳{order.grandTotal.toLocaleString("en-BD")}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Items, Timeline, Notes) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fulfillment Timeline */}
          <OrderTimeline
            currentStatus={order.orderStatus}
            timeline={order.timeline}
          />

          {/* Ordered Line Items */}
          <OrderItemsCard items={order.items} />

          {/* Internal Staff Notes */}
          <OrderNotesCard
            internalNotes={order.internalNotes}
            onAddNote={handleAddNote}
            isLoading={addNoteMutation.isPending}
          />
        </div>

        {/* Right Column (Financials, Customer, Logistics) */}
        <div className="space-y-6">
          {/* Financial Breakdown */}
          <OrderPriceBreakdownCard
            order={order}
            onMarkPaid={handleMarkPaid}
            isLoading={markPaymentMutation.isPending}
          />

          {/* Customer & Shipping */}
          <OrderCustomerCard
            customerId={order.customerId}
            customerName={order.customerName}
            customerPhone={order.customerPhone}
            customerEmail={order.customerEmail}
            shippingAddress={order.shippingAddress}
            billingAddress={order.billingAddress}
          />

          {/* Courier Logistics */}
          <OrderDeliveryCard
            delivery={order.delivery}
            orderStatus={order.orderStatus}
          />
        </div>
      </div>

      {/* Print Invoice Modal */}
      <PrintInvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <OrderDetailsContent />
    </Suspense>
  );
}
