"use client";

import React, { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus, Info } from "lucide-react";
import {
  inviteMemberSchema,
  type InviteMemberFormValues,
  INVITABLE_ROLES,
} from "../schemas";
import { ROLE_DEFINITIONS, PERMISSION_GROUPS } from "../constants";
import { useInviteMemberMutation } from "../hooks";

interface InviteMemberDialogProps {
  trigger?: React.ReactNode;
}

export function InviteMemberDialog({ trigger }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [showCustomPermissions, setShowCustomPermissions] = useState(false);
  const inviteMutation = useInviteMemberMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema) as Resolver<InviteMemberFormValues>,
    defaultValues: {
      name: "",
      email: "",
      role: "order_manager",
      customPermissions: [],
    },
  });

  const selectedRole = useWatch({ control, name: "role" });
  const selectedPermissions = useWatch({ control, name: "customPermissions" }) || [];

  const handleRoleChange = (val: string) => {
    setValue("role", val as InviteMemberFormValues["role"], { shouldValidate: true });
    // Reset custom permissions when role changes
    setValue("customPermissions", []);
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

  const onSubmit = async (values: InviteMemberFormValues) => {
    try {
      await inviteMutation.mutateAsync(values);
      setOpen(false);
      reset();
      setShowCustomPermissions(false);
    } catch {
      // Error handled by mutation hook toast
    }
  };

  const defaultRolePermissions =
    selectedRole && ROLE_DEFINITIONS[selectedRole]
      ? ROLE_DEFINITIONS[selectedRole].defaultPermissions
      : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your merchant team. Invitations expire in 7 days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Demo Mode Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Simulated Operation:</strong> In demo mode, no real email will be sent.
              The invitation will be added to your pending ledger with instant simulation capabilities.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Nusrat Jahan"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="nusrat@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="role">Assigned Role *</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {INVITABLE_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_DEFINITIONS[r].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <p className="text-xs text-muted-foreground mt-1">
                {ROLE_DEFINITIONS[selectedRole].description}
              </p>
            )}
          </div>

          {/* Custom Granular Permissions Section */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">
                  Granular Permissions Override
                </span>
                <p className="text-xs text-muted-foreground">
                  Default role grants {defaultRolePermissions.length} permissions.
                  You can grant additional custom permissions below.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCustomPermissions(!showCustomPermissions)}
              >
                {showCustomPermissions ? "Hide Overrides" : "Customize"}
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
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
