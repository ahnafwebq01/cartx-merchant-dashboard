"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageHeader } from "@/components/layout/PageHeader";
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
import { Textarea } from "@/components/ui/textarea";
import { useCollectionsQuery, useCreateCollectionMutation } from "@/features/products/hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { toast } from "sonner";

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
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Products", href: "/dashboard/products" },
            { label: "Collections" },
          ]}
        />
        <PageHeader
          title="Product Collections"
          description="Curate themed groups of merchandise for seasonal campaigns, promotions, and featured showcases."
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {collections.length} active merchandising collections
        </span>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Create Collection
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} className="h-64" />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
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
              <label className="text-xs font-medium text-foreground">Collection Title</label>
              <Input
                placeholder="e.g. Winter Clearance 2026"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Description</label>
              <Textarea
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
  );
}
