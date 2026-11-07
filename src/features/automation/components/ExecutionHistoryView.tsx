"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkflowExecutionsQuery, useWorkflowsQuery } from "../hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";

export function ExecutionHistoryView() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: workflows, isLoading: workflowsLoading } = useWorkflowsQuery();
  const { data: executions, isLoading: executionsLoading } = useWorkflowExecutionsQuery(
    selectedWorkflowId === "all" ? undefined : selectedWorkflowId
  );

  if (workflowsLoading || executionsLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const filteredExecutions = (executions || []).filter((exec) => {
    if (statusFilter !== "all" && exec.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Execution Audit History"
        description="Comprehensive audit trail of manual and simulated workflow triggers, action latencies, and condition outcomes"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Automation", href: "/dashboard/automation" },
          { label: "Execution History" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/automation">
                <ArrowLeft className="h-4 w-4" />
                Back to Automation
              </Link>
            </Button>
          </div>
        }
      />

      {/* Demo Disclosures Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Simulated Execution Telemetry: </span>
          All records presented here reflect manual &quot;Test Run&quot; dispatches performed within this browser session.
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filter by Recipe:</span>
          <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
            <SelectTrigger className="w-56 h-8 text-xs">
              <SelectValue placeholder="All Workflows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              {workflows?.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {["all", "success", "failed", "skipped"].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className="text-xs h-8 capitalize"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        {filteredExecutions.length === 0 ? (
          <EmptyState
            title="No Execution Records Found"
            description="Trigger a &quot;Test Run&quot; on any workflow recipe to generate an audit log entry."
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Workflow</TableHead>
                    <TableHead className="text-xs font-semibold">Trigger Event</TableHead>
                    <TableHead className="text-xs font-semibold">Outcome</TableHead>
                    <TableHead className="text-xs font-semibold">Executed Actions / Details</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Duration</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecutions.map((exec) => (
                    <TableRow key={exec.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-semibold text-foreground">
                        {exec.workflowName}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {exec.triggerEvent}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono capitalize ${
                            exec.status === "success"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                              : exec.status === "skipped"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                          }`}
                        >
                          {exec.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-sm">
                        {exec.executedActions.length > 0 ? (
                          <ul className="list-disc list-inside space-y-0.5">
                            {exec.executedActions.map((act, i) => (
                              <li key={i} className="truncate">
                                {act}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                            {exec.failureReason || "Condition not met"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-center font-mono text-muted-foreground">
                        {exec.duration}ms
                      </TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">
                        {new Date(exec.executedAt).toLocaleString("en-BD", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card-Based Transformation View */}
            <div className="block md:hidden divide-y divide-border/60">
              {filteredExecutions.map((exec) => (
                <div key={exec.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-foreground block truncate">
                        {exec.workflowName}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                        {exec.triggerEvent}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono capitalize ${
                          exec.status === "success"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                            : exec.status === "skipped"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                        }`}
                      >
                        {exec.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs pt-1 border-t border-border/40">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Actions Executed</span>
                    {exec.executedActions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-xs text-foreground">
                        {exec.executedActions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px] block mt-0.5">
                        {exec.failureReason || "Condition not met"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                    <span className="font-mono">Latency: {exec.duration}ms</span>
                    <span>
                      {new Date(exec.executedAt).toLocaleString("en-BD", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

