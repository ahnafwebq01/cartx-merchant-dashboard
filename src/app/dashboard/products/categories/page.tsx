"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCategoriesQuery } from "@/features/products/hooks";
import { CategoryManagementModal } from "@/features/products/components/CategoryManagementModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories = [] } = useCategoriesQuery();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Products", href: "/dashboard/products" },
            { label: "Categories" },
          ]}
        />
        <PageHeader
          title="Product Categories"
          description="Group and organize products into logical categories for easy discovery on your storefront."
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {categories.length} total categories configured
        </span>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Category
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40 text-xs">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="min-w-[200px]">Category Name</TableHead>
              <TableHead className="w-48">URL Handle / Slug</TableHead>
              <TableHead className="min-w-[240px]">Description</TableHead>
              <TableHead className="w-32 text-center">Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c, idx) => (
              <TableRow key={c.id} className="text-xs">
                <TableCell className="text-center text-muted-foreground font-mono">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded text-primary">
                      <FolderTree className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-foreground">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground text-[11px]">
                  /{c.slug}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.description || "—"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="text-[10px]">
                    {c.productCount} items
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryManagementModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
