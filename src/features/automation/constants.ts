import type {
  Workflow,
  WorkflowExecution,
  TriggerType,
  ConditionType,
  ActionType,
} from "./types";

export interface TriggerOption {
  type: TriggerType;
  label: string;
  description: string;
  iconName: string;
}

export const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    type: "order_created",
    label: "New Order Placed",
    description: "Fires whenever a customer completes a checkout in your store",
    iconName: "ShoppingCart",
  },
  {
    type: "order_status_changed",
    label: "Order Status Transitioned",
    description: "Fires when fulfillment changes (e.g. processing, shipped, delivered)",
    iconName: "Truck",
  },
  {
    type: "low_stock",
    label: "Low Inventory Alert",
    description: "Fires when any SKU reaches or drops below its reorder threshold",
    iconName: "AlertTriangle",
  },
  {
    type: "customer_created",
    label: "Customer Account Created",
    description: "Fires when a new shopper registers or places their first order",
    iconName: "Users",
  },
  {
    type: "coupon_redeemed",
    label: "Promotion Coupon Redeemed",
    description: "Fires when a customer successfully claims a promotional voucher code",
    iconName: "Tag",
  },
];

export interface ConditionOption {
  type: ConditionType;
  label: string;
  operators: { value: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "in"; label: string }[];
  placeholder?: string;
  inputType: "number" | "text" | "select";
  options?: { value: string; label: string }[];
}

export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    type: "order_amount",
    label: "Order Grand Total (৳)",
    operators: [
      { value: "greater_than", label: "Greater than (>)" },
      { value: "less_than", label: "Less than (<)" },
      { value: "equals", label: "Equals (=)" },
    ],
    placeholder: "e.g. 5000",
    inputType: "number",
  },
  {
    type: "order_status",
    label: "Target Order Status",
    operators: [
      { value: "equals", label: "Is" },
      { value: "not_equals", label: "Is not" },
    ],
    inputType: "select",
    options: [
      { value: "pending", label: "Pending Confirmation" },
      { value: "processing", label: "Processing & Packaging" },
      { value: "shipped", label: "Shipped with Courier" },
      { value: "delivered", label: "Delivered to Customer" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    type: "stock_threshold",
    label: "Remaining Stock Units",
    operators: [
      { value: "less_than", label: "Less than (<)" },
      { value: "equals", label: "Equals (=)" },
    ],
    placeholder: "e.g. 5",
    inputType: "number",
  },
  {
    type: "customer_segment",
    label: "Customer Lifecycle Segment",
    operators: [
      { value: "equals", label: "Is" },
      { value: "not_equals", label: "Is not" },
    ],
    inputType: "select",
    options: [
      { value: "high_value", label: "VIP High-Spender" },
      { value: "repeat", label: "Repeat Buyer" },
      { value: "new", label: "New Registration" },
      { value: "inactive", label: "Inactive Risk" },
    ],
  },
  {
    type: "product_category",
    label: "Product Category",
    operators: [
      { value: "equals", label: "Is" },
      { value: "contains", label: "Contains" },
    ],
    placeholder: "e.g. Saree, Organic",
    inputType: "text",
  },
];

export interface ActionOption {
  type: ActionType;
  label: string;
  description: string;
  configKey: string;
  configLabel: string;
  placeholder: string;
}

export const ACTION_OPTIONS: ActionOption[] = [
  {
    type: "add_notification",
    label: "Create Internal Merchant Notification",
    description: "Post a high-priority banner inside the merchant dashboard",
    configKey: "message",
    configLabel: "Notification Message",
    placeholder: "e.g. High-value VIP order received! Priority packaging required.",
  },
  {
    type: "apply_tag",
    label: "Apply Customer CRM Tag",
    description: "Append a segmentation tag to the associated customer profile",
    configKey: "tag",
    configLabel: "Tag Name",
    placeholder: "e.g. VIP-Express, Eid-Shopper",
  },
  {
    type: "create_task",
    label: "Create Simulated Staff Task",
    description: "Assign an operational fulfillment task for store managers",
    configKey: "taskTitle",
    configLabel: "Task Title",
    placeholder: "e.g. Call customer for address confirmation before dispatch",
  },
  {
    type: "mark_activity",
    label: "Log Store Audit Activity",
    description: "Record an immutable audit record in store telemetry logs",
    configKey: "logMessage",
    configLabel: "Audit Log Entry",
    placeholder: "e.g. Automatic discount verified and applied at checkout",
  },
  {
    type: "simulate_notification",
    label: "Simulate Push / SMS Dispatch",
    description: "Demonstrate automated customer notification message delivery",
    configKey: "alertBody",
    configLabel: "Message Content",
    placeholder: "e.g. আপনার অর্ডারটি নিশ্চিত করা হয়েছে! দ্রুত ডেলিভারি করা হবে।",
  },
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: "wf_vip_order_alert",
    name: "VIP High-Value Order Alert",
    description: "When an order exceeding ৳10,000 is placed, trigger internal staff alerts and tag the customer as VIP",
    status: "active",
    trigger: {
      id: "trg_1",
      type: "order_created",
      label: "New Order Placed",
      description: "Fires whenever a customer completes a checkout in your store",
      config: {},
    },
    conditions: [
      {
        id: "cnd_1",
        type: "order_amount",
        operator: "greater_than",
        value: 10000,
        label: "Order Total > ৳10,000",
      },
    ],
    actions: [
      {
        id: "act_1",
        type: "add_notification",
        label: "Create Internal Merchant Notification",
        config: { message: "High-value VIP order placed! Immediate warehouse prioritization assigned." },
      },
      {
        id: "act_2",
        type: "apply_tag",
        label: "Apply Customer CRM Tag",
        config: { tag: "VIP" },
      },
    ],
    executionCount: 5,
    lastExecutedAt: "2026-10-29T14:30:00.000Z",
    createdAt: "2026-10-15T10:00:00.000Z",
    updatedAt: "2026-10-28T12:00:00.000Z",
  },
  {
    id: "wf_low_stock_restock",
    name: "Low Inventory Restock Alert",
    description: "Notify inventory managers when product available stock falls under 5 units",
    status: "active",
    trigger: {
      id: "trg_2",
      type: "low_stock",
      label: "Low Inventory Alert",
      description: "Fires when any SKU reaches or drops below its reorder threshold",
      config: {},
    },
    conditions: [
      {
        id: "cnd_2",
        type: "stock_threshold",
        operator: "less_than",
        value: 5,
        label: "Units in stock < 5",
      },
    ],
    actions: [
      {
        id: "act_3",
        type: "create_task",
        label: "Create Simulated Staff Task",
        config: { taskTitle: "Restock Jamdani & Mustard Oil batch from artisan supplier" },
      },
      {
        id: "act_4",
        type: "mark_activity",
        label: "Log Store Audit Activity",
        config: { logMessage: "Stock critical warning triggered" },
      },
    ],
    executionCount: 8,
    lastExecutedAt: "2026-10-28T16:00:00.000Z",
    createdAt: "2026-10-16T11:00:00.000Z",
    updatedAt: "2026-10-27T09:00:00.000Z",
  },
  {
    id: "wf_new_shopper_welcome",
    name: "New Customer Welcome Tag",
    description: "Automatically label first-time registered customers and simulate welcome greeting",
    status: "inactive",
    trigger: {
      id: "trg_3",
      type: "customer_created",
      label: "Customer Account Created",
      description: "Fires when a new shopper registers or places their first order",
      config: {},
    },
    conditions: [],
    actions: [
      {
        id: "act_5",
        type: "apply_tag",
        label: "Apply Customer CRM Tag",
        config: { tag: "New Shopper" },
      },
      {
        id: "act_6",
        type: "simulate_notification",
        label: "Simulate Push / SMS Dispatch",
        config: { alertBody: "Welcome to Green Harvest BD! Use code EID2026 for ৳200 off your first purchase." },
      },
    ],
    executionCount: 2,
    lastExecutedAt: "2026-10-25T11:00:00.000Z",
    createdAt: "2026-10-18T14:00:00.000Z",
    updatedAt: "2026-10-25T11:00:00.000Z",
  },
];

