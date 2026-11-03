export type SegmentConditionField =
  | "total_orders"
  | "total_spend"
  | "average_order_value"
  | "customer_tags"
  | "customer_segment"
  | "last_order_date"
  | "registration_date"
  | "customer_city"
  | "customer_division";

export type SegmentConditionOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "contains"
  | "not_contains"
  | "in"
  | "not_in"
  | "before"
  | "after";

export interface SegmentCondition {
  id: string;
  field: SegmentConditionField;
  operator: SegmentConditionOperator;
  value: string | number | string[];
}

export interface SegmentConditionGroup {
  id: string;
  logic: "AND" | "OR";
  conditions: SegmentCondition[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  conditionGroups: SegmentConditionGroup[];
  groupLogic: "AND" | "OR";
  matchingCustomerCount: number;
  matchingCustomerIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentPreview {
  matchingCount: number;
  totalCustomers: number;
  matchingCustomerIds: string[];
  percentage: number;
}

export interface SegmentStats {
  totalSegments: number;
  activeSegments: number;
  averageSegmentSize: number;
}

