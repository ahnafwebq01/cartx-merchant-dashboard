"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storePageSchema, type StorePageFormValues } from "../schemas";
import {
  usePageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} from "../hooks";
import { LEGAL_TEMPLATES } from "../constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  Trash2,
  Eye,
  ArrowLeft,
  Sparkles,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { toast } from "sonner";

interface PageEditorViewProps {
  pageId?: string;
}

export function PageEditorView({ pageId }: PageEditorViewProps) {
  const router = useRouter();
  const isEditing = Boolean(pageId);

  const { data: page, isLoading, isError, error } = usePageQuery(pageId || "");
  const createMutation = useCreatePageMutation();
  const updateMutation = useUpdatePageMutation();
  const deleteMutation = useDeletePageMutation();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("blank");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StorePageFormValues>({
    resolver: zodResolver(storePageSchema),
    defaultValues: {
      title: "",
      titleBn: "",
      slug: "",
      content: "",
      contentBn: "",
      pageType: "standard_cms",
      status: "published",
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        titleBn: page.titleBn || "",
        slug: page.slug,
        content: page.content,
        contentBn: page.contentBn || "",
        pageType: page.pageType,
        policyType: page.policyType,
        status: page.status,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
      });
    }
  }, [page, reset]);

  const watchedTitle = useWatch({ control, name: "title" });
  const watchedPageType = useWatch({ control, name: "pageType" });
  const watchedStatus = useWatch({ control, name: "status" });
  const watchedContent = useWatch({ control, name: "content" });
  const watchedSlug = useWatch({ control, name: "slug" });

  // Auto slug generation for new pages
  useEffect(() => {
    if (!isEditing && watchedTitle && !pageId) {
      const generated = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (generated) {
        setValue("slug", generated, { shouldValidate: true });
      }
    }
  }, [watchedTitle, isEditing, pageId, setValue]);

  const handleApplyTemplate = (templateKey: "privacy" | "terms" | "refund" | "shipping") => {
    const template = LEGAL_TEMPLATES[templateKey];
    if (!template) return;

    setSelectedTemplateKey(templateKey);
    setValue("title", template.title, { shouldDirty: true, shouldValidate: true });
    setValue("titleBn", template.titleBn, { shouldDirty: true });
    setValue("slug", template.slug, { shouldDirty: true, shouldValidate: true });
    setValue("content", template.content, { shouldDirty: true, shouldValidate: true });
    setValue("pageType", "legal_policy", { shouldDirty: true });
    setValue("policyType", templateKey, { shouldDirty: true });
    setValue("metaTitle", `${template.title} | Storefront`, { shouldDirty: true });
    setValue(
      "metaDescription",
      `Official ${template.title} for our customers in Bangladesh.`,
      { shouldDirty: true }
    );
    toast.success(`Loaded "${template.title}" template`);
  };

  const onSubmit = async (values: StorePageFormValues) => {
    try {
      if (isEditing && pageId) {
        await updateMutation.mutateAsync({ id: pageId, input: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push("/dashboard/store/pages");
    } catch {
      // Handled by mutation onError toast
    }
  };

  const handleDelete = async () => {
    if (!pageId) return;
    try {
      await deleteMutation.mutateAsync(pageId);
      router.push("/dashboard/store/pages");
    } catch {
      // Handled by mutation onError toast
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Page Editor..."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Pages", href: "/dashboard/store/pages" },
          ]}
        />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (isEditing && (isError || !page)) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Page Not Found"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Pages", href: "/dashboard/store/pages" },
          ]}
        />
        <ErrorState
          title="Could not find page"
          message={error?.message || `The requested page '${pageId}' does not exist.`}
          onRetry={() => router.push("/dashboard/store/pages")}
        />
      </div>
    );
  }

  const isLegalPolicy = watchedPageType === "legal_policy";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title={isEditing ? `Edit Page: ${page?.title}` : "Create New Store Page"}
        description="স্টোরফ্রন্টের জন্য কাস্টম তথ্যবহুল পেইজ বা লিগ্যাল পলিসি লিখুন"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Storefront", href: "/dashboard/store" },
          { label: "Pages", href: "/dashboard/store/pages" },
          {
            label: isEditing ? (page?.title || "Edit Page") : "New Page",
            href: isEditing ? `/dashboard/store/pages/${pageId}/edit` : "/dashboard/store/pages/new",
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href="/dashboard/store/pages">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              className="gap-1.5 text-xs"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </Button>

            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this page?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this page from your store. Shoppers visiting this URL will encounter a 404 error.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              type="submit"
              size="sm"
              className="gap-1.5 text-xs"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-3.5 w-3.5" />
              <span>
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Page"
                  : "Save Page"}
              </span>
            </Button>
          </div>
        }
      />

      {/* Template Quick Selection Bar (Only shown or helpful for new pages) */}
      {!isEditing && (
        <Card className="border-border shadow-xs bg-muted/20">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Load Ready-made Legal Policy Template</span>
            </CardTitle>
            <CardDescription className="text-[11px]">
              বাংলাদেশের ই-কমার্সের জন্য প্রণীত স্ট্যান্ডার্ড নীতিমালা সরাসরি ফরম-এ লোড করুন:
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedTemplateKey === "privacy" ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleApplyTemplate("privacy")}
              className="text-xs h-8"
            >
              <Scale className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Privacy Policy</span>
            </Button>

            <Button
              type="button"
              variant={selectedTemplateKey === "terms" ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleApplyTemplate("terms")}
              className="text-xs h-8"
            >
              <Scale className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Terms & Conditions</span>
            </Button>

            <Button
              type="button"
              variant={selectedTemplateKey === "refund" ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleApplyTemplate("refund")}
              className="text-xs h-8"
            >
              <Scale className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>7-Day Return Policy</span>
            </Button>

            <Button
              type="button"
              variant={selectedTemplateKey === "shipping" ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleApplyTemplate("shipping")}
              className="text-xs h-8"
            >
              <Scale className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Shipping Policy</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legal Notice Callout */}
      {isLegalPolicy && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200">
            <h4 className="font-semibold">
              আইনি নোটিশ / Legal Disclaimer
            </h4>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300">
              এই টেমপ্লেটটি একটি নমুনা খসড়া এবং আনুষ্ঠানিক আইনি পরামর্শ (Legal Advice) নয়। আপনার ব্যবসায়ের সুনির্দিষ্ট রিটার্ন নিয়ম, রিফান্ড সময়সীমা এবং ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরের নির্দেশনাবলী অনুযায়ী টেক্সট পরিবর্তন করুন।
            </p>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Content & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Page Information</CardTitle>
              <CardDescription>
                পেইজের শিরোনাম এবং ইউআরএল পাথ নির্ধারণ করুন।
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="page-title" className="text-xs font-semibold">
                  Page Title (English) *
                </Label>
                <Input
                  id="page-title"
                  {...register("title")}
                  placeholder="e.g. Privacy Policy or About Us"
                  className="h-9 text-xs"
                />
                {errors.title && (
                  <p className="text-[11px] text-destructive mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="page-title-bn" className="text-xs">
                  পেইজের শিরোনাম (বাংলায় ঐচ্ছিক)
                </Label>
                <Input
                  id="page-title-bn"
                  {...register("titleBn")}
                  placeholder="যেমন: গোপনীয়তা নীতি বা আমাদের গল্প"
                  className="h-9 text-xs font-bengali"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="page-slug" className="text-xs font-semibold">
                  URL Slug (লিংক পাথ) *
                </Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1.5 rounded-md border border-border">
                    https://green-harvest.cartx.com.bd/
                  </span>
                  <Input
                    id="page-slug"
                    {...register("slug")}
                    placeholder="privacy-policy"
                    className="h-9 text-xs font-mono lowercase"
                  />
                </div>
                {errors.slug && (
                  <p className="text-[11px] text-destructive mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Page Content</CardTitle>
                <CardDescription>
                  পেইজের মূল কন্টেন্ট (Markdown ও টেক্সট ফরম্যাট সমর্থিত)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Markdown Supported
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                {...register("content")}
                rows={18}
                placeholder="Write your page content here... Supports # Headings, - Bullet lists, and **Bold text**."
                className="font-mono text-xs leading-relaxed"
              />
              {errors.content && (
                <p className="text-[11px] text-destructive">
                  {errors.content.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings & SEO (1 Col) */}
        <div className="space-y-6">
          {/* Status & Page Type Settings */}
          <Card className="border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Publishing & Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="page-status" className="text-xs font-semibold">
                  Publishing Status
                </Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(val) =>
                    setValue("status", val as "published" | "draft", { shouldDirty: true })
                  }
                >
                  <SelectTrigger id="page-status" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published" className="text-xs">
                      🟢 Published (সরাসরি প্রকাশ)
                    </SelectItem>
                    <SelectItem value="draft" className="text-xs">
                      🟡 Draft (খসড়া সংরক্ষণ)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="page-type" className="text-xs font-semibold">
                  Page Classification
                </Label>
                <Select
                  value={watchedPageType}
                  onValueChange={(val) =>
                    setValue("pageType", val as "standard_cms" | "legal_policy", {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger id="page-type" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard_cms" className="text-xs">
                      Standard Content Page (সাধারণ পৃষ্ঠা)
                    </SelectItem>
                    <SelectItem value="legal_policy" className="text-xs">
                      Legal Policy (আইনি নীতিমালা)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Search Engine Optimization (SEO) */}
          <Card className="border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Search Engine Optimization (SEO)</CardTitle>
              <CardDescription>
                গুগল বা সার্চ ইঞ্জিনের জন্য মেটা ট্যাগ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="meta-title" className="text-xs">
                  SEO Meta Title
                </Label>
                <Input
                  id="meta-title"
                  {...register("metaTitle")}
                  placeholder="e.g. Privacy Policy | Store Name"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="meta-desc" className="text-xs">
                  SEO Meta Description
                </Label>
                <Textarea
                  id="meta-desc"
                  {...register("metaDescription")}
                  rows={3}
                  placeholder="Short description for search engine result snippets..."
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono">
                /{watchedSlug || "untitled"}
              </Badge>
              <Badge className="text-xs">
                {watchedStatus}
              </Badge>
            </div>
            <DialogTitle className="text-xl pt-1">
              {watchedTitle || "Untitled Page"}
            </DialogTitle>
            <DialogDescription>
              Storefront public layout preview
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 border-t border-border">
            <div className="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-xs">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-foreground">
                {watchedContent || "No content entered yet."}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setShowPreviewModal(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
