import type { TeamMember, TeamInvitation, TeamStats } from "../types";
import type { InviteMemberFormValues, UpdateMemberFormValues } from "../schemas";
import type { Permission } from "@/types/auth";
import { INITIAL_TEAM_MEMBERS, INITIAL_INVITATIONS } from "../constants";

export const TEAM_MEMBERS_STORAGE_KEY = "cartx_demo_team_members_v1";
export const TEAM_INVITATIONS_STORAGE_KEY = "cartx_demo_team_invitations_v1";

export class MockTeamService {
  private memoryMembers: TeamMember[] = JSON.parse(JSON.stringify(INITIAL_TEAM_MEMBERS));
  private memoryInvitations: TeamInvitation[] = JSON.parse(JSON.stringify(INITIAL_INVITATIONS));

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
      console.warn(`[MockTeamService] Failed to set localStorage key "${key}":`, e);
    }
  }

  public async getTeamMembers(params?: {
    search?: string;
    role?: string;
    status?: string;
  }): Promise<TeamMember[]> {
    const members = this.safeGetItem<TeamMember[]>(TEAM_MEMBERS_STORAGE_KEY, this.memoryMembers);
    this.memoryMembers = members;

    return members.filter((member) => {
      if (params?.search) {
        const q = params.search.toLowerCase();
        const matches =
          member.name.toLowerCase().includes(q) ||
          member.email.toLowerCase().includes(q) ||
          (member.phone && member.phone.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (params?.role && params.role !== "all" && member.role !== params.role) {
        return false;
      }
      if (params?.status && params.status !== "all" && member.status !== params.status) {
        return false;
      }
      return true;
    });
  }

  public async getTeamMemberById(id: string): Promise<TeamMember | null> {
    const members = await this.getTeamMembers();
    return members.find((m) => m.id === id) || null;
  }

  public async inviteMember(
    data: InviteMemberFormValues,
    invitedByName = "Tariqul Islam"
  ): Promise<TeamInvitation> {
    const members = await this.getTeamMembers();
    const existingMember = members.find(
      (m) => m.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existingMember) {
      throw new Error(`A team member with email "${data.email}" already exists.`);
    }

    const invitations = await this.getTeamInvitations();
    const existingInvite = invitations.find(
      (inv) =>
        inv.email.toLowerCase() === data.email.toLowerCase() &&
        inv.status === "pending"
    );
    if (existingInvite) {
      throw new Error(`An active pending invitation for "${data.email}" already exists.`);
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newInvite: TeamInvitation = {
      id: `inv_${Date.now()}`,
      email: data.email.toLowerCase(),
      name: data.name,
      role: data.role,
      customPermissions: (data.customPermissions as Permission[]) || [],
      invitedBy: invitedByName,
      invitedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      status: "pending",
    };

    const updated = [newInvite, ...invitations];
    this.memoryInvitations = updated;
    this.safeSetItem(TEAM_INVITATIONS_STORAGE_KEY, updated);

    return newInvite;
  }

  public async updateTeamMember(
    id: string,
    data: UpdateMemberFormValues
  ): Promise<TeamMember> {
    const members = await this.getTeamMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Team member with ID "${id}" was not found.`);
    }

    const current = members[index];

    // Protect Store Owner
    if (current.isOwner) {
      if (data.role !== "owner") {
        throw new Error("The Store Owner role cannot be changed or demoted.");
      }
      if (data.status !== "active") {
        throw new Error("The Store Owner account cannot be suspended or deactivated.");
      }
    }

    const updated: TeamMember = {
      ...current,
      name: data.name,
      phone: data.phone || current.phone,
      role: data.role,
      status: data.status,
      customPermissions: (data.customPermissions as Permission[]) || current.customPermissions,
      lastActiveAt: new Date().toISOString(),
    };

    members[index] = updated;
    this.memoryMembers = members;
    this.safeSetItem(TEAM_MEMBERS_STORAGE_KEY, members);

    return updated;
  }

  public async removeTeamMember(id: string): Promise<void> {
    const members = await this.getTeamMembers();
    const target = members.find((m) => m.id === id);
    if (!target) {
      throw new Error(`Team member with ID "${id}" was not found.`);
    }

    if (target.isOwner) {
      throw new Error("The Store Owner cannot be removed from the store team.");
    }

    const filtered = members.filter((m) => m.id !== id);
    this.memoryMembers = filtered;
    this.safeSetItem(TEAM_MEMBERS_STORAGE_KEY, filtered);
  }

  public async getTeamInvitations(status?: string): Promise<TeamInvitation[]> {
    const invitations = this.safeGetItem<TeamInvitation[]>(
      TEAM_INVITATIONS_STORAGE_KEY,
      this.memoryInvitations
    );
    this.memoryInvitations = invitations;

    if (!status || status === "all") {
      return invitations;
    }
    return invitations.filter((inv) => inv.status === status);
  }

  public async cancelInvitation(id: string): Promise<void> {
    const invitations = await this.getTeamInvitations();
    const index = invitations.findIndex((inv) => inv.id === id);
    if (index === -1) {
      throw new Error(`Invitation with ID "${id}" was not found.`);
    }

    invitations[index].status = "cancelled";
    this.memoryInvitations = invitations;
    this.safeSetItem(TEAM_INVITATIONS_STORAGE_KEY, invitations);
  }

  public async resendInvitation(id: string): Promise<TeamInvitation> {
    const invitations = await this.getTeamInvitations();
    const index = invitations.findIndex((inv) => inv.id === id);
    if (index === -1) {
      throw new Error(`Invitation with ID "${id}" was not found.`);
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const updated: TeamInvitation = {
      ...invitations[index],
      invitedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      status: "pending",
    };

    invitations[index] = updated;
    this.memoryInvitations = invitations;
    this.safeSetItem(TEAM_INVITATIONS_STORAGE_KEY, invitations);

    return updated;
  }

  public async acceptInvitation(id: string): Promise<TeamMember> {
    const invitations = await this.getTeamInvitations();
    const invite = invitations.find((inv) => inv.id === id);
    if (!invite) {
      throw new Error(`Invitation with ID "${id}" was not found.`);
    }

    // Mark invitation accepted
    invite.status = "accepted";
    this.safeSetItem(TEAM_INVITATIONS_STORAGE_KEY, invitations);

    // Convert into new team member
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: invite.name,
      email: invite.email,
      role: invite.role,
      status: "active",
      twoFactorEnabled: false,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      customPermissions: invite.customPermissions,
    };

    const members = await this.getTeamMembers();
    const updatedMembers = [...members, newMember];
    this.memoryMembers = updatedMembers;
    this.safeSetItem(TEAM_MEMBERS_STORAGE_KEY, updatedMembers);

    return newMember;
  }

  public async getTeamStats(): Promise<TeamStats> {
    const members = await this.getTeamMembers();
    const invitations = await this.getTeamInvitations();

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === "active").length;
    const pendingInvites = invitations.filter((inv) => inv.status === "pending").length;
    const withTwoFactor = members.filter((m) => m.twoFactorEnabled).length;
    const twoFactorAdoptionRate = totalMembers > 0 ? Math.round((withTwoFactor / totalMembers) * 100) : 0;

    return {
      totalMembers,
      activeMembers,
      pendingInvites,
      twoFactorAdoptionRate,
    };
  }

  public resetToDefaults(): void {
    this.memoryMembers = JSON.parse(JSON.stringify(INITIAL_TEAM_MEMBERS));
    this.memoryInvitations = JSON.parse(JSON.stringify(INITIAL_INVITATIONS));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TEAM_MEMBERS_STORAGE_KEY);
      window.localStorage.removeItem(TEAM_INVITATIONS_STORAGE_KEY);
    }
  }
}

export const mockTeamService = new MockTeamService();
