"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { CustomerStatsCards } from "@/features/customers/components/CustomerStatsCards";
import { CustomerFilterToolbar } from "@/features/customers/components/CustomerFilterToolbar";
import { CustomerListTable } from "@/features/customers/components/CustomerListTable";
import { CustomerTagsModal } from "@/features/customers/components/CustomerTagsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCustomersQuery,
  useCustomerStatsQuery,
  useUpdateCustomerTagsMutation,
  useCreateCustomerMutation,
  useResetDemoCustomersMutation,
} from "@/features/customers/hooks";
import type { Customer, CustomerFilterParams } from "@/features/customers/types";
import type { CustomerFormValues } from "@/features/customers/schemas";
import { UserPlus, RefreshCw } from "lucide-react";

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilterParams>({
    page: 1,
    limit: 10,
    search: "",
    segment: "all",
    sortBy: "spend_desc",
  });

  const [managingTagsCustomer, setManagingTagsCustomer] =
    useState<Customer | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Form state for Add Customer
  const [newCustomerForm, setNewCustomerForm] = useState<CustomerFormValues>({
    name: "",
    phone: "",
    email: "",
    city: "Dhaka",
    division: "Dhaka",
    addressLine1: "",
    tags: ["New"],
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Queries
  const { data, isLoading } = useCustomersQuery(filters);
  const { data: stats } = useCustomerStatsQuery();

  // Mutations
  const updateTagsMutation = useUpdateCustomerTagsMutation();
  const createCustomerMutation = useCreateCustomerMutation();
  const resetCustomersMutation = useResetDemoCustomersMutation();

  const customers = data?.customers || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const limit = data?.limit || 10;
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (updates: Partial<CustomerFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      segment: "all",
      sortBy: "spend_desc",
    });
  };

  const handleSaveTags = async (tags: string[]) => {
    if (!managingTagsCustomer) return;
    await updateTagsMutation.mutateAsync({
      id: managingTagsCustomer.id,
      tags,
    });
  };

  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || newCustomerForm.name.trim().length < 2) {
      setFormError("Name must be at least 2 characters.");
      return;
    }
    if (!newCustomerForm.phone || newCustomerForm.phone.trim().length < 11) {
      setFormError("Valid 11-digit mobile number required (e.g. 01711223344).");
      return;
    }
    if (
      !newCustomerForm.addressLine1 ||
      newCustomerForm.addressLine1.trim().length < 5
    ) {
      setFormError("Address must be at least 5 characters.");
      return;
    }

    setFormError(null);
    try {
      await createCustomerMutation.mutateAsync(newCustomerForm);
      setIsAddCustomerOpen(false);
      setNewCustomerForm({
        name: "",
        phone: "",
        email: "",
        city: "Dhaka",
        division: "Dhaka",
        addressLine1: "",
        tags: ["New"],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers Database"
        description="View customer lifetime value, order frequency, delivery addresses, and customer tags."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Customers", href: "/dashboard/customers" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsAddCustomerOpen(true)}
              className="text-xs h-8 gap-1.5 font-medium"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add Customer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetCustomersMutation.mutate()}
              className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Demo
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      {stats && <CustomerStatsCards stats={stats} />}

      {/* Filters Toolbar */}
      <CustomerFilterToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Customers Table */}
      <CustomerListTable
        customers={customers}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        onPageChange={(p) => handleFilterChange({ page: p })}
        onLimitChange={(l) => handleFilterChange({ limit: l, page: 1 })}
        onManageTags={(c) => setManagingTagsCustomer(c)}
        isLoading={isLoading}
      />

      {/* Tags Modal */}
      <CustomerTagsModal
        customer={managingTagsCustomer}
        isOpen={Boolean(managingTagsCustomer)}
        onClose={() => setManagingTagsCustomer(null)}
        onSaveTags={handleSaveTags}
        isLoading={updateTagsMutation.isPending}
      />

      {/* Add Customer Modal */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Add New Customer
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 py-2 text-xs">
            {formError && (
              <div className="p-2.5 rounded bg-destructive/10 text-destructive text-xs">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs">Full Name *</Label>
              <Input
                placeholder="e.g. Tanvir Ahmed"
                value={newCustomerForm.name}
                onChange={(e) =>
                  setNewCustomerForm({ ...newCustomerForm, name: e.target.value })
                }
                className="text-xs h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Mobile Phone *</Label>
                <Input
                  placeholder="01711223344"
                  value={newCustomerForm.phone}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                  }
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Email Address</Label>
                <Input
                  placeholder="customer@example.com"
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, email: e.target.value })
                  }
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">City *</Label>
                <Input
                  placeholder="Dhaka"
                  value={newCustomerForm.city}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, city: e.target.value })
                  }
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Division *</Label>
                <Input
                  placeholder="Dhaka"
                  value={newCustomerForm.division}
                  onChange={(e) =>
                    setNewCustomerForm({
                      ...newCustomerForm,
                      division: e.target.value,
                    })
                  }
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Primary Shipping Address *</Label>
              <Input
                placeholder="House 42, Road 7/A, Dhanmondi"
                value={newCustomerForm.addressLine1}
                onChange={(e) =>
                  setNewCustomerForm({
                    ...newCustomerForm,
                    addressLine1: e.target.value,
                  })
                }
                className="text-xs h-8"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createCustomerMutation.isPending}
                className="text-xs font-medium"
              >
                {createCustomerMutation.isPending ? "Adding..." : "Add Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

