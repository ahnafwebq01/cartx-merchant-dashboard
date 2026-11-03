import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockSegmentationService } from "./services/mockSegmentation";
import type { CreateSegmentFormValues } from "./schemas";
import type { SegmentConditionGroup } from "./types";
import { toast } from "sonner";

export const SEGMENTATION_QUERY_KEYS = {
  all: ["segments"] as const,
  list: (params?: { search?: string; status?: string }) => ["segments", "list", params] as const,
  detail: (id: string) => ["segments", "detail", id] as const,
  preview: (groups: SegmentConditionGroup[], logic: "AND" | "OR") =>
    ["segments", "preview", groups, logic] as const,
  stats: ["segments", "stats"] as const,
};

export function useSegmentsQuery(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: SEGMENTATION_QUERY_KEYS.list(params),
    queryFn: () => mockSegmentationService.getSegments(params),
  });
}

export function useSegmentQuery(id: string) {
  return useQuery({
    queryKey: SEGMENTATION_QUERY_KEYS.detail(id),
    queryFn: () => mockSegmentationService.getSegmentById(id),
    enabled: Boolean(id),
  });
}

export function useSegmentPreview(
  conditionGroups: SegmentConditionGroup[],
  groupLogic: "AND" | "OR" = "AND"
) {
  return useQuery({
    queryKey: SEGMENTATION_QUERY_KEYS.preview(conditionGroups, groupLogic),
    queryFn: () => mockSegmentationService.evaluateSegment(conditionGroups, groupLogic),
    enabled: Boolean(conditionGroups && conditionGroups.length > 0),
  });
}

export function useSegmentStatsQuery() {
  return useQuery({
    queryKey: SEGMENTATION_QUERY_KEYS.stats,
    queryFn: () => mockSegmentationService.getSegmentStats(),
  });
}

export function useCreateSegmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CreateSegmentFormValues) =>
      mockSegmentationService.createSegment(values),
    onSuccess: (segment) => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success(`Segment "${segment.name}" created (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create segment.");
    },
  });
}

export function useUpdateSegmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CreateSegmentFormValues }) =>
      mockSegmentationService.updateSegment(id, values),
    onSuccess: (segment) => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success(`Segment "${segment.name}" updated (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update segment.");
    },
  });
}

export function useDuplicateSegmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockSegmentationService.duplicateSegment(id),
    onSuccess: (segment) => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success(`Segment duplicated: "${segment.name}" (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to duplicate segment.");
    },
  });
}

export function useDeleteSegmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockSegmentationService.deleteSegment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success("Segment deleted successfully (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete segment.");
    },
  });
}

export function useToggleSegmentStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockSegmentationService.toggleSegmentStatus(id),
    onSuccess: (segment) => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success(
        `Segment "${segment.name}" is now ${segment.isActive ? "Active" : "Inactive"}`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to toggle segment status.");
    },
  });
}

