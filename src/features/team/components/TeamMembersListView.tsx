"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROLE_DEFINITIONS } from "../constants";
import { ALL_ROLES } from "../schemas";
import {
  useTeamMembersQuery,
  useTeamInvitationsQuery,
  useTeamStatsQuery,
  useRemoveMemberMutation,
  useCancelInvitationMutation,
  useResendInvitationMutation,
  useAcceptInvitationMutation,
} from "../hooks";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import type { TeamMember, TeamInvitation } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function TeamMembersListView() {
  const [activeTab, setActiveTab] = useState<"members" | "invitations">("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [inviteToCancel, setInviteToCancel] = useState<TeamInvitation | null>(null);

  // Queries
  const { data: members = [], isLoading: isLoadingMembers } = useTeamMembersQuery({
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
  });

  const { data: invitations = [], isLoading: isLoadingInvites } = useTeamInvitationsQuery();
  const { data: stats } = useTeamStatsQuery();

  // Mutations
  const removeMutation = useRemoveMemberMutation();
  const cancelInviteMutation = useCancelInvitationMutation();
  const resendInviteMutation = useResendInvitationMutation();
  const acceptInviteMutation = useAcceptInvitationMutation();

  const handleConfirmDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await removeMutation.mutateAsync(memberToDelete.id);
      setMemberToDelete(null);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleConfirmCancelInvite = async () => {
    if (!inviteToCancel) return;
    try {
      await cancelInviteMutation.mutateAsync(inviteToCancel.id);
      setInviteToCancel(null);
    } catch {
      // Error handled by mutation hook
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const pendingInvitesCount = invitations.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Staff Members</p>
            <h4 className="text-2xl font-bold mt-1 text-foreground">
              {stats?.totalMembers ?? members.length}
            </h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Staff</p>
            <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
              {stats?.activeMembers ?? members.filter((m) => m.status === "active").length}
            </h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pending Invitations</p>
            <h4 className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
              {pendingInvitesCount}
            </h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">2FA Adoption</p>
            <h4 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
              {stats?.twoFactorAdoptionRate ?? 0}%
            </h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team & Access Management
              </CardTitle>
              <CardDescription className="mt-1">
                Manage merchant staff members, assign built-in roles, and configure granular permissions.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/team/roles">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Roles & Permissions Matrix
                </Button>
              </Link>
              <InviteMemberDialog />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "members" | "invitations")}
            className="w-full space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-3">
              <TabsList>
                <TabsTrigger value="members" className="gap-2">
                  <Users className="h-4 w-4" />
                  Team Members ({members.length})
                </TabsTrigger>
                <TabsTrigger value="invitations" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Invitations ({invitations.length})
                  {pendingInvitesCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                      {pendingInvitesCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {activeTab === "members" && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search member by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9 text-xs"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {ALL_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_DEFINITIONS[r].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px] h-9 text-xs">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* TAB: TEAM MEMBERS */}
            <TabsContent value="members" className="m-0">
              {isLoadingMembers ? (
                <LoadingSkeleton rows={4} />
              ) : members.length === 0 ? (
                <div className="p-8 text-center rounded-lg border border-dashed border-border">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-medium text-foreground">No team members found</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    No members match your current filter criteria. Try clearing search or invite a new member.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-border overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Staff Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Account Status</TableHead>
                          <TableHead>Security (2FA)</TableHead>
                          <TableHead>Joined Date</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => {
                          const roleDef = ROLE_DEFINITIONS[member.role];

                          return (
                            <TableRow key={member.id} className="hover:bg-muted/20">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 bg-primary/10 text-primary font-semibold text-xs">
                                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm text-foreground flex items-center gap-1.5">
                                      {member.name}
                                      {member.isOwner && (
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/40 text-primary">
                                          Owner
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                      <span>{member.email}</span>
                                      {member.phone && <span>• {member.phone}</span>}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div>
                                  <Badge variant="secondary" className="font-normal text-xs">
                                    {roleDef?.label || member.role}
                                  </Badge>
                                  {member.customPermissions && member.customPermissions.length > 0 && (
                                    <div className="text-[10px] text-muted-foreground mt-0.5">
                                      +{member.customPermissions.length} custom permissions
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell>
                                {member.status === "active" && (
                                  <Badge variant="success" className="text-[11px]">
                                    Active
                                  </Badge>
                                )}
                                {member.status === "suspended" && (
                                  <Badge variant="destructive" className="text-[11px]">
                                    Suspended
                                  </Badge>
                                )}
                                {member.status === "inactive" && (
                                  <Badge variant="outline" className="text-[11px]">
                                    Inactive
                                  </Badge>
                                )}
                              </TableCell>

                              <TableCell>
                                {member.twoFactorEnabled ? (
                                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Enabled</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                                    <span>Not setup</span>
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(member.joinedAt)}
                              </TableCell>

                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(member.lastActiveAt)}
                              </TableCell>

                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingMember(member)}>
                                      Edit Role & Permissions
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      disabled={member.isOwner}
                                      onClick={() => setMemberToDelete(member)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      Remove from Team
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="block lg:hidden divide-y divide-border/60">
                    {members.map((member) => {
                      const roleDef = ROLE_DEFINITIONS[member.role];
                      return (
                        <div key={member.id} className="p-4 space-y-3 hover:bg-muted/10 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-10 w-10 bg-primary/10 text-primary font-semibold text-xs shrink-0">
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-foreground flex items-center gap-1.5 flex-wrap">
                                  <span className="truncate">{member.name}</span>
                                  {member.isOwner && (
                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/40 text-primary">
                                      Owner
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                {member.phone && <p className="text-[11px] text-muted-foreground">{member.phone}</p>}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingMember(member)}>
                                  Edit Role & Permissions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={member.isOwner}
                                  onClick={() => setMemberToDelete(member)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  Remove from Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Role</span>
                              <Badge variant="secondary" className="font-normal text-xs mt-0.5">
                                {roleDef?.label || member.role}
                              </Badge>
                              {member.customPermissions && member.customPermissions.length > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  +{member.customPermissions.length} custom
                                </p>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Status</span>
                              <div className="mt-0.5">
                                {member.status === "active" && (
                                  <Badge variant="success" className="text-[11px]">
                                    Active
                                  </Badge>
                                )}
                                {member.status === "suspended" && (
                                  <Badge variant="destructive" className="text-[11px]">
                                    Suspended
                                  </Badge>
                                )}
                                {member.status === "inactive" && (
                                  <Badge variant="outline" className="text-[11px]">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">2FA Security</span>
                              {member.twoFactorEnabled ? (
                                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  <span>Enabled</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Not setup</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Last Active</span>
                              <span className="text-muted-foreground">{formatDate(member.lastActiveAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB: INVITATIONS */}
            <TabsContent value="invitations" className="m-0">
              {isLoadingInvites ? (
                <LoadingSkeleton rows={3} />
              ) : invitations.length === 0 ? (
                <div className="p-8 text-center rounded-lg border border-dashed border-border">
                  <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-medium text-foreground">No invitations</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    You have not sent any pending invitations yet.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-border overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Invitee</TableHead>
                          <TableHead>Invited Role</TableHead>
                          <TableHead>Invited By</TableHead>
                          <TableHead>Sent Date</TableHead>
                          <TableHead>Expires On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invitations.map((inv) => {
                          const roleDef = ROLE_DEFINITIONS[inv.role];

                          return (
                            <TableRow key={inv.id} className="hover:bg-muted/20">
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm text-foreground">{inv.name}</div>
                                  <div className="text-xs text-muted-foreground">{inv.email}</div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <Badge variant="outline" className="font-normal text-xs">
                                  {roleDef?.label || inv.role}
                                </Badge>
                              </TableCell>

                              <TableCell className="text-xs text-muted-foreground">
                                {inv.invitedBy}
                              </TableCell>

                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(inv.invitedAt)}
                              </TableCell>

                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(inv.expiresAt)}
                              </TableCell>

                              <TableCell>
                                {inv.status === "pending" && (
                                  <Badge variant="warning" className="text-[11px]">
                                    Pending
                                  </Badge>
                                )}
                                {inv.status === "accepted" && (
                                  <Badge variant="success" className="text-[11px]">
                                    Accepted
                                  </Badge>
                                )}
                                {inv.status === "expired" && (
                                  <Badge variant="destructive" className="text-[11px]">
                                    Expired
                                  </Badge>
                                )}
                                {inv.status === "cancelled" && (
                                  <Badge variant="outline" className="text-[11px]">
                                    Cancelled
                                  </Badge>
                                )}
                              </TableCell>

                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {inv.status === "pending" && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => resendInviteMutation.mutate(inv.id)}
                                        disabled={resendInviteMutation.isPending}
                                        className="h-8 px-2 text-xs gap-1"
                                      >
                                        <RotateCw className="h-3.5 w-3.5" />
                                        Resend
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => acceptInviteMutation.mutate(inv.id)}
                                        disabled={acceptInviteMutation.isPending}
                                        className="h-8 px-2 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                                      >
                                        Simulate Accept
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setInviteToCancel(inv)}
                                        className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  )}

                                  {inv.status === "expired" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => resendInviteMutation.mutate(inv.id)}
                                      disabled={resendInviteMutation.isPending}
                                      className="h-8 px-2 text-xs gap-1"
                                    >
                                      <RotateCw className="h-3.5 w-3.5" />
                                      Re-invite
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="block lg:hidden divide-y divide-border/60">
                    {invitations.map((inv) => {
                      const roleDef = ROLE_DEFINITIONS[inv.role];
                      return (
                        <div key={inv.id} className="p-4 space-y-3 hover:bg-muted/10 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-foreground">{inv.name}</p>
                              <p className="text-xs text-muted-foreground">{inv.email}</p>
                            </div>
                            <div>
                              {inv.status === "pending" && (
                                <Badge variant="warning" className="text-[11px]">
                                  Pending
                                </Badge>
                              )}
                              {inv.status === "accepted" && (
                                <Badge variant="success" className="text-[11px]">
                                  Accepted
                                </Badge>
                              )}
                              {inv.status === "expired" && (
                                <Badge variant="destructive" className="text-[11px]">
                                  Expired
                                </Badge>
                              )}
                              {inv.status === "cancelled" && (
                                <Badge variant="outline" className="text-[11px]">
                                  Cancelled
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Invited Role</span>
                              <Badge variant="outline" className="font-normal text-xs mt-0.5">
                                {roleDef?.label || inv.role}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Invited By</span>
                              <span className="text-muted-foreground">{inv.invitedBy}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Sent Date</span>
                              <span className="text-muted-foreground">{formatDate(inv.invitedAt)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Expires On</span>
                              <span className="text-muted-foreground">{formatDate(inv.expiresAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/40">
                            {inv.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resendInviteMutation.mutate(inv.id)}
                                  disabled={resendInviteMutation.isPending}
                                  className="h-8 px-2.5 text-xs gap-1 flex-1"
                                >
                                  <RotateCw className="h-3.5 w-3.5" />
                                  Resend
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => acceptInviteMutation.mutate(inv.id)}
                                  disabled={acceptInviteMutation.isPending}
                                  className="h-8 px-2.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex-1"
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setInviteToCancel(inv)}
                                  className="h-8 px-2.5 text-xs text-destructive hover:text-destructive"
                                >
                                  Cancel
                                </Button>
                              </>
                            )}

                            {inv.status === "expired" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resendInviteMutation.mutate(inv.id)}
                                disabled={resendInviteMutation.isPending}
                                className="h-8 px-3 text-xs gap-1.5 flex-1"
                              >
                                <RotateCw className="h-3.5 w-3.5" />
                                Re-invite Member
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <EditMemberDialog
        member={editingMember}
        open={Boolean(editingMember)}
        onOpenChange={(open) => !open && setEditingMember(null)}
      />

      {/* Delete Member Confirmation Dialog */}
      <AlertDialog
        open={Boolean(memberToDelete)}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Remove Team Member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToDelete?.name}</strong> (
              {memberToDelete?.email}) from the store team? Their dashboard access credentials
              will be immediately revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Member</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invitation Confirmation Dialog */}
      <AlertDialog
        open={Boolean(inviteToCancel)}
        onOpenChange={(open) => !open && setInviteToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Team Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the pending invitation for{" "}
              <strong>{inviteToCancel?.email}</strong>? The invitation link will be invalidated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Active</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancelInvite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
