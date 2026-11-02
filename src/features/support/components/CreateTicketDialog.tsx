"use client";

import React, { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LifeBuoy, AlertCircle, Plus } from "lucide-react";
import {
  createTicketSchema,
  type CreateTicketFormValues,
} from "../schemas";
import { useCreateTicketMutation } from "../hooks";
import type { TicketCategory, TicketPriority } from "../types";

interface CreateTicketDialogProps {
  trigger?: React.ReactNode;
  onCreated?: (ticketId: string) => void;
}

export function CreateTicketDialog({
  trigger,
  onCreated,
}: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateTicketMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema) as Resolver<CreateTicketFormValues>,
    defaultValues: {
      subject: "",
      category: "technical",
      priority: "medium",
      message: "",
    },
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const selectedPriority = useWatch({ control, name: "priority" });

  const onSubmit = async (values: CreateTicketFormValues) => {
    try {
      const ticket = await createMutation.mutateAsync(values);
      setOpen(false);
      reset();
      if (onCreated) {
        onCreated(ticket.id);
      }
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            Open Support Ticket
          </DialogTitle>
          <DialogDescription>
            Submit a technical, courier, payment, or account request to the CartX Support Team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Simulated Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong>Demo Support System:</strong> Tickets and replies are simulated in local memory and browser storage.
              Replies from CartX specialists can be simulated directly in the conversation view.
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g. Steadfast Courier tracking sync delay"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(v) => setValue("category", v as TicketCategory, { shouldValidate: true })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical & Platform</SelectItem>
                  <SelectItem value="shipping">Courier & Logistics</SelectItem>
                  <SelectItem value="payments">Payment Gateways & COD</SelectItem>
                  <SelectItem value="billing">Subscription & Invoices</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={selectedPriority}
                onValueChange={(v) => setValue("priority", v as TicketPriority, { shouldValidate: true })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (General questions)</SelectItem>
                  <SelectItem value="medium">Medium (Standard issues)</SelectItem>
                  <SelectItem value="high">High (Fulfillment affected)</SelectItem>
                  <SelectItem value="urgent">Urgent (Checkout offline)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Detailed Description *</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Describe what occurred, any error messages, and relevant order or consignment IDs..."
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Submitting Ticket..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
