import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAutomationService } from "./services/mockAutomation";
import type { WorkflowFormValues } from "./schemas";
import { toast } from "sonner";

export const AUTOMATION_QUERY_KEYS = {
  workflows: (params?: { search?: string; status?: string }) =>
    ["automation", "workflows", params] as const,
  workflow: (id: string) => ["automation", "workflow", id] as const,
  executions: (workflowId?: string) => ["automation", "executions", workflowId] as const,
  stats: ["automation", "stats"] as const,
};

export function useWorkflowsQuery(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.workflows(params),
    queryFn: () => mockAutomationService.getWorkflows(params),
  });
}

export function useWorkflowQuery(id: string) {
  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.workflow(id),
    queryFn: () => mockAutomationService.getWorkflowById(id),
    enabled: Boolean(id),
  });
}

export function useWorkflowExecutionsQuery(workflowId?: string) {
  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.executions(workflowId),
    queryFn: () => mockAutomationService.getExecutions(workflowId),
  });
}

export function useWorkflowStatsQuery() {
  return useQuery({
    queryKey: AUTOMATION_QUERY_KEYS.stats,
    queryFn: () => mockAutomationService.getWorkflowStats(),
  });
}

export function useCreateWorkflowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: WorkflowFormValues) =>
      mockAutomationService.createWorkflow(values),
    onSuccess: (wf) => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      toast.success(`Workflow "${wf.name}" created (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create workflow.");
    },
  });
}

export function useUpdateWorkflowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: WorkflowFormValues }) =>
      mockAutomationService.updateWorkflow(id, values),
    onSuccess: (wf) => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      toast.success(`Workflow "${wf.name}" updated (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update workflow.");
    },
  });
}

export function useDuplicateWorkflowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockAutomationService.duplicateWorkflow(id),
    onSuccess: (wf) => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      toast.success(`Duplicated workflow: "${wf.name}" (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to duplicate workflow.");
    },
  });
}

export function useDeleteWorkflowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockAutomationService.deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      toast.success("Workflow deleted (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete workflow.");
    },
  });
}

export function useToggleWorkflowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockAutomationService.toggleWorkflow(id),
    onSuccess: (wf) => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      toast.success(
        `Workflow "${wf.name}" is now ${wf.status === "active" ? "Active" : "Inactive"}`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to toggle workflow status.");
    },
  });
}

export function useSimulateExecutionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockAutomationService.simulateExecution(id),
    onSuccess: (exec) => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      if (exec.status === "success") {
        toast.success(`Simulated test run for "${exec.workflowName}" executed successfully!`);
      } else {
        toast.error(`Simulated run failed: ${exec.failureReason}`);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Simulated execution failed.");
    },
  });
}

