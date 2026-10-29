"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockProductService } from "../services/mockProducts";
import { Download, Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCT_QUERY_KEYS } from "../hooks";

interface ProductImportExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "import" | "export";
}

export function ProductImportExportModal({
  open,
  onOpenChange,
  defaultTab = "export",
}: ProductImportExportModalProps) {
  const queryClient = useQueryClient();
  const [csvContent, setCsvContent] = useState("");
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: string[];
  } | null>(null);

  const sampleCsv = `SKU,Title,Category,Regular Price (BDT),Sale Price (BDT),Stock,Low Stock Threshold,Status,Brand
SHR-COT-101,"Fine Cotton Formal Shirt",Men's Fashion,2400,2100,15,4,active,Deshi Style
BAG-LTH-102,"Executive Leather Laptop Bag",Leather Goods,4500,4200,8,2,active,Apex
KRT-SLK-103,"Festive Embroidered Kurti",Women's Fashion,1850,,20,5,active,Aarong Style`;

  const handleDownloadCsv = () => {
    try {
      const csv = mockProductService.exportProductsCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `cartx_products_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Export downloaded", {
        description: "Your product catalog has been exported to CSV.",
      });
    } catch {
      toast.error("Failed to export products CSV");
    }
  };

  const handleProcessImport = () => {
    if (!csvContent.trim()) {
      toast.error("Please paste or load CSV content first");
      return;
    }

    try {
      const result = mockProductService.importProductsCSV(csvContent);
      setImportResult(result);

      if (result.imported > 0) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
        toast.success(`Imported ${result.imported} products`, {
          description: "New products added to your demo catalog.",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error processing CSV";
      toast.error("Failed to import CSV", {
        description: message,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Product Import & Export
          </DialogTitle>
          <DialogDescription className="text-xs">
            Download your catalog or bulk import new products using CSV format.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" /> Export Catalog
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" /> Import from CSV
            </TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4 pt-3">
            <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Export to Spreadsheet</h4>
              <p className="text-xs text-muted-foreground">
                Exports all active, draft, and archived products including SKUs, categories, BDT pricing, and stock levels. Compatible with Excel, Google Sheets, and standard inventory managers.
              </p>
            </div>

            <Button onClick={handleDownloadCsv} className="w-full">
              <Download className="h-4 w-4 mr-2" /> Download Products CSV
            </Button>
          </TabsContent>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-4 pt-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                Select CSV File or Paste CSV Data
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-border file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 cursor-pointer w-full"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">CSV Text Content:</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px]"
                  onClick={() => setCsvContent(sampleCsv)}
                >
                  Load Sample Template
                </Button>
              </div>
              <Textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Paste CSV rows here..."
                className="font-mono text-xs"
              />
            </div>

            {/* Import Feedback */}
            {importResult && (
              <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-foreground">
                    Successfully imported: {importResult.imported} items
                  </span>
                </div>
                {importResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-destructive font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Errors encountered ({importResult.errors.length}):</span>
                    </div>
                    <ul className="list-disc pl-5 text-[11px] text-muted-foreground space-y-0.5">
                      {importResult.errors.slice(0, 5).map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button onClick={handleProcessImport} className="w-full">
              <Upload className="h-4 w-4 mr-2" /> Process & Import Products
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
