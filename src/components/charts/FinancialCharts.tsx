import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters';
import { YearlyFinancialBreakdown } from '../../types';

// =========================================================================
// 1. CUMULATIVE 5-YEAR TCO COMPARISON CHART (FOR COMPARE VIEW)
// =========================================================================
interface CumulativeComparisonChartProps {
  carAName: string;
  carBName: string;
  tcoA: number[]; // 5-year cumulative TCO array
  tcoB: number[]; // 5-year cumulative TCO array
  winnerIsA: boolean;
}

export const CumulativeComparisonChart: React.FC<CumulativeComparisonChartProps> = ({
  carAName,
  carBName,
  tcoA,
  tcoB,
  winnerIsA,
}) => {
  const [hoverYear, setHoverYear] = useState<number | null>(4); // Default to 5th year (index 4)

  if (!tcoA || !tcoB || tcoA.length < 5 || tcoB.length < 5) return null;

  const width = 360;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...tcoA, ...tcoB) * 1.05;
  const minVal = 0;

  const getX = (index: number) => padding.left + (index / 4) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  const pathA = tcoA.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');
  const pathB = tcoB.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');

  const activeIdx = hoverYear !== null ? hoverYear : 4;
  const activeValA = tcoA[activeIdx];
  const activeValB = tcoB[activeIdx];
  const diffAtYear = Math.abs(activeValA - activeValB);
  const isABetterAtYear = activeValA < activeValB;

  return (
    <div className="p-4 rounded-2xl bg-[#0F131A] border border-white/8 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            CUMULATIVE 5-YEAR OUTLAY
          </span>
          <span className="text-xs text-zinc-400">
            Total capital burn trajectory
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block">Year {activeIdx + 1} Gap</span>
          <span className="text-xs font-black text-[#CCFF00] font-mono-numbers">
            {formatINR(diffAtYear)} diff
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-visible">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Subtle Gridlines */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
            const yVal = padding.top + chartHeight * (1 - ratio);
            const gridAmount = Math.round(maxVal * ratio);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yVal}
                  x2={width - padding.right}
                  y2={yVal}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 6}
                  y={yVal + 3}
                  textAnchor="end"
                  fontSize="8"
                  fill="#71717a"
                  fontFamily="monospace"
                >
                  ₹{(gridAmount / 100000).toFixed(0)}L
                </text>
              </g>
            );
          })}

          {/* Lines */}
          {/* Line B (Mercedes / Car B) */}
          <path
            d={pathB}
            fill="none"
            stroke={!winnerIsA ? '#CCFF00' : '#60a5fa'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Line A (BMW / Car A) */}
          <path
            d={pathA}
            fill="none"
            stroke={winnerIsA ? '#CCFF00' : '#f43f5e'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Year Points */}
          {[0, 1, 2, 3, 4].map((idx) => {
            const x = getX(idx);
            const yA = getY(tcoA[idx]);
            const yB = getY(tcoB[idx]);
            const isActive = activeIdx === idx;

            return (
              <g key={idx} className="cursor-pointer" onClick={() => setHoverYear(idx)}>
                {/* Year Label */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isActive ? '#CCFF00' : '#a1a1aa'}
                  fontWeight={isActive ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  Y{idx + 1}
                </text>

                {/* Highlight vertical rule if active */}
                {isActive && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + chartHeight}
                    stroke="rgba(204, 255, 0, 0.3)"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Dot A */}
                <circle
                  cx={x}
                  y={yA}
                  r={isActive ? 4.5 : 3}
                  fill={winnerIsA ? '#CCFF00' : '#f43f5e'}
                  stroke="#08090C"
                  strokeWidth="1.5"
                />

                {/* Dot B */}
                <circle
                  cx={x}
                  y={yB}
                  r={isActive ? 4.5 : 3}
                  fill={!winnerIsA ? '#CCFF00' : '#60a5fa'}
                  stroke="#08090C"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Interactive Pill */}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${winnerIsA ? 'bg-[#CCFF00]' : 'bg-rose-500'}`} />
            <span className="text-zinc-300 font-semibold">{carAName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${!winnerIsA ? 'bg-[#CCFF00]' : 'bg-blue-400'}`} />
            <span className="text-zinc-300 font-semibold">{carBName}</span>
          </div>
        </div>
        <span className="text-zinc-400 text-[10px]">Tap Y1–Y5 to inspect</span>
      </div>
    </div>
  );
};

