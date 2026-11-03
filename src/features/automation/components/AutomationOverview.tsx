"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Info,
  ListTree,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  useWorkflowExecutionsQuery,
  useWorkflowStatsQuery,
} from "../hooks";
import { mockAutomationService } from "../services/mockAutomation";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AutomationOverview() {
  const queryClient = useQueryClient();
  const { isLoading: workflowsLoading } = useWorkflowsQuery();
  const { data: executions, isLoading: executionsLoading } = useWorkflowExecutionsQuery();
  const { data: stats, isLoading: statsLoading } = useWorkflowStatsQuery();

  if (workflowsLoading || executionsLoading || statsLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const handleReset = () => {
    mockAutomationService.resetToDefaults();
    queryClient.invalidateQueries({ queryKey: ["automation"] });
    toast.success("Automations restored to demo defaults (Demo Mode)");
  };

  const recentExecutions = (executions || []).slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Automation & Workflows"
        description="Automate order processing, low inventory restocking alerts, and customer lifecycle actions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Automation" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/automation/history">
                <Clock className="h-4 w-4" />
                Execution History
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Defaults
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/automation/workflows/new">
                <Plus className="h-4 w-4" />
                New Workflow
              </Link>
            </Button>
          </div>
        }
      />

      {/* Demo Disclosures Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Simulated Automation Runtime (Demo Mode)</p>
          <p className="text-muted-foreground dark:text-sky-300">
            Workflows and trigger simulations demonstrate CartX automation orchestration. No persistent background workers (e.g. BullMQ / Redis queues) run on the client, and no real SMS or emails are transmitted. Workflows execute explicitly via the &quot;Test Run&quot; simulator button.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Workflows
            </CardTitle>
            <ListTree className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalWorkflows ?? 3}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured rule recipes</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Recipes
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeWorkflows ?? 2} Active</div>
            <p className="text-xs text-muted-foreground mt-1">Listening for store events</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Simulated Runs
            </CardTitle>
            <Play className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExecutions ?? 4}</div>
            <p className="text-xs text-muted-foreground mt-1">Total manual test dispatches</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Execution Success
            </CardTitle>
            <Zap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successRate ?? 85}%</div>
            <p className="text-xs text-muted-foreground mt-1">Simulated action completions</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Workflow Recipes</CardTitle>
            <CardDescription className="text-xs">
              View, edit, duplicate, and trigger test executions of your active automations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between" variant="outline" size="sm">
              <Link href="/dashboard/automation/workflows">
                <span>Manage Workflows</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Build New Automation</CardTitle>
            <CardDescription className="text-xs">
              Create compound multi-condition trigger recipes with customer tags & alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between" size="sm">
              <Link href="/dashboard/automation/workflows/new">
                <span>Workflow Builder</span>
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Execution Audit Trail</CardTitle>
            <CardDescription className="text-xs">
              Review detailed execution logs, latency timing, and condition check results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between" variant="outline" size="sm">
              <Link href="/dashboard/automation/history">
                <span>View Full Log</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions Preview */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Simulated Executions</CardTitle>
            <CardDescription className="text-xs">
              Last 4 workflow triggers executed in this browser session
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/dashboard/automation/history">View All</Link>
          </Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold">Workflow</TableHead>
              <TableHead className="text-xs font-semibold">Trigger Event</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Executed Actions</TableHead>
              <TableHead className="text-xs font-semibold text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExecutions.map((exec) => (
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
                <TableCell className="text-xs text-muted-foreground truncate max-w-xs">
                  {exec.executedActions.length > 0 ? exec.executedActions.join(", ") : exec.failureReason || "None"}
                </TableCell>
                <TableCell className="text-xs text-right text-muted-foreground">
                  {new Date(exec.executedAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

