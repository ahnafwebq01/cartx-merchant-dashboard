"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Layers, Filter } from "lucide-react";
import type {
  CustomerSegment,
  SegmentCondition,
  SegmentConditionGroup,
  SegmentConditionField,
  SegmentConditionOperator,
} from "../types";
import { CONDITION_FIELD_DEFINITIONS } from "../constants";
import { mockSegmentationService } from "../services/mockSegmentation";
import { SegmentPreviewPanel } from "./SegmentPreviewPanel";
import { useCreateSegmentMutation, useUpdateSegmentMutation } from "../hooks";

interface SegmentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segmentToEdit?: CustomerSegment | null;
}

export function SegmentEditorDialog({
  open,
  onOpenChange,
  segmentToEdit,
}: SegmentEditorDialogProps) {
  const createMutation = useCreateSegmentMutation();
  const updateMutation = useUpdateSegmentMutation();

  const [name, setName] = useState(segmentToEdit?.name ?? "");
  const [description, setDescription] = useState(segmentToEdit?.description ?? "");
  const [isActive] = useState(segmentToEdit?.isActive ?? true);
  const [groupLogic, setGroupLogic] = useState<"AND" | "OR">(segmentToEdit?.groupLogic ?? "AND");
  const [groups, setGroups] = useState<SegmentConditionGroup[]>(() =>
    segmentToEdit
      ? JSON.parse(JSON.stringify(segmentToEdit.conditionGroups))
      : [
          {
            id: "grp_1",
            logic: "AND",
            conditions: [
              {
                id: "c_1",
                field: "total_spend",
                operator: "greater_than_or_equal",
                value: 5000,
              },
            ],
          },
        ]
  );

  // Live evaluation
  const preview = mockSegmentationService.evaluateSegment(groups, groupLogic);

  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: `grp_${Date.now()}`,
        logic: "AND",
        conditions: [
          {
            id: `c_${Date.now()}`,
            field: "total_orders",
            operator: "greater_than_or_equal",
            value: 2,
          },
        ],
      },
    ]);
  };

  const removeGroup = (groupId: string) => {
    if (groups.length <= 1) return;
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  const addCondition = (groupId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          conditions: [
            ...g.conditions,
            {
              id: `c_${Date.now()}`,
              field: "customer_city",
              operator: "equals",
              value: "Dhaka",
            },
          ],
        };
      })
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id !== groupId) return g;
        if (g.conditions.length <= 1) return g;
        return {
          ...g,
          conditions: g.conditions.filter((c) => c.id !== conditionId),
        };
      })
    );
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    updates: Partial<SegmentCondition>
  ) => {
    setGroups(
      groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          conditions: g.conditions.map((c) => {
            if (c.id !== conditionId) return c;
            const updated = { ...c, ...updates };
            // If field changed, reset operator & value to defaults
            if (updates.field && updates.field !== c.field) {
              const def = CONDITION_FIELD_DEFINITIONS.find((d) => d.field === updates.field);
              if (def) {
                updated.operator = def.operators[0].value;
                updated.value = def.type === "number" ? 0 : def.type === "date" ? "2026-10-01" : "";
              }
            }
            return updated;
          }),
        };
      })
    );
  };

  const updateGroupLogic = (groupId: string, logic: "AND" | "OR") => {
    setGroups(groups.map((g) => (g.id === groupId ? { ...g, logic } : g)));
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    if (segmentToEdit) {
      await updateMutation.mutateAsync({
        id: segmentToEdit.id,
        values: {
          name: name.trim(),
          description: description.trim(),
          conditionGroups: groups,
          groupLogic,
          isActive,
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        conditionGroups: groups,
        groupLogic,
        isActive,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            {segmentToEdit ? "Edit Customer Segment" : "Create Dynamic Segment"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Build multi-attribute customer cohorts with compound AND/OR condition rules
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="segmentName" className="text-xs font-medium">
                Segment Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="segmentName"
                placeholder="e.g. VIP Dhaka Buyers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="segmentDesc" className="text-xs font-medium">
                Description / Merchant Purpose
              </Label>
              <Textarea
                id="segmentDesc"
                rows={2}
                placeholder="Describe targeting rules and merchandising objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs resize-none"
              />
            </div>
          </div>

          {/* Condition Groups Builder */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  Segmentation Criteria Groups
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Combine customer attributes such as order spend, district, and tags
                </p>
              </div>

              {groups.length > 1 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Between groups:</span>
                  <Select
                    value={groupLogic}
                    onValueChange={(val: "AND" | "OR") => setGroupLogic(val)}
                  >
                    <SelectTrigger className="w-24 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">MATCH ALL (AND)</SelectItem>
                      <SelectItem value="OR">MATCH ANY (OR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {groups.map((group, gIdx) => (
              <div
                key={group.id}
                className="p-4 rounded-xl border border-border bg-card/60 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">Group {gIdx + 1}</span>
                    <span className="text-[11px] text-muted-foreground">Conditions logic:</span>
                    <Select
                      value={group.logic}
                      onValueChange={(val: "AND" | "OR") => updateGroupLogic(group.id, val)}
                    >
                      <SelectTrigger className="w-20 h-6 text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {groups.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGroup(group.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Conditions in Group */}
                <div className="space-y-2">
                  {group.conditions.map((cond) => {
                    const fieldDef = CONDITION_FIELD_DEFINITIONS.find(
                      (d) => d.field === cond.field
                    ) || CONDITION_FIELD_DEFINITIONS[0];

                    return (
                      <div
                        key={cond.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 rounded-lg bg-muted/40 text-xs"
                      >
                        {/* Field Selector */}
                        <Select
                          value={cond.field}
                          onValueChange={(val: SegmentConditionField) =>
                            updateCondition(group.id, cond.id, { field: val })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-44 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_FIELD_DEFINITIONS.map((def) => (
                              <SelectItem key={def.field} value={def.field}>
                                {def.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Operator Selector */}
                        <Select
                          value={cond.operator}
                          onValueChange={(val: SegmentConditionOperator) =>
                            updateCondition(group.id, cond.id, { operator: val })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-44 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldDef.operators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Value Input */}
                        <div className="flex-1 w-full sm:w-auto">
                          {fieldDef.type === "select" && fieldDef.options ? (
                            <Select
                              value={String(cond.value)}
                              onValueChange={(val) =>
                                updateCondition(group.id, cond.id, { value: val })
                              }
                            >
                              <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldDef.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : fieldDef.type === "number" ? (
                            <Input
                              type="number"
                              value={cond.value}
                              onChange={(e) =>
                                updateCondition(group.id, cond.id, {
                                  value: Number(e.target.value),
                                })
                              }
                              placeholder={fieldDef.placeholder}
                              className="h-8 text-xs font-mono"
                            />
                          ) : fieldDef.type === "date" ? (
                            <Input
                              type="date"
                              value={String(cond.value)}
                              onChange={(e) =>
                                updateCondition(group.id, cond.id, { value: e.target.value })
                              }
                              className="h-8 text-xs"
                            />
                          ) : (
                            <Input
                              type="text"
                              value={String(cond.value)}
                              onChange={(e) =>
                                updateCondition(group.id, cond.id, { value: e.target.value })
                              }
                              placeholder={fieldDef.placeholder}
                              className="h-8 text-xs"
                            />
                          )}
                        </div>

                        {group.conditions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCondition(group.id, cond.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition(group.id)}
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                  Add Condition
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addGroup}
              className="text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Condition Group
            </Button>
          </div>

          {/* Live Preview Panel */}
          <SegmentPreviewPanel preview={preview} />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!name.trim() || createMutation.isPending || updateMutation.isPending}
          >
            {segmentToEdit ? "Save Segment" : "Create Segment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
