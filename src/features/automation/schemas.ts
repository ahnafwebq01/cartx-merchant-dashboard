import { z } from "zod";

export const workflowTriggerSchema = z.object({
  id: z.string(),
  type: z.enum([
    "order_created",
    "order_status_changed",
    "low_stock",
    "customer_created",
    "coupon_redeemed",
  ]),
  label: z.string(),
  description: z.string(),
  config: z.record(z.string(), z.string()).default({}),
});

export const workflowConditionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "order_amount",
    "order_status",
    "product_category",
    "customer_segment",
    "stock_threshold",
  ]),
  operator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains", "in"]),
  value: z.union([z.string(), z.number()]),
  label: z.string(),
});

export const workflowActionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "add_notification",
    "apply_tag",
    "create_task",
    "mark_activity",
    "simulate_notification",
  ]),
  label: z.string(),
  config: z.record(z.string(), z.string()).default({}),
});

export const workflowSchema = z.object({
  name: z.string().min(2, "Workflow name must be at least 2 characters").max(100, "Workflow name cannot exceed 100 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().default(""),
  trigger: workflowTriggerSchema,
  conditions: z.array(workflowConditionSchema).default([]),
  actions: z.array(workflowActionSchema).min(1, "Configure at least one action to execute"),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
});

export type WorkflowFormValues = z.infer<typeof workflowSchema>;

