'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, Download, Share2, Check, FileText, 
  ShieldCheck, Landmark, Scale, AlertTriangle, 
  Calendar, MapPin, Award, ExternalLink, X, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Politician } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SourceTypeBadge } from '@/components/SourceTypeBadge';

interface DossierExportModalProps {
  politician: Politician;
}

export function DossierExportModal({ politician }: DossierExportModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Generate QR Code for digital verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liveUrl = `${window.location.origin}/politician/${politician.id}`;
      QRCode.toDataURL(liveUrl, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
    }
  }, [politician.id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyJournalistBrief = () => {
    const casesSummary = (politician.cases || []).map((c, i) => 
      `${i + 1}. ${c.title} (Suit: ${c.suitNumber || 'N/A'}, Status: ${c.status.toUpperCase()}, Amount: ${c.currency} ${c.amountInvolved.toLocaleString()})`
    ).join('\n');

    const totalForfeitureFormatted = politician.totalForfeiture && politician.totalForfeiture > 0 
      ? `₦${(politician.totalForfeiture / 1000000000).toFixed(1)} Billion` 
      : '₦0 (Zero Restitution)';

    const brief = `
CIVIC AUDIT DOSSIER: ${politician.fullName.toUpperCase()}
--------------------------------------------------
Affiliation: ${politician.primaryParty} | State: ${politician.stateOfOrigin || 'Federal'} | Office: ${politician.currentOfficeType || 'Public Figure'}
Accountability Score: ${politician.accountabilityScore || 0}/100
Total Restitution / Forfeitures: ${totalForfeitureFormatted}
Electoral Candidate Status: ${politician.candidateFor || 'Historical Public Record'}

VERIFIED JUDICIAL CASES:
${casesSummary || 'Zero open criminal cases on public record.'}

VERIFICATION SOURCE:
National Public Asset & Civic Accountability Archive (Verified Gazette & High Court Records)
Full live digital audit sheet: ${typeof window !== 'undefined' ? window.location.origin : ''}/politician/${politician.id}
`.trim();

    navigator.clipboard.writeText(brief);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    toast({
      title: "Journalist Press Brief Copied",
      description: "Text formatted for broadcast, news briefs, and debate briefs.",
    });
  };

  const totalBillion = politician.totalForfeiture ? (politician.totalForfeiture / 1000000000).toFixed(1) : '0';
  const isClean = (!politician.cases || politician.cases.length === 0) && (!politician.totalForfeiture || politician.totalForfeiture === 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="h-9 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 border-primary/20 hover:bg-primary/5 text-primary shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline">Export Dossier (PDF)</span>
          <span className="sm:hidden">Dossier</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-50 p-0 rounded-3xl border-none">
        {/* Sticky top action bar for modal */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="font-black uppercase text-xs tracking-wider text-primary">
              Official Printable Audit Sheet
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJournalistBrief}
              className="h-8 px-3 font-bold text-xs uppercase tracking-wider border-primary/20"
            >
              {copiedText ? <Check className="w-3 h-3 text-emerald-600 mr-1" /> : <Copy className="w-3 h-3 text-accent mr-1" />}
              <span>{copiedText ? 'Copied' : 'Copy Press Brief'}</span>
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 px-4 font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-accent" />
              <span>Print / Save as PDF</span>
            </Button>
          </div>
        </div>

        {/* Printable Document Paper Sheet */}
        <div className="p-6 md:p-10" ref={printRef}>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 text-slate-900 font-sans">
            
            {/* Official Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-accent inline-block rounded-full"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                    Federal Republic of Nigeria • Civic Integrity Archive
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
                  National Public Official Audit Sheet
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Verified gazette records, court rulings, and public restitution disclosures.
                </p>
              </div>

              {/* Digital Verification QR & Stamp */}
              <div className="flex items-center gap-4 border p-3 rounded-xl bg-slate-50 shrink-0">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Digital Verification QR" 
                    className="w-16 h-16 rounded border bg-white"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded animate-pulse" />
                )}
                <div className="text-[10px] space-y-0.5">
                  <p className="font-black uppercase text-slate-900">Digital Audit QR</p>
                  <p className="text-slate-500">Scan to inspect</p>
                  <p className="text-slate-500">live court records</p>
                  <Badge className="bg-emerald-600 text-white border-none text-[8px] font-black uppercase px-1.5 py-0.5">
                    Verified Authentic
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-200 mb-3 shadow-inner">
                  {politician.profileImageUrl ? (
                    <img 
                      src={politician.profileImageUrl} 
                      alt={politician.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-400">
                      NA
                    </div>
                  )}
                </div>
                <span className="font-black text-xs uppercase px-2.5 py-1 bg-slate-900 text-white rounded-md">
                  {politician.primaryParty}
                </span>
              </div>

              <div className="md:col-span-3 space-y-3">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                    {politician.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold mt-1">
                    {politician.stateOfOrigin && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        State of Origin: <strong>{politician.stateOfOrigin}</strong>
                      </span>
                    )}
                    {politician.candidateFor && (
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-accent" />
                        Candidate Status: <strong>{politician.candidateFor}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {politician.bio}
                </p>

                {/* Score Card Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Accountability Score
                    </p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">
                      {politician.accountabilityScore || 0}<span className="text-xs text-slate-400 font-normal">/100</span>
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Total Restitution
                    </p>
                    <p className="text-xl font-black text-accent mt-0.5">
                      {politician.totalForfeiture && politician.totalForfeiture > 0 ? (
                        `₦${totalBillion}B`
                      ) : (
                        <span className="text-emerald-700 text-sm font-black">₦0 (Clean)</span>
                      )}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Verified Cases
                    </p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">
                      {(politician.cases || []).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hall of Integrity Notification if Clean */}
            {isClean && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 mb-8 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-black text-sm uppercase text-emerald-950">
                    Official Hall of Integrity Clearance
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    National archival audit verifies <strong>zero criminal indictments</strong>, zero asset restitution judgments, and no pending EFCC or ICPC charges throughout the recorded public tenure of this official.
                  </p>
                </div>
              </div>
            )}

            {/* Verified Judicial Cases Section */}
            {(politician.cases || []).length > 0 && (
              <div className="mb-8 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-accent" />
                    Verified Judicial Proceedings & Charges
                  </h3>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Section 15(5) Constitution Compliance
                  </span>
                </div>

                <div className="divide-y border rounded-xl overflow-hidden">
                  {(politician.cases || []).map((c, idx) => (
                    <div key={idx} className="p-4 bg-white text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-slate-900 uppercase">
                            {c.title}
                          </span>
                          <SourceTypeBadge sourceType={c.sourceType} caseRecord={c} size="sm" />
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-300">
                          {c.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500 pt-1">
                        {c.suitNumber && <span>Suit No: <strong>{c.suitNumber}</strong></span>}
                        {c.courtJurisdiction && <span>Court: <strong>{c.courtJurisdiction}</strong></span>}
                        <span>Amount Involved: <strong>{c.currency} {c.amountInvolved.toLocaleString()}</strong></span>
                        {c.adjournmentsCount !== undefined && <span>Adjournments: <strong>{c.adjournmentsCount}</strong></span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Notice & Statutory Declaration */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[9px] text-slate-500 leading-relaxed space-y-1">
              <p className="font-bold uppercase text-slate-700">
                Statutory Civic Notice & Editorial Integrity:
              </p>
              <p>
                Compiled in strict compliance with Section 22 and Section 39 of the Constitution of the Federal Republic of Nigeria (1999 as amended) and the Freedom of Information (FOI) Act 2011. All figures and case registries are derived from certified court rulings, official gazettes, and public administrative recovery releases.
              </p>
            </div>

            {/* Dossier Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
              <span>National Civic Audit Dossier #{politician.id}</span>
              <span>Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>Civic Registry Phase 2 Certified</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