// =========================================================================
// 2. 5-YEAR VALUATION & DEPRECIATION CURVE CHART (FOR KEEP/SELL)
// =========================================================================
interface ValuationCurveChartProps {
  vehicleName: string;
  startValue: number;
  yearlyValues: number[]; // 5-year values
  breakEvenHorizon?: string;
  decision: 'KEEP' | 'SELL';
}

export const ValuationCurveChart: React.FC<ValuationCurveChartProps> = ({
  vehicleName,
  startValue,
  yearlyValues,
  breakEvenHorizon = 'Apr 2027',
  decision,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<number>(1); // Highlight year 1 (12M verdict)

  if (!yearlyValues || yearlyValues.length < 5) return null;

  const points = [startValue, ...yearlyValues]; // Y0 to Y5 (6 points)
  const width = 360;
  const height = 170;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = startValue * 1.05;
  const minVal = Math.min(...points) * 0.85;

  const getX = (idx: number) => padding.left + (idx / 5) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  const pathD = points.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');
  const areaD = `${pathD} L ${getX(5)} ${padding.top + chartHeight} L ${getX(0)} ${padding.top + chartHeight} Z`;

  const activeVal = points[selectedPoint];

  return (
    <div className="p-4 rounded-2xl bg-[#0F131A] border border-white/8 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            RESIDUAL VALUATION CURVE
          </span>
          <span className="text-xs text-zinc-400">
            {vehicleName} market retention
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block">
            {selectedPoint === 0 ? 'Today Value' : `Year ${selectedPoint} Value`}
          </span>
          <span className="text-xs font-black text-white font-mono-numbers">
            {formatINR(activeVal)}
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.3, 0.6, 0.9].map((ratio, i) => {
            const yVal = padding.top + chartHeight * (1 - ratio);
            const gridAmount = Math.round(minVal + (maxVal - minVal) * ratio);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yVal}
                  x2={width - padding.right}
                  y2={yVal}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 6}
                  y={yVal + 3}
                  textAnchor="end"
                  fontSize="8"
                  fill="#71717a"
                  fontFamily="monospace"
                >
                  ₹{(gridAmount / 100000).toFixed(0)}L
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaD} fill="url(#valGrad)" />

          {/* Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#CCFF00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Year 1 (12-Month) Highlight Line */}
          <line
            x1={getX(1)}
            y1={padding.top}
            x2={getX(1)}
            y2={padding.top + chartHeight}
            stroke="rgba(204, 255, 0, 0.4)"
            strokeDasharray="2 2"
          />

          {/* Data Points */}
          {points.map((val, idx) => {
            const x = getX(idx);
            const y = getY(val);
            const isSelected = selectedPoint === idx;
            const is12M = idx === 1;

            return (
              <g key={idx} className="cursor-pointer" onClick={() => setSelectedPoint(idx)}>
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isSelected ? '#CCFF00' : is12M ? '#ffffff' : '#71717a'}
                  fontWeight={isSelected || is12M ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {idx === 0 ? 'Now' : `Y${idx}`}
                </text>

                <circle
                  cx={x}
                  y={y}
                  r={isSelected ? 5 : is12M ? 4 : 2.5}
                  fill={is12M ? '#CCFF00' : isSelected ? '#ffffff' : '#a1a1aa'}
                  stroke="#090C11"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
          <span>Y1 marks 12M {decision} inflection window</span>
        </span>
        <span className="font-mono-numbers text-zinc-300">Break-even: {breakEvenHorizon}</span>
      </div>
    </div>
  );
};

// =========================================================================
// 3. YEARLY OWNERSHIP-COST BREAKDOWN CHART (FOR COSTS VIEW)
// =========================================================================
interface YearlyCostBreakdownChartProps {
  yearlyData: YearlyFinancialBreakdown[];
}

export const YearlyCostBreakdownChart: React.FC<YearlyCostBreakdownChartProps> = ({ yearlyData }) => {
  const [selectedYear, setSelectedYear] = useState<number>(1);

  if (!yearlyData || yearlyData.length === 0) return null;

  const activeData = yearlyData.find((d) => d.year === selectedYear) || yearlyData[0];
  const maxYearTotal = Math.max(...yearlyData.map((d) => d.yearTotal), 1);

  return (
    <div className="p-4 rounded-2xl bg-[#0F131A] border border-white/8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            5-YEAR YEARLY ARCHITECTURE
          </span>
          <span className="text-xs text-zinc-400">
            Tap year to inspect cost distribution
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block">Year {selectedYear} Total</span>
          <span className="text-xs font-black text-white font-mono-numbers">
            {formatINR(activeData.yearTotal)}
          </span>
        </div>
      </div>

      {/* 5 Stacked Yearly Columns */}
      <div className="grid grid-cols-5 gap-2 items-end h-32 pt-2">
        {yearlyData.map((d) => {
          const isSelected = d.year === selectedYear;
          const colHeightPct = Math.round((d.yearTotal / maxYearTotal) * 100);

          // Component heights in percentage of year total
          const depPct = (d.depreciation / d.yearTotal) * 100;
          const fuelPct = (d.fuel / d.yearTotal) * 100;
          const maintPct = (d.maintenance / d.yearTotal) * 100;
          const insPct = (d.insurance / d.yearTotal) * 100;
          const intPct = (d.financingInterest / d.yearTotal) * 100;

          return (
            <button
              key={d.year}
              onClick={() => setSelectedYear(d.year)}
              className="flex flex-col items-center justify-end h-full gap-1.5 group cursor-pointer focus:outline-none"
            >
              <div 
                style={{ height: `${colHeightPct}%` }}
                className={`w-full rounded-lg overflow-hidden flex flex-col-reverse transition-all border ${
                  isSelected ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]/40' : 'border-transparent opacity-80 group-hover:opacity-100'
                }`}
              >
                {/* Depreciation (rose) */}
                <div style={{ height: `${depPct}%` }} className="bg-rose-500 w-full" title={`Depr: ${formatINR(d.depreciation)}`} />
                {/* Maintenance (blue) */}
                <div style={{ height: `${maintPct}%` }} className="bg-blue-500 w-full" title={`Maint: ${formatINR(d.maintenance)}`} />
                {/* Fuel (amber) */}
                <div style={{ height: `${fuelPct}%` }} className="bg-amber-400 w-full" title={`Fuel: ${formatINR(d.fuel)}`} />
                {/* Insurance (emerald) */}
                <div style={{ height: `${insPct}%` }} className="bg-emerald-400 w-full" title={`Insurance: ${formatINR(d.insurance)}`} />
                {/* Financing (lime) */}
                {d.financingInterest > 0 && (
                  <div style={{ height: `${intPct}%` }} className="bg-[#CCFF00] w-full" title={`Loan: ${formatINR(d.financingInterest)}`} />
                )}
              </div>

              <span className={`text-[10px] font-mono-numbers font-bold ${
                isSelected ? 'text-[#CCFF00]' : 'text-zinc-400'
              }`}>
                Y{d.year}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Year Itemized Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[10px]">
        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-zinc-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Depr
          </span>
          <span className="font-bold font-mono-numbers text-white block mt-0.5">
            {formatINR(activeData.depreciation)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-zinc-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Fuel
          </span>
          <span className="font-bold font-mono-numbers text-white block mt-0.5">
            {formatINR(activeData.fuel)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-zinc-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Maint.
          </span>
          <span className="font-bold font-mono-numbers text-white block mt-0.5">
            {formatINR(activeData.maintenance)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
          <span className="text-zinc-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" /> Interest
          </span>
          <span className="font-bold font-mono-numbers text-white block mt-0.5">
            {formatINR(activeData.financingInterest)}
          </span>
        </div>
      </div>
    </div>
  );
};
