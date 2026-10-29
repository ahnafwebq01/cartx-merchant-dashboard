"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useCategoriesQuery, useCreateProductMutation } from "@/features/products/hooks";
import type { ProductFormValues } from "@/features/products/schemas";

export default function NewProductPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategoriesQuery();
  const createMutation = useCreateProductMutation();

  const handleCreate = async (values: ProductFormValues) => {
    await createMutation.mutateAsync(
      {
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
          id: `var-${idx + 1}`,
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
      {
        onSuccess: () => {
          router.push("/dashboard/products");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/dashboard/products" },
          { label: "Add Product" },
        ]}
      />
      <ProductForm
        categories={categories}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
