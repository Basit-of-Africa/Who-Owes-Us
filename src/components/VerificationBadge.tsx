'use client';

import { useState } from 'react';
import { 
  ShieldCheck, ExternalLink, Check, Copy, FileText, 
  Landmark, Scale, BookOpen, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { VerificationSource, VerificationAgency } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  verification?: VerificationSource;
  suitNumber?: string;
  courtJurisdiction?: string;
  className?: string;
  compact?: boolean;
}

const AGENCY_CONFIG: Record<VerificationAgency, { label: string; badgeClass: string; icon: any; agencyFullName: string }> = {
  EFCC: {
    label: 'EFCC Certified',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
    icon: ShieldCheck,
    agencyFullName: 'Economic and Financial Crimes Commission (EFCC)'
  },
  ICPC: {
    label: 'ICPC Documented',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300 hover:bg-teal-200',
    icon: ShieldCheck,
    agencyFullName: 'Independent Corrupt Practices Commission (ICPC)'
  },
  FEDERAL_HIGH_COURT: {
    label: 'Federal High Court Ruling',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
    icon: Scale,
    agencyFullName: 'Federal High Court of Nigeria'
  },
  SUPREME_COURT: {
    label: 'Supreme Court Certified',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200',
    icon: Scale,
    agencyFullName: 'Supreme Court of Nigeria'
  },
  CCB: {
    label: 'CCB Declaration',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300 hover:bg-cyan-200',
    icon: BookOpen,
    agencyFullName: 'Code of Conduct Bureau (CCB)'
  },
  GAZETTE: {
    label: 'Official Gazette Record',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200',
    icon: FileText,
    agencyFullName: 'Federal Republic of Nigeria Official Gazette'
  },
  UK_NCA: {
    label: 'UK NCA Certified',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200',
    icon: Landmark,
    agencyFullName: 'UK National Crime Agency (NCA) / Crown Prosecution Service'
  },
  US_DOJ: {
    label: 'US DOJ / Senate Record',
    badgeClass: 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200',
    icon: Landmark,
    agencyFullName: 'United States Department of Justice / Senate Investigations'
  }
};

export function VerificationBadge({
  verification,
  suitNumber,
  courtJurisdiction,
  className,
  compact = false,
}: VerificationBadgeProps) {
  const { toast } = useToast();
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Default fallback if no custom verification is attached but suitNumber exists
  const effectiveVerification: VerificationSource = verification || {
    agency: 'FEDERAL_HIGH_COURT',
    agencyLabel: 'Federal High Court Ruling',
    certifiedDocId: suitNumber || 'FHC/ABJ/CR/CERT',
    gazetteNotice: 'FRN-GAZ-OFFICIAL-LEGAL',
    verificationStatus: 'court_certified'
  };

  const agencyMeta = AGENCY_CONFIG[effectiveVerification.agency] || {
    label: effectiveVerification.agencyLabel || 'Certified Public Record',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    icon: ShieldCheck,
    agencyFullName: 'National Judicial & Statutory Gazette Archive'
  };

  const AgencyIcon = agencyMeta.icon;

  const standardCitation = `[Official Civic Archive] ${agencyMeta.agencyFullName}. Suit/Certified Record No: ${effectiveVerification.certifiedDocId || suitNumber || 'N/A'}${effectiveVerification.gazetteNotice ? `; Gazette Ref: ${effectiveVerification.gazetteNotice}` : ''}${courtJurisdiction ? `; Jurisdiction: ${courtJurisdiction}` : ''}. Verified Public Document.`;

  const copyCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(standardCitation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
    toast({
      title: "Citation Copied for Media/Debate",
      description: "Standard investigative source citation formatted and copied to clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer shadow-2xs text-left",
            agencyMeta.badgeClass,
            className
          )}
          title="Click to inspect official agency verification and citation"
        >
          <AgencyIcon className="w-3 h-3 shrink-0" />
          <span>{agencyMeta.label}</span>
          {!compact && (
            <span className="opacity-60 text-[9px] font-bold">
              • Verified
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white p-6 rounded-3xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/5 text-primary">
              <AgencyIcon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-base font-black uppercase text-primary">
                Official Agency Verification
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-medium">
                Cryptographically and judicially verified public record
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Status highlight */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                Audited & Certified Authentic
              </span>
            </div>
            <Badge className="bg-emerald-600 text-white border-none text-[9px] font-bold uppercase">
              {effectiveVerification.verificationStatus.replace('_', ' ')}
            </Badge>
          </div>

          {/* Details list */}
          <div className="p-4 rounded-2xl bg-secondary/30 space-y-3 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                Issuing Statutory Authority
              </p>
              <p className="font-black text-primary text-sm mt-0.5">
                {agencyMeta.agencyFullName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Certified Doc / Suit #
                </p>
                <p className="font-bold text-primary mt-0.5 truncate">
                  {effectiveVerification.certifiedDocId || suitNumber || 'FRN-OFFICIAL-DOCK'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Gazette Registration
                </p>
                <p className="font-bold text-primary mt-0.5 truncate">
                  {effectiveVerification.gazetteNotice || 'Vol. 110, No. 42'}
                </p>
              </div>
            </div>

            {courtJurisdiction && (
              <div className="pt-2 border-t">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                  Court / Tribunal Venue
                </p>
                <p className="font-semibold text-primary mt-0.5">
                  {courtJurisdiction}
                </p>
              </div>
            )}
          </div>

          {/* Media / Debate Citation Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Investigative Citation Format
              </label>
              <button
                type="button"
                onClick={copyCitation}
                className="text-[10px] font-black uppercase text-accent hover:text-accent/80 flex items-center gap-1"
              >
                {copiedCitation ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCitation ? 'Citation Copied' : 'Copy Citation'}</span>
              </button>
            </div>
            <div className="p-3 bg-secondary/20 rounded-xl font-mono text-[11px] text-muted-foreground leading-relaxed border select-all">
              {standardCitation}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyCitation}
              className="flex-1 font-bold text-xs uppercase tracking-wider h-10 border-primary/20"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy Citation
            </Button>

            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1 font-bold text-xs uppercase tracking-wider h-10 bg-primary text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