export const INITIAL_EXECUTIONS: WorkflowExecution[] = [
  {
    id: "exec_001",
    workflowId: "wf_vip_order_alert",
    workflowName: "VIP High-Value Order Alert",
    triggerEvent: "order_created (Order #CTX-1001)",
    status: "success",
    executedActions: [
      "Added dashboard alert: High-value order placed",
      "Applied customer tag: VIP",
    ],
    executedAt: "2026-10-29T14:30:15.000Z",
    duration: 85,
  },
  {
    id: "exec_002",
    workflowId: "wf_low_stock_restock",
    workflowName: "Low Inventory Restock Alert",
    triggerEvent: "low_stock (SKU JMD-SLK-001)",
    status: "success",
    executedActions: [
      "Created fulfillment task: Restock supplier",
      "Logged audit record",
    ],
    executedAt: "2026-10-28T16:00:10.000Z",
    duration: 62,
  },
  {
    id: "exec_003",
    workflowId: "wf_vip_order_alert",
    workflowName: "VIP High-Value Order Alert",
    triggerEvent: "order_created (Order #CTX-1004)",
    status: "skipped",
    executedActions: [],
    failureReason: "Condition not met: Order amount ৳4,120 is less than threshold ৳10,000",
    executedAt: "2026-10-28T11:15:00.000Z",
    duration: 35,
  },
  {
    id: "exec_004",
    workflowId: "wf_new_shopper_welcome",
    workflowName: "New Customer Welcome Tag",
    triggerEvent: "customer_created (Customer Farhana Akter)",
    status: "success",
    executedActions: [
      "Applied CRM tag: New Shopper",
      "Simulated notification dispatch",
    ],
    executedAt: "2026-10-25T11:00:00.000Z",
    duration: 110,
  },
];

