import { z } from "zod";

export const segmentConditionSchema = z.object({
  id: z.string(),
  field: z.enum([
    "total_orders",
    "total_spend",
    "average_order_value",
    "customer_tags",
    "customer_segment",
    "last_order_date",
    "registration_date",
    "customer_city",
    "customer_division",
  ]),
  operator: z.enum([
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "greater_than_or_equal",
    "less_than_or_equal",
    "contains",
    "not_contains",
    "in",
    "not_in",
    "before",
    "after",
  ]),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
});

export const segmentConditionGroupSchema = z.object({
  id: z.string(),
  logic: z.enum(["AND", "OR"]),
  conditions: z.array(segmentConditionSchema).min(1, "At least one condition required per group"),
});

export const createSegmentSchema = z.object({
  name: z.string().min(2, "Segment name must be at least 2 characters").max(100, "Segment name cannot exceed 100 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().default(""),
  conditionGroups: z.array(segmentConditionGroupSchema).min(1, "At least one condition group is required"),
  groupLogic: z.enum(["AND", "OR"]).default("AND"),
  isActive: z.boolean().default(true),
});

export type CreateSegmentFormValues = z.infer<typeof createSegmentSchema>;

