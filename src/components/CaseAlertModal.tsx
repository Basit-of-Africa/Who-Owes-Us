'use client';

import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, ShieldAlert, Sparkles, 
  Send, Mail, Phone, Calendar, ArrowRight, Loader2, X
} from 'lucide-react';
import { Politician } from '@/lib/types';
import { alertStore } from '@/lib/fallback-registry';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface CaseAlertModalProps {
  politician: Politician;
  trigger?: React.ReactNode;
}

export function CaseAlertModal({ politician, trigger }: CaseAlertModalProps) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState('');
  const [frequency, setFrequency] = useState<'immediate' | 'weekly_digest'>('immediate');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      toast({
        variant: "destructive",
        title: "Contact Info Required",
        description: "Please enter your email or WhatsApp number to receive court notifications.",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate real subscription action
      await new Promise((resolve) => setTimeout(resolve, 600));
      alertStore.subscribeAlert(politician.id, politician.fullName, contact.trim(), frequency);
      setSuccess(true);
      toast({
        title: "Case Tracker Activated",
        description: `You will receive verified trial and court judgment alerts for ${politician.fullName}.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: "Could not activate notifications. Please retry.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setContact('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setTimeout(() => setSuccess(false), 300);
    }}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 border-accent/40 text-accent hover:bg-accent/10 transition-all shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Track Trial Alerts</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md p-6 bg-slate-950 text-white border-slate-800 rounded-3xl shadow-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent/20 text-accent border border-accent/30 font-mono text-[9px] uppercase tracking-widest">
              Live Trial Dispatch
            </Badge>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Real-Time Adjournment Monitor
            </span>
          </div>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Track Legal Updates
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 leading-relaxed">
            Receive automated dispatch notifications whenever a new suit adjournment, EFCC charge, or High Court asset forfeiture ruling is filed against <strong className="text-white font-bold">{politician.fullName}</strong>.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black uppercase text-white tracking-wide">
                Alerts Configured
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Notifications for <span className="text-accent font-bold">{politician.fullName}</span> will be dispatched to <span className="font-mono text-white underline">{contact}</span>.
              </p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-left text-[11px] space-y-1.5 font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Dispatch Mode:</span>
                <span className="text-slate-200 uppercase font-bold">{frequency.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Official:</span>
                <span className="text-slate-200">{politician.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Cases Tracked:</span>
                <span className="text-accent font-bold">{politician.cases?.length || 0} Records</span>
              </div>
            </div>

            <Button
              onClick={handleReset}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs h-11 rounded-xl"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Contact Destination</span>
                <span className="text-[9px] text-slate-500 font-mono">Email or WhatsApp</span>
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. advocate@civicwatch.ng or +234 803 000 0000"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-11 text-xs focus-visible:ring-accent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Dispatch Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFrequency('immediate')}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    frequency === 'immediate'
                      ? 'bg-accent/15 border-accent text-white font-bold'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-black uppercase text-[10px] text-accent tracking-wider">Instant Notice</p>
                  <p className="text-[10px] opacity-75 mt-0.5">As rulings occur</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('weekly_digest')}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    frequency === 'weekly_digest'
                      ? 'bg-accent/15 border-accent text-white font-bold'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-black uppercase text-[10px] text-accent tracking-wider">Weekly Digest</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Summary every Friday</p>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 leading-normal flex items-start gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>We never spam. Notifications are strictly triggered by court calendar entries, gazetted filings, or EFCC official press bulletins.</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-lg gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring Dispatch...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Activate Case Alerts</span>
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
