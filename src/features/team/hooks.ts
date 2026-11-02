import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockTeamService } from "./services/mockTeam";
import type { InviteMemberFormValues, UpdateMemberFormValues } from "./schemas";
import { toast } from "sonner";

export const TEAM_QUERY_KEYS = {
  members: (params?: { search?: string; role?: string; status?: string }) =>
    ["team", "members", params] as const,
  member: (id: string) => ["team", "member", id] as const,
  invitations: (status?: string) => ["team", "invitations", status] as const,
  stats: ["team", "stats"] as const,
};

export function useTeamMembersQuery(params?: {
  search?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.members(params),
    queryFn: () => mockTeamService.getTeamMembers(params),
  });
}

export function useTeamMemberQuery(id: string) {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.member(id),
    queryFn: () => mockTeamService.getTeamMemberById(id),
    enabled: Boolean(id),
  });
}

export function useTeamInvitationsQuery(status?: string) {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.invitations(status),
    queryFn: () => mockTeamService.getTeamInvitations(status),
  });
}

export function useTeamStatsQuery() {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.stats,
    queryFn: () => mockTeamService.getTeamStats(),
  });
}

export function useInviteMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteMemberFormValues) => mockTeamService.inviteMember(data),
    onSuccess: (newInvite) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(`Invitation sent to ${newInvite.email} (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send invitation.");
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberFormValues }) =>
      mockTeamService.updateTeamMember(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(`Updated team member: ${updated.name}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update member.");
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockTeamService.removeTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Team member removed successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove member.");
    },
  });
}

export function useCancelInvitationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockTeamService.cancelInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Invitation cancelled.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to cancel invitation.");
    },
  });
}

export function useResendInvitationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockTeamService.resendInvitation(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(`Invitation resent to ${updated.email} (Demo Mode: expiry +7 days)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to resend invitation.");
    },
  });
}

export function useAcceptInvitationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockTeamService.acceptInvitation(id),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(`Simulated acceptance: ${member.name} is now an active member!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to accept invitation.");
    },
  });
}
