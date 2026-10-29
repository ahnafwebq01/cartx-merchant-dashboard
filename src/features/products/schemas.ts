import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name required"),
  sku: z.string().min(2, "Variant SKU required"),
  price: z.number().positive("Variant price must be > 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  attributes: z.record(z.string(), z.string()).optional(),
});

export const productFormSchema = z.object({
  title: z
    .string()
    .min(2, "Product title must be at least 2 characters")
    .max(150, "Product title cannot exceed 150 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and single hyphens"
    ),
  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU cannot exceed 50 characters"),
  barcode: z.string().max(50).optional(),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().max(100).optional(),
  shortDescription: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive("Regular price must be greater than 0"),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0, "Initial stock cannot be negative"),
  lowStockThreshold: z.number().int().min(0),
  trackInventory: z.boolean(),
  allowBackorders: z.boolean(),
  status: z.enum(["active", "draft", "archived"]),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  weight: z.number().min(0).optional(),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(200).optional(),
  variants: z.array(productVariantSchema).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Category slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  sortOrder: z.number().int().min(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
