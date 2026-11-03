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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShieldCheck, Unlink } from "lucide-react";
import type { Integration } from "../types";
import { useUpdateIntegrationConfigMutation, useDisconnectIntegrationMutation } from "../hooks";

interface ConfigureIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: Integration | null;
}

export function ConfigureIntegrationDialog({
  open,
  onOpenChange,
  integration,
}: ConfigureIntegrationDialogProps) {
  if (!integration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open && (
          <ConfigureIntegrationForm
            key={integration.id}
            integration={integration}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ConfigureIntegrationForm({
  integration,
  onOpenChange,
}: {
  integration: Integration;
  onOpenChange: (open: boolean) => void;
}) {
  const updateMutation = useUpdateIntegrationConfigMutation();
  const disconnectMutation = useDisconnectIntegrationMutation();

  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    integration.configFields.forEach((f) => {
      initial[f.key] = f.value || "";
    });
    return initial;
  });

  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false);

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id: integration.id,
      values: formValues,
    });
    onOpenChange(false);
  };

  const handleDisconnect = async () => {
    await disconnectMutation.mutateAsync(integration.id);
    setDisconnectConfirmOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{integration.iconEmoji || "🔌"}</span>
          <div>
            <DialogTitle className="text-base font-semibold">{integration.name}</DialogTitle>
            <DialogDescription className="text-xs">{integration.description}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Status Badge & Security notice */}
      <div className="space-y-3 py-1">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 text-xs">
          <span className="text-muted-foreground">Current Integration Status:</span>
          <Badge
            variant="outline"
            className={`text-[10px] font-medium capitalize ${
              integration.isEnabled
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200"
            }`}
          >
            {integration.isEnabled ? "Demo Connected" : "Disconnected"}
          </Badge>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 text-[11px] text-amber-900 dark:text-amber-200">
          <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Zero-Secrets Sandbox:</strong> Credentials entered here are masked demo placeholders. Real API keys and merchant secrets are stored strictly on the authoritative Express backend proxy.
          </span>
        </div>

        {/* Dynamic Configuration Fields */}
        <div className="space-y-3 pt-2">
          {integration.configFields.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              This integration is pre-configured and requires no additional parameters in Demo Mode.
            </p>
          ) : (
            integration.configFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key} className="text-xs font-medium">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                {field.type === "select" && field.options ? (
                  <Select
                    value={formValues[field.key] || field.options[0].value}
                    onValueChange={(val) => handleFieldChange(field.key, val)}
                  >
                    <SelectTrigger id={field.key} className="text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formValues[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="text-xs h-8 font-mono"
                  />
                )}
                {field.helpText && (
                  <p className="text-[10px] text-muted-foreground">{field.helpText}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border">
        {integration.isEnabled ? (
          <AlertDialog open={disconnectConfirmOpen} onOpenChange={setDisconnectConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                <Unlink className="h-3.5 w-3.5 mr-1" />
                Disconnect
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect {integration.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will disable the integration and remove connection parameters from your browser session. You can reconnect anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDisconnect}
                  className="bg-destructive text-destructive-foreground"
                >
                  Disconnect Integration
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="text-xs"
          >
            {integration.isEnabled ? "Update Settings" : "Connect Gateway"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
