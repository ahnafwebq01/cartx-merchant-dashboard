"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DatePreset, DateRange } from "../types";
import { DATE_PRESET_OPTIONS, getDateRangeFromPreset } from "../constants";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const handlePresetClick = (preset: DatePreset) => {
    if (preset === "custom") {
      onChange({ ...value, preset: "custom" });
    } else {
      onChange(getDateRangeFromPreset(preset));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 max-w-full min-w-0">
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border max-w-full overflow-x-auto">
        {DATE_PRESET_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={value.preset === opt.value ? "default" : "ghost"}
            size="sm"
            onClick={() => handlePresetClick(opt.value)}
            className="h-7 text-xs px-2 sm:px-2.5 shrink-0"
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {value.preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
          <Input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            className="h-8 w-32 sm:w-36 text-xs"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            className="h-8 w-32 sm:w-36 text-xs"
          />
        </div>
      )}
    </div>
  );
}
