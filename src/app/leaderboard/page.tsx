'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Search, ArrowUpDown, Landmark, 
  Loader2, ShieldAlert, ChevronRight, Share2, Check,
  MapPin, Award, CheckCircle2, Clock, Scale, RotateCcw,
  Sparkles, Filter, ShieldCheck
} from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Politician } from '@/lib/types';

// All 36 Nigerian States + FCT
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function LeaderboardPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedOffice, setSelectedOffice] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'integrity' | 'aspirants' | 'gridlock'>('all');
  const [sortBy, setSortBy] = useState<'forfeiture' | 'score' | 'name' | 'delay'>('forfeiture');

  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: rawPoliticians, loading } = useCollection(politiciansRef);

  // Helper to compute max case delay in days
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

  // Filtered & Sorted Politicians
  const filteredPoliticians = useMemo(() => {
    if (!rawPoliticians) return [];
    
    return [...rawPoliticians]
      .filter((p: any) => {
        // Tab-specific filters
        if (activeTab === 'integrity') {
          const isClean = (!p.cases || p.cases.length === 0) && 
                          (!p.totalForfeiture || p.totalForfeiture === 0) &&
                          (!p.accountabilityScore || p.accountabilityScore <= 5);
          if (!isClean) return false;
        }

        if (activeTab === 'aspirants') {
          if (!p.candidateFor && !p.isIncumbent) return false;
        }

        if (activeTab === 'gridlock') {
          const maxDelay = getMaxCaseDelayDays(p);
          const hasGridlockCase = (p.cases || []).some((c: any) => c.adjournmentsCount >= 10 || c.prolongedDelay);
          if (maxDelay < 1000 && !hasGridlockCase) return false;
        }

        // Search filter
        const fullName = p.fullName || '';
        const party = p.primaryParty || '';
        const state = p.stateOfOrigin || '';
        const candidate = p.candidateFor || '';
        const matchesSearch = 
          fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          party.toLowerCase().includes(searchQuery.toLowerCase()) ||
          state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // State filter
        if (selectedState !== 'all') {
          if ((p.stateOfOrigin || '').toLowerCase() !== selectedState.toLowerCase()) {
            return false;
          }
        }

        // Office filter
        if (selectedOffice !== 'all') {
          if ((p.currentOfficeType || '').toLowerCase() !== selectedOffice.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'score') return (b.accountabilityScore || 0) - (a.accountabilityScore || 0);
        if (sortBy === 'forfeiture') return (b.totalForfeiture || 0) - (a.totalForfeiture || 0);
        if (sortBy === 'delay') return getMaxCaseDelayDays(b) - getMaxCaseDelayDays(a);
        return (a.fullName || '').localeCompare(b.fullName || '');
      });
  }, [rawPoliticians, searchQuery, selectedState, selectedOffice, activeTab, sortBy]);

  // Count metrics for quick badges
  const counts = useMemo(() => {
    if (!rawPoliticians) return { total: 0, integrity: 0, aspirants: 0, gridlock: 0 };
    return {
      total: rawPoliticians.length,
      integrity: rawPoliticians.filter((p: any) => (!p.cases || p.cases.length === 0) && (!p.totalForfeiture || p.totalForfeiture === 0)).length,
      aspirants: rawPoliticians.filter((p: any) => !!p.candidateFor).length,
      gridlock: rawPoliticians.filter((p: any) => getMaxCaseDelayDays(p) >= 1000).length
    };
  }, [rawPoliticians]);

  const hasActiveFilters = searchQuery !== '' || selectedState !== 'all' || selectedOffice !== 'all' || activeTab !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedOffice('all');
    setActiveTab('all');
    setSortBy('forfeiture');
  };

  return (
    <div className="container mx-auto px-6 md:px-[50px] py-12 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-white hover:bg-primary px-3 py-1 font-bold uppercase text-[10px] tracking-widest">
              National Civic Audit Registry
            </Badge>
            <Badge variant="outline" className="border-accent text-accent font-bold uppercase text-[10px] tracking-widest bg-accent/5">
              Phase 1 Live
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tight leading-none">
            Public Figures Dossier
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl text-sm md:text-base leading-relaxed">
            Multi-facet scrutiny covering financial restitution, accountability scores, judicial gridlock velocity, and electoral candidate audit trails.
          </p>
        </div>

        {/* Action Button to ballot comparison */}
        <div className="flex items-center gap-3">
          <Link href="/compare">
            <Button className="h-12 px-6 rounded-xl font-black text-xs uppercase tracking-wider bg-accent hover:bg-accent/90 text-primary shadow-sm gap-2">
              <Scale className="w-4 h-4" />
              <span>Ballot Audit (Compare 2-3 Candidates)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Registry Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
            activeTab === 'all'
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-white text-muted-foreground hover:text-primary hover:bg-secondary/40"
          )}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>All Figures ({counts.total})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('integrity')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border",
            activeTab === 'integrity'
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-emerald-50/50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/50"
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hall of Integrity ({counts.integrity})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('aspirants')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
            activeTab === 'aspirants'
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-white text-muted-foreground hover:text-primary hover:bg-secondary/40"
          )}
        >
          <Award className="w-3.5 h-3.5 text-accent" />
          <span>2027 Aspirants ({counts.aspirants})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gridlock')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
            activeTab === 'gridlock'
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white text-muted-foreground hover:text-primary hover:bg-secondary/40"
          )}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Prolonged Gridlock ({counts.gridlock})</span>
        </button>
      </div>

      {/* Multi-facet Filter Bar */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search name, party, state..." 
              className="pl-10 h-11 bg-secondary/30 border-none font-medium text-xs rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* State of Origin Filter */}
          <div>
            <Select value={selectedState} onValueChange={(val) => setSelectedState(val)}>
              <SelectTrigger className="h-11 bg-secondary/30 border-none font-bold text-xs uppercase tracking-wider rounded-xl">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">
                    {selectedState === 'all' ? 'All Nigerian States' : `${selectedState} State`}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All Nigerian States (36 + FCT)</SelectItem>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state} State</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Office Classification Filter */}
          <div>
            <Select value={selectedOffice} onValueChange={(val) => setSelectedOffice(val)}>
              <SelectTrigger className="h-11 bg-secondary/30 border-none font-bold text-xs uppercase tracking-wider rounded-xl">
                <div className="flex items-center gap-2 truncate">
                  <Landmark className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">
                    {selectedOffice === 'all' ? 'All Office Types' : selectedOffice.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Office Classifications</SelectItem>
                <SelectItem value="governor">State Governors / Ex-Governors</SelectItem>
                <SelectItem value="senator">Senators & National Assembly</SelectItem>
                <SelectItem value="minister">Ministers & Federal MDAs</SelectItem>
                <SelectItem value="president">President</SelectItem>
                <SelectItem value="vice_president">Vice President</SelectItem>
                <SelectItem value="representative">House of Representatives</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Select */}
          <div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-11 bg-secondary/30 border-none font-bold text-xs uppercase tracking-wider rounded-xl">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                  <SelectValue placeholder="Sort Registry" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forfeiture">Restitution / Forfeiture (High-Low)</SelectItem>
                <SelectItem value="score">Accountability Score (Highest Risk)</SelectItem>
                <SelectItem value="delay">Judicial Delay (Longest Pending)</SelectItem>
                <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Chips & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Active Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="font-bold text-[10px] uppercase">Query: "{searchQuery}"</Badge>
              )}
              {selectedState !== 'all' && (
                <Badge variant="secondary" className="font-bold text-[10px] uppercase">State: {selectedState}</Badge>
              )}
              {selectedOffice !== 'all' && (
                <Badge variant="secondary" className="font-bold text-[10px] uppercase">Office: {selectedOffice}</Badge>
              )}
              {activeTab !== 'all' && (
                <Badge className="bg-accent/20 text-accent-foreground font-bold text-[10px] uppercase">Tab: {activeTab}</Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All Filters</span>
            </Button>
          </div>
        )}
      </div>

      {/* Hall of Integrity Special Spotlight Banner if on integrity tab */}
      {activeTab === 'integrity' && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-emerald-950 uppercase tracking-wide text-lg">
                Hall of Integrity & Clean Public Record
              </h3>
              <p className="text-xs text-emerald-800 font-medium max-w-2xl mt-1 leading-relaxed">
                Public officials documented in our civic archive with verified public tenures, <strong>zero criminal corruption indictments</strong>, zero asset forfeiture orders, and pristine accountability standing.
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white px-4 py-1.5 font-black uppercase text-xs tracking-wider shrink-0">
            {filteredPoliticians.length} Clean Records Verified
          </Badge>
        </div>
      )}

      {/* Grid of Politician Cards */}
      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPoliticians.map((p: any, index: number) => {
            const rank = index + 1;
            const maxDelayDays = getMaxCaseDelayDays(p);
            const isClean = (!p.cases || p.cases.length === 0) && (!p.totalForfeiture || p.totalForfeiture === 0);
            const hasProlongedDelay = maxDelayDays >= 1000;

            return (
              <Card 
                key={p.id} 
                className={cn(
                  "h-full transition-all border shadow-sm bg-white rounded-2xl overflow-hidden relative flex flex-col justify-between hover:shadow-md",
                  isClean && "border-emerald-200 bg-emerald-50/20"
                )}
              >
                <div>
                  {/* Top Image / Avatar banner */}
                  <div className="aspect-[4/3] relative bg-primary/5 flex items-center justify-center overflow-hidden">
                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-md border",
                        isClean ? "bg-emerald-600 border-emerald-400 text-white" :
                        rank === 1 ? "bg-yellow-500 border-yellow-300 text-white" :
                        rank === 2 ? "bg-slate-400 border-slate-200 text-white" :
                        rank === 3 ? "bg-amber-600 border-amber-400 text-white" :
                        "bg-primary border-primary-foreground/20 text-white"
                      )}>
                        #{rank}
                      </div>
                    </div>

                    {/* Quick Badges on Right */}
                    <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
                      {isClean && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Clean Record
                        </span>
                      )}
                      {hasProlongedDelay && !isClean && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {Math.floor(maxDelayDays / 365)}y Trial Delay
                        </span>
                      )}
                      {p.candidateFor && (
                        <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Award className="w-2.5 h-2.5 text-accent" />
                          2027 Candidate
                        </span>
                      )}
                      {((p.cases || []).some((c: any) => c.verification)) && !isClean && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-950/85 backdrop-blur-sm text-emerald-300 border border-emerald-500/40 font-black text-[8px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                          Verified Records
                        </span>
                      )}
                    </div>

                    {p.profileImageUrl ? (
                      <img 
                        src={p.profileImageUrl} 
                        alt={p.fullName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Landmark className="w-16 h-16 text-primary opacity-10" />
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-accent text-[10px] font-black uppercase tracking-wider">
                          {p.primaryParty}
                        </span>
                        {p.stateOfOrigin && (
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                            • <MapPin className="w-2.5 h-2.5 inline" /> {p.stateOfOrigin}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white text-lg font-black uppercase tracking-tight leading-tight line-clamp-1">
                        {p.fullName}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">
                          Amount Documented
                        </p>
                        <p className="text-lg font-black text-primary">
                          {p.totalForfeiture && p.totalForfeiture > 0 ? (
                            `₦${p.totalForfeiture >= 1000000000 
                              ? `${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                              : `${(p.totalForfeiture / 1000000).toFixed(1)}M`}`
                          ) : (
                            <span className="text-emerald-700 text-sm font-black uppercase">₦0 (Clean Record)</span>
                          )}
                        </p>
                      </div>
                      <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} />
                    </div>

                    {/* Candidate aspiration badge if any */}
                    {p.candidateFor && (
                      <p className="text-[11px] font-bold text-muted-foreground truncate border-t pt-2">
                        Seeking: <span className="text-primary">{p.candidateFor}</span>
                      </p>
                    )}
                  </CardContent>
                </div>

                {/* Card Footer with links and compare CTA */}
                <CardFooter className="px-4 py-3 bg-secondary/20 border-t flex justify-between items-center gap-2">
                  <Link 
                    href={`/politician/${p.id}`}
                    className="text-[10px] font-black uppercase text-primary hover:text-accent flex items-center gap-1 transition-colors"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/compare?p1=${p.id}`}
                      title="Add to Ballot Audit comparison"
                      className="px-2.5 py-1 rounded-lg bg-primary/5 hover:bg-accent/20 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Scale className="w-3 h-3 text-accent" />
                      <span>Compare</span>
                    </Link>

                    <button
                      type="button"
                      title="Copy profile link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = `${window.location.origin}/politician/${p.id}`;
                        navigator.clipboard.writeText(url);
                        setCopiedId(p.id);
                        setTimeout(() => setCopiedId(null), 2000);
                        toast({
                          title: "Profile Link Copied!",
                          description: `Direct link for ${p.fullName} copied to clipboard.`,
                        });
                      }}
                      className="p-1.5 rounded-lg hover:bg-white text-muted-foreground hover:text-primary transition-all flex items-center"
                    >
                      {copiedId === p.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 text-accent" />
                      )}
                    </button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="mt-4 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
            Assembling Civic Audit Registry...
          </p>
        </div>
      )}

      {filteredPoliticians.length === 0 && !loading && (
        <div className="text-center py-28 bg-white rounded-2xl border border-dashed p-8">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-bold text-primary uppercase">No Records Found</h3>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            No public figures matched your current filter criteria. Try resetting your search filters or state selections.
          </p>
          <Button 
            onClick={resetFilters}
            className="mt-6 font-bold uppercase text-xs tracking-wider"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
