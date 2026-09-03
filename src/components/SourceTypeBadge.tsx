'use client';

import React from 'react';
import { 
  ShieldCheck, Scale, Landmark, FileText, 
  BookOpen, Globe, Newspaper, CheckCircle2 
} from 'lucide-react';
import { CaseRecord, CaseSourceType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SourceTypeBadgeProps {
  sourceType?: CaseSourceType | string;
  caseRecord?: Partial<CaseRecord>;
  className?: string;
  showBrackets?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

interface SourceConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeClass: string;
  description: string;
}

const SOURCE_MAP: Record<string, SourceConfig> = {
  efcc: {
    key: 'EFCC Certified',
    label: 'EFCC Certified',
    icon: ShieldCheck,
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:border-amber-700/50 dark:text-amber-400',
    description: 'Certified by the Economic and Financial Crimes Commission public charge & arraignment rolls.'
  },
  court_judgment: {
    key: 'Court Judgment',
    label: 'Court Judgment',
    icon: Scale,
    badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-300 dark:border-blue-700/50 dark:text-blue-400',
    description: 'Statutory ruling or certified order issued by the Federal High Court or State High Court bench.'
  },
  supreme_court: {
    key: 'Supreme Court Ruling',
    label: 'Supreme Court Ruling',
    icon: Landmark,
    badgeClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-300 dark:border-emerald-700/50 dark:text-emerald-400',
    description: 'Final appellate judgment certified in the Nigerian Law Reports by the Supreme Court of Nigeria.'
  },
  icpc: {
    key: 'ICPC Documented',
    label: 'ICPC Documented',
    icon: CheckCircle2,
    badgeClass: 'bg-teal-500/10 text-teal-800 border-teal-300 dark:border-teal-700/50 dark:text-teal-400',
    description: 'Verified public corruption registry maintained by the Independent Corrupt Practices Commission.'
  },
  gazette: {
    key: 'Official Gazette',
    label: 'Official Gazette',
    icon: FileText,
    badgeClass: 'bg-purple-500/10 text-purple-800 border-purple-300 dark:border-purple-700/50 dark:text-purple-400',
    description: 'Published in the official gazette notices and statutory releases of the Federal Republic of Nigeria.'
  },
  ccb: {
    key: 'CCB Declaration',
    label: 'CCB Declaration',
    icon: BookOpen,
    badgeClass: 'bg-cyan-500/10 text-cyan-800 border-cyan-300 dark:border-cyan-700/50 dark:text-cyan-400',
    description: 'Asset declaration or Code of Conduct Tribunal verification record.'
  },
  international: {
    key: 'International Inquiry',
    label: 'International Inquiry',
    icon: Globe,
    badgeClass: 'bg-slate-500/10 text-slate-800 border-slate-300 dark:border-slate-700/50 dark:text-slate-300',
    description: 'Documented in international mutual legal assistance, US DOJ, UK NCA, or foreign court proceedings.'
  },
  investigative: {
    key: 'Investigative Report',
    label: 'Investigative Report',
    icon: Newspaper,
    badgeClass: 'bg-neutral-500/10 text-neutral-800 border-neutral-300 dark:border-neutral-700/50 dark:text-neutral-300',
    description: 'Peer-reviewed civic investigation based on public procurement and FOI records.'
  }
};

/**
 * Automates resolution of sourceType based on explicit sourceType field,
 * or automatic inference from verification agency, suit number, or case status.
 */
export function resolveSourceType(
  explicitSourceType?: string,
  caseRecord?: Partial<CaseRecord>
): SourceConfig {
  const norm = (explicitSourceType || '').toLowerCase().trim();

  // 1. Check direct matches
  if (norm.includes('efcc')) return SOURCE_MAP.efcc;
  if (norm.includes('supreme')) return SOURCE_MAP.supreme_court;
  if (norm.includes('court') || norm.includes('judgment') || norm.includes('ruling') || norm.includes('fhc') || norm.includes('tribunal')) {
    return SOURCE_MAP.court_judgment;
  }
  if (norm.includes('icpc')) return SOURCE_MAP.icpc;
  if (norm.includes('gazette')) return SOURCE_MAP.gazette;
  if (norm.includes('ccb') || norm.includes('conduct')) return SOURCE_MAP.ccb;
  if (norm.includes('international') || norm.includes('us') || norm.includes('uk') || norm.includes('nca') || norm.includes('senate') || norm.includes('doj')) {
    return SOURCE_MAP.international;
  }
  if (norm.includes('investigative') || norm.includes('audit') || norm.includes('report') || norm.includes('media')) {
    return SOURCE_MAP.investigative;
  }

  // 2. Automated inference from caseRecord properties
  if (caseRecord) {
    const agency = caseRecord.verification?.agency;
    if (agency === 'EFCC') return SOURCE_MAP.efcc;
    if (agency === 'SUPREME_COURT') return SOURCE_MAP.supreme_court;
    if (agency === 'FEDERAL_HIGH_COURT') return SOURCE_MAP.court_judgment;
    if (agency === 'ICPC') return SOURCE_MAP.icpc;
    if (agency === 'CCB') return SOURCE_MAP.ccb;
    if (agency === 'GAZETTE') return SOURCE_MAP.gazette;
    if (agency === 'UK_NCA' || agency === 'US_DOJ') return SOURCE_MAP.international;

    // Check suit number patterns
    const suit = (caseRecord.suitNumber || '').toUpperCase();
    if (suit.startsWith('SC/')) return SOURCE_MAP.supreme_court;
    if (suit.includes('EFCC')) return SOURCE_MAP.efcc;
    if (suit.includes('FHC/') || suit.includes('/HC/') || suit.includes('CR/') || suit.includes('CS/')) {
      return SOURCE_MAP.court_judgment;
    }
    if (caseRecord.status === 'convicted' || caseRecord.status === 'dismissed') {
      return SOURCE_MAP.court_judgment;
    }
  }

  // Fallback default
  return SOURCE_MAP.court_judgment;
}

export function SourceTypeBadge({
  sourceType,
  caseRecord,
  className,
  showBrackets = true,
  size = 'default'
}: SourceTypeBadgeProps) {
  const config = resolveSourceType(sourceType, caseRecord);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1',
    default: 'text-[10px] px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2'
  }[size];

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    default: 'w-3 h-3',
    lg: 'w-3.5 h-3.5'
  }[size];

  const badgeContent = (
    <span
      className={cn(
        "inline-flex items-center font-black uppercase tracking-wider rounded-md border shadow-2xs font-mono transition-colors",
        config.badgeClass,
        sizeClasses,
        className
      )}
    >
      <Icon className={cn(iconSizes, "shrink-0 opacity-80")} />
      <span>{showBrackets ? `[${config.label}]` : config.label}</span>
    </span>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="cursor-help inline-flex text-left">
            {badgeContent}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs p-3 bg-slate-900 text-slate-100 border-slate-700 shadow-xl rounded-xl">
          <div className="space-y-1">
            <p className="font-bold text-accent uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Icon className="w-3 h-3" />
              Automated Source Verification
            </p>
            <p className="text-[11px] leading-relaxed text-slate-200">
              {config.description}
            </p>
            {caseRecord?.suitNumber && (
              <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 font-mono">
                Ref: {caseRecord.suitNumber}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
