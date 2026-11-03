export type WorkflowStatus = "active" | "inactive" | "draft";

export type TriggerType =
  | "order_created"
  | "order_status_changed"
  | "low_stock"
  | "customer_created"
  | "coupon_redeemed";

export type ConditionType =
  | "order_amount"
  | "order_status"
  | "product_category"
  | "customer_segment"
  | "stock_threshold";

export type ActionType =
  | "add_notification"
  | "apply_tag"
  | "create_task"
  | "mark_activity"
  | "simulate_notification";

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  label: string;
  description: string;
  config: Record<string, string>;
}

export interface WorkflowCondition {
  id: string;
  type: ConditionType;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "in";
  value: string | number;
  label: string;
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  label: string;
  config: Record<string, string>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus = "success" | "failed" | "skipped";

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  triggerEvent: string;
  status: ExecutionStatus;
  executedActions: string[];
  failureReason?: string;
  executedAt: string;
  duration: number;
}

export interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successRate: number;
}

