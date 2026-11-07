"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Check, X, Search, Lock, Info } from "lucide-react";
import { ROLE_DEFINITIONS, PERMISSION_GROUPS } from "../constants";
import { ALL_ROLES } from "../schemas";

export function RolesPermissionsMatrixView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = PERMISSION_GROUPS.map((group) => {
    const matchingPerms = group.permissions.filter(
      (p) =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...group,
      permissions: matchingPerms,
    };
  }).filter((group) => group.permissions.length > 0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                CartX Merchant Roles & Permissions Matrix
              </CardTitle>
              <CardDescription className="mt-1">
                Authoritative mapping of built-in roles and 26 granular permissions (CARTX_MERCHANT_DASHBOARD.md Section 3).
              </CardDescription>
            </div>
            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 mb-4 rounded-lg border border-border bg-muted/40 text-xs text-muted-foreground flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong>Role Security Model:</strong> The <strong>Store Owner</strong> holds permanent, unrestricted control over the store, including billing and ownership. <strong>Store Administrator</strong> has broad operational access excluding billing ownership. Custom granular permissions can also be granted to individual members.
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[220px]">Permission Scope</TableHead>
                    {ALL_ROLES.map((roleKey) => (
                      <TableHead key={roleKey} className="text-center min-w-[110px] px-2">
                        <div className="font-semibold text-xs text-foreground">
                          {ROLE_DEFINITIONS[roleKey].label}
                        </div>
                        {ROLE_DEFINITIONS[roleKey].isSystemProtected && (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-normal flex items-center justify-center gap-0.5 mt-0.5">
                            <Lock className="h-3 w-3" /> Protected
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <React.Fragment key={group.name}>
                      <TableRow className="bg-muted/30 font-medium hover:bg-muted/40">
                        <TableCell
                          colSpan={ALL_ROLES.length + 1}
                          className="py-2 text-xs font-semibold uppercase tracking-wider text-primary"
                        >
                          {group.name} ({group.permissions.length})
                        </TableCell>
                      </TableRow>
                      {group.permissions.map((perm) => (
                        <TableRow key={perm.id} className="hover:bg-muted/20">
                          <TableCell className="py-2.5">
                            <div className="font-medium text-sm text-foreground">
                              {perm.label}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {perm.id}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              {perm.description}
                            </div>
                          </TableCell>
                          {ALL_ROLES.map((roleKey) => {
                            const hasPerm =
                              ROLE_DEFINITIONS[roleKey].defaultPermissions.includes(perm.id);

                            return (
                              <TableCell key={roleKey} className="text-center py-2.5">
                                {hasPerm ? (
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <Check className="h-4 w-4" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground/40">
                                    <X className="h-3.5 w-3.5" />
                                  </span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}

                  {filteredGroups.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={ALL_ROLES.length + 1}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No permissions match your search query &ldquo;{searchTerm}&rdquo;.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden divide-y divide-border/60">
              {filteredGroups.map((group) => (
                <div key={group.name} className="space-y-3 p-4">
                  <div className="py-1 px-2.5 rounded bg-muted/60 text-xs font-semibold uppercase tracking-wider text-primary inline-block">
                    {group.name} ({group.permissions.length})
                  </div>

                  <div className="space-y-3">
                    {group.permissions.map((perm) => (
                      <div key={perm.id} className="p-3.5 rounded-lg border border-border/70 bg-card space-y-2.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-xs text-foreground">{perm.label}</h4>
                            <span className="font-mono text-[10px] text-muted-foreground shrink-0">{perm.id}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{perm.description}</p>
                        </div>

                        <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-1.5">
                          {ALL_ROLES.map((roleKey) => {
                            const hasPerm = ROLE_DEFINITIONS[roleKey].defaultPermissions.includes(perm.id);
                            return (
                              <div
                                key={roleKey}
                                className={`flex items-center justify-between p-1.5 rounded text-[11px] ${
                                  hasPerm
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
                                    : "bg-muted/40 text-muted-foreground"
                                }`}
                              >
                                <span className="truncate">{ROLE_DEFINITIONS[roleKey].label}</span>
                                {hasPerm ? (
                                  <Check className="h-3 w-3 text-emerald-600 shrink-0 ml-1" />
                                ) : (
                                  <X className="h-3 w-3 text-muted-foreground/40 shrink-0 ml-1" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredGroups.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No permissions match your search query &ldquo;{searchTerm}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
