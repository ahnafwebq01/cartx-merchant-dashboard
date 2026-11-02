"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  Search,
  MessageSquare,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupportTicketsQuery } from "../hooks";
import { CreateTicketDialog } from "./CreateTicketDialog";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function TicketsListView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tickets = [], isLoading } = useSupportTicketsQuery({
    status: statusFilter,
    category: categoryFilter,
    priority: priorityFilter,
    search: searchTerm,
  });

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                Merchant Support Tickets
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Track and respond to technical, courier, payment, and account support requests.
              </CardDescription>
            </div>
            <CreateTicketDialog />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Simulated Disclaimer */}
          <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Demo Support System:</strong> All tickets, replies, and status changes are stored locally.
              Click on any ticket to view the conversation thread or simulate responses.
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs h-7">All ({tickets.length})</TabsTrigger>
                <TabsTrigger value="open" className="text-xs h-7">Open</TabsTrigger>
                <TabsTrigger value="in_progress" className="text-xs h-7">In Progress</TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs h-7">Resolved</TabsTrigger>
                <TabsTrigger value="closed" className="text-xs h-7">Closed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search subject or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="shipping">Logistics</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets Table */}
          {tickets.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-dashed border-border">
              <LifeBuoy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium text-foreground">No support tickets found</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No tickets match your current filters. Create a new support ticket if you require assistance.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {t.id}
                      </TableCell>

                      <TableCell className="text-xs">
                        <Link
                          href={`/dashboard/support/tickets/${t.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <span>{t.subject}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <MessageSquare className="h-3 w-3" /> {t.messages.length}
                          </span>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {t.category.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {t.priority === "urgent" && (
                          <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                        )}
                        {t.priority === "high" && (
                          <Badge variant="warning" className="text-[10px]">High</Badge>
                        )}
                        {t.priority === "medium" && (
                          <Badge variant="secondary" className="text-[10px]">Medium</Badge>
                        )}
                        {t.priority === "low" && (
                          <Badge variant="outline" className="text-[10px]">Low</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {t.status === "open" && (
                          <Badge variant="default" className="text-[10px]">Open</Badge>
                        )}
                        {t.status === "in_progress" && (
                          <Badge variant="warning" className="text-[10px]">In Progress</Badge>
                        )}
                        {t.status === "resolved" && (
                          <Badge variant="success" className="text-[10px]">Resolved</Badge>
                        )}
                        {t.status === "closed" && (
                          <Badge variant="outline" className="text-[10px]">Closed</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(t.updatedAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link href={`/dashboard/support/tickets/${t.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1">
                            View <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
