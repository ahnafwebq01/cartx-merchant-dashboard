import type {
  CustomerSegment,
  SegmentCondition,
  SegmentConditionGroup,
  SegmentPreview,
  SegmentStats,
} from "../types";
import type { CreateSegmentFormValues } from "../schemas";
import { INITIAL_SEGMENTS } from "../constants";
import { mockCustomerService } from "@/features/customers/services/mockCustomers";
import type { Customer } from "@/features/customers/types";

export const SEGMENTS_STORAGE_KEY = "cartx_demo_segments_v1";

export class MockSegmentationService {
  private memorySegments: CustomerSegment[] = JSON.parse(
    JSON.stringify(INITIAL_SEGMENTS)
  );

  private safeGetItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSetItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[MockSegmentationService] Failed to set localStorage key "${key}":`, e);
    }
  }

  private loadAllCustomers(): Customer[] {
    const res = mockCustomerService.getCustomers({ limit: 100 });
    return res.customers;
  }

  /**
   * Evaluates a single condition against a customer record deterministically.
   */
  public evaluateCondition(customer: Customer, condition: SegmentCondition): boolean {
    const { field, operator, value } = condition;

    switch (field) {
      case "total_spend": {
        const numVal = Number(value);
        if (isNaN(numVal)) return false;
        if (operator === "greater_than_or_equal") return customer.totalSpend >= numVal;
        if (operator === "less_than_or_equal") return customer.totalSpend <= numVal;
        if (operator === "greater_than") return customer.totalSpend > numVal;
        if (operator === "less_than") return customer.totalSpend < numVal;
        if (operator === "equals") return customer.totalSpend === numVal;
        return false;
      }

      case "total_orders": {
        const numVal = Number(value);
        if (isNaN(numVal)) return false;
        if (operator === "greater_than_or_equal") return customer.totalOrders >= numVal;
        if (operator === "less_than_or_equal") return customer.totalOrders <= numVal;
        if (operator === "greater_than") return customer.totalOrders > numVal;
        if (operator === "less_than") return customer.totalOrders < numVal;
        if (operator === "equals") return customer.totalOrders === numVal;
        return false;
      }

      case "average_order_value": {
        const numVal = Number(value);
        if (isNaN(numVal)) return false;
        if (operator === "greater_than_or_equal") return customer.averageOrderValue >= numVal;
        if (operator === "less_than_or_equal") return customer.averageOrderValue <= numVal;
        if (operator === "equals") return customer.averageOrderValue === numVal;
        return false;
      }

      case "customer_city": {
        const strVal = String(value).toLowerCase().trim();
        const city = (customer.city || "").toLowerCase().trim();
        if (operator === "equals") return city === strVal;
        if (operator === "not_equals") return city !== strVal;
        if (operator === "contains") return city.includes(strVal);
        return false;
      }

      case "customer_division": {
        const strVal = String(value).toLowerCase().trim();
        const div = (customer.division || "").toLowerCase().trim();
        if (operator === "equals") return div === strVal;
        if (operator === "not_equals") return div !== strVal;
        return false;
      }

      case "customer_tags": {
        const strVal = String(value).toLowerCase().trim();
        const tags = customer.tags.map((t) => t.toLowerCase());
        if (operator === "contains") return tags.some((t) => t.includes(strVal));
        if (operator === "not_contains") return !tags.some((t) => t.includes(strVal));
        return false;
      }

      case "customer_segment": {
        const strVal = String(value).toLowerCase().trim();
        if (operator === "equals") return customer.segment === strVal;
        if (operator === "not_equals") return customer.segment !== strVal;
        return false;
      }

      case "last_order_date": {
        if (!customer.lastOrderDate) return false;
        const customerTime = new Date(customer.lastOrderDate).getTime();
        const condTime = new Date(String(value)).getTime();
        if (isNaN(customerTime) || isNaN(condTime)) return false;
        if (operator === "before") return customerTime < condTime;
        if (operator === "after") return customerTime > condTime;
        return false;
      }

      case "registration_date": {
        const customerTime = new Date(customer.createdAt).getTime();
        const condTime = new Date(String(value)).getTime();
        if (isNaN(customerTime) || isNaN(condTime)) return false;
        if (operator === "before") return customerTime < condTime;
        if (operator === "after") return customerTime > condTime;
        return false;
      }

      default:
        return false;
    }
  }

  /**
   * Evaluates condition groups with AND/OR logic against all demo customers.
   */
  public evaluateSegment(
    conditionGroups: SegmentConditionGroup[],
    groupLogic: "AND" | "OR" = "AND"
  ): SegmentPreview {
    const customers = this.loadAllCustomers();
    const totalCustomers = customers.length;

    if (!conditionGroups || conditionGroups.length === 0) {
      return {
        matchingCount: totalCustomers,
        totalCustomers,
        matchingCustomerIds: customers.map((c) => c.id),
        percentage: 100,
      };
    }

    const matchingCustomers = customers.filter((customer) => {
      // Evaluate each group
      const groupResults = conditionGroups.map((group) => {
        if (!group.conditions || group.conditions.length === 0) return true;

        if (group.logic === "AND") {
          return group.conditions.every((c) => this.evaluateCondition(customer, c));
        } else {
          return group.conditions.some((c) => this.evaluateCondition(customer, c));
        }
      });

      if (groupLogic === "AND") {
        return groupResults.every(Boolean);
      } else {
        return groupResults.some(Boolean);
      }
    });

    const matchingCount = matchingCustomers.length;
    const percentage = totalCustomers > 0 ? Math.round((matchingCount / totalCustomers) * 100) : 0;

    return {
      matchingCount,
      totalCustomers,
      matchingCustomerIds: matchingCustomers.map((c) => c.id),
      percentage,
    };
  }

  public async getSegments(params?: { search?: string; status?: string }): Promise<CustomerSegment[]> {
    const stored = this.safeGetItem<CustomerSegment[]>(
      SEGMENTS_STORAGE_KEY,
      this.memorySegments
    );
    this.memorySegments = stored;

    // Recalculate matches against live customer database
    const refreshed = stored.map((seg) => {
      const preview = this.evaluateSegment(seg.conditionGroups, seg.groupLogic);
      return {
        ...seg,
        matchingCustomerCount: preview.matchingCount,
        matchingCustomerIds: preview.matchingCustomerIds,
      };
    });

    return refreshed.filter((seg) => {
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        const matches =
          seg.name.toLowerCase().includes(q) ||
          (seg.description && seg.description.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (params?.status && params.status !== "all") {
        const wantActive = params.status === "active";
        if (seg.isActive !== wantActive) return false;
      }
      return true;
    });
  }

  public async getSegmentById(id: string): Promise<CustomerSegment | null> {
    const segments = await this.getSegments();
    return segments.find((s) => s.id === id) || null;
  }

  public async createSegment(values: CreateSegmentFormValues): Promise<CustomerSegment> {
    const segments = await this.getSegments();
    const preview = this.evaluateSegment(values.conditionGroups, values.groupLogic);

    const now = new Date().toISOString();
    const newSegment: CustomerSegment = {
      id: `seg_${Date.now()}`,
      name: values.name,
      description: values.description || "",
      conditionGroups: values.conditionGroups,
      groupLogic: values.groupLogic,
      matchingCustomerCount: preview.matchingCount,
      matchingCustomerIds: preview.matchingCustomerIds,
      isActive: values.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newSegment, ...segments];
    this.memorySegments = updated;
    this.safeSetItem(SEGMENTS_STORAGE_KEY, updated);

    return newSegment;
  }

  public async updateSegment(
    id: string,
    values: CreateSegmentFormValues
  ): Promise<CustomerSegment> {
    const segments = await this.getSegments();
    const index = segments.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Segment with ID "${id}" was not found.`);
    }

    const preview = this.evaluateSegment(values.conditionGroups, values.groupLogic);

    const updated: CustomerSegment = {
      ...segments[index],
      name: values.name,
      description: values.description || "",
      conditionGroups: values.conditionGroups,
      groupLogic: values.groupLogic,
      matchingCustomerCount: preview.matchingCount,
      matchingCustomerIds: preview.matchingCustomerIds,
      isActive: values.isActive ?? segments[index].isActive,
      updatedAt: new Date().toISOString(),
    };

    segments[index] = updated;
    this.memorySegments = segments;
    this.safeSetItem(SEGMENTS_STORAGE_KEY, segments);

    return updated;
  }

  public async duplicateSegment(id: string): Promise<CustomerSegment> {
    const segments = await this.getSegments();
    const target = segments.find((s) => s.id === id);
    if (!target) {
      throw new Error(`Segment with ID "${id}" not found.`);
    }

    const now = new Date().toISOString();
    const duplicated: CustomerSegment = {
      ...target,
      id: `seg_${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [duplicated, ...segments];
    this.memorySegments = updated;
    this.safeSetItem(SEGMENTS_STORAGE_KEY, updated);

    return duplicated;
  }

  public async deleteSegment(id: string): Promise<void> {
    const segments = await this.getSegments();
    const filtered = segments.filter((s) => s.id !== id);
    this.memorySegments = filtered;
    this.safeSetItem(SEGMENTS_STORAGE_KEY, filtered);
  }

  public async toggleSegmentStatus(id: string): Promise<CustomerSegment> {
    const segments = await this.getSegments();
    const index = segments.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Segment with ID "${id}" was not found.`);
    }

    segments[index].isActive = !segments[index].isActive;
    segments[index].updatedAt = new Date().toISOString();

    this.memorySegments = segments;
    this.safeSetItem(SEGMENTS_STORAGE_KEY, segments);

    return segments[index];
  }

  public async getSegmentStats(): Promise<SegmentStats> {
    const segments = await this.getSegments();
    const totalSegments = segments.length;
    const activeSegments = segments.filter((s) => s.isActive).length;
    const totalMatching = segments.reduce((acc, s) => acc + s.matchingCustomerCount, 0);
    const averageSegmentSize = totalSegments > 0 ? Math.round(totalMatching / totalSegments) : 0;

    return {
      totalSegments,
      activeSegments,
      averageSegmentSize,
    };
  }

  public resetToDefaults(): void {
    this.memorySegments = JSON.parse(JSON.stringify(INITIAL_SEGMENTS));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SEGMENTS_STORAGE_KEY);
    }
  }
}

export const mockSegmentationService = new MockSegmentationService();

