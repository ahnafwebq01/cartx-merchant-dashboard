"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCheck, ShieldAlert } from "lucide-react";
import {
  updateMemberSchema,
  type UpdateMemberFormValues,
  ALL_ROLES,
} from "../schemas";
import { ROLE_DEFINITIONS, PERMISSION_GROUPS } from "../constants";
import { useUpdateMemberMutation } from "../hooks";
import type { TeamMember, TeamMemberStatus } from "../types";
import type { MerchantRole } from "@/types/auth";

interface EditMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: EditMemberDialogProps) {
  const [userToggledCustom, setUserToggledCustom] = useState<boolean | null>(null);
  const showCustomPermissions =
    userToggledCustom ?? Boolean(member?.customPermissions && member.customPermissions.length > 0);
  const updateMutation = useUpdateMemberMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateMemberFormValues>({
    resolver: zodResolver(updateMemberSchema) as Resolver<UpdateMemberFormValues>,
    defaultValues: {
      name: "",
      phone: "",
      role: "order_manager",
      status: "active",
      customPermissions: [],
    },
  });

  const selectedRole = useWatch({ control, name: "role" });
  const selectedPermissions = useWatch({ control, name: "customPermissions" }) || [];
  const selectedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        phone: member.phone || "",
        role: member.role,
        status: member.status,
        customPermissions: (member.customPermissions as string[]) || [],
      });
    }
  }, [member, reset]);

  if (!member) return null;

  const handleRoleChange = (val: string) => {
    setValue("role", val as MerchantRole, { shouldValidate: true });
  };

  const handleStatusChange = (val: string) => {
    setValue("status", val as TeamMemberStatus, { shouldValidate: true });
  };

  const togglePermission = (permId: string) => {
    const current = selectedPermissions;
    if (current.includes(permId)) {
      setValue(
        "customPermissions",
        current.filter((p) => p !== permId)
      );
    } else {
      setValue("customPermissions", [...current, permId]);
    }
  };

  const onSubmit = async (values: UpdateMemberFormValues) => {
    try {
      await updateMutation.mutateAsync({ id: member.id, data: values });
      onOpenChange(false);
    } catch {
      // Handled by hook toast
    }
  };

  const defaultRolePermissions =
    selectedRole && ROLE_DEFINITIONS[selectedRole]
      ? ROLE_DEFINITIONS[selectedRole].defaultPermissions
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Edit Team Member: {member.name}
          </DialogTitle>
          <DialogDescription>
            Update role, account status, and custom granular permissions for this team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {member.isOwner && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>System Protected Role:</strong> This account is the primary Store Owner.
                Owner role and account status cannot be altered or suspended.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+880 1..." {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={handleRoleChange}
                disabled={member.isOwner}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r} value={r} disabled={r === "owner" && !member.isOwner}>
                      {ROLE_DEFINITIONS[r].label} {r === "owner" && "(Primary)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Account Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={member.isOwner}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Granular Permissions Section */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">
                  Granular Permissions Override
                </span>
                <p className="text-xs text-muted-foreground">
                  Default role grants {defaultRolePermissions.length} permissions.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUserToggledCustom(!showCustomPermissions)}
              >
                {showCustomPermissions ? "Hide Overrides" : "Customize Overrides"}
              </Button>
            </div>

            {showCustomPermissions && (
              <div className="mt-3 space-y-4 max-h-60 overflow-y-auto p-3 rounded-lg border border-border bg-muted/30">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {group.name}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.permissions.map((perm) => {
                        const isGrantedByDefault = defaultRolePermissions.includes(perm.id);
                        const isCustomSelected = selectedPermissions.includes(perm.id);
                        const isChecked = isGrantedByDefault || isCustomSelected;

                        return (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                              isGrantedByDefault
                                ? "border-primary/30 bg-primary/5 text-foreground"
                                : isChecked
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border hover:bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              disabled={isGrantedByDefault}
                              onCheckedChange={() => togglePermission(perm.id)}
                              className="mt-0.5"
                            />
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {perm.label}
                                {isGrantedByDefault && (
                                  <span className="text-[10px] text-primary">(Role default)</span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
