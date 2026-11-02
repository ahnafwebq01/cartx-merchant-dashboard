"use client";

import React from "react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Clock,
  Send,
  CheckCircle2,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSupportTicketQuery,
  useReplyTicketMutation,
  useUpdateTicketStatusMutation,
} from "../hooks";
import { replyTicketSchema, type ReplyTicketFormValues } from "../schemas";
import type { TicketStatus } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { mockSupportService } from "../services/mockSupport";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface TicketDetailViewProps {
  ticketId: string;
}

export function TicketDetailView({ ticketId }: TicketDetailViewProps) {
  const queryClient = useQueryClient();
  const { data: ticket, isLoading, error } = useSupportTicketQuery(ticketId);
  const replyMutation = useReplyTicketMutation();
  const updateStatusMutation = useUpdateTicketStatusMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyTicketFormValues>({
    resolver: zodResolver(replyTicketSchema) as Resolver<ReplyTicketFormValues>,
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: ReplyTicketFormValues) => {
    try {
      await replyMutation.mutateAsync({
        ticketId,
        message: values.message,
      });
      reset();
    } catch {
      // Handled by hook toast
    }
  };

  const handleSimulateAgentReply = async () => {
    if (!ticket) return;
    try {
      const responses = [
        "We have reviewed your request and verified our courier gateway telemetry. The issue is now addressed.",
        "Thank you for the update! We are continuing to monitor the logs for your store.",
        "Our engineering team has confirmed the configuration update. Everything is operating normally.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const tickets = await mockSupportService.getSupportTickets();
      const current = tickets.find((t) => t.id === ticketId);
      if (current) {
        current.messages.push({
          id: `msg_agent_${Date.now()}`,
          ticketId,
          sender: "support_agent",
          senderName: "Tanvir Hasan",
          senderRole: "CartX Senior Technical Specialist",
          message: randomResponse,
          createdAt: new Date().toISOString(),
        });
        current.status = "in_progress";
        current.lastReplyBy = "support_agent";
        current.updatedAt = new Date().toISOString();
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "cartx_demo_support_tickets_v1",
            JSON.stringify(tickets)
          );
        }
        queryClient.invalidateQueries({ queryKey: ["support"] });
        toast.success("Simulated CartX agent reply received!");
      }
    } catch {
      toast.error("Failed to simulate reply.");
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (error || !ticket) {
    return (
      <div className="p-8 text-center rounded-lg border border-border bg-card">
        <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
        <h4 className="font-bold text-foreground">Ticket Not Found</h4>
        <p className="text-xs text-muted-foreground mt-1">
          The requested ticket with ID &ldquo;{ticketId}&rdquo; does not exist or was removed.
        </p>
        <Link href="/dashboard/support/tickets">
          <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/support/tickets">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground font-semibold">
                {ticket.id}
              </span>
              <Badge variant="outline" className="text-[11px] capitalize">
                {ticket.category.replace("_", " ")}
              </Badge>
              {ticket.priority === "urgent" && (
                <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
              )}
              {ticket.priority === "high" && (
                <Badge variant="warning" className="text-[10px]">High</Badge>
              )}
              {ticket.priority === "medium" && (
                <Badge variant="secondary" className="text-[10px]">Medium</Badge>
              )}
              {ticket.priority === "low" && (
                <Badge variant="outline" className="text-[10px]">Low</Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground mt-1">{ticket.subject}</h2>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          <Select
            value={ticket.status}
            onValueChange={(val) =>
              updateStatusMutation.mutate({
                ticketId: ticket.id,
                status: val as TicketStatus,
              })
            }
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {ticket.status !== "resolved" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateStatusMutation.mutate({
                  ticketId: ticket.id,
                  status: "resolved",
                })
              }
              disabled={updateStatusMutation.isPending}
              className="text-xs h-8 text-emerald-600 dark:text-emerald-400 gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
            </Button>
          )}
        </div>
      </div>

      {/* Conversation Thread */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Conversation History ({ticket.messages.length} messages)</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Created {formatDate(ticket.createdAt)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {ticket.messages.map((msg) => {
            const isAgent = msg.sender === "support_agent";

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border transition-all ${
                  isAgent
                    ? "border-primary/30 bg-primary/5 ml-4 sm:ml-8"
                    : "border-border bg-card mr-4 sm:mr-8"
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Avatar className={`h-7 w-7 text-xs ${isAgent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <AvatarFallback>
                        {isAgent ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-semibold text-xs text-foreground block">
                        {msg.senderName}
                      </span>
                      {msg.senderRole && (
                        <span className="text-[10px] text-primary font-medium">
                          {msg.senderRole}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                  {msg.message}
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* Reply Section */}
        <CardFooter className="pt-4 border-t border-border flex flex-col items-stretch gap-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
            <div className="space-y-1.5">
              <label htmlFor="reply-box" className="text-xs font-medium text-foreground">
                Your Response
              </label>
              <Textarea
                id="reply-box"
                rows={3}
                placeholder="Type your message or follow-up questions..."
                {...register("message")}
                className="text-xs"
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSimulateAgentReply}
                className="text-xs gap-1.5 text-primary border-primary/30 hover:bg-primary/10 w-full sm:w-auto"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Simulate CartX Support Reply
              </Button>

              <Button
                type="submit"
                disabled={replyMutation.isPending}
                size="sm"
                className="text-xs gap-1.5 w-full sm:w-auto"
              >
                <Send className="h-3.5 w-3.5" />
                {replyMutation.isPending ? "Sending..." : "Submit Reply"}
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
