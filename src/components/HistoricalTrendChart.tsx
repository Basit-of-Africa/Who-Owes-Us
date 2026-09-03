'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Politician } from '@/lib/types';
import { computeHistoricalScoreTrend, HistoricalTrendPoint } from '@/lib/trend';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Scale, 
  Clock, 
  CheckCircle2, 
  Info,
  ArrowUpRight
} from 'lucide-react';

interface HistoricalTrendChartProps {
  politician: Politician;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

function CustomTrendTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data: HistoricalTrendPoint = payload[0].payload;

  return (
    <div className="bg-slate-950 text-white p-3.5 rounded-xl shadow-2xl border border-slate-800 text-xs min-w-[240px] max-w-[320px] space-y-2 z-50">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-black text-sm text-slate-100">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Year {data.year}</span>
        </div>
        <Badge 
          className="text-[10px] uppercase font-bold py-0.5 px-2"
          style={{ backgroundColor: data.riskColor, color: '#fff' }}
        >
          {data.riskTier.split('/')[0]}
        </Badge>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-slate-400 font-medium text-[11px]">Cumulative Score:</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-amber-400">{data.score.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400">pts</span>
          {data.delta > 0 && (
            <span className="text-[10px] font-bold text-red-400 flex items-center">
              (+{data.delta.toFixed(1)})
            </span>
          )}
        </div>
      </div>

      {data.casesCount > 0 && (
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Active / Filed Cases:</span>
          <span className="font-bold text-slate-200">{data.casesCount}</span>
        </div>
      )}

      {data.offices.length > 0 && (
        <div className="pt-1.5 border-t border-slate-800/80">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> Tenure in Year
          </p>
          <div className="space-y-0.5">
            {data.offices.slice(0, 2).map((off, i) => (
              <p key={i} className="text-[11px] text-slate-300 truncate">
                • {off}
              </p>
            ))}
          </div>
        </div>
      )}

      {data.events.length > 0 && (
        <div className="pt-1.5 border-t border-slate-800/80">
          <p className="text-[10px] font-bold uppercase text-amber-400 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Case Milestone Logged
          </p>
          <ul className="space-y-1">
            {data.events.map((ev, i) => (
              <li key={i} className="text-[11px] text-slate-200 bg-slate-900/90 p-1.5 rounded border border-slate-800 leading-tight">
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function HistoricalTrendChart({ politician }: HistoricalTrendChartProps) {
  const trendSummary = useMemo(() => computeHistoricalScoreTrend(politician), [politician]);
  const [rangeFilter, setRangeFilter] = useState<'all' | 'recent'>('all');
  const [selectedPoint, setSelectedPoint] = useState<HistoricalTrendPoint | null>(null);

  const displayPoints = useMemo(() => {
    if (rangeFilter === 'recent' && trendSummary.points.length > 6) {
      return trendSummary.points.slice(-6);
    }
    return trendSummary.points;
  }, [trendSummary, rangeFilter]);

  const inflectionEvents = useMemo(() => {
    return trendSummary.points.filter(p => p.events.length > 0 || (p.delta > 0 && p.year !== trendSummary.startYear));
  }, [trendSummary]);

  const hasScore = trendSummary.currentScore > 0;
  const strokeColor = hasScore ? (trendSummary.currentScore > 50 ? '#DC2626' : '#D97706') : '#16A34A';
  const fillColor = hasScore ? (trendSummary.currentScore > 50 ? '#EF4444' : '#F59E0B') : '#22C55E';

  // Compute domain upper bound nicely
  const maxScore = Math.max(...displayPoints.map(p => p.score), 10);
  const yDomainMax = Math.ceil((maxScore * 1.25) / 10) * 10;

  return (
    <Card className="border-none shadow-md overflow-hidden bg-card rounded-2xl">
      <CardHeader className="p-6 md:p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-black text-primary uppercase tracking-tight">
                Accountability Trend Over Time
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Chronological score evolution based on judicial filings, asset recovery orders, and public tenures ({trendSummary.startYear} – {trendSummary.endYear}).
            </CardDescription>
          </div>

          {trendSummary.points.length > 6 && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted/70 p-1 rounded-xl border">
              <Button
                variant={rangeFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg px-3 ${
                  rangeFilter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                onClick={() => setRangeFilter('all')}
              >
                Full Record ({trendSummary.points.length} yrs)
              </Button>
              <Button
                variant={rangeFilter === 'recent' ? 'default' : 'ghost'}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg px-3 ${
                  rangeFilter === 'recent' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                onClick={() => setRangeFilter('recent')}
              >
                Recent (Last 6 Yrs)
              </Button>
            </div>
          )}
        </div>

        {/* Quick Metric Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-3.5 bg-background border rounded-xl shadow-xs">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
              Career Inception ({trendSummary.startYear})
            </p>
            <p className="text-xl font-black text-primary">
              {trendSummary.initialScore.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">pts</span>
            </p>
          </div>

          <div className="p-3.5 bg-background border rounded-xl shadow-xs">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
              Current Rating ({trendSummary.endYear})
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-black text-primary">
                {trendSummary.currentScore.toFixed(1)}
              </p>
              <span className="text-xs font-normal text-muted-foreground">pts</span>
            </div>
          </div>

          <div className="p-3.5 bg-background border rounded-xl shadow-xs">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
              Lifetime Net Shift
            </p>
            <p className={`text-xl font-black flex items-center ${
              trendSummary.netChange > 0 ? 'text-accent' : 'text-emerald-600'
            }`}>
              {trendSummary.netChange > 0 ? `+${trendSummary.netChange.toFixed(1)}` : '0.0'}
              {trendSummary.netChange > 0 && <ArrowUpRight className="w-4 h-4 ml-0.5" />}
            </p>
          </div>

          <div className="p-3.5 bg-background border rounded-xl shadow-xs">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
              Peak Shift Year
            </p>
            <p className="text-xl font-black text-primary">
              {trendSummary.highestVelocityDelta > 0 ? (
                <>
                  {trendSummary.highestVelocityYear}{' '}
                  <span className="text-xs font-bold text-accent">
                    (+{trendSummary.highestVelocityDelta.toFixed(1)})
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-emerald-600">Stable</span>
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-8">
        {/* Recharts Area Chart Container */}
        <div className="h-[280px] sm:h-[340px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayPoints}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedPoint(e.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="scoreTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.08} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600, opacity: 0.7 }}
                dy={6}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600, opacity: 0.7 }}
                domain={[0, yDomainMax]}
                dx={-4}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              
              {/* Optional reference lines for context */}
              {maxScore > 30 && (
                <ReferenceLine 
                  y={30} 
                  stroke="#F59E0B" 
                  strokeDasharray="4 4" 
                  strokeOpacity={0.5}
                  label={{ 
                    value: "Elevated Risk", 
                    fill: "#D97706", 
                    fontSize: 9, 
                    fontWeight: 700, 
                    position: "insideTopRight" 
                  }} 
                />
              )}

              {maxScore > 60 && (
                <ReferenceLine 
                  y={60} 
                  stroke="#DC2626" 
                  strokeDasharray="4 4" 
                  strokeOpacity={0.5}
                  label={{ 
                    value: "Critical Risk Threshold", 
                    fill: "#DC2626", 
                    fontSize: 9, 
                    fontWeight: 700, 
                    position: "insideTopRight" 
                  }} 
                />
              )}

              <Area
                type="monotone"
                dataKey="score"
                stroke={strokeColor}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreTrendGradient)"
                activeDot={{ 
                  r: 6, 
                  stroke: '#fff', 
                  strokeWidth: 2, 
                  fill: strokeColor 
                }}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const hasEvent = payload.events && payload.events.length > 0;
                  const isInflection = payload.delta > 0 && payload.year !== trendSummary.startYear;
                  
                  if (!hasEvent && !isInflection) {
                    return <circle cx={cx} cy={cy} r={2} fill={strokeColor} opacity={0.3} key={`dot-${payload.year}`} />;
                  }

                  return (
                    <g key={`event-dot-${payload.year}`}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={hasEvent ? 5 : 4}
                        fill="#fff"
                        stroke={hasEvent ? '#DC2626' : strokeColor}
                        strokeWidth={2.5}
                        className="cursor-pointer transition-transform hover:scale-125"
                      />
                      {hasEvent && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={2}
                          fill="#DC2626"
                        />
                      )}
                    </g>
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 px-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
              Dots with red markers indicate legal filings or asset forfeiture orders
            </span>
            <span className="font-semibold uppercase tracking-wider text-[9px] opacity-70">
              Interactive • Tap/Hover any year
            </span>
          </div>
        </div>

        {/* Selected Year Detail Callout (if tapped or clicked) */}
        {selectedPoint && (
          <div className="p-4 bg-muted/40 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-bold">
                  Year {selectedPoint.year} Focus
                </Badge>
                <span className="text-sm font-black text-primary">
                  Score: {selectedPoint.score.toFixed(1)} pts
                </span>
                {selectedPoint.delta > 0 && (
                  <Badge className="bg-red-600 text-white font-bold text-[10px]">
                    +{selectedPoint.delta.toFixed(1)} spike
                  </Badge>
                )}
              </div>
              {selectedPoint.events.length > 0 ? (
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Recorded:</strong> {selectedPoint.events.join('; ')}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  No new legal inquiries registered in {selectedPoint.year}. Prior record sustained.
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] uppercase font-bold h-7 self-end sm:self-center"
              onClick={() => setSelectedPoint(null)}
            >
              Close
            </Button>
          </div>
        )}

        {/* Chronological Milestones Log */}
        {inflectionEvents.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-accent" />
                Key Record Inflection Milestones ({inflectionEvents.length})
              </h4>
              <span className="text-[10px] text-muted-foreground">Chronological audit checkpoints</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inflectionEvents.map((pt, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-primary text-sm">{pt.year}</span>
                      {pt.delta > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                          +{pt.delta.toFixed(1)} pts
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        (Total: {pt.score.toFixed(1)})
                      </span>
                    </div>

                    {pt.events.length > 0 ? (
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        {pt.events.join('; ')}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-[11px]">
                        Accountability score adjusted based on cumulative filings.
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span 
                      className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${pt.riskColor}18`, color: pt.riskColor }}
                    >
                      {pt.riskTier.split('/')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-100">Clean Longitudinal Record</p>
              <p className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                No judicial indictments or asset recovery judgments are recorded across the tracked service timeline.
              </p>
            </div>
          </div>
        )}

        {/* Methodology Footer */}
        <div className="p-3.5 bg-muted/30 rounded-xl border border-dashed flex items-start gap-2.5 text-[11px] text-muted-foreground">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Trend Calculation Standard:</strong> Scores are plotted retrospectively using statutory milestone dates. Convictions (+8), Charges (+4), Investigations (+2), Restitution recoveries (log10(NGN Restitution) × 5), and detentions are credited to the specific legal calendar year they occurred.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
