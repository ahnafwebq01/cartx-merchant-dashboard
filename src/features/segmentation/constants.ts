import type { CustomerSegment, SegmentConditionField, SegmentConditionOperator } from "./types";

export interface ConditionFieldDefinition {
  field: SegmentConditionField;
  label: string;
  type: "number" | "text" | "date" | "select";
  operators: { value: SegmentConditionOperator; label: string }[];
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export const CONDITION_FIELD_DEFINITIONS: ConditionFieldDefinition[] = [
  {
    field: "total_spend",
    label: "Total Spending (৳)",
    type: "number",
    operators: [
      { value: "greater_than_or_equal", label: "Greater than or equal to (≥)" },
      { value: "less_than_or_equal", label: "Less than or equal to (≤)" },
      { value: "greater_than", label: "Greater than (>)" },
      { value: "less_than", label: "Less than (<)" },
      { value: "equals", label: "Equals (=)" },
    ],
    placeholder: "e.g. 10000",
  },
  {
    field: "total_orders",
    label: "Total Orders Count",
    type: "number",
    operators: [
      { value: "greater_than_or_equal", label: "Greater than or equal to (≥)" },
      { value: "less_than_or_equal", label: "Less than or equal to (≤)" },
      { value: "equals", label: "Equals (=)" },
      { value: "greater_than", label: "Greater than (>)" },
      { value: "less_than", label: "Less than (<)" },
    ],
    placeholder: "e.g. 2",
  },
  {
    field: "average_order_value",
    label: "Average Order Value (AOV ৳)",
    type: "number",
    operators: [
      { value: "greater_than_or_equal", label: "Greater than or equal to (≥)" },
      { value: "less_than_or_equal", label: "Less than or equal to (≤)" },
      { value: "equals", label: "Equals (=)" },
    ],
    placeholder: "e.g. 5000",
  },
  {
    field: "customer_city",
    label: "Customer City / District",
    type: "select",
    operators: [
      { value: "equals", label: "Is" },
      { value: "not_equals", label: "Is not" },
      { value: "contains", label: "Contains" },
    ],
    options: [
      { value: "Dhaka", label: "Dhaka" },
      { value: "Chattogram", label: "Chattogram" },
      { value: "Sylhet", label: "Sylhet" },
      { value: "Rajshahi", label: "Rajshahi" },
      { value: "Khulna", label: "Khulna" },
      { value: "Barishal", label: "Barishal" },
      { value: "Rangpur", label: "Rangpur" },
      { value: "Mymensingh", label: "Mymensingh" },
    ],
  },
  {
    field: "customer_division",
    label: "Customer Division",
    type: "select",
    operators: [
      { value: "equals", label: "Is" },
      { value: "not_equals", label: "Is not" },
    ],
    options: [
      { value: "Dhaka", label: "Dhaka" },
      { value: "Chattogram", label: "Chattogram" },
      { value: "Sylhet", label: "Sylhet" },
      { value: "Rajshahi", label: "Rajshahi" },
      { value: "Khulna", label: "Khulna" },
      { value: "Barishal", label: "Barishal" },
    ],
  },
  {
    field: "customer_tags",
    label: "Customer CRM Tags",
    type: "text",
    operators: [
      { value: "contains", label: "Contains tag" },
      { value: "not_contains", label: "Does not contain" },
    ],
    placeholder: "e.g. VIP, Repeat, Fashion",
  },
  {
    field: "customer_segment",
    label: "Customer Lifecycle Group",
    type: "select",
    operators: [
      { value: "equals", label: "Is" },
      { value: "not_equals", label: "Is not" },
    ],
    options: [
      { value: "new", label: "New Customer" },
      { value: "repeat", label: "Repeat Customer" },
      { value: "high_value", label: "High Value / VIP" },
      { value: "inactive", label: "Inactive Customer" },
    ],
  },
  {
    field: "last_order_date",
    label: "Last Order Date",
    type: "date",
    operators: [
      { value: "before", label: "Before date" },
      { value: "after", label: "After date" },
    ],
  },
  {
    field: "registration_date",
    label: "Registration Date",
    type: "date",
    operators: [
      { value: "before", label: "Before date" },
      { value: "after", label: "After date" },
    ],
  },
];

export const INITIAL_SEGMENTS: CustomerSegment[] = [
  {
    id: "seg_vip_high_value",
    name: "VIP High-Spenders (≥ ৳10,000)",
    description: "Customers who have generated lifetime gross sales of at least ৳10,000 across confirmed orders",
    groupLogic: "AND",
    conditionGroups: [
      {
        id: "grp_vip_1",
        logic: "AND",
        conditions: [
          {
            id: "c_vip_spend",
            field: "total_spend",
            operator: "greater_than_or_equal",
            value: 10000,
          },
        ],
      },
    ],
    matchingCustomerCount: 3,
    matchingCustomerIds: ["cust-001", "cust-002", "cust-008"],
    isActive: true,
    createdAt: "2026-10-15T10:00:00.000Z",
    updatedAt: "2026-10-28T14:30:00.000Z",
  },
  {
    id: "seg_dhaka_residents",
    name: "Dhaka Metro Customers",
    description: "Shoppers located within Dhaka metropolitan area eligible for same-day delivery (৳60)",
    groupLogic: "AND",
    conditionGroups: [
      {
        id: "grp_dhaka_1",
        logic: "AND",
        conditions: [
          {
            id: "c_dhaka_city",
            field: "customer_city",
            operator: "equals",
            value: "Dhaka",
          },
        ],
      },
    ],
    matchingCustomerCount: 3,
    matchingCustomerIds: ["cust-001", "cust-002", "cust-007"],
    isActive: true,
    createdAt: "2026-10-16T11:00:00.000Z",
    updatedAt: "2026-10-28T14:30:00.000Z",
  },
  {
    id: "seg_repeat_buyers",
    name: "Loyal Repeat Buyers (2+ Orders)",
    description: "Verified customers who placed two or more successful purchase orders",
    groupLogic: "AND",
    conditionGroups: [
      {
        id: "grp_repeat_1",
        logic: "AND",
        conditions: [
          {
            id: "c_repeat_orders",
            field: "total_orders",
            operator: "greater_than_or_equal",
            value: 2,
          },
        ],
      },
    ],
    matchingCustomerCount: 6,
    matchingCustomerIds: ["cust-001", "cust-002", "cust-003", "cust-004", "cust-005", "cust-006"],
    isActive: true,
    createdAt: "2026-10-17T09:00:00.000Z",
    updatedAt: "2026-10-29T09:10:00.000Z",
  },
  {
    id: "seg_inactive_risk",
    name: "Inactive Churn Risk",
    description: "Customers with single order placed prior to September 2026 needing winback reactivation",
    groupLogic: "AND",
    conditionGroups: [
      {
        id: "grp_inactive_1",
        logic: "AND",
        conditions: [
          {
            id: "c_inactive_orders",
            field: "total_orders",
            operator: "less_than",
            value: 2,
          },
          {
            id: "c_inactive_date",
            field: "last_order_date",
            operator: "before",
            value: "2026-09-01",
          },
        ],
      },
    ],
    matchingCustomerCount: 1,
    matchingCustomerIds: ["cust-007"],
    isActive: true,
    createdAt: "2026-10-18T14:00:00.000Z",
    updatedAt: "2026-10-25T13:00:00.000Z",
  },
];

