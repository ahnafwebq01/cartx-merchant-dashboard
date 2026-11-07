"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Webhook,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Trash2,
  Edit,
  Info,
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
  useWebhooksQuery,
  useWebhookDeliveriesQuery,
  useWebhookStatsQuery,
  useDeleteWebhookMutation,
  useSimulateDeliveryMutation,
  useRetryDeliveryMutation,
  useToggleWebhookMutation,
} from "../hooks";
import { WebhookEditorDialog } from "./WebhookEditorDialog";
import type { WebhookEndpoint } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";

export function WebhooksListView() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WebhookEndpoint | null>(null);

  const { data: webhooks, isLoading: webhooksLoading } = useWebhooksQuery();
  const { data: deliveries, isLoading: deliveriesLoading } = useWebhookDeliveriesQuery();
  const { data: stats, isLoading: statsLoading } = useWebhookStatsQuery();

  const deleteMutation = useDeleteWebhookMutation();
  const toggleMutation = useToggleWebhookMutation();
  const simulateMutation = useSimulateDeliveryMutation();
  const retryMutation = useRetryDeliveryMutation();

  if (webhooksLoading || deliveriesLoading || statsLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const handleEdit = (wh: WebhookEndpoint) => {
    setEditingWebhook(wh);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingWebhook(null);
    setEditorOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSimulate = (wh: WebhookEndpoint) => {
    const event = wh.events[0] || "order.created";
    simulateMutation.mutate({ webhookId: wh.id, event });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhook Management"
        description="Configure event listeners, inspect payload schemas, and simulate real-time notification deliveries"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Integrations", href: "/dashboard/integrations" },
          { label: "Webhooks" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/integrations">
                <ArrowLeft className="h-4 w-4" />
                Back to Integrations
              </Link>
            </Button>
            <Button size="sm" onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Register Webhook
            </Button>
          </div>
        }
      />

      {/* Security & Simulated Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Simulated Webhook Dispatch Engine</p>
          <p className="text-muted-foreground dark:text-sky-300">
            In Demo Mode, delivery attempts are simulated locally to test payload structure and state tracking. No outbound HTTP/HTTPS requests are dispatched from your browser. In production, deliveries will originate from the shared Express API with HMAC-SHA256 signature verification.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Endpoints
            </CardTitle>
            <Webhook className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEndpoints ?? 2}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured listeners</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Endpoints
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeEndpoints ?? 1}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for event ingestion</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Simulated Dispatches
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDeliveries ?? 4}</div>
            <p className="text-xs text-muted-foreground mt-1">Logged event deliveries</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Simulated Success
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successRate ?? 75}%</div>
            <p className="text-xs text-muted-foreground mt-1">200 OK HTTP responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks Endpoints Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Registered Webhook Endpoints</CardTitle>
            <CardDescription className="text-xs">
              Configured destination endpoints and event subscriptions
            </CardDescription>
          </div>
        </CardHeader>
        {(!webhooks || webhooks.length === 0) ? (
          <EmptyState
            title="No Webhook Endpoints"
            description="Register a webhook endpoint to receive real-time updates for order creations and inventory alerts."
            actionLabel="Register Webhook"
            onAction={handleCreate}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Destination URL</TableHead>
                    <TableHead className="text-xs font-semibold">Subscribed Events</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((wh) => (
                    <TableRow key={wh.id} className="hover:bg-muted/30">
                      <TableCell className="py-3">
                        <div className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <span>{wh.url}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                          {wh.description || "No description"}
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {wh.events.map((evt) => (
                            <Badge key={evt} variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                              {evt}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <button
                          type="button"
                          onClick={() => toggleMutation.mutate(wh.id)}
                          disabled={toggleMutation.isPending}
                          title="Click to toggle active status"
                        >
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium capitalize cursor-pointer hover:opacity-80 transition-opacity ${
                              wh.isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200"
                            }`}
                          >
                            {wh.isActive ? "Active" : "Paused"}
                          </Badge>
                        </button>
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSimulate(wh)}
                            disabled={simulateMutation.isPending}
                            className="h-7 text-xs gap-1 text-primary hover:text-primary"
                            title="Simulate sending a webhook event"
                          >
                            <Play className="h-3 w-3" />
                            Test Dispatch
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(wh)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(wh)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-border/60">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-4 space-y-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-semibold text-foreground break-all">{wh.url}</p>
                      {wh.description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{wh.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMutation.mutate(wh.id)}
                      disabled={toggleMutation.isPending}
                      className="shrink-0"
                    >
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium capitalize cursor-pointer hover:opacity-80 transition-opacity ${
                          wh.isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200"
                        }`}
                      >
                        {wh.isActive ? "Active" : "Paused"}
                      </Badge>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                      Subscribed Events
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((evt) => (
                        <Badge key={evt} variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                          {evt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulate(wh)}
                      disabled={simulateMutation.isPending}
                      className="h-7 text-xs gap-1 text-primary hover:text-primary flex-1"
                    >
                      <Play className="h-3 w-3" />
                      Test Dispatch
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(wh)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteTarget(wh)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Simulated Delivery History Table */}
      <Card className="rounded-xl shadow-xs overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Simulated Delivery Event History</CardTitle>
          <CardDescription className="text-xs">
            Audit trail of mock delivery attempts and server response codes
          </CardDescription>
        </CardHeader>
        {(!deliveries || deliveries.length === 0) ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No simulated deliveries recorded yet. Click &quot;Test Dispatch&quot; on an endpoint to simulate an event.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Event</TableHead>
                    <TableHead className="text-xs font-semibold">Destination URL</TableHead>
                    <TableHead className="text-xs font-semibold">Status / Code</TableHead>
                    <TableHead className="text-xs font-semibold">Latency</TableHead>
                    <TableHead className="text-xs font-semibold">Attempted</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Retry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((del) => (
                    <TableRow key={del.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-mono font-medium">{del.event}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                        {del.webhookUrl}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono capitalize ${
                            del.status === "simulated_success"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                          }`}
                        >
                          {del.statusCode} {del.status === "simulated_success" ? "OK" : "Error"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {del.responseTime}ms
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(del.attemptedAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {del.status === "simulated_failure" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryMutation.mutate(del.id)}
                            disabled={retryMutation.isPending}
                            className="h-6 text-xs gap-1 text-primary"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Retry
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Delivered</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-border/60">
              {deliveries.map((del) => (
                <div key={del.id} className="p-3.5 space-y-2 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground">{del.event}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono capitalize ${
                        del.status === "simulated_success"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                      }`}
                    >
                      {del.statusCode} {del.status === "simulated_success" ? "OK" : "Error"}
                    </Badge>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground break-all">{del.webhookUrl}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-3">
                      <span>Latency: <strong className="font-mono font-medium text-foreground">{del.responseTime}ms</strong></span>
                      <span>{new Date(del.attemptedAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {del.status === "simulated_failure" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryMutation.mutate(del.id)}
                        disabled={retryMutation.isPending}
                        className="h-6 text-xs gap-1 text-primary px-2"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Retry
                      </Button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Delivered</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Webhook Modal */}
      <WebhookEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        webhookToEdit={editingWebhook}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook Endpoint?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the webhook subscription for {deleteTarget?.url}. No further simulated events will be queued for this URL.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Endpoint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

