"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormValues } from "../schemas";
import type { Product, ProductCategory } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  ArrowLeft,
  Save,
  ImageIcon,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";

interface ProductFormProps {
  initialProduct?: Product;
  categories: ProductCategory[];
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const DEMO_PRESET_IMAGES = [
  {
    name: "Jamdani Saree",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Cotton Saree",
    url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Men's Panjabi",
    url: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sylhet Black Tea",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Leather Wallet",
    url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Raw Honey",
    url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Clay Terracotta",
    url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jute Tote Bag",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  },
];

export function ProductForm({
  initialProduct,
  categories,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const defaultValues: ProductFormValues = {
    title: initialProduct?.title || "",
    slug: initialProduct?.slug || "",
    sku: initialProduct?.sku || "",
    barcode: initialProduct?.barcode || "",
    category: initialProduct?.category || (categories[0]?.name ?? "Women's Fashion"),
    brand: initialProduct?.brand || "",
    shortDescription: initialProduct?.shortDescription || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 1000,
    salePrice: initialProduct?.salePrice,
    costPrice: initialProduct?.costPrice,
    taxRate: initialProduct?.taxRate || 0,
    stock: initialProduct?.stock ?? 10,
    lowStockThreshold: initialProduct?.lowStockThreshold ?? 5,
    trackInventory: initialProduct?.trackInventory ?? true,
    allowBackorders: initialProduct?.allowBackorders ?? false,
    status: initialProduct?.status || "active",
    imageUrl: initialProduct?.images[0]?.url || DEMO_PRESET_IMAGES[0].url,
    weight: initialProduct?.weight || 0.5,
    seoTitle: initialProduct?.seoTitle || "",
    seoDescription: initialProduct?.seoDescription || "",
    variants: initialProduct?.variants || [],
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const titleWatch = watch("title");
  const priceWatch = watch("price") || 0;
  const costWatch = watch("costPrice") || 0;
  const currentCategory = watch("category");
  const currentStatus = watch("status");
  const imageUrlWatch = watch("imageUrl");
  const trackInventoryWatch = watch("trackInventory");
  const variants = watch("variants") || [];

  const salePriceWatch = watch("salePrice");

  // Profit Margin calculation based on effective retail/selling price
  const effectivePrice =
    typeof salePriceWatch === "number" && !isNaN(salePriceWatch) && salePriceWatch > 0
      ? salePriceWatch
      : priceWatch;
  const profit = effectivePrice > 0 && costWatch > 0 ? effectivePrice - costWatch : 0;
  const marginPercent =
    effectivePrice > 0 && costWatch > 0 ? Math.round((profit / effectivePrice) * 100) : null;

  // Auto-generate slug from title
  const handleAutoSlug = () => {
    if (!titleWatch) return;
    const generated = titleWatch
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", generated, { shouldValidate: true });
  };

  // Auto-generate SKU from Category + Title
  const handleAutoSku = () => {
    const catCode = (currentCategory || "PRD").substring(0, 3).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    setValue("sku", `${catCode}-${rand}`, { shouldValidate: true });
  };

  // Add a variant
  const handleAddVariant = () => {
    const nextIdx = variants.length + 1;
    const newVariant = {
      name: `Option ${nextIdx}`,
      sku: `${getValues("sku") || "SKU"}-V${nextIdx}`,
      price: priceWatch || 1000,
      stock: 5,
      attributes: {},
    };
    setValue("variants", [...variants, newVariant]);
  };

  // Remove variant
  const handleRemoveVariant = (index: number) => {
    setValue(
      "variants",
      variants.filter((_, idx) => idx !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Sticky Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.back()}
            aria-label="Back to products"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {isEditing ? `Edit: ${initialProduct?.title}` : "Add New Product"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isEditing
                ? "Update product details, pricing, inventory, and media."
                : "Create a new item in your store's catalog."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/products")}
            disabled={isSubmitting}
          >
            Discard
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-1.5" />
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Basic Information</CardTitle>
              <CardDescription className="text-xs">
                Essential identification and descriptive details of the product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Title */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Product Title <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("title")}
                  placeholder="e.g. Handwoven Dhakai Jamdani Saree"
                  className="text-xs"
                />
                {errors.title && (
                  <p className="text-[11px] text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* URL Slug with Auto Generator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    URL Handle / Slug <span className="text-destructive">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary"
                    onClick={handleAutoSlug}
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> Generate from title
                  </Button>
                </div>
                <Input
                  {...register("slug")}
                  placeholder="e.g. handwoven-dhakai-jamdani-saree"
                  className="text-xs font-mono"
                />
                {errors.slug && (
                  <p className="text-[11px] text-destructive">{errors.slug.message}</p>
                )}
              </div>

              {/* Short & Full Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Short Summary</label>
                <Input
                  {...register("shortDescription")}
                  placeholder="Brief 1-sentence product summary"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Full Description</label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Detailed material, origin, styling guide, and product specifications..."
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section B: Media & Preset Images */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" /> Product Images
              </CardTitle>
              <CardDescription className="text-xs">
                Provide an image URL or pick one from curated Bangladesh demo presets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Active Image Preview */}
                <div className="relative aspect-square w-32 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
                  {imageUrlWatch ? (
                    <Image
                      src={imageUrlWatch}
                      alt="Product preview"
                      fill
                      sizes="128px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="h-8 w-8 stroke-1" />
                      <span className="text-[10px] mt-1">No image</span>
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium text-foreground">Image Web URL</label>
                  <Input
                    {...register("imageUrl")}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs font-mono"
                  />
                  {errors.imageUrl && (
                    <p className="text-[11px] text-destructive">{errors.imageUrl.message}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Direct S3/Cloudinary upload endpoint integration is planned in Phase 3 backend contract.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Preset Clicker */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground block">
                  Select a Curated Bangladesh Demo Image Preset:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEMO_PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setValue("imageUrl", preset.url, { shouldValidate: true })}
                      className={`text-left p-1.5 rounded-md border text-xs flex items-center gap-2 transition-all ${
                        imageUrlWatch === preset.url
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="relative h-7 w-7 rounded overflow-hidden shrink-0 border">
                        <Image
                          src={preset.url}
                          alt={preset.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="truncate text-[11px]">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section C: Pricing in BDT */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Pricing & Margins (BDT ৳)</CardTitle>
              <CardDescription className="text-xs">
                Configure retail price, promotional discounts, and unit cost.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Regular Price */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Regular Price (৳) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="1"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="1200"
                    className="text-xs"
                  />
                  {errors.price && (
                    <p className="text-[11px] text-destructive">{errors.price.message}</p>
                  )}
                </div>

                {/* Sale Price */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Sale Price (৳)</label>
                  <Input
                    type="number"
                    step="1"
                    {...register("salePrice", {
                      setValueAs: (v) =>
                        v === "" || v === null || (typeof v === "number" && isNaN(v))
                          ? undefined
                          : Number(v),
                    })}
                    placeholder="Optional discount price"
                    className="text-xs"
                  />
                  {errors.salePrice && (
                    <p className="text-[11px] text-destructive">{errors.salePrice.message}</p>
                  )}
                </div>

                {/* Cost Per Item */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Cost per Item (৳)</label>
                  <Input
                    type="number"
                    step="1"
                    {...register("costPrice", {
                      setValueAs: (v) =>
                        v === "" || v === null || (typeof v === "number" && isNaN(v))
                          ? undefined
                          : Number(v),
                    })}
                    placeholder="Wholesale/Manufacturing cost"
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Profit & Margin Display */}
              {marginPercent !== null && (
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-foreground">
                    Estimated Profit: <strong>৳{profit.toLocaleString("en-BD")}</strong> per unit
                    (Margin: <strong>{marginPercent}%</strong>)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section D: Inventory & SKU */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Inventory & Stock Tracking</CardTitle>
              <CardDescription className="text-xs">
                Manage unique SKUs, current on-hand units, and low-stock notification threshold.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* SKU with Auto-generate */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">
                      SKU Code <span className="text-destructive">*</span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px] text-primary"
                      onClick={handleAutoSku}
                    >
                      <Sparkles className="h-3 w-3 mr-1" /> Generate SKU
                    </Button>
                  </div>
                  <Input
                    {...register("sku")}
                    placeholder="e.g. JMD-SLK-001"
                    className="text-xs font-mono"
                  />
                  {errors.sku && (
                    <p className="text-[11px] text-destructive">{errors.sku.message}</p>
                  )}
                </div>

                {/* Barcode */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Barcode (UPC/EAN)</label>
                  <Input
                    {...register("barcode")}
                    placeholder="Optional barcode number"
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground">Track Inventory</span>
                  <p className="text-[11px] text-muted-foreground">
                    Keep track of quantities and stop selling when out of stock.
                  </p>
                </div>
                <Switch
                  checked={trackInventoryWatch}
                  onCheckedChange={(checked) => setValue("trackInventory", checked)}
                />
              </div>

              {trackInventoryWatch && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Available Stock</label>
                    <Input
                      type="number"
                      step="1"
                      {...register("stock", { valueAsNumber: true })}
                      placeholder="10"
                      className="text-xs"
                    />
                    {errors.stock && (
                      <p className="text-[11px] text-destructive">{errors.stock.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Low Stock Alert Threshold
                    </label>
                    <Input
                      type="number"
                      step="1"
                      {...register("lowStockThreshold", { valueAsNumber: true })}
                      placeholder="5"
                      className="text-xs"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section E: Variants */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Product Variants</CardTitle>
                  <CardDescription className="text-xs">
                    Multiple sizes, colors, or materials under the same product.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariant}
                  className="text-xs h-7"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                  No variants added. This product uses a single standard SKU and price.
                </div>
              ) : (
                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border rounded-lg bg-card grid grid-cols-1 sm:grid-cols-4 gap-2 items-end"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Variant Name</label>
                        <Input
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].name = e.target.value;
                            setValue("variants", updated);
                          }}
                          placeholder="e.g. Size 40"
                          className="text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Variant SKU</label>
                        <Input
                          value={v.sku}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].sku = e.target.value;
                            setValue("variants", updated);
                          }}
                          placeholder="SKU-VAR"
                          className="text-xs h-8 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground">Price (৳)</label>
                        <Input
                          type="number"
                          value={v.price}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].price = Number(e.target.value);
                            setValue("variants", updated);
                          }}
                          className="text-xs h-8"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="space-y-1 flex-1">
                          <label className="text-[10px] text-muted-foreground">Stock</label>
                          <Input
                            type="number"
                            value={v.stock}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[idx].stock = Number(e.target.value);
                              setValue("variants", updated);
                            }}
                            className="text-xs h-8"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveVariant(idx)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column (Right 1 col) */}
        <div className="space-y-6">
          {/* Publishing Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Publishing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={currentStatus}
                onValueChange={(val) =>
                  setValue("status", val as "active" | "draft" | "archived", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Visible in Store)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-[11px] text-muted-foreground">
                Active products appear on your live storefront immediately. Drafts remain visible only in this dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Organization & Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Product Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select
                  value={currentCategory}
                  onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-[11px] text-destructive">{errors.category.message}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Brand / Manufacturer</label>
                <Input
                  {...register("brand")}
                  placeholder="e.g. Aarong, Apex, Deshi Dosh"
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Delivery */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.05"
                  {...register("weight", {
                    setValueAs: (v) =>
                      v === "" || v === null || (typeof v === "number" && isNaN(v))
                        ? undefined
                        : Number(v),
                  })}
                  placeholder="0.5"
                  className="text-xs"
                />
                <p className="text-[10px] text-muted-foreground">
                  Used by courier partners (Pathao, Steadfast) for delivery fee calculation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Search Engine Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">SEO Title</label>
                <Input
                  {...register("seoTitle")}
                  placeholder="Title for Google search results"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Meta Description</label>
                <Textarea
                  {...register("seoDescription")}
                  rows={2}
                  placeholder="Brief description for search engines"
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
