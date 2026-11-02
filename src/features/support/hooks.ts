import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockSupportService } from "./services/mockSupport";
import type { TicketStatus } from "./types";
import type { CreateTicketFormValues } from "./schemas";
import { toast } from "sonner";

export const SUPPORT_QUERY_KEYS = {
  articles: (params?: { search?: string; category?: string }) =>
    ["support", "articles", params] as const,
  article: (slug: string) => ["support", "article", slug] as const,
  faqs: (category?: string) => ["support", "faqs", category] as const,
  tickets: (params?: { status?: string; category?: string; priority?: string; search?: string }) =>
    ["support", "tickets", params] as const,
  ticket: (id: string) => ["support", "ticket", id] as const,
};

export function useHelpArticlesQuery(params?: { search?: string; category?: string }) {
  return useQuery({
    queryKey: SUPPORT_QUERY_KEYS.articles(params),
    queryFn: () => mockSupportService.getHelpArticles(params),
  });
}

export function useHelpArticleQuery(slug: string) {
  return useQuery({
    queryKey: SUPPORT_QUERY_KEYS.article(slug),
    queryFn: () => mockSupportService.getHelpArticleBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useFaqsQuery(category?: string) {
  return useQuery({
    queryKey: SUPPORT_QUERY_KEYS.faqs(category),
    queryFn: () => mockSupportService.getFaqs(category),
  });
}

export function useSupportTicketsQuery(params?: {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: SUPPORT_QUERY_KEYS.tickets(params),
    queryFn: () => mockSupportService.getSupportTickets(params),
  });
}

export function useSupportTicketQuery(id: string) {
  return useQuery({
    queryKey: SUPPORT_QUERY_KEYS.ticket(id),
    queryFn: () => mockSupportService.getSupportTicketById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketFormValues) =>
      mockSupportService.createSupportTicket(data),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      toast.success(`Support ticket ${ticket.id} created successfully! (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create support ticket.");
    },
  });
}

export function useReplyTicketMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: string; message: string }) =>
      mockSupportService.replySupportTicket(ticketId, message),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.ticket(updated.id) });
      toast.success("Reply submitted.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit reply.");
    },
  });
}

export function useUpdateTicketStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: TicketStatus }) =>
      mockSupportService.updateTicketStatus(ticketId, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.ticket(updated.id) });
      toast.success(`Ticket status updated to ${updated.status}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update ticket status.");
    },
  });
}
