"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ProductForm } from "@/features/products/components/ProductForm";
import {
  useProductQuery,
  useCategoriesQuery,
  useUpdateProductMutation,
} from "@/features/products/hooks";
import type { ProductFormValues } from "@/features/products/schemas";

function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;

  const { data: product, isLoading, error } = useProductQuery(productId);
  const { data: categories = [] } = useCategoriesQuery();
  const updateMutation = useUpdateProductMutation();

  const breadcrumbs = [
    { label: "Products", href: "/dashboard/products" },
    { label: product ? `Edit: ${product.title}` : "Edit Product" },
  ];

  const handleUpdate = async (values: ProductFormValues) => {
    if (!product) return;

    await updateMutation.mutateAsync(
      {
        id: product.id,
        updates: {
          title: values.title,
          slug: values.slug,
          sku: values.sku,
          barcode: values.barcode,
          category: values.category,
          brand: values.brand,
          shortDescription: values.shortDescription,
          description: values.description,
          price: values.price,
          salePrice: values.salePrice,
          costPrice: values.costPrice,
          taxRate: values.taxRate,
          stock: values.stock,
          lowStockThreshold: values.lowStockThreshold,
          trackInventory: values.trackInventory,
          allowBackorders: values.allowBackorders,
          status: values.status,
          images: values.imageUrl
            ? [{ id: "img-1", url: values.imageUrl, alt: values.title, isMain: true }]
            : [],
          variants: values.variants?.map((v, idx) => ({
            id: v.id || `var-${idx + 1}`,
            name: v.name,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            attributes: v.attributes || {},
          })),
          weight: values.weight,
          seoTitle: values.seoTitle,
          seoDescription: values.seoDescription,
        },
      },
      {
        onSuccess: () => {
          router.push("/dashboard/products");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Products", href: "/dashboard/products" }, { label: "Loading..." }]} />
        <LoadingSkeleton rows={8} className="h-96" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Products", href: "/dashboard/products" }, { label: "Not Found" }]} />
        <ErrorState
          title="Product Not Found"
          message={`The requested product with ID "${productId}" could not be located in your store's catalog.`}
          onRetry={() => router.push("/dashboard/products")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      <ProductForm
        initialProduct={product}
        categories={categories}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <LoadingSkeleton rows={8} className="h-96" />
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}
