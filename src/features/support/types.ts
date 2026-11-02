export type HelpArticleCategory =
  | "getting_started"
  | "payments"
  | "couriers"
  | "storefront"
  | "marketing"
  | "team_billing";

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  category: HelpArticleCategory;
  categoryLabel: string;
  summary: string;
  content: string;
  readTimeMinutes: number;
  tags: string[];
  lastUpdated: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type TicketCategory =
  | "billing"
  | "technical"
  | "shipping"
  | "payments"
  | "general"
  | "feature_request";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: "merchant" | "support_agent";
  senderName: string;
  senderRole?: string;
  avatarUrl?: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  lastReplyBy: "merchant" | "support_agent";
  messages: TicketMessage[];
}

