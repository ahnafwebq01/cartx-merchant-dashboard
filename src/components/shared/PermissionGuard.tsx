"use client";

import React from "react";
import { useAuth } from "@/lib/auth/context";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions/rbac";
import type { Permission } from "@/types/auth";
import { ShieldAlert } from "lucide-react";

interface PermissionGuardProps {
  permission?: Permission;
  anyPermission?: Permission[];
  allPermissions?: Permission[];
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
  children: React.ReactNode;
}

/**
 * Conditionally renders UI elements based on the active user's permissions.
 * NOTE: This is client-side UI optimization only. Authoritative access controls
 * must be verified on the backend API.
 */
export function PermissionGuard({
  permission,
  anyPermission,
  allPermissions,
  fallback,
  showAccessDenied = false,
  children,
}: PermissionGuardProps) {
  const { permissions, currentRole } = useAuth();

  // Store owner bypasses UI-level permission checks
  if (currentRole === "owner") {
    return <>{children}</>;
  }

  let isAllowed = true;

  if (permission) {
    isAllowed = hasPermission(permissions, permission);
  } else if (anyPermission && anyPermission.length > 0) {
    isAllowed = hasAnyPermission(permissions, anyPermission);
  } else if (allPermissions && allPermissions.length > 0) {
    isAllowed = hasAllPermissions(permissions, allPermissions);
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-border bg-card">
        <ShieldAlert className="h-12 w-12 text-destructive mb-3" />
        <h4 className="text-lg font-semibold text-foreground">Access Restricted</h4>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Your current role does not have permission to view or manage this section.
          Contact your store owner for elevated access.
        </p>
      </div>
    );
  }

  return null;
}

