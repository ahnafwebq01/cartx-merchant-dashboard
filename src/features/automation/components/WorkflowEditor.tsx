"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TRIGGER_OPTIONS,
  CONDITION_OPTIONS,
  ACTION_OPTIONS,
} from "../constants";
import type {
  Workflow,
  WorkflowTrigger,
  WorkflowCondition,
  WorkflowAction,
  TriggerType,
  ConditionType,
  ActionType,
  WorkflowStatus,
} from "../types";
import {
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useWorkflowQuery,
} from "../hooks";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { toast } from "sonner";

let idCounter = 0;
function getNextId(prefix: string) {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}

interface WorkflowEditorProps {
  workflowId?: string;
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  const isEditing = Boolean(workflowId);
  const { data: existingWorkflow, isLoading } = useWorkflowQuery(workflowId || "");

  if (isEditing && isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <WorkflowEditorForm
      key={workflowId || "new"}
      workflowId={workflowId}
      initialWorkflow={existingWorkflow}
      isEditing={isEditing}
    />
  );
}

function WorkflowEditorForm({
  workflowId,
  initialWorkflow,
  isEditing,
}: {
  workflowId?: string;
  initialWorkflow?: Workflow | null;
  isEditing: boolean;
}) {
  const router = useRouter();
  const createMutation = useCreateWorkflowMutation();
  const updateMutation = useUpdateWorkflowMutation();

  const [name, setName] = useState(() => initialWorkflow?.name ?? "");
  const [description, setDescription] = useState(
    () => initialWorkflow?.description ?? ""
  );
  const [status, setStatus] = useState<WorkflowStatus>(
    () => initialWorkflow?.status ?? "active"
  );

  const [selectedTrigger, setSelectedTrigger] = useState<WorkflowTrigger>(
    () =>
      initialWorkflow?.trigger ?? {
        id: "trg_initial",
        type: "order_created",
        label: "New Order Placed",
        description: "Fires whenever a customer completes a checkout in your store",
        config: {},
      }
  );

  const [conditions, setConditions] = useState<WorkflowCondition[]>(
    () =>
      initialWorkflow?.conditions ?? [
        {
          id: "cnd_initial",
          type: "order_amount",
          operator: "greater_than",
          value: 5000,
          label: "Order Total > ৳5,000",
        },
      ]
  );

  const [actions, setActions] = useState<WorkflowAction[]>(
    () =>
      initialWorkflow?.actions ?? [
        {
          id: "act_initial",
          type: "add_notification",
          label: "Create Internal Merchant Notification",
          config: { message: "High-priority order received" },
        },
      ]
  );

  const handleTriggerSelect = (type: TriggerType) => {
    const opt = TRIGGER_OPTIONS.find((t) => t.type === type) || TRIGGER_OPTIONS[0];
    setSelectedTrigger({
      id: getNextId("trg"),
      type: opt.type,
      label: opt.label,
      description: opt.description,
      config: {},
    });
  };

  const addCondition = () => {
    const opt = CONDITION_OPTIONS[0];
    setConditions((prev) => [
      ...prev,
      {
        id: getNextId("cnd"),
        type: opt.type,
        operator: "greater_than",
        value: 1000,
        label: `${opt.label} > ৳1,000`,
      },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const updateConditionField = (id: string, updates: Partial<WorkflowCondition>) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addAction = () => {
    const opt = ACTION_OPTIONS[0];
    setActions((prev) => [
      ...prev,
      {
        id: getNextId("act"),
        type: opt.type,
        label: opt.label,
        config: { [opt.configKey]: opt.placeholder },
      },
    ]);
  };

  const removeAction = (id: string) => {
    if (actions.length <= 1) {
      toast.error("A workflow must have at least one action step.");
      return;
    }
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  const updateActionType = (id: string, type: ActionType) => {
    const opt = ACTION_OPTIONS.find((a) => a.type === type) || ACTION_OPTIONS[0];
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              type,
              label: opt.label,
              config: { [opt.configKey]: "" },
            }
          : a
      )
    );
  };

  const updateActionConfig = (id: string, key: string, value: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              config: { ...a.config, [key]: value },
            }
          : a
      )
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please provide a name for this workflow recipe.");
      return;
    }
    if (actions.length === 0) {
      toast.error("Please configure at least one action step.");
      return;
    }

    try {
      if (isEditing && workflowId) {
        await updateMutation.mutateAsync({
          id: workflowId,
          values: {
            name: name.trim(),
            description: description.trim(),
            status,
            trigger: selectedTrigger,
            conditions,
            actions,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          status,
          trigger: selectedTrigger,
          conditions,
          actions,
        });
      }

      router.push("/dashboard/automation/workflows");
    } catch {
      // toast is handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? `Edit Workflow: ${name || "Untitled"}` : "Create Automation Workflow"}
        description="Construct trigger-condition-action recipes to automate store management in Demo Mode."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Automation", href: "/dashboard/automation" },
          { label: "Workflows", href: "/dashboard/automation/workflows" },
          { label: isEditing ? "Edit Workflow" : "New Recipe" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/automation/workflows">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Cancel
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !name.trim()}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isEditing ? "Save Changes" : "Save Recipe"}
            </Button>
          </div>
        }
      />

      <div className="flex items-start gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Simulated Automation Builder: </span>
          Workflows do not execute background cron daemons or fire live external APIs. You can simulate test runs safely with instantaneous audit logging.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step-by-Step Recipe Construction */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: TRIGGER */}
          <Card className="rounded-xl shadow-xs border-primary/30">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </span>
                  <CardTitle className="text-sm font-semibold">
                    Trigger (When This Happens...)
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {selectedTrigger.type}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Select the store event that initiates this automated workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRIGGER_OPTIONS.map((opt) => {
                  const isSelected = selectedTrigger.type === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => handleTriggerSelect(opt.type)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: CONDITIONS */}
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold">
                    2
                  </span>
                  <CardTitle className="text-sm font-semibold">
                    Conditions (Only If...)
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Condition
                </Button>
              </div>
              <CardDescription className="text-xs">
                Optional filtering criteria that must evaluate to true before actions run
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {conditions.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-xl text-xs text-muted-foreground">
                  No conditions configured. This workflow will run unconditionally for every trigger event.
                </div>
              ) : (
                conditions.map((cond, index) => {
                  const opt =
                    CONDITION_OPTIONS.find((c) => c.type === cond.type) || CONDITION_OPTIONS[0];

                  return (
                    <div
                      key={cond.id}
                      className="p-3 rounded-xl border border-border bg-card flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-muted-foreground uppercase px-2 py-0.5 rounded bg-muted">
                        {index === 0 ? "IF" : "AND"}
                      </span>

                      {/* Condition Type */}
                      <Select
                        value={cond.type}
                        onValueChange={(val: ConditionType) => {
                          const newOpt = CONDITION_OPTIONS.find((c) => c.type === val)!;
                          updateConditionField(cond.id, {
                            type: val,
                            operator: newOpt.operators[0].value,
                            label: newOpt.label,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-44 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITION_OPTIONS.map((c) => (
                            <SelectItem key={c.type} value={c.type}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Operator select */}
                      <Select
                        value={cond.operator}
                        onValueChange={(val) =>
                          updateConditionField(cond.id, {
                            operator: val as WorkflowCondition["operator"],
                          })
                        }
                      >
                        <SelectTrigger className="w-full sm:w-40 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {opt.operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Value Input */}
                      <Input
                        type={opt.inputType}
                        value={cond.value}
                        placeholder={opt.placeholder}
                        onChange={(e) =>
                          updateConditionField(cond.id, {
                            value:
                              opt.inputType === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                        className="w-full sm:w-36 h-8 text-xs"
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(cond.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* STEP 3: ACTIONS */}
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    3
                  </span>
                  <CardTitle className="text-sm font-semibold">
                    Actions (Then Do This...)
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Action
                </Button>
              </div>
              <CardDescription className="text-xs">
                Operational tasks executed when conditions are satisfied
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {actions.map((act, index) => {
                const opt = ACTION_OPTIONS.find((a) => a.type === act.type) || ACTION_OPTIONS[0];

                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-border bg-card space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          Action {index + 1}
                        </span>
                        <Select
                          value={act.type}
                          onValueChange={(val: ActionType) => updateActionType(act.id, val)}
                        >
                          <SelectTrigger className="h-8 text-xs font-semibold w-64">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_OPTIONS.map((a) => (
                              <SelectItem key={a.type} value={a.type}>
                                {a.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAction(act.id)}
                        disabled={actions.length <= 1}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-muted-foreground">
                        {opt.configLabel}
                      </Label>
                      <Input
                        value={act.config[opt.configKey] || ""}
                        placeholder={opt.placeholder}
                        onChange={(e) =>
                          updateActionConfig(act.id, opt.configKey, e.target.value)
                        }
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Workflow Metadata & Activation */}
        <div className="space-y-6">
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Workflow Metadata</CardTitle>
              <CardDescription className="text-xs">Title, description & state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="wfName" className="text-xs font-medium">
                  Recipe Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="wfName"
                  placeholder="e.g. VIP Order Priority Alert"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wfDesc" className="text-xs font-medium">
                  Description
                </Label>
                <Textarea
                  id="wfDesc"
                  rows={3}
                  placeholder="Explain why this workflow runs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 text-xs">
                <div>
                  <div className="font-semibold text-foreground">Operational Status</div>
                  <div className="text-[11px] text-muted-foreground capitalize">
                    Currently {status}
                  </div>
                </div>
                <Switch
                  checked={status === "active"}
                  onCheckedChange={(val) => setStatus(val ? "active" : "inactive")}
                />
              </div>

              {/* Summary Pill */}
              <div className="p-3 rounded-lg border border-border bg-background space-y-1.5 text-xs">
                <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                  Summary Recipe
                </span>
                <div className="text-xs leading-relaxed text-foreground">
                  <span className="font-semibold text-primary">WHEN</span> {selectedTrigger.label}{" "}
                  {conditions.length > 0 && (
                    <>
                      <span className="font-semibold text-primary">IF</span> {conditions.length} condition{conditions.length > 1 ? "s" : ""}{" "}
                    </>
                  )}
                  <span className="font-semibold text-primary">THEN</span> execute {actions.length} action{actions.length > 1 ? "s" : ""}.
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending || !name.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Save Recipe Changes" : "Create Workflow Recipe"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
