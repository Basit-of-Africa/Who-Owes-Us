'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  X, Scale, Wallet, Loader2, Users, Landmark, Search, 
  CheckCircle2, ShieldCheck, MapPin, Award, Clock, Share2, 
  ExternalLink, Check, Sparkles, FileText, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CaseVelocityMeter } from '@/components/CaseVelocityMeter';
import { SourceTypeBadge } from '@/components/SourceTypeBadge';
import { cn } from '@/lib/utils';
import { Politician } from '@/lib/types';

function CompareContent() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const politiciansQuery = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansQuery);

  // Initialize from query parameters (e.g. ?p1=id1&p2=id2&p3=id3)
  useEffect(() => {
    const p1 = searchParams.get('p1');
    const p2 = searchParams.get('p2');
    const p3 = searchParams.get('p3');
    const initial: string[] = [];
    if (p1 && !initial.includes(p1)) initial.push(p1);
    if (p2 && !initial.includes(p2)) initial.push(p2);
    if (p3 && !initial.includes(p3)) initial.push(p3);
    if (initial.length > 0) {
      setSelectedIds(initial);
    }
  }, [searchParams]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      toast({
        title: "Matrix Full (Max 3)",
        description: "You can compare up to 3 figures simultaneously. Remove one to add another.",
      });
      return prev;
    });
  };

  const filteredOptions = useMemo(() => {
    if (!politicians) return [];
    return [...politicians]
      .filter((p: any) => {
        const nameMatch = (p.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const partyMatch = (p.primaryParty || '').toLowerCase().includes(searchQuery.toLowerCase());
        const stateMatch = (p.stateOfOrigin || '').toLowerCase().includes(searchQuery.toLowerCase());
        const candidateMatch = (p.candidateFor || '').toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || partyMatch || stateMatch || candidateMatch;
      })
      .sort((a, b) => ((b as any).totalForfeiture || 0) - ((a as any).totalForfeiture || 0));
  }, [politicians, searchQuery]);

  const selectedPoliticians = useMemo(() => {
    if (!politicians) return [];
    return selectedIds
      .map(id => politicians.find((p: any) => p.id === id))
      .filter((p): p is any => !!p);
  }, [selectedIds, politicians]);

  // Helper to compute max case delay
  const getMaxCaseDelayDays = (p: any): number => {
    if (!p.cases || p.cases.length === 0) return 0;
    let maxDays = 0;
    const now = new Date().getTime();
    for (const c of p.cases) {
      if (!c.caseStartDate) continue;
      const start = new Date(c.caseStartDate).getTime();
      const end = c.caseEndDate ? new Date(c.caseEndDate).getTime() : now;
      const days = Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
      if (days > maxDays) maxDays = days;
    }
    return maxDays;
  };

  const handleShareMatrix = () => {
    if (selectedIds.length === 0) return;
    const params = new URLSearchParams();
    selectedIds.forEach((id, idx) => params.set(`p${idx + 1}`, id));
    const url = `${window.location.origin}/compare?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast({
      title: "Comparison Link Copied!",
      description: "Direct link to this comparative audit matrix copied to clipboard.",
    });
  };

  // Loading state
  if (loading && (!politicians || politicians.length === 0)) {
    return (
      <div className="container mx-auto px-6 md:px-[50px] py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
          Opening Comparative Audit Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-[50px] py-8 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-none px-4 py-1 font-black uppercase text-[10px] tracking-widest">
              The Ballot Audit
            </Badge>
            <Badge className="bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-wider">
              Side-by-Side Comparison
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter">
            Cross-Audit Candidates
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl text-sm md:text-base leading-relaxed">
            Select up to three figures to scrutinize relative restitution totals, judicial trial gridlock, accountability ratings, and electoral records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              onClick={handleShareMatrix}
              className="h-11 px-4 rounded-xl font-bold uppercase text-xs tracking-wider gap-2 border-primary/20 hover:bg-primary/5 text-primary"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-accent" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Comparison'}</span>
            </Button>
          )}

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search candidate or state..." 
              className="pl-10 h-11 bg-white border-none shadow-sm rounded-xl font-medium text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Selector Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4 border-b border-primary/5 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Candidate Selection ({selectedIds.length}/3 Selected)
            </h3>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-red-500 transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
        
        {/* Horizontal scrollable / grid selection pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredOptions.map((p: any) => {
            const isSelected = selectedIds.includes(p.id);
            const isClean = (!p.cases || p.cases.length === 0) && (!p.totalForfeiture || p.totalForfeiture === 0);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleSelect(p.id)}
                className={cn(
                  "p-3 rounded-2xl text-left transition-all border text-xs flex flex-col justify-between relative group",
                  isSelected 
                    ? "bg-primary text-white border-primary shadow-md ring-2 ring-accent" 
                    : "bg-white hover:border-accent hover:shadow-sm border-slate-200 text-slate-800"
                )}
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className={cn(
                    "font-black text-[9px] uppercase px-1.5 py-0.5 rounded",
                    isSelected ? "bg-accent text-primary" : "bg-secondary text-primary"
                  )}>
                    {p.primaryParty}
                  </span>
                  {isSelected ? (
                    <div className="bg-accent text-primary rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : isClean ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : null}
                </div>

                <div>
                  <p className="font-black uppercase line-clamp-1 leading-snug">
                    {p.fullName}
                  </p>
                  <p className={cn(
                    "text-[10px] font-bold mt-0.5",
                    isSelected ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {p.stateOfOrigin ? `${p.stateOfOrigin} State` : 'Federal'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Comparative Audit Matrix Area */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-primary/10"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent" />
            Cross-Audit Comparative Board
          </span>
        </div>
      </div>

      {selectedPoliticians.length > 0 ? (
        <div className="space-y-8">
          {/* Main Cards Grid */}
          <div className={cn(
            "grid gap-6",
            selectedPoliticians.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
            selectedPoliticians.length === 2 ? "grid-cols-1 md:grid-cols-2" :
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {selectedPoliticians.map((p: any) => {
              const maxDelayDays = getMaxCaseDelayDays(p);
              const isClean = (!p.cases || p.cases.length === 0) && (!p.totalForfeiture || p.totalForfeiture === 0);

              return (
                <Card 
                  key={p.id} 
                  className={cn(
                    "border shadow-lg bg-white rounded-3xl overflow-hidden relative flex flex-col justify-between",
                    isClean && "border-emerald-300 ring-2 ring-emerald-100"
                  )}
                >
                  <div>
                    {/* Header bar */}
                    <div className="relative aspect-[16/9] bg-primary/5 overflow-hidden flex items-center justify-center">
                      <button 
                        onClick={() => toggleSelect(p.id)}
                        title="Remove candidate from comparison"
                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition-colors shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {p.profileImageUrl ? (
                        <img 
                          src={p.profileImageUrl} 
                          alt={p.fullName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Landmark className="w-20 h-20 text-primary opacity-10" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                      
                      <div className="absolute bottom-4 left-5 right-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-accent text-[10px] font-black uppercase tracking-wider">
                            {p.primaryParty}
                          </span>
                          {p.stateOfOrigin && (
                            <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              • <MapPin className="w-3 h-3 inline" /> {p.stateOfOrigin} State
                            </span>
                          )}
                        </div>
                        <h2 className="text-white text-2xl font-black uppercase tracking-tight leading-tight">
                          {p.fullName}
                        </h2>
                      </div>
                    </div>

                    {/* Content Matrix Rows */}
                    <CardContent className="p-6 space-y-6 divide-y divide-primary/5">
                      {/* Metric 1: Accountability Score */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                            Accountability Risk Score
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                            Lower score = Higher transparency
                          </p>
                        </div>
                        <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="text-sm font-black px-3.5 py-1.5" />
                      </div>

                      {/* Metric 2: Restitution & Forfeiture Amount */}
                      <div className="pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                            <Wallet className="w-3.5 h-3.5 text-accent" />
                            Restitution Tied
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                            Court & gazetted orders
                          </p>
                        </div>
                        <span className="text-xl font-black text-accent">
                          {p.totalForfeiture && p.totalForfeiture > 0 ? (
                            `₦${p.totalForfeiture >= 1000000000 
                              ? `${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                              : `${(p.totalForfeiture / 1000000).toFixed(0)}M`}`
                          ) : (
                            <span className="text-emerald-700 text-sm font-black">₦0 (Clean)</span>
                          )}
                        </span>
                      </div>

                      {/* Metric 3: Office & Election Standing */}
                      <div className="pt-4 space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-primary" />
                          Office Classification & Status
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.currentOfficeType && (
                            <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20">
                              {p.currentOfficeType.replace('_', ' ')}
                            </Badge>
                          )}
                          {p.candidateFor ? (
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">
                              Seeking: {p.candidateFor}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                              Historical Figure
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Metric 4: Judicial Trial Velocity */}
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Judicial Velocity
                          </p>
                          <span className="text-xs font-black uppercase">
                            {p.cases && p.cases.length > 0 ? (
                              maxDelayDays >= 2500 ? (
                                <span className="text-red-600 font-bold">Chronic Gridlock ({Math.floor(maxDelayDays / 365)}y)</span>
                              ) : maxDelayDays >= 1000 ? (
                                <span className="text-amber-600 font-bold">Prolonged ({Math.floor(maxDelayDays / 365)}y)</span>
                              ) : (
                                <span className="text-slate-600">Active Trial</span>
                              )
                            ) : (
                              <span className="text-emerald-700 font-bold">0 Pending Delays</span>
                            )}
                          </span>
                        </div>

                        {/* First case velocity meter preview if exists */}
                        {p.cases && p.cases.length > 0 ? (
                          <div className="p-3 bg-secondary/30 rounded-xl space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <p className="text-[11px] font-black text-primary uppercase line-clamp-1">
                                {p.cases[0].title}
                              </p>
                              <SourceTypeBadge sourceType={p.cases[0].sourceType} caseRecord={p.cases[0]} size="sm" />
                            </div>
                            <CaseVelocityMeter caseRecord={p.cases[0]} />
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-1" />
                            Prong 1 Audit: Zero open criminal indictments in judicial registry.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 bg-secondary/20 border-t flex items-center justify-between">
                    <Link
                      href={`/politician/${p.id}`}
                      className="text-xs font-black uppercase text-primary hover:text-accent flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Public Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSelect(p.id)}
                      className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-primary/10 shadow-sm p-8">
          <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-muted-foreground opacity-30" />
          </div>
          <h2 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">
            Select Candidates to Audit
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm font-medium leading-relaxed mb-6">
            Choose candidates above to populate the head-to-head comparison matrix. You can evaluate up to 3 figures at once across judicial delays, restitution, and accountability scores.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (filteredOptions.length >= 2) {
                  setSelectedIds([filteredOptions[0].id, filteredOptions[1].id]);
                }
              }}
              className="text-xs font-bold uppercase tracking-wider border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent" />
              Load Top Restitution Pair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 md:px-[50px] py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
          Loading Comparative Audit Matrix...
        </p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
