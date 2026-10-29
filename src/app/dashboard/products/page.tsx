"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ProductFilterToolbar } from "@/features/products/components/ProductFilterToolbar";
import { ProductListTable } from "@/features/products/components/ProductListTable";
import { ProductImportExportModal } from "@/features/products/components/ProductImportExportModal";
import {
  useProductsQuery,
  useCategoriesQuery,
  useDuplicateProductMutation,
  useArchiveProductMutation,
  useDeleteProductMutation,
  useBulkArchiveMutation,
  useBulkDeleteMutation,
  useResetDemoDataMutation,
} from "@/features/products/hooks";
import type { ProductFilterParams } from "@/features/products/types";
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
import { Info, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilterParams>({
    status: "all",
    category: "all",
    stockStatus: "all",
    sortBy: "createdAt-desc",
    page: 1,
    limit: 10,
    search: "",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Queries & Mutations
  const { data, isLoading } = useProductsQuery(filters);
  const { data: categories = [] } = useCategoriesQuery();

  const duplicateMutation = useDuplicateProductMutation();
  const archiveMutation = useArchiveProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const bulkArchiveMutation = useBulkArchiveMutation();
  const bulkDeleteMutation = useBulkDeleteMutation();
  const resetDemoDataMutation = useResetDemoDataMutation();

  const handleFilterChange = (updates: Partial<ProductFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setSelectedIds([]); // clear selection on filter/page change
  };

  const handleSelectId = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (!data) return;
    if (selected) {
      const pageIds = data.items.map((p) => p.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    } else {
      const pageIds = new Set(data.items.map((p) => p.id));
      setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
    }
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return;
    bulkArchiveMutation.mutate(selectedIds, {
      onSuccess: () => setSelectedIds([]),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
        setShowBulkDeleteConfirm(false);
      },
    });
  };

  const handleResetDemoData = () => {
    resetDemoDataMutation.mutate(undefined, {
      onSuccess: () => {
        setShowResetConfirm(false);
        setFilters({
          status: "all",
          category: "all",
          stockStatus: "all",
          sortBy: "createdAt-desc",
          page: 1,
          limit: 10,
          search: "",
        });
        setSelectedIds([]);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div>
        <Breadcrumbs items={[{ label: "Products" }]} />
        <PageHeader
          title="Products & Catalog"
          description="Manage your store's merchandise, categories, pricing in BDT (৳), and product availability."
        />
      </div>

      {/* Demo Notice Banner */}
      <div className="flex items-center gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <div>
          <strong className="text-foreground">Demo Catalog Mode:</strong> All product and inventory modifications are persisted locally in your browser storage. You can create, edit, filter, or reset demo data anytime without affecting live production.
        </div>
      </div>

      {/* Filter and Actions Toolbar */}
      <ProductFilterToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        selectedCount={selectedIds.length}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={() => setShowBulkDeleteConfirm(true)}
        onClearSelection={() => setSelectedIds([])}
        onOpenImportExport={() => setShowImportExport(true)}
        onResetDemoData={() => setShowResetConfirm(true)}
        totalProducts={data?.total ?? 0}
      />

      {/* Data Table */}
      {isLoading ? (
        <LoadingSkeleton rows={6} className="h-96" />
      ) : (
        <ProductListTable
          data={
            data || {
              items: [],
              total: 0,
              page: 1,
              limit: 10,
              totalPages: 1,
            }
          }
          selectedIds={selectedIds}
          onSelectId={handleSelectId}
          onSelectAll={handleSelectAll}
          onPageChange={(page) => handleFilterChange({ page })}
          onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
          onDuplicate={(id) => duplicateMutation.mutate(id)}
          onArchive={(id) => archiveMutation.mutate(id)}
          onDelete={(id) => deleteMutation.mutate(id)}
          onClearFilters={() =>
            handleFilterChange({
              search: "",
              category: "all",
              status: "all",
              stockStatus: "all",
              sortBy: "createdAt-desc",
              page: 1,
            })
          }
        />
      )}

      {/* Import / Export Modal */}
      <ProductImportExportModal
        open={showImportExport}
        onOpenChange={setShowImportExport}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={showBulkDeleteConfirm}
        onOpenChange={setShowBulkDeleteConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete {selectedIds.length} Products
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to delete these {selectedIds.length} selected items? This will remove them from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
              onClick={handleConfirmBulkDelete}
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Demo Data Confirmation Dialog */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Reset Demo Catalog</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This will restore the 12 default Bangladeshi products, categories, and inventory logs to their initial baseline. Any custom products you created will be reset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetDemoData} className="text-xs">
              Confirm Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
