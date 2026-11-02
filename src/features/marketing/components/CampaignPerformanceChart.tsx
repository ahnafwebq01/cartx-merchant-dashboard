"use client";

import React, { useState } from "react";
import type { MarketingTimelinePoint } from "../types";

interface CampaignPerformanceChartProps {
  data: MarketingTimelinePoint[];
  height?: number;
}

export function CampaignPerformanceChart({
  data,
  height = 260,
}: CampaignPerformanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
        No campaign timeline data available for this timeframe.
      </div>
    );
  }

  // Max value calculation for auto-scaling
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1000);
  const maxDiscounts = Math.max(...data.map((d) => d.discounts), 500);
  const chartMax = Math.max(maxRevenue, maxDiscounts * 2);

  // SVG coordinate calculations
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = 720;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * innerWidth;
    const yRevenue = paddingTop + innerHeight - (d.revenue / chartMax) * innerHeight;
    const yDiscount = paddingTop + innerHeight - (d.discounts / chartMax) * innerHeight;
    return { ...d, x, yRevenue, yDiscount };
  });

  const revenuePath = points.reduce((acc, p, i) => {
    return `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yRevenue.toFixed(1)}`;
  }, "");

  const revenueAreaPath = `${revenuePath} L ${points[points.length - 1].x.toFixed(1)} ${(
    paddingTop + innerHeight
  ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(paddingTop + innerHeight).toFixed(1)} Z`;

  const discountPath = points.reduce((acc, p, i) => {
    return `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yDiscount.toFixed(1)}`;
  }, "");

  // Y-axis grid increments (4 lines)
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => {
    const value = Math.round(chartMax * ratio);
    const y = paddingTop + innerHeight - ratio * innerHeight;
    return { value, y };
  });

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Legend */}
      <div className="flex items-center justify-between pb-3 text-xs text-muted-foreground border-b border-border/60 mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
            <span className="font-medium text-foreground">Attributed Sales (৳)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            <span className="font-medium text-foreground">Discount Savings Given (৳)</span>
          </div>
        </div>
        <div className="text-[11px]">Daily Trend Analysis</div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[550px] select-none"
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary, #2563EB)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary, #2563EB)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={chartWidth - paddingRight}
                y2={tick.y}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[10px] fill-muted-foreground font-mono"
              >
                ৳{tick.value >= 1000 ? `${(tick.value / 1000).toFixed(0)}k` : tick.value}
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => {
            // Show roughly 6-8 labels across width
            const step = Math.max(1, Math.floor(points.length / 7));
            if (i % step !== 0 && i !== points.length - 1) return null;
            return (
              <text
                key={i}
                x={p.x}
                y={chartHeight - 10}
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground"
              >
                {p.label}
              </text>
            );
          })}

          {/* Area under revenue */}
          <path d={revenueAreaPath} fill="url(#revenueGrad)" />

          {/* Revenue line */}
          <path
            d={revenuePath}
            fill="none"
            stroke="var(--primary, #2563EB)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Discount line */}
          <path
            d={discountPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive hover overlay columns */}
          {points.map((p, i) => {
            const colWidth = innerWidth / (points.length || 1);
            return (
              <rect
                key={i}
                x={p.x - colWidth / 2}
                y={paddingTop}
                width={colWidth}
                height={innerHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Hover highlight markers */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + innerHeight}
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.yRevenue}
                r="4.5"
                fill="var(--primary, #2563EB)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.yDiscount}
                r="4"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Floating tooltip on hover */}
      {hoveredPoint && (
        <div className="mt-2 p-2.5 rounded-lg border border-border bg-card shadow-md flex items-center justify-between text-xs transition-all">
          <div className="font-semibold text-foreground">
            {hoveredPoint.label} ({hoveredPoint.date})
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary font-medium">
              Sales: ৳{hoveredPoint.revenue.toLocaleString("en-BD")}
            </span>
            <span className="text-amber-600 font-medium">
              Savings Given: ৳{hoveredPoint.discounts.toLocaleString("en-BD")}
            </span>
            <span className="text-muted-foreground font-mono">
              Redemptions: {hoveredPoint.redemptions}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

