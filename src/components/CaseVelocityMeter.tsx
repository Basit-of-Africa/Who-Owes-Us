'use client';

import React, { useState } from 'react';
import { CaseRecord } from '@/lib/types';
import { 
  Clock, AlertTriangle, Scale, ShieldAlert, 
  ChevronDown, ChevronUp, CheckCircle2, 
  Gavel, Hourglass, Landmark
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CaseVelocityMeterProps {
  caseRecord: CaseRecord;
  className?: string;
  compact?: boolean;
}

export function CaseVelocityMeter({ caseRecord, className = "", compact = false }: CaseVelocityMeterProps) {
  const [expanded, setExpanded] = useState(false);

  const startDate = new Date(caseRecord.caseStartDate);
  const isConcluded = caseRecord.status === 'convicted' || caseRecord.status === 'dismissed';
  const endDate = caseRecord.caseEndDate ? new Date(caseRecord.caseEndDate) : new Date();

  // Elapsed days calculation
  const diffTime = Math.max(0, endDate.getTime() - startDate.getTime());
  const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const elapsedYears = (elapsedDays / 365.25).toFixed(1);

  // Categorize delay severity
  let severity: 'low' | 'medium' | 'prolonged' | 'chronic' = 'low';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  let statusText = 'Normal Litigation Velocity';

  if (isConcluded) {
    statusText = `Concluded after ${elapsedDays.toLocaleString()} days (${elapsedYears} yrs)`;
    badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  } else if (elapsedDays >= 2500) {
    severity = 'chronic';
    statusText = 'Chronic Judicial Gridlock';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-300';
  } else if (elapsedDays >= 1000) {
    severity = 'prolonged';
    statusText = 'Prolonged Trial Alert';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-300';
  } else if (elapsedDays >= 365) {
    severity = 'medium';
    statusText = 'Extended Case Duration';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-300';
  } else {
    statusText = 'Active / Recent Inquiry';
  }

  // ACJA (Administration of Criminal Justice Act) benchmark in Nigeria is 180 days for substantive criminal trials
  const acjaBenchmarkDays = 180;
  const benchmarkRatio = Math.min(100, Math.round((elapsedDays / 3650) * 100)); // normalized against 10 years max

  const stages = [
    { label: 'Charge Filing', complete: true, active: false },
    { label: 'Pleas & Bail', complete: elapsedDays > 30, active: elapsedDays <= 30 },
    { label: 'Interlocutory Writs', complete: elapsedDays > 365, active: elapsedDays > 30 && elapsedDays <= 365 },
    { label: 'Substantive Trial', complete: elapsedDays > 1000 || isConcluded, active: elapsedDays > 365 && !isConcluded },
    { label: 'Judgment / Closure', complete: isConcluded, active: !isConcluded && elapsedDays >= 1000 },
  ];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-[10px] font-mono", className)}>
        <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5", badgeColor)}>
          <Clock className="w-3 h-3 mr-1" />
          {elapsedDays.toLocaleString()}d ({elapsedYears}y)
        </Badge>
        <span className="text-muted-foreground text-[10px] font-semibold">{statusText}</span>
      </div>
    );
  }

  return (
    <div className={cn("mt-4 p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-900/30 transition-all", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-lg",
            severity === 'chronic' ? "bg-rose-100 text-rose-700" :
            severity === 'prolonged' ? "bg-amber-100 text-amber-700" :
            "bg-blue-100 text-blue-700"
          )}>
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Case Velocity & Delay Meter
              </span>
              <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0", badgeColor)}>
                {severity === 'chronic' || severity === 'prolonged' ? (
                  <AlertTriangle className="w-2.5 h-2.5 mr-1 inline" />
                ) : (
                  <Hourglass className="w-2.5 h-2.5 mr-1 inline" />
                )}
                {statusText}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Initiated: {caseRecord.caseStartDate} {isConcluded ? `• Resolved: ${caseRecord.caseEndDate || 'Documented'}` : '• Active Trial'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-black text-primary font-mono">
            {elapsedDays.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">days</span>
          </div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase">
            ~{elapsedYears} years in judicial system
          </p>
        </div>
      </div>

      {/* Visual Delay Progress Gauge */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Speedy Trial (ACJA 180d)</span>
          <span>1,000d Threshold</span>
          <span>3,650d+ (10y Gridlock)</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-700",
              severity === 'chronic' ? "bg-rose-500" :
              severity === 'prolonged' ? "bg-amber-500" :
              severity === 'medium' ? "bg-blue-500" :
              "bg-emerald-500"
            )}
            style={{ width: `${Math.max(8, benchmarkRatio)}%` }}
          />
        </div>
      </div>

      {/* Procedural Stage Tracker */}
      <div className="grid grid-cols-5 gap-1 py-2 border-t border-slate-200/80 dark:border-slate-800 text-center">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1">
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black border",
              stage.complete ? "bg-emerald-600 border-emerald-600 text-white" :
              stage.active ? "bg-accent border-accent text-white animate-pulse" :
              "bg-slate-100 border-slate-300 text-slate-400"
            )}>
              {stage.complete ? "✓" : idx + 1}
            </div>
            <span className={cn(
              "text-[8px] font-bold uppercase leading-tight tracking-tight",
              stage.complete ? "text-primary" :
              stage.active ? "text-accent font-black" :
              "text-muted-foreground/60"
            )}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      {/* Judicial Delay Details Toggle */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
        >
          <span>{expanded ? 'Hide Judicial Context' : 'Examine Delay Factors & Suit Records'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {caseRecord.courtJurisdiction && (
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <Landmark className="w-3 h-3 text-primary/60" />
            {caseRecord.courtJurisdiction}
          </span>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-dashed space-y-2 text-xs text-muted-foreground bg-white/80 dark:bg-slate-900/60 p-3 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <strong className="text-primary font-bold">Court Suit Number:</strong>{' '}
              <span className="font-mono">{caseRecord.suitNumber || 'Suit No. on Gazette File'}</span>
            </div>
            <div>
              <strong className="text-primary font-bold">Estimated Adjournments:</strong>{' '}
              <span>{caseRecord.adjournmentsCount || Math.max(4, Math.round(elapsedDays / 120))} court sittings</span>
            </div>
            {caseRecord.presidingJudge && (
              <div>
                <strong className="text-primary font-bold">Presiding Judge:</strong>{' '}
                <span>{caseRecord.presidingJudge}</span>
              </div>
            )}
            <div>
              <strong className="text-primary font-bold">ACJA Standard Variance:</strong>{' '}
              <span className={severity === 'chronic' || severity === 'prolonged' ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                +{Math.max(0, elapsedDays - acjaBenchmarkDays).toLocaleString()} days beyond statutory target
              </span>
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-muted-foreground/90 border-t pt-2 mt-2">
            <strong>Systemic Delay Factor:</strong> In Nigerian financial crime litigation, interlocutory challenges to court jurisdiction and senior counsel elevation frequently freeze substantive hearings at the Federal High Court while interlocutory appeals pend before the Supreme Court.
          </p>
        </div>
      )}
    </div>
  );
}
