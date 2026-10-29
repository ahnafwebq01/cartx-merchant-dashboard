import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockProductService } from "./services/mockProducts";
import type {
  Product,
  ProductCategory,
  ProductCollection,
  ProductFilterParams,
} from "./types";
import { toast } from "sonner";

export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
  list: (params?: ProductFilterParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  categories: ["categories"] as const,
  collections: ["collections"] as const,
};

export function useProductsQuery(params?: ProductFilterParams) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => mockProductService.getProducts(params),
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => mockProductService.getProductById(id),
    enabled: Boolean(id),
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.categories,
    queryFn: () => mockProductService.getCategories(),
  });
}

export function useCollectionsQuery() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.collections,
    queryFn: () => mockProductService.getCollections(),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      Promise.resolve(mockProductService.createProduct(data)),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Product created successfully", {
        description: `"${newProduct.title}" has been saved to demo catalog.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to create product", {
        description: err.message,
      });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      Promise.resolve(mockProductService.updateProduct(id, updates)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Product updated successfully", {
        description: `Changes to "${updated.title}" have been saved.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to update product", {
        description: err.message,
      });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      mockProductService.deleteProduct(id);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Product deleted", {
        description: "The product was removed from your demo store catalog.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to delete product", {
        description: err.message,
      });
    },
  });
}

export function useArchiveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Promise.resolve(mockProductService.toggleArchiveProduct(id)),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      if (product.status === "archived") {
        toast.info("Product archived", {
          description: `"${product.title}" is now archived and hidden from public storefront.`,
        });
      } else {
        toast.success("Product unarchived", {
          description: `"${product.title}" has been restored to active status.`,
        });
      }
    },
  });
}

export function useDuplicateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Promise.resolve(mockProductService.duplicateProduct(id)),
    onSuccess: (copy) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories });
      toast.success("Product duplicated", {
        description: `Created draft copy: "${copy.title}"`,
      });
    },
  });
}

export function useBulkArchiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => Promise.resolve(mockProductService.bulkArchive(ids)),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(`Archived ${count} products`, {
        description: "Selected products have been marked as archived.",
      });
    },
  });
}

export function useBulkDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => Promise.resolve(mockProductService.bulkDelete(ids)),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(`Deleted ${count} products`, {
        description: "Selected products removed from demo catalog.",
      });
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ProductCategory, "id" | "productCount">) =>
      Promise.resolve(mockProductService.createCategory(data)),
    onSuccess: (cat) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories });
      toast.success("Category created", {
        description: `"${cat.name}" added to store categories.`,
      });
    },
  });
}

export function useCreateCollectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ProductCollection, "id" | "productCount">) =>
      Promise.resolve(mockProductService.createCollection(data)),
    onSuccess: (col) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.collections });
      toast.success("Collection created", {
        description: `"${col.title}" added to merchandising collections.`,
      });
    },
  });
}

export function useResetDemoDataMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      mockProductService.resetDemoData();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Demo data reset", {
        description: "Products, categories, and inventory have been restored to initial baseline.",
      });
    },
  });
}

