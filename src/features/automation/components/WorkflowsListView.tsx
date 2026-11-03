"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Play,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useWorkflowsQuery,
  useDuplicateWorkflowMutation,
  useDeleteWorkflowMutation,
  useToggleWorkflowMutation,
  useSimulateExecutionMutation,
} from "../hooks";
import type { Workflow } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";

export function WorkflowsListView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);

  const { data: workflows, isLoading } = useWorkflowsQuery({
    search,
    status: statusFilter,
  });

  const duplicateMutation = useDuplicateWorkflowMutation();
  const deleteMutation = useDeleteWorkflowMutation();
  const toggleMutation = useToggleWorkflowMutation();
  const simulateMutation = useSimulateExecutionMutation();

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Recipes"
        description="Configure event triggers, conditional logic filters, and automated execution actions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Automation", href: "/dashboard/automation" },
          { label: "Workflows" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/automation">
                <ArrowLeft className="h-4 w-4" />
                Back to Automation
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/automation/workflows/new">
                <Plus className="h-4 w-4" />
                Create Workflow
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows by title or trigger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "active", "inactive", "draft"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="text-xs capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Workflows Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        {(!workflows || workflows.length === 0) ? (
          <EmptyState
            title="No Workflows Found"
            description="Create your first automated recipe to trigger notifications, assign customer tags, or log tasks."
            actionLabel="Create Workflow"
            onAction={() => {
              router.push("/dashboard/automation/workflows/new");
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Workflow</TableHead>
                <TableHead className="text-xs font-semibold">Event Trigger</TableHead>
                <TableHead className="text-xs font-semibold">Rules</TableHead>
                <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                <TableHead className="text-xs font-semibold text-center">Runs</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((wf) => (
                <TableRow key={wf.id} className="hover:bg-muted/30">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-foreground">{wf.name}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                      {wf.description || "No description provided"}
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {wf.trigger.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{wf.conditions.length} condition{wf.conditions.length === 1 ? "" : "s"}</span>
                      <span>•</span>
                      <span>{wf.actions.length} action{wf.actions.length === 1 ? "" : "s"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium capitalize ${
                        wf.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                          : wf.status === "draft"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200"
                      }`}
                    >
                      {wf.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 text-center font-mono text-xs">
                    {wf.executionCount}
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => simulateMutation.mutate(wf.id)}
                        disabled={simulateMutation.isPending}
                        className="h-7 text-xs gap-1 text-primary hover:text-primary"
                        title="Simulate executing this workflow"
                      >
                        <Play className="h-3 w-3" />
                        Test Run
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/automation/workflows/${wf.id}/edit`} className="text-xs cursor-pointer flex items-center">
                              <Edit className="h-3.5 w-3.5 mr-2" />
                              Edit Recipe
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => duplicateMutation.mutate(wf.id)}
                            className="text-xs cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleMutation.mutate(wf.id)}
                            className="text-xs cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                            {wf.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(wf)}
                            className="text-xs text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Recipe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow recipe and all associated simulation execution history records?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Workflow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
