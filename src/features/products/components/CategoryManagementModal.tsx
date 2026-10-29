"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, type CategoryFormValues } from "../schemas";
import { useCategoriesQuery, useCreateCategoryMutation } from "../hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Plus, Sparkles } from "lucide-react";

interface CategoryManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryManagementModal({
  open,
  onOpenChange,
}: CategoryManagementModalProps) {
  const { data: categories = [] } = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sortOrder: categories.length + 1,
    },
  });

  const nameWatch = watch("name");

  const handleAutoSlug = () => {
    if (!nameWatch) return;
    const slug = nameWatch
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", slug, { shouldValidate: true });
  };

  const onSubmit = (values: CategoryFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        reset();
        setShowAddForm(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" /> Store Categories
            </DialogTitle>
            {!showAddForm && (
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Category
              </Button>
            )}
          </div>
          <DialogDescription className="text-xs">
            Manage your store&apos;s taxonomy to organize products for customer browsing.
          </DialogDescription>
        </DialogHeader>

        {showAddForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-3 rounded-lg border border-border bg-muted/30 space-y-3 my-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-foreground">New Category</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-[11px]"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Category Name</label>
              <Input
                {...register("name")}
                placeholder="e.g. Traditional Jewelry"
                className="text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Slug</label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-2.5 w-2.5" /> Auto Slug
                </button>
              </div>
              <Input
                {...register("slug")}
                placeholder="traditional-jewelry"
                className="text-xs font-mono"
              />
              {errors.slug && (
                <p className="text-[11px] text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Description</label>
              <Textarea
                {...register("description")}
                rows={2}
                placeholder="Brief category summary"
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full text-xs"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Save Category"}
            </Button>
          </form>
        )}

        {/* Existing Categories List */}
        <div className="space-y-2 mt-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Existing Categories ({categories.length})
          </span>
          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {categories.map((c) => (
              <div key={c.id} className="p-2.5 flex items-center justify-between text-xs bg-card">
                <div>
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-muted-foreground text-[11px] ml-2 font-mono">
                    /{c.slug}
                  </span>
                  {c.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {c.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {c.productCount} products
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
