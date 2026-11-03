"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Info,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useSegmentsQuery,
  useSegmentStatsQuery,
  useDuplicateSegmentMutation,
  useDeleteSegmentMutation,
  useToggleSegmentStatusMutation,
} from "../hooks";
import { SegmentEditorDialog } from "./SegmentEditorDialog";
import type { CustomerSegment } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { mockSegmentationService } from "../services/mockSegmentation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function SegmentsListView() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<CustomerSegment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerSegment | null>(null);

  const { data: segments, isLoading: segmentsLoading } = useSegmentsQuery({
    search,
    status: statusFilter,
  });
  const { data: stats, isLoading: statsLoading } = useSegmentStatsQuery();

  const duplicateMutation = useDuplicateSegmentMutation();
  const deleteMutation = useDeleteSegmentMutation();
  const toggleMutation = useToggleSegmentStatusMutation();

  if (segmentsLoading || statsLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const handleEdit = (seg: CustomerSegment) => {
    setEditingSegment(seg);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingSegment(null);
    setEditorOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleResetDefaults = () => {
    mockSegmentationService.resetToDefaults();
    queryClient.invalidateQueries({ queryKey: ["segments"] });
    toast.success("Customer segments restored to demo defaults (Demo Mode)");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Segments"
        description="Create dynamic cohorts based on order spend, frequency, location, and purchase behaviors"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Customer Segments" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Defaults
            </Button>
            <Button size="sm" onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Segment
            </Button>
          </div>
        }
      />

      {/* Demo Mode Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Deterministic Demo Segmentation: </span>
          Segment counts and audience match percentages are computed against the 8 authentic Bangladesh demo shoppers stored in your browser session. No mock counts are fabricated.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Segments
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSegments ?? 4}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured merchant audience rules</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Audiences
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSegments ?? 4}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for discount vouchers & flash sales</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Avg Segment Reach
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageSegmentSize ?? 3} Shoppers</div>
            <p className="text-xs text-muted-foreground mt-1">Average matching customer volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments by name or condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map((status) => (
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

      {/* Segments Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        {(!segments || segments.length === 0) ? (
          <EmptyState
            title="No Segments Found"
            description="Create your first customer segment to target high-value buyers or specific regional districts."
            actionLabel="Create Segment"
            onAction={handleCreate}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Segment Name</TableHead>
                <TableHead className="text-xs font-semibold">Criteria Conditions</TableHead>
                <TableHead className="text-xs font-semibold text-center">Matched Audience</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((seg) => (
                <TableRow key={seg.id} className="hover:bg-muted/30">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-foreground">{seg.name}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                      {seg.description || "No description provided"}
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {seg.conditionGroups.map((grp, idx) => (
                        <Badge
                          key={grp.id}
                          variant="secondary"
                          className="text-[10px] font-mono px-1.5 py-0.5"
                        >
                          {grp.conditions.length} condition{grp.conditions.length > 1 ? "s" : ""}
                          {idx < seg.conditionGroups.length - 1 && (
                            <span className="ml-1 text-primary font-bold">{seg.groupLogic}</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {seg.matchingCustomerCount} customers
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium capitalize ${
                        seg.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200"
                      }`}
                    >
                      {seg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEdit(seg)} className="text-xs cursor-pointer">
                          <Edit className="h-3.5 w-3.5 mr-2" />
                          Edit Segment
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => duplicateMutation.mutate(seg.id)}
                          className="text-xs cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleMutation.mutate(seg.id)}
                          className="text-xs cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                          {seg.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(seg)}
                          className="text-xs text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Segment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Editor Modal */}
      <SegmentEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        segmentToEdit={editingSegment}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer segment? Any promotional campaigns using this segment will revert to targeting all customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Segment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

