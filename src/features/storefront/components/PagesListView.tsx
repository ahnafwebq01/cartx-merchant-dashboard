"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Scale,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePagesQuery, useDeletePageMutation } from "../hooks";
import type { StorePage } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";

export function PagesListView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "legal_policy">("all");
  const [previewPage, setPreviewPage] = useState<StorePage | null>(null);

  const queryParams = {
    search,
    status: (activeTab === "published" || activeTab === "draft" ? activeTab : "all") as "all" | "published" | "draft",
    type: (activeTab === "legal_policy" ? "legal_policy" : "all") as "all" | "legal_policy" | "standard_cms",
  };

  const { data: pages, isLoading, isError, error, refetch } = usePagesQuery(queryParams);
  const deleteMutation = useDeletePageMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Pages & Legal Policies"
          description="স্টোরফ্রন্ট পেইজ, আইনি নীতিমালা ও কন্টেন্ট তৈরি করুন"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Pages", href: "/dashboard/store/pages" },
          ]}
        />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (isError || !pages) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Pages & Legal Policies"
          description="স্টোরফ্রন্ট পেইজ, আইনি নীতিমালা ও কন্টেন্ট তৈরি করুন"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Pages", href: "/dashboard/store/pages" },
          ]}
        />
        <ErrorState
          title="Failed to load pages"
          message={error?.message || "Could not retrieve store pages"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages & Legal Policies"
        description="স্টোরফ্রন্ট পেইজ, আইনি নীতিমালা ও কন্টেন্ট তৈরি করুন"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Storefront", href: "/dashboard/store" },
          { label: "Pages", href: "/dashboard/store/pages" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/dashboard/store/pages/new">
                <Plus className="h-4 w-4" />
                <span>Create New Page</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Quick Legal Templates Prompt Card */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">
              Ready-made Bangladesh E-Commerce Legal Templates
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Privacy Policy, Terms & Conditions, 7-Day Refund Policy, and Shipping Policy pre-configured for BDT and MFS.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Link href="/dashboard/store/pages/new">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Use Legal Template</span>
          </Link>
        </Button>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Tabs
          value={activeTab}
          onValueChange={(val) =>
            setActiveTab(val as "all" | "published" | "draft" | "legal_policy")
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs">
              All Pages
            </TabsTrigger>
            <TabsTrigger value="published" className="text-xs">
              Published
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="legal_policy" className="text-xs">
              Legal Policies
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by title or slug..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Pages Data Table */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-0">
          {pages.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={FileText}
                title="No pages found"
                description={
                  search
                    ? `No pages match your search "${search}". Try resetting the filter.`
                    : "You haven't created any custom pages or legal policies yet."
                }
                actionLabel={search ? "Clear Search" : "Create Page"}
                onAction={
                  search
                    ? () => setSearch("")
                    : () => router.push("/dashboard/store/pages/new")
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Page Title</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">URL Path / Slug</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Last Updated</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id} className="text-xs">
                      {/* Title */}
                      <TableCell className="font-medium text-foreground py-3">
                        <div className="flex items-center gap-2">
                          {page.pageType === "legal_policy" ? (
                            <Scale className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <div>
                            <Link
                              href={`/dashboard/store/pages/${page.id}/edit`}
                              className="font-semibold text-foreground hover:text-primary transition-colors hover:underline block"
                            >
                              {page.title}
                            </Link>
                            {page.titleBn && (
                              <span className="text-[11px] text-muted-foreground font-bengali block">
                                {page.titleBn}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        {page.pageType === "legal_policy" ? (
                          <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                            Legal Policy
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Custom CMS
                          </Badge>
                        )}
                      </TableCell>

                      {/* Slug */}
                      <TableCell className="font-mono text-muted-foreground text-[11px]">
                        /{page.slug}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {page.status === "published" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            ✓ Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </TableCell>

                      {/* Last Updated */}
                      <TableCell className="text-muted-foreground text-[11px]">
                        {new Date(page.updatedAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewPage(page)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Preview Page"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Edit Page"
                          >
                            <Link href={`/dashboard/store/pages/${page.id}/edit`}>
                              <Edit className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                title="Delete Page"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Page?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <strong>{page.title}</strong>? This action will permanently remove this page from your storefront navigation.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(page.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Page
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Page Preview Modal */}
      <Dialog open={Boolean(previewPage)} onOpenChange={() => setPreviewPage(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                /{previewPage?.slug}
              </Badge>
              <Badge
                className={
                  previewPage?.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                    : "text-xs"
                }
              >
                {previewPage?.status}
              </Badge>
            </div>
            <DialogTitle className="text-xl pt-1">
              {previewPage?.title}
            </DialogTitle>
            <DialogDescription>
              Storefront public page layout preview
            </DialogDescription>
          </DialogHeader>

          {previewPage && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-xs prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
                  {previewPage.content}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground">
                  Last updated: {new Date(previewPage.updatedAt).toLocaleString("en-BD")}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewPage(null)}>
                    Close
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/store/pages/${previewPage.id}/edit`}>
                      Edit Page
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
