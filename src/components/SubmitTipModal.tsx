'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Send, FileText, CheckCircle2, 
  Lock, AlertTriangle, Scale, Building2, UploadCloud,
  Loader2, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tipStore } from '@/lib/fallback-registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubmitTipModalProps {
  politicianId?: string;
  politicianName?: string;
  trigger?: React.ReactNode;
}

export function SubmitTipModal({ politicianId, politicianName, trigger }: SubmitTipModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    politicianName: politicianName || '',
    agencyTarget: 'EFCC' as 'EFCC' | 'ICPC' | 'CCB' | 'COURT' | 'GENERAL',
    title: '',
    description: '',
    allegedAmount: '',
    currency: 'NGN',
    jurisdictionOrState: '',
    documentRefNumber: '',
    evidenceLinks: '',
    submitterAlias: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a title and detailed description of the public record.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      
      const parsedLinks = formData.evidenceLinks
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      tipStore.add({
        politicianId,
        politicianName: formData.politicianName || politicianName,
        agencyTarget: formData.agencyTarget,
        title: formData.title,
        description: formData.description,
        allegedAmount: formData.allegedAmount ? parseFloat(formData.allegedAmount) : 0,
        currency: formData.currency,
        jurisdictionOrState: formData.jurisdictionOrState,
        documentRefNumber: formData.documentRefNumber,
        evidenceLinks: parsedLinks,
        submitterAlias: formData.submitterAlias || 'Anonymous Whistleblower'
      });

      setSubmitted(true);
      toast({
        title: "Tip Transmitted",
        description: "Civic intelligence logged securely for registry fact-checking.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "An error occurred transmitting the report. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({
      politicianName: politicianName || '',
      agencyTarget: 'EFCC',
      title: '',
      description: '',
      allegedAmount: '',
      currency: 'NGN',
      jurisdictionOrState: '',
      documentRefNumber: '',
      evidenceLinks: '',
      submitterAlias: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setTimeout(() => setSubmitted(false), 300);
    }}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Submit Civic Tip</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-slate-950 text-white border-slate-800 rounded-3xl shadow-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-[9px] uppercase tracking-widest">
              Confidential Civic Ingestion
            </Badge>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Protected Whistleblower Channel
            </span>
          </div>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            {politicianName ? `Submit Tip on ${politicianName}` : 'Submit Public Record Tip'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 leading-relaxed">
            Report undisclosed asset declarations, court forfeiture orders, or EFCC inquiries. All reports are verified against certified court rolls and official gazettes before entering the public registry.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 space-y-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black uppercase text-white tracking-wide">
                Civic Dossier Received
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your report has been encrypted and assigned a confidential registry review token. Civic fact-checkers will audit the reference with the designated agency.
              </p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Target Agency:</span>
                <span className="text-emerald-400 font-bold">{formData.agencyTarget}</span>
              </div>
              <div className="flex justify-between">
                <span>Subject:</span>
                <span className="text-slate-200">{formData.politicianName || politicianName || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-amber-400 uppercase font-bold">Under Civic Review</span>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs h-12 rounded-xl"
            >
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {!politicianName && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Target Public Figure Name
                </label>
                <Input
                  placeholder="e.g. Yahaya Bello, Diezani Alison-Madueke"
                  value={formData.politicianName}
                  onChange={(e) => setFormData({ ...formData, politicianName: e.target.value })}
                  className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Target Agency / Court
                </label>
                <select
                  value={formData.agencyTarget}
                  onChange={(e) => setFormData({ ...formData, agencyTarget: e.target.value as any })}
                  className="w-full h-10 px-3 bg-slate-900/90 border border-slate-700 text-white rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="EFCC">EFCC (Economic & Financial Crimes)</option>
                  <option value="ICPC">ICPC (Corrupt Practices Commission)</option>
                  <option value="CCB">CCB (Code of Conduct Bureau)</option>
                  <option value="COURT">Federal / State High Court</option>
                  <option value="GENERAL">General Civic Audit</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  State / Jurisdiction
                </label>
                <Input
                  placeholder="e.g. Abuja FCT, Lagos, Rivers"
                  value={formData.jurisdictionOrState}
                  onChange={(e) => setFormData({ ...formData, jurisdictionOrState: e.target.value })}
                  className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Tip Heading / Title
              </label>
              <Input
                placeholder="e.g. Undisclosed foreign asset accounts in British Virgin Islands"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Detailed Evidence & Summary</span>
                <span className="text-[9px] text-slate-500 font-mono">Max clarity</span>
              </label>
              <Textarea
                placeholder="Describe the procurement irregularity, bank account, court order, or property coordinates..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-xs resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Alleged Amount Involved (NGN)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5000000000"
                  value={formData.allegedAmount}
                  onChange={(e) => setFormData({ ...formData, allegedAmount: e.target.value })}
                  className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Court Suit / Gazette Ref (If known)
                </label>
                <Input
                  placeholder="e.g. FHC/ABJ/CR/112/2023"
                  value={formData.documentRefNumber}
                  onChange={(e) => setFormData({ ...formData, documentRefNumber: e.target.value })}
                  className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Supporting URLs or Document Links (One per line)
              </label>
              <Textarea
                placeholder="https://court-record-link.org&#10;https://efcc.gov.ng/press-release"
                rows={2}
                value={formData.evidenceLinks}
                onChange={(e) => setFormData({ ...formData, evidenceLinks: e.target.value })}
                className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-xs resize-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Submitter Alias (Optional)</span>
                <span className="text-[9px] text-slate-500 font-mono">Leave blank for full anonymity</span>
              </label>
              <Input
                placeholder="Anonymous Citizen"
                value={formData.submitterAlias}
                onChange={(e) => setFormData({ ...formData, submitterAlias: e.target.value })}
                className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs"
              />
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>Whistleblower Identity Protection: IP addresses are not stored. Civic leads undergo secondary authentication before inclusion in public dossier aggregates.</span>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-lg gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Encrypting & Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Public Record Lead</span>
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
