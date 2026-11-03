import { describe, it, expect, beforeEach } from "vitest";
import { MockTeamService } from "@/features/team/services/mockTeam";
import {
  MockBillingService,
  calculatePlanPricing,
  calculateUsageMetric,
} from "@/features/billing/services/mockBilling";
import { MockSupportService } from "@/features/support/services/mockSupport";
import { ROLE_DEFINITIONS } from "@/features/team/constants";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/rbac";
import type { MerchantRole } from "@/types/auth";

describe("Phase 8 — Team, Billing & Operations Architecture", () => {
  let teamService: MockTeamService;
  let billingService: MockBillingService;
  let supportService: MockSupportService;

  beforeEach(() => {
    teamService = new MockTeamService();
    billingService = new MockBillingService();
    supportService = new MockSupportService();

    // Reset services
    teamService.resetToDefaults();
    billingService.resetToDefaults();
    supportService.resetToDefaults();
  });

  // ==========================================
  // MODULE A: TEAM MANAGEMENT
  // ==========================================
  describe("Module A: Team Management & Granular Permissions", () => {
    it("should return the default 5 Bangladesh merchant team members", async () => {
      const members = await teamService.getTeamMembers();
      expect(members.length).toBe(5);

      const owner = members.find((m) => m.role === "owner");
      expect(owner).toBeDefined();
      expect(owner?.name).toBe("Tariqul Islam");
      expect(owner?.isOwner).toBe(true);
      expect(owner?.status).toBe("active");
    });

    it("should filter team members by search query", async () => {
      const byName = await teamService.getTeamMembers({ search: "Shamima" });
      expect(byName.length).toBe(1);
      expect(byName[0].email).toBe("shamima@greenharvest.com.bd");

      const byPhone = await teamService.getTeamMembers({ search: "1912" });
      expect(byPhone.length).toBe(1);
      expect(byPhone[0].name).toBe("Kamrul Hasan");

      const noMatch = await teamService.getTeamMembers({ search: "NonExistentUser" });
      expect(noMatch.length).toBe(0);
    });

    it("should filter team members by role and status", async () => {
      const admins = await teamService.getTeamMembers({ role: "admin" });
      expect(admins.length).toBe(1);
      expect(admins[0].name).toBe("Shamima Akhter");

      const activeMembers = await teamService.getTeamMembers({ status: "active" });
      expect(activeMembers.length).toBe(5);

      const suspended = await teamService.getTeamMembers({ status: "suspended" });
      expect(suspended.length).toBe(0);
    });

    it("should update team member details and save changes", async () => {
      const updated = await teamService.updateTeamMember("tm_03", {
        name: "Kamrul Hasan (Senior)",
        phone: "+880 1912-999999",
        role: "order_manager",
        status: "active",
        customPermissions: ["discounts.manage"],
      });

      expect(updated.name).toBe("Kamrul Hasan (Senior)");
      expect(updated.phone).toBe("+880 1912-999999");
      expect(updated.customPermissions).toContain("discounts.manage");

      const fetched = await teamService.getTeamMemberById("tm_03");
      expect(fetched?.name).toBe("Kamrul Hasan (Senior)");
    });

    it("should strictly protect the Store Owner from demotion or suspension", async () => {
      const owner = (await teamService.getTeamMembers()).find((m) => m.isOwner);
      expect(owner).toBeDefined();

      // Attempting to demote owner role must throw
      await expect(
        teamService.updateTeamMember(owner!.id, {
          name: owner!.name,
          role: "admin",
          status: "active",
          customPermissions: [],
        })
      ).rejects.toThrow("The Store Owner role cannot be changed or demoted.");

      // Attempting to suspend owner account must throw
      await expect(
        teamService.updateTeamMember(owner!.id, {
          name: owner!.name,
          role: "owner",
          status: "suspended",
          customPermissions: [],
        })
      ).rejects.toThrow("The Store Owner account cannot be suspended or deactivated.");
    });

    it("should strictly protect the Store Owner from being deleted", async () => {
      const owner = (await teamService.getTeamMembers()).find((m) => m.isOwner);
      expect(owner).toBeDefined();

      await expect(teamService.removeTeamMember(owner!.id)).rejects.toThrow(
        "The Store Owner cannot be removed from the store team."
      );

      // Verify owner still exists
      const members = await teamService.getTeamMembers();
      expect(members.some((m) => m.id === owner!.id)).toBe(true);
    });

    it("should remove non-owner team members successfully", async () => {
      await teamService.removeTeamMember("tm_05"); // Rakib Chowdhury (Support)
      const members = await teamService.getTeamMembers();
      expect(members.length).toBe(4);
      expect(members.some((m) => m.id === "tm_05")).toBe(false);
    });

    it("should create team invitation with 7-day expiration and pending status", async () => {
      const newInvite = await teamService.inviteMember({
        name: "Jamil Ahmed",
        email: "jamil.ops@example.com",
        role: "order_manager",
        customPermissions: [],
      });

      expect(newInvite.status).toBe("pending");
      expect(newInvite.email).toBe("jamil.ops@example.com");
      expect(newInvite.role).toBe("order_manager");

      const expiryDate = new Date(newInvite.expiresAt);
      const invitedDate = new Date(newInvite.invitedAt);
      const diffDays = Math.round(
        (expiryDate.getTime() - invitedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(7);
    });

    it("should prevent duplicate invitations for existing members or active invites", async () => {
      // Existing member email
      await expect(
        teamService.inviteMember({
          name: "Duplicate Tariqul",
          email: "tariqul@greenharvest.com.bd",
          role: "admin",
          customPermissions: [],
        })
      ).rejects.toThrow('A team member with email "tariqul@greenharvest.com.bd" already exists.');

      // Existing active pending invite
      await expect(
        teamService.inviteMember({
          name: "Duplicate Nusrat",
          email: "nusrat.mkt@example.com",
          role: "marketing_manager",
          customPermissions: [],
        })
      ).rejects.toThrow('An active pending invitation for "nusrat.mkt@example.com" already exists.');
    });

    it("should handle invitation state transitions: resend, cancel, accept", async () => {
      // 1. Resend
      const resent = await teamService.resendInvitation("inv_01");
      expect(resent.status).toBe("pending");

      // 2. Cancel
      await teamService.cancelInvitation("inv_01");
      const invitesAfterCancel = await teamService.getTeamInvitations();
      const cancelled = invitesAfterCancel.find((i) => i.id === "inv_01");
      expect(cancelled?.status).toBe("cancelled");

      // 3. Simulated Accept on a fresh invite
      const freshInvite = await teamService.inviteMember({
        name: "Sultana Razia",
        email: "sultana@greenharvest.com.bd",
        role: "accountant",
        customPermissions: [],
      });

      const newMember = await teamService.acceptInvitation(freshInvite.id);
      expect(newMember.email).toBe("sultana@greenharvest.com.bd");
      expect(newMember.role).toBe("accountant");
      expect(newMember.status).toBe("active");

      const allMembers = await teamService.getTeamMembers();
      expect(allMembers.some((m) => m.email === "sultana@greenharvest.com.bd")).toBe(true);
    });

    it("should accurately calculate team statistics and 2FA adoption rate", async () => {
      const stats = await teamService.getTeamStats();
      expect(stats.totalMembers).toBe(5);
      expect(stats.activeMembers).toBe(5);
      expect(stats.pendingInvites).toBe(1); // Nusrat is pending
      // 3 of 5 members have 2FA (Tariqul, Shamima, Farhana) -> 60%
      expect(stats.twoFactorAdoptionRate).toBe(60);
    });

    it("should verify default permissions matrix across all 8 roles", () => {
      const roles: MerchantRole[] = [
        "owner",
        "admin",
        "order_manager",
        "product_manager",
        "inventory_manager",
        "marketing_manager",
        "accountant",
        "support",
      ];

      roles.forEach((r) => {
        const def = ROLE_DEFINITIONS[r];
        expect(def).toBeDefined();
        expect(def.defaultPermissions.length).toBeGreaterThan(0);
      });

      // Owner has billing.manage, Admin does not
      expect(DEFAULT_ROLE_PERMISSIONS.owner.includes("billing.manage")).toBe(true);
      expect(DEFAULT_ROLE_PERMISSIONS.admin.includes("billing.manage")).toBe(false);

      // Support has order and customer view, but no product archive
      expect(DEFAULT_ROLE_PERMISSIONS.support.includes("orders.view")).toBe(true);
      expect(DEFAULT_ROLE_PERMISSIONS.support.includes("products.archive")).toBe(false);
    });
  });

  // ==========================================
  // MODULE B: BILLING & SUBSCRIPTIONS
  // ==========================================
  describe("Module B: CartX Subscription Plans, Billing & Invoicing", () => {
    it("should calculate exact pricing and annual savings for all subscription tiers", () => {
      // Starter
      const starterMonthly = calculatePlanPricing("starter", "monthly");
      expect(starterMonthly.billedAmount).toBe(999);
      expect(starterMonthly.annualSavingsAmount).toBe(0);

      const starterAnnual = calculatePlanPricing("starter", "annual");
      expect(starterAnnual.billedAmount).toBe(9990);
      // 999 * 12 = 11,988 -> Savings: 11,988 - 9,990 = 1,998
      expect(starterAnnual.annualSavingsAmount).toBe(1998);
      expect(starterAnnual.monthlyEquivalent).toBe(Math.round(9990 / 12));

      // Growth
      const growthMonthly = calculatePlanPricing("growth", "monthly");
      expect(growthMonthly.billedAmount).toBe(2499);

      const growthAnnual = calculatePlanPricing("growth", "annual");
      expect(growthAnnual.billedAmount).toBe(24990);
      // 2499 * 12 = 29,988 -> Savings: 29,988 - 24,990 = 4,998
      expect(growthAnnual.annualSavingsAmount).toBe(4998);

      // Pro
      const proAnnual = calculatePlanPricing("pro", "annual");
      expect(proAnnual.billedAmount).toBe(59990);
      // 5999 * 12 = 71,988 -> Savings: 71,988 - 59,990 = 11,998
      expect(proAnnual.annualSavingsAmount).toBe(11998);
    });

    it("should accurately calculate usage limits and threshold statuses", () => {
      // Normal (< 70%)
      const normalMetric = calculateUsageMetric("products", "Products", 18, 500, "products");
      expect(normalMetric.percentUsed).toBe(4);
      expect(normalMetric.status).toBe("normal");

      // Warning (70% - 89%)
      const warningMetric = calculateUsageMetric("staff", "Staff", 4, 5, "members");
      expect(warningMetric.percentUsed).toBe(80);
      expect(warningMetric.status).toBe("warning");

      // Critical (>= 90%)
      const criticalMetric = calculateUsageMetric("orders", "Orders", 950, 1000, "orders");
      expect(criticalMetric.percentUsed).toBe(95);
      expect(criticalMetric.status).toBe("critical");

      // Unlimited quota (-1)
      const unlimitedMetric = calculateUsageMetric("products", "Products", 1200, -1, "products");
      expect(unlimitedMetric.percentUsed).toBe(0);
      expect(unlimitedMetric.status).toBe("normal");
      expect(unlimitedMetric.limit).toBe(-1);
    });

    it("should return the store usage metrics reflecting current plan capacity", async () => {
      const metrics = await billingService.getUsageMetrics();
      expect(metrics.length).toBe(5);

      const staffMetric = metrics.find((m) => m.id === "staff");
      expect(staffMetric).toBeDefined();
      expect(staffMetric?.current).toBe(4);
      expect(staffMetric?.limit).toBe(5);
      expect(staffMetric?.status).toBe("warning"); // 80% usage
    });

    it("should handle subscription upgrade/downgrade and automatically generate a simulated paid invoice", async () => {
      const updatedSub = await billingService.upgradeSubscription("pro", "annual");
      expect(updatedSub.planId).toBe("pro");
      expect(updatedSub.billingCycle).toBe("annual");
      expect(updatedSub.currentPriceBDT).toBe(59990);

      // Check that a new invoice was prepended
      const invoices = await billingService.getInvoices();
      expect(invoices[0].planId).toBe("pro");
      expect(invoices[0].billingCycle).toBe("annual");
      expect(invoices[0].totalBDT).toBe(59990);
      expect(invoices[0].status).toBe("paid");
    });

    it("should retrieve and filter invoices by payment status", async () => {
      const allInvoices = await billingService.getInvoices();
      expect(allInvoices.length).toBeGreaterThanOrEqual(5);

      const paidInvoices = await billingService.getInvoices("paid");
      expect(paidInvoices.every((i) => i.status === "paid")).toBe(true);

      const failedInvoices = await billingService.getInvoices("failed");
      expect(failedInvoices.length).toBe(1);
      expect(failedInvoices[0].id).toBe("inv_2026_07_002");
    });

    it("should simulate retry and settlement of failed or pending invoices", async () => {
      const failed = (await billingService.getInvoices("failed"))[0];
      expect(failed).toBeDefined();

      const settled = await billingService.payInvoice(failed.id);
      expect(settled.status).toBe("paid");
      expect(settled.transactionId).toMatch(/^TXN-RETRY-/);

      const remainingFailed = await billingService.getInvoices("failed");
      expect(remainingFailed.length).toBe(0);
    });

    it("should update billing contact settings and legal entity BIN", async () => {
      const updated = await billingService.updateBillingSettings({
        billingEmail: "finance.lead@greenharvest.com.bd",
        companyName: "Green Harvest Organic Bangladesh PLC",
        businessIdentificationNumber: "002819472-0999",
        street: "Gulshan 2, Road 45",
        city: "Dhaka",
        state: "Dhaka",
        postalCode: "1212",
        country: "Bangladesh",
      });

      expect(updated.billingEmail).toBe("finance.lead@greenharvest.com.bd");
      expect(updated.companyName).toBe("Green Harvest Organic Bangladesh PLC");
      expect(updated.businessIdentificationNumber).toBe("002819472-0999");
    });

    it("should add, set default, and remove payment instruments", async () => {
      // Add new Nagad method
      const newPm = await billingService.addPaymentMethod({
        type: "nagad",
        label: "Nagad Business Direct",
        identifier: "01811223344",
        accountHolderName: "Tariqul Islam",
        isDefault: false,
      });

      expect(newPm.type).toBe("nagad");

      // Set as default
      await billingService.setDefaultPaymentMethod(newPm.id);
      const settingsAfterDefault = await billingService.getBillingSettings();
      const updatedPm = settingsAfterDefault.paymentMethods.find((p) => p.id === newPm.id);
      expect(updatedPm?.isDefault).toBe(true);

      // Attempting to remove default payment method must throw
      await expect(billingService.removePaymentMethod(newPm.id)).rejects.toThrow(
        "Default auto-renewal payment method cannot be removed."
      );
    });
  });

  // ==========================================
  // MODULE C: HELP CENTER & SUPPORT
  // ==========================================
  describe("Module C: Help Center, Guides & Support Ticketing", () => {
    it("should return searchable help guides covering Bangladesh e-commerce", async () => {
      const allArticles = await supportService.getHelpArticles();
      expect(allArticles.length).toBe(8);

      const bkashSearch = await supportService.getHelpArticles({ search: "bKash" });
      expect(bkashSearch.length).toBeGreaterThan(0);
      expect(bkashSearch.some((a) => a.title.includes("bKash"))).toBe(true);

      const courierFilter = await supportService.getHelpArticles({ category: "couriers" });
      expect(courierFilter.length).toBe(1);
      expect(courierFilter[0].title).toContain("Steadfast & Pathao");
    });

    it("should retrieve single article by slug with structured content", async () => {
      const article = await supportService.getHelpArticleBySlug("custom-domain-dns-instructions");
      expect(article).toBeDefined();
      expect(article?.title).toContain("Connecting Custom Domains");
      expect(article?.content).toContain("CNAME Record");
    });

    it("should return categorized FAQ items", async () => {
      const faqs = await supportService.getFaqs();
      expect(faqs.length).toBe(8);

      const courierFaqs = await supportService.getFaqs("Couriers & Delivery");
      expect(courierFaqs.length).toBe(2);
      expect(courierFaqs[0].question).toContain("courier");
    });

    it("should list initial support tickets with status and category filtering", async () => {
      const tickets = await supportService.getSupportTickets();
      expect(tickets.length).toBe(4);

      const inProgress = await supportService.getSupportTickets({ status: "in_progress" });
      expect(inProgress.length).toBe(1);
      expect(inProgress[0].id).toBe("TCK-1048");

      const shippingTickets = await supportService.getSupportTickets({ category: "shipping" });
      expect(shippingTickets.length).toBe(1);
    });

    it("should create new support ticket with generated ID, status open, and initial message", async () => {
      const newTicket = await supportService.createSupportTicket({
        subject: "Discrepancy in COD payout ledger for Steadfast",
        category: "shipping",
        priority: "high",
        message: "Our weekly Steadfast COD settlement sheet shows a deduction of ৳180 for order #ORD-2026-042 which was marked delivered.",
      });

      expect(newTicket.id).toMatch(/^TCK-\d{4}$/);
      expect(newTicket.status).toBe("open");
      expect(newTicket.priority).toBe("high");
      expect(newTicket.messages.length).toBe(1);
      expect(newTicket.messages[0].sender).toBe("merchant");

      const fetched = await supportService.getSupportTicketById(newTicket.id);
      expect(fetched?.subject).toBe("Discrepancy in COD payout ledger for Steadfast");
    });

    it("should append merchant reply and automatically reopen resolved/closed tickets", async () => {
      // TCK-1045 is resolved
      const beforeReply = await supportService.getSupportTicketById("TCK-1045");
      expect(beforeReply?.status).toBe("resolved");

      const updated = await supportService.replySupportTicket(
        "TCK-1045",
        "We have a follow-up question regarding subdomain redirects."
      );

      expect(updated.messages.length).toBe(4);
      expect(updated.lastReplyBy).toBe("merchant");
      expect(updated.status).toBe("in_progress"); // Reopened!
    });

    it("should update ticket status explicitly", async () => {
      const updated = await supportService.updateTicketStatus("TCK-1048", "resolved");
      expect(updated.status).toBe("resolved");

      const closed = await supportService.updateTicketStatus("TCK-1048", "closed");
      expect(closed.status).toBe("closed");
    });
  });
});
