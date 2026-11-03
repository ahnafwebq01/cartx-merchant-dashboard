"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DateRange } from "../types";
import { mockAnalyticsService } from "../services/mockAnalytics";
import { toast } from "sonner";

interface AnalyticsExportButtonProps {
  tab: "sales" | "customers" | "products" | "marketing";
  dateRange: DateRange;
}

export function AnalyticsExportButton({ tab, dateRange }: AnalyticsExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const report = await mockAnalyticsService.exportReport(tab, dateRange);
      const csvContent = mockAnalyticsService.generateCSV(report);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${report.title}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${report.title}.csv (Demo Mode)`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to export CSV report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
      className="gap-2 text-xs"
    >
      <Download className="h-4 w-4" />
      {exporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}

