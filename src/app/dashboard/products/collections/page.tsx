"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
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
import { Plus, Sparkles, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCollectionsQuery, useCreateCollectionMutation } from "@/features/products/hooks";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

export default function CollectionsPage() {
  const { data: collections = [], isLoading } = useCollectionsQuery();
  const createMutation = useCreateCollectionMutation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreateCollection = () => {
    if (!newTitle.trim()) {
      toast.error("Collection title is required");
      return;
    }

    const slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    createMutation.mutate(
      {
        title: newTitle,
        slug,
        description: newDesc,
        published: true,
      },
      {
        onSuccess: () => {
          setShowAddModal(false);
          setNewTitle("");
          setNewDesc("");
        },
      }
    );
  };

  return (
    <PermissionGuard permission="products.view" showAccessDenied>
      <div className="space-y-6">
      <PageHeader
        title="Product Collections"
        description="Curate themed groups of merchandise for seasonal campaigns, promotions, and featured showcases."
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products" },
          { label: "Collections" },
        ]}
        actions={
          <Button size="sm" onClick={() => setShowAddModal(true)} className="text-xs h-9">
            <Plus className="h-4 w-4 mr-1.5" /> Create Collection
          </Button>
        }
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{collections.length} active merchandising collections</span>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} className="h-64" />
      ) : collections.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Collections Created"
          description="Group products for seasonal campaigns, Eid sales, or featured showcases to drive conversions."
          actionLabel="Create First Collection"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 text-xs">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[200px]">Collection Title</TableHead>
                  <TableHead className="w-48">URL Handle / Slug</TableHead>
                  <TableHead className="min-w-[240px]">Description</TableHead>
                  <TableHead className="w-28 text-center">Products</TableHead>
                  <TableHead className="w-24 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((col, idx) => (
                  <TableRow key={col.id} className="text-xs">
                    <TableCell className="text-center text-muted-foreground font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded text-primary">
                          <Layers className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold text-foreground">{col.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-[11px]">
                      /collections/{col.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{col.description}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-[10px]">
                        {col.productCount} items
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                        Published
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card-Based Transformation View */}
          <div className="block md:hidden divide-y divide-border/60">
            {collections.map((col, idx) => (
              <div key={col.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded text-primary shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-foreground block">{col.title}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">#{idx + 1} • /collections/{col.slug}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30 shrink-0">
                    Published
                  </Badge>
                </div>

                {col.description && (
                  <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
                    {col.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <span className="text-[11px] text-muted-foreground">Merchandise Count</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {col.productCount} items
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Collection Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Create Collection
            </DialogTitle>
            <DialogDescription className="text-xs">
              Group products manually for seasonal sales, Eid discounts, or featured campaigns.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            <div className="space-y-1">
              <Label htmlFor="col-title" className="text-xs font-medium text-foreground">
                Collection Title
              </Label>
              <Input
                id="col-title"
                placeholder="e.g. Winter Clearance 2026"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="col-desc" className="text-xs font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="col-desc"
                rows={3}
                placeholder="Brief summary for storefront shoppers..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>Save Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </PermissionGuard>
  );
}
