import type {
  Workflow,
  WorkflowExecution,
  WorkflowStats,
} from "../types";
import type { WorkflowFormValues } from "../schemas";
import { INITIAL_WORKFLOWS, INITIAL_EXECUTIONS } from "../constants";

export const WORKFLOWS_STORAGE_KEY = "cartx_demo_workflows_v1";
export const WORKFLOW_EXECUTIONS_STORAGE_KEY = "cartx_demo_workflow_executions_v1";

export class MockAutomationService {
  private memoryWorkflows: Workflow[] = JSON.parse(
    JSON.stringify(INITIAL_WORKFLOWS)
  );
  private memoryExecutions: WorkflowExecution[] = JSON.parse(
    JSON.stringify(INITIAL_EXECUTIONS)
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
      console.warn(`[MockAutomationService] Failed to set localStorage key "${key}":`, e);
    }
  }

  public async getWorkflows(params?: {
    search?: string;
    status?: string;
  }): Promise<Workflow[]> {
    const list = this.safeGetItem<Workflow[]>(
      WORKFLOWS_STORAGE_KEY,
      this.memoryWorkflows
    );
    this.memoryWorkflows = list;

    return list.filter((wf) => {
      if (params?.status && params.status !== "all" && wf.status !== params.status) {
        return false;
      }
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        const matches =
          wf.name.toLowerCase().includes(q) ||
          (wf.description && wf.description.toLowerCase().includes(q)) ||
          wf.trigger.label.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  public async getWorkflowById(id: string): Promise<Workflow | null> {
    const list = await this.getWorkflows();
    return list.find((w) => w.id === id) || null;
  }

  public async createWorkflow(values: WorkflowFormValues): Promise<Workflow> {
    const list = await this.getWorkflows();
    const now = new Date().toISOString();

    const newWorkflow: Workflow = {
      id: `wf_${Date.now()}`,
      name: values.name,
      description: values.description || "",
      status: values.status || "active",
      trigger: values.trigger,
      conditions: values.conditions,
      actions: values.actions,
      executionCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newWorkflow, ...list];
    this.memoryWorkflows = updated;
    this.safeSetItem(WORKFLOWS_STORAGE_KEY, updated);

    return newWorkflow;
  }

  public async updateWorkflow(
    id: string,
    values: WorkflowFormValues
  ): Promise<Workflow> {
    const list = await this.getWorkflows();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Workflow with ID "${id}" was not found.`);
    }

    const updated: Workflow = {
      ...list[index],
      name: values.name,
      description: values.description || "",
      status: values.status,
      trigger: values.trigger,
      conditions: values.conditions,
      actions: values.actions,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.memoryWorkflows = list;
    this.safeSetItem(WORKFLOWS_STORAGE_KEY, list);

    return updated;
  }

  public async duplicateWorkflow(id: string): Promise<Workflow> {
    const list = await this.getWorkflows();
    const target = list.find((w) => w.id === id);
    if (!target) {
      throw new Error(`Workflow "${id}" was not found.`);
    }

    const now = new Date().toISOString();
    const duplicated: Workflow = {
      ...target,
      id: `wf_${Date.now()}`,
      name: `${target.name} (Copy)`,
      status: "draft",
      executionCount: 0,
      lastExecutedAt: undefined,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [duplicated, ...list];
    this.memoryWorkflows = updated;
    this.safeSetItem(WORKFLOWS_STORAGE_KEY, updated);

    return duplicated;
  }

  public async deleteWorkflow(id: string): Promise<void> {
    const list = await this.getWorkflows();
    const filtered = list.filter((w) => w.id !== id);
    this.memoryWorkflows = filtered;
    this.safeSetItem(WORKFLOWS_STORAGE_KEY, filtered);

    // Also remove associated executions
    const executions = await this.getExecutions();
    const filteredExecutions = executions.filter((e) => e.workflowId !== id);
    this.memoryExecutions = filteredExecutions;
    this.safeSetItem(WORKFLOW_EXECUTIONS_STORAGE_KEY, filteredExecutions);
  }

  public async toggleWorkflow(id: string): Promise<Workflow> {
    const list = await this.getWorkflows();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Workflow "${id}" was not found.`);
    }

    const currentStatus = list[index].status;
    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    const updatedItem: Workflow = {
      ...list[index],
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedItem;
    this.memoryWorkflows = [...list];
    this.safeSetItem(WORKFLOWS_STORAGE_KEY, this.memoryWorkflows);

    return updatedItem;
  }

  public async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    const list = this.safeGetItem<WorkflowExecution[]>(
      WORKFLOW_EXECUTIONS_STORAGE_KEY,
      this.memoryExecutions
    );
    this.memoryExecutions = list;

    if (workflowId) {
      return list.filter((e) => e.workflowId === workflowId);
    }
    return list;
  }

  /**
   * Simulates a test execution run of the workflow in Demo Mode.
   * NO real background worker or notification delivery is triggered.
   */
  public async simulateExecution(id: string): Promise<WorkflowExecution> {
    const list = await this.getWorkflows();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Workflow with ID "${id}" was not found.`);
    }

    const workflow = list[index];
    const isSuccess = Math.random() > 0.15; // 85% success rate

    const executedActions = workflow.actions.map((act) => {
      const configVal = Object.values(act.config)[0] || "";
      return `${act.label}: ${configVal || "Simulated"}`;
    });

    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId: workflow.id,
      workflowName: workflow.name,
      triggerEvent: `${workflow.trigger.type} (Simulated Event)`,
      status: isSuccess ? "success" : "failed",
      executedActions: isSuccess ? executedActions : [],
      failureReason: isSuccess ? undefined : "Simulated action timeout or condition mismatch",
      executedAt: new Date().toISOString(),
      duration: Math.floor(Math.random() * 80) + 40,
    };

    // Update workflow stats
    workflow.executionCount += 1;
    workflow.lastExecutedAt = execution.executedAt;
    list[index] = workflow;
    this.memoryWorkflows = list;
    this.safeSetItem(WORKFLOWS_STORAGE_KEY, list);

    // Save execution record
    const executions = await this.getExecutions();
    const updatedExecutions = [execution, ...executions];
    this.memoryExecutions = updatedExecutions;
    this.safeSetItem(WORKFLOW_EXECUTIONS_STORAGE_KEY, updatedExecutions);

    return execution;
  }

  public async getWorkflowStats(): Promise<WorkflowStats> {
    const workflows = await this.getWorkflows();
    const executions = await this.getExecutions();

    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter((w) => w.status === "active").length;
    const totalExecutions = executions.length;
    const successCount = executions.filter((e) => e.status === "success").length;
    const successRate = totalExecutions > 0 ? Math.round((successCount / totalExecutions) * 100) : 100;

    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successRate,
    };
  }

  public resetToDefaults(): void {
    this.memoryWorkflows = JSON.parse(JSON.stringify(INITIAL_WORKFLOWS));
    this.memoryExecutions = JSON.parse(JSON.stringify(INITIAL_EXECUTIONS));

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(WORKFLOWS_STORAGE_KEY);
      window.localStorage.removeItem(WORKFLOW_EXECUTIONS_STORAGE_KEY);
    }
  }
}

export const mockAutomationService = new MockAutomationService();
