import { z } from "zod";

export const stockAdjustmentFormSchema = z
  .object({
    productId: z.string().min(1, "Please select a product"),
    type: z.enum([
      "restock",
      "damaged",
      "lost",
      "manual_correction",
      "return_restock",
    ]),
    quantity: z
      .number()
      .int("Quantity must be an integer"),
    reason: z
      .string()
      .min(2, "Reason is required (min 2 characters)")
      .max(200, "Reason cannot exceed 200 characters"),
    referenceId: z.string().max(50).optional(),
    note: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "manual_correction") {
      if (data.quantity < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Stock count cannot be negative",
          path: ["quantity"],
        });
      }
    } else {
      if (data.quantity < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity must be at least 1",
          path: ["quantity"],
        });
      }
    }
  });

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentFormSchema>;

