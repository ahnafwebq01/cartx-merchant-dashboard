import { z } from "zod";

/**
 * Coupon Creation & Editing Validation Schema
 */
export const couponFormSchema = z
  .object({
    code: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z
        .string()
        .min(3, "Coupon code must be at least 3 characters")
        .max(20, "Coupon code cannot exceed 20 characters")
        .regex(
          /^[A-Z0-9_-]+$/,
          "Coupon code must contain only uppercase letters, numbers, hyphens, and underscores"
        )
    ),
    campaignName: z
      .string()
      .min(2, "Campaign name must be at least 2 characters")
      .max(100, "Campaign name cannot exceed 100 characters"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.coerce
      .number()
      .positive("Discount value must be positive"),
    minOrderAmount: z.coerce
      .number()
      .min(0, "Minimum order amount cannot be negative")
      .default(0),
    maxDiscountCap: z.coerce
      .number()
      .min(0, "Maximum discount cap cannot be negative")
      .nullable()
      .optional(),
    usageLimit: z.coerce
      .number()
      .int("Usage limit must be an integer")
      .positive("Usage limit must be a positive integer")
      .nullable()
      .optional(),
    perCustomerLimit: z.coerce
      .number()
      .int("Per-customer limit must be an integer")
      .positive("Per-customer limit must be a positive integer")
      .nullable()
      .optional()
      .default(1),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "Expiration date is required"),
    applicableProducts: z.array(z.string()).default([]),
    applicableCategories: z.array(z.string()).default([]),
    customerEligibility: z
      .enum(["all", "first_time", "vip", "returning"])
      .default("all"),
    status: z.enum(["active", "inactive", "expired"]).default("active"),
  })
  .superRefine((data, ctx) => {
    // 1. Percentage discount validation (1 - 100)
    if (data.discountType === "percentage") {
      if (data.discountValue < 1 || data.discountValue > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Percentage discount must be between 1% and 100%",
          path: ["discountValue"],
        });
      }
    }

    // 2. Fixed discount validation
    if (data.discountType === "fixed") {
      if (data.discountValue <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Fixed discount amount must be greater than ৳0",
          path: ["discountValue"],
        });
      }
    }

    // 3. Expiration date must be strictly after start date
    const start = new Date(data.startDate).getTime();
    const end = new Date(data.endDate).getTime();

    if (isNaN(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid start date format",
        path: ["startDate"],
      });
    }

    if (isNaN(end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid expiration date format",
        path: ["endDate"],
      });
    }

    if (!isNaN(start) && !isNaN(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiration date must be after the start date",
        path: ["endDate"],
      });
    }

    // 4. Maximum discount cap is only meaningful for percentage discounts
    if (data.discountType === "fixed" && data.maxDiscountCap) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum discount cap applies only to percentage discounts",
        path: ["maxDiscountCap"],
      });
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;

/**
 * Promotional Campaign & Automatic Discount Validation Schema
 */
export const promotionalDiscountFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Campaign name must be at least 2 characters")
      .max(100, "Campaign name cannot exceed 100 characters"),
    description: z.string().max(255).optional(),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.coerce
      .number()
      .positive("Discount value must be positive"),
    scope: z.enum(["storewide", "category", "product"]),
    targetCategories: z.array(z.string()).default([]),
    targetProducts: z.array(z.string()).default([]),
    minOrderAmount: z.coerce
      .number()
      .min(0, "Minimum order amount cannot be negative")
      .default(0),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(["draft", "scheduled", "active", "ended"]).default("active"),
  })
  .superRefine((data, ctx) => {
    // 1. Percentage limit
    if (data.discountType === "percentage" && (data.discountValue < 1 || data.discountValue > 100)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percentage discount must be between 1% and 100%",
        path: ["discountValue"],
      });
    }

    // 2. Fixed amount limit
    if (data.discountType === "fixed" && data.discountValue <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fixed discount amount must be greater than ৳0",
        path: ["discountValue"],
      });
    }

    // 3. Category target check
    if (data.scope === "category" && (!data.targetCategories || data.targetCategories.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one target category for category-specific discounts",
        path: ["targetCategories"],
      });
    }

    // 4. Product target check
    if (data.scope === "product" && (!data.targetProducts || data.targetProducts.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one target product for product-specific discounts",
        path: ["targetProducts"],
      });
    }

    // 5. Date validation
    const start = new Date(data.startDate).getTime();
    const end = new Date(data.endDate).getTime();

    if (isNaN(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid start date format",
        path: ["startDate"],
      });
    }

    if (isNaN(end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid end date format",
        path: ["endDate"],
      });
    }

    if (!isNaN(start) && !isNaN(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after the start date",
        path: ["endDate"],
      });
    }
  });

export type PromotionalDiscountFormValues = z.infer<typeof promotionalDiscountFormSchema>;

/**
 * Flash Sale Campaign Validation Schema
 */
export const flashSaleFormSchema = z
  .object({
    title: z
      .string()
      .min(2, "Flash sale title must be at least 2 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z.string().max(255).optional(),
    productId: z.string().min(1, "Product selection is required"),
    originalPrice: z.coerce.number().positive("Original price must be positive"),
    discountedPrice: z.coerce
      .number()
      .positive("Discounted price must be greater than ৳0"),
    allocatedStock: z.coerce
      .number()
      .int("Allocated stock must be an integer")
      .positive("Allocated flash sale stock must be at least 1 unit"),
    perCustomerLimit: z.coerce
      .number()
      .int("Per-customer limit must be an integer")
      .positive("Per-customer limit must be at least 1")
      .default(1),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    status: z.enum(["draft", "scheduled", "active", "ended"]).default("scheduled"),
  })
  .superRefine((data, ctx) => {
    // 1. Discounted price must be strictly lower than regular product price
    if (data.discountedPrice >= data.originalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Flash sale price (৳${data.discountedPrice}) must be lower than the regular price (৳${data.originalPrice})`,
        path: ["discountedPrice"],
      });
    }

    // 2. End time must be strictly after start time
    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();

    if (isNaN(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid start time format",
        path: ["startTime"],
      });
    }

    if (isNaN(end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid end time format",
        path: ["endTime"],
      });
    }

    if (!isNaN(start) && !isNaN(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Flash sale end time must be after the start time",
        path: ["endTime"],
      });
    }
  });

export type FlashSaleFormValues = z.infer<typeof flashSaleFormSchema>;
