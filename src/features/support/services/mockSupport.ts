import type {
  HelpArticle,
  FAQItem,
  SupportTicket,
  TicketMessage,
  TicketStatus,
} from "../types";
import type { CreateTicketFormValues } from "../schemas";
import { HELP_ARTICLES, FAQ_ITEMS, INITIAL_TICKETS } from "../constants";

export const SUPPORT_TICKETS_STORAGE_KEY = "cartx_demo_support_tickets_v1";

export class MockSupportService {
  private memoryTickets: SupportTicket[] = JSON.parse(JSON.stringify(INITIAL_TICKETS));

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
      console.warn(`[MockSupportService] Failed to set localStorage key "${key}":`, e);
    }
  }

  public async getHelpArticles(params?: {
    search?: string;
    category?: string;
  }): Promise<HelpArticle[]> {
    return HELP_ARTICLES.filter((article) => {
      if (params?.category && params.category !== "all" && article.category !== params.category) {
        return false;
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        const matches =
          article.title.toLowerCase().includes(q) ||
          article.summary.toLowerCase().includes(q) ||
          article.content.toLowerCase().includes(q) ||
          article.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }

  public async getHelpArticleBySlug(slug: string): Promise<HelpArticle | null> {
    return HELP_ARTICLES.find((a) => a.slug === slug || a.id === slug) || null;
  }

  public async getFaqs(category?: string): Promise<FAQItem[]> {
    if (!category || category === "all") {
      return FAQ_ITEMS;
    }
    return FAQ_ITEMS.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }

  public async getSupportTickets(params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<SupportTicket[]> {
    const tickets = this.safeGetItem<SupportTicket[]>(
      SUPPORT_TICKETS_STORAGE_KEY,
      this.memoryTickets
    );
    this.memoryTickets = tickets;

    return tickets.filter((ticket) => {
      if (params?.status && params.status !== "all" && ticket.status !== params.status) {
        return false;
      }
      if (params?.category && params.category !== "all" && ticket.category !== params.category) {
        return false;
      }
      if (params?.priority && params.priority !== "all" && ticket.priority !== params.priority) {
        return false;
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        const matches =
          ticket.id.toLowerCase().includes(q) ||
          ticket.subject.toLowerCase().includes(q) ||
          ticket.messages.some((m) => m.message.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }

  public async getSupportTicketById(id: string): Promise<SupportTicket | null> {
    const tickets = await this.getSupportTickets();
    return tickets.find((t) => t.id === id) || null;
  }

  public async createSupportTicket(
    data: CreateTicketFormValues,
    senderName = "Tariqul Islam (Store Owner)"
  ): Promise<SupportTicket> {
    const tickets = await this.getSupportTickets();
    const now = new Date().toISOString();

    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const firstMessage: TicketMessage = {
      id: `msg_${Date.now()}_1`,
      ticketId,
      sender: "merchant",
      senderName,
      message: data.message,
      createdAt: now,
    };

    const newTicket: SupportTicket = {
      id: ticketId,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: "open",
      createdAt: now,
      updatedAt: now,
      lastReplyBy: "merchant",
      messages: [firstMessage],
    };

    const updated = [newTicket, ...tickets];
    this.memoryTickets = updated;
    this.safeSetItem(SUPPORT_TICKETS_STORAGE_KEY, updated);

    return newTicket;
  }

  public async replySupportTicket(
    ticketId: string,
    messageText: string,
    senderName = "Tariqul Islam (Store Owner)"
  ): Promise<SupportTicket> {
    const tickets = await this.getSupportTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      throw new Error(`Support ticket "${ticketId}" was not found.`);
    }

    const current = tickets[index];
    const now = new Date().toISOString();

    const newMsg: TicketMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      sender: "merchant",
      senderName,
      message: messageText,
      createdAt: now,
    };

    const updated: SupportTicket = {
      ...current,
      updatedAt: now,
      lastReplyBy: "merchant",
      // If was resolved/closed, auto-reopen to in_progress
      status: current.status === "resolved" || current.status === "closed" ? "in_progress" : current.status,
      messages: [...current.messages, newMsg],
    };

    tickets[index] = updated;
    this.memoryTickets = tickets;
    this.safeSetItem(SUPPORT_TICKETS_STORAGE_KEY, tickets);

    return updated;
  }

  public async updateTicketStatus(
    ticketId: string,
    newStatus: TicketStatus
  ): Promise<SupportTicket> {
    const tickets = await this.getSupportTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      throw new Error(`Support ticket "${ticketId}" was not found.`);
    }

    const current = tickets[index];
    const updated: SupportTicket = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    tickets[index] = updated;
    this.memoryTickets = tickets;
    this.safeSetItem(SUPPORT_TICKETS_STORAGE_KEY, tickets);

    return updated;
  }

  public resetToDefaults(): void {
    this.memoryTickets = JSON.parse(JSON.stringify(INITIAL_TICKETS));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SUPPORT_TICKETS_STORAGE_KEY);
    }
  }
}

export const mockSupportService = new MockSupportService();
