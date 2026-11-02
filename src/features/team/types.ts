import type { MerchantRole, Permission } from "@/types/auth";

export type TeamMemberStatus = "active" | "suspended" | "inactive";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: MerchantRole;
  status: TeamMemberStatus;
  customPermissions?: Permission[];
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  joinedAt: string;
  lastActiveAt: string;
  isOwner?: boolean;
}

export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface TeamInvitation {
  id: string;
  email: string;
  name: string;
  role: MerchantRole;
  customPermissions?: Permission[];
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: InvitationStatus;
}

export interface RoleDefinition {
  role: MerchantRole;
  label: string;
  description: string;
  defaultPermissions: Permission[];
  isSystemProtected?: boolean;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  twoFactorAdoptionRate: number;
}

