import type { DatePreset, DateRange } from "./types";

export function getDateRangeFromPreset(preset: DatePreset): DateRange {
  const now = new Date();
  const to = now.toISOString().split("T")[0];

  let fromDate = new Date();
  switch (preset) {
    case "today":
      fromDate = now;
      break;
    case "7d":
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "custom":
    default:
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }

  const from = fromDate.toISOString().split("T")[0];
  return { from, to, preset };
}

export const DATE_PRESET_OPTIONS: { value: DatePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "custom", label: "Custom Range" },
];

