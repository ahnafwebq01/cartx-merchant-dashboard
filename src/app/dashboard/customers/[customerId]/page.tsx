"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/button";
import { CustomerProfileCard } from "@/features/customers/components/CustomerProfileCard";
import { CustomerOrdersTable } from "@/features/customers/components/CustomerOrdersTable";
import { CustomerTagsModal } from "@/features/customers/components/CustomerTagsModal";
import {
  useCustomerQuery,
  useUpdateCustomerTagsMutation,
  useAddCustomerNoteMutation,
} from "@/features/customers/hooks";
import { useOrdersQuery } from "@/features/orders/hooks";
import { ArrowLeft } from "lucide-react";

function CustomerDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.customerId as string;

  const { data: customer, isLoading, error } = useCustomerQuery(customerId);
  const { data: ordersData } = useOrdersQuery({ limit: 100 });
  const updateTagsMutation = useUpdateCustomerTagsMutation();
  const addNoteMutation = useAddCustomerNoteMutation();

  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Not Found"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Customers", href: "/dashboard/customers" },
            { label: "Profile" },
          ]}
        />
        <ErrorState
          title="Customer Not Found"
          message={`Could not locate customer with ID "${customerId}".`}
          onRetry={() => router.push("/dashboard/customers")}
        />
      </div>
    );
  }

  const customerOrders = (ordersData?.orders || []).filter(
    (o) => o.customerId === customer.id
  );

  const handleSaveTags = async (tags: string[]) => {
    await updateTagsMutation.mutateAsync({
      id: customer.id,
      tags,
    });
  };

  const handleAddNote = async (note: string) => {
    await addNoteMutation.mutateAsync({
      id: customer.id,
      note,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description={`Customer profile & order history (${customer.totalOrders} total orders)`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Customers", href: "/dashboard/customers" },
          { label: customer.name },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/customers")}
            className="text-xs h-8 gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Customers
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile Card */}
        <div className="lg:col-span-1">
          <CustomerProfileCard
            customer={customer}
            onAddNote={handleAddNote}
            onManageTags={() => setIsTagsModalOpen(true)}
            isLoading={addNoteMutation.isPending}
          />
        </div>

        {/* Right Column: Customer Orders History Table */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerOrdersTable
            orders={customerOrders}
            customerName={customer.name}
          />
        </div>
      </div>

      {/* Tags Management Modal */}
      <CustomerTagsModal
        customer={customer}
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        onSaveTags={handleSaveTags}
        isLoading={updateTagsMutation.isPending}
      />
    </div>
  );
}

export default function CustomerDetailsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={6} />}>
      <CustomerDetailsContent />
    </Suspense>
  );
}
