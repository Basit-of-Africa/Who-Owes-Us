'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, limit, getDocs } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { 
  Search, ArrowUpDown, ExternalLink, ShieldCheck, 
  Loader2, Landmark, ShieldAlert, Trophy, Medal, 
  Award, Scale, Gavel, History, Info, ChevronRight 
} from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { INITIAL_REGISTRY_SEED } from '@/lib/seed-data';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { db } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'forfeiture' | 'name'>('forfeiture');
  const [isAutoSeeding, setIsAutoSeeding] = useState(false);

  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansRef);

  useEffect(() => {
    async function performAutoSeed() {
      if (!db || loading || isAutoSeeding) return;
      
      const q = query(collection(db, 'politicians'), limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) return;
      
      setIsAutoSeeding(true);
      try {
        await Promise.all(INITIAL_REGISTRY_SEED.map(async (data) => {
          const polRef = await addDoc(collection(db, 'politicians'), {
            fullName: data.fullName,
            aliasNames: data.aliasNames || [],
            bio: data.bio || '',
            primaryParty: data.primaryParty || 'Unknown',
            accountabilityScore: 0, 
            totalForfeiture: data.totalForfeiture || 0,
            profileImageUrl: '', 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          if (data.cases) {
            await Promise.all(data.cases.map(c => 
              addDoc(collection(db, 'politicians', polRef.id, 'cases'), {
                ...c,
                politicianId: polRef.id,
                amountInvolved: c.amountInvolved || 0,
                currency: c.currency || 'NGN',
                caseStartDate: c.caseStartDate || new Date().toISOString()
              })
            ));
          }
        }));
      } catch (e) {
        console.error("Auto-seed failed", e);
      } finally {
        setIsAutoSeeding(false);
      }
    }

    performAutoSeed();
  }, [db, loading, isAutoSeeding]);

  const filteredPoliticians = useMemo(() => {
    if (!politicians) return [];
    
    return [...politicians]
      .filter(p => {
        const fullName = (p as any).fullName || '';
        const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return ((b as any).accountabilityScore || 0) - ((a as any).accountabilityScore || 0);
        if (sortBy === 'forfeiture') return ((b as any).totalForfeiture || 0) - ((a as any).totalForfeiture || 0);
        return ((a as any).fullName || '').localeCompare((b as any).fullName || '');
      });
  }, [searchQuery, sortBy, politicians]);

  const totalRestitution = useMemo(() => {
    return politicians?.reduce((sum, p) => sum + ((p as any).totalForfeiture || 0), 0) || 0;
  }, [politicians]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-primary text-white overflow-hidden py-20 md:py-32">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/50 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-accent/20 text-accent hover:bg-accent/20 border-accent/30 px-6 py-2 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
              National Restitution Registry
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Who Owes Us?
            </h1>
            <p className="text-xl md:text-3xl font-medium text-white/70 max-w-2xl mx-auto italic leading-tight">
              "An independent, data-driven archive monitoring the corruption records and financial restitution history of public officials."
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-w-[300px] text-center shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Tracked Restitution</p>
                 <p className="text-4xl md:text-5xl font-black text-accent">₦{(totalRestitution / 1000000000).toFixed(1)}B</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-w-[300px] text-center shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Archived Dossiers</p>
                 <p className="text-4xl md:text-5xl font-black text-white">{(politicians?.length) || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & PILLARS SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-accent font-black uppercase tracking-[0.2em] text-xs">Our Mandate</p>
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tight">Civic Accountability Through Data.</h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  We believe that transparency is the first step toward national restitution. By archiving verifiable public records, we provide citizens with a clear view of the legal and financial footprints of those entrusted with public power.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 bg-secondary/20 rounded-[2rem] border border-primary/5">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-primary uppercase tracking-tight">Verified Footprints</h3>
                  <p className="text-sm text-muted-foreground font-medium">Every record is indexed from court gazettes, investigative media, and anti-corruption archives.</p>
                </div>
                <div className="space-y-4 p-6 bg-secondary/20 rounded-[2rem] border border-primary/5">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-primary uppercase tracking-tight">Audit Matrix</h3>
                  <p className="text-sm text-muted-foreground font-medium">Perform side-by-side comparisons of restitution history and legal status across officials.</p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-primary p-12 text-white relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <Gavel className="w-32 h-32" />
              </div>
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                   <Info className="w-4 h-4 text-accent" />
                   <span className="text-[10px] font-black uppercase tracking-widest">The Audit Formula</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight leading-none">Mathematical Integrity Scoring</h3>
                <p className="text-white/70 font-medium leading-relaxed">
                  Our algorithm weights legal outcomes against financial impact. Convictions carry more weight than charges, and the volume of public funds involved logarithmic factor to the final score.
                </p>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/50">
                     <span>Conviction Weight</span>
                     <span className="text-accent">+8.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/50">
                     <span>Formal Charge</span>
                     <span className="text-accent">+4.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/50">
                     <span>Public Forfeiture</span>
                     <span className="text-accent">log10(₦) x 5</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* REGISTRY SECTION */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <Badge className="bg-primary text-white hover:bg-primary border-none px-4 py-1 font-black uppercase text-[10px] tracking-widest">
                Master Registry
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter">Current Audit Ranking</h2>
              <p className="text-muted-foreground font-medium max-w-xl">Sorted by **Amount Tied** to records. Badges awarded to the Top 3 fiscal contributors to the registry.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by name or party..." 
                  className="pl-12 h-14 bg-white border-none shadow-sm rounded-xl focus:ring-2 focus:ring-accent font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-full md:w-[220px] h-14 bg-white border-none shadow-sm rounded-xl font-black uppercase text-[10px] tracking-widest px-6">
                  <div className="flex items-center gap-3">
                    <ArrowUpDown className="w-4 h-4 text-accent" />
                    <SelectValue placeholder="Sort Registry" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="forfeiture">Restitution (High-Low)</SelectItem>
                  <SelectItem value="score">Accountability Score</SelectItem>
                  <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isAutoSeeding && (
            <div className="mb-12 p-16 bg-white border-4 border-dashed border-accent/10 rounded-[3rem] flex flex-col items-center justify-center gap-6 text-center shadow-sm">
              <Loader2 className="w-12 h-12 animate-spin text-accent" />
              <div>
                <h3 className="font-black text-2xl text-primary uppercase tracking-tight">Assembling Master Registry...</h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Archiving high-value records for investigative audit.</p>
              </div>
            </div>
          )}

          {!loading || filteredPoliticians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPoliticians.map((p: any, index: number) => {
                const rank = index + 1;
                const isTop3ByAmount = rank <= 3 && sortBy === 'forfeiture';
                const isTop3 = isTop3ByAmount;
                
                return (
                  <Link key={p.id} href={`/politician/${p.id}`} className="group">
                    <Card className="h-full hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border-none shadow-md bg-white rounded-[2rem] flex flex-col overflow-hidden relative">
                      <div className="aspect-[4/5] relative overflow-hidden bg-primary/5 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                        <div className="flex flex-col items-center gap-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                          <Landmark className="w-24 h-24 text-primary" />
                        </div>
                        
                        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
                          <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-2xl bg-white/95 backdrop-blur-md border-none px-4 py-2" />
                          {isTop3 && (
                            <Badge className={cn(
                              "px-4 py-1.5 font-black uppercase text-[9px] tracking-widest border-none flex items-center gap-1.5 shadow-lg",
                              rank === 1 ? "bg-yellow-500 text-white" :
                              rank === 2 ? "bg-slate-400 text-white" :
                              "bg-orange-600 text-white"
                            )}>
                              {rank === 1 ? <Trophy className="w-3.5 h-3.5" /> : rank === 2 ? <Medal className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                              Rank #{rank}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent z-10">
                           <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2">{p.primaryParty}</p>
                           <h3 className="text-white text-2xl font-black leading-tight uppercase tracking-tighter">{p.fullName}</h3>
                        </div>
                      </div>
                      <CardContent className="p-8 flex-grow">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Archived Cases</p>
                            <p className="text-2xl font-black text-primary">{(p as any).cases?.length || 0}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Amount Tied</p>
                            <p className="text-2xl font-black text-accent truncate">
                              {p.totalForfeiture >= 1000000000 
                                ? `₦${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                                : p.totalForfeiture >= 1000000 
                                  ? `₦${(p.totalForfeiture / 1000000).toFixed(1)}M`
                                  : `₦${(p.totalForfeiture).toLocaleString()}`
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-8 py-6 bg-secondary/10 border-t border-primary/5 flex items-center justify-between">
                        <Badge variant="outline" className="text-[9px] font-black text-muted-foreground uppercase tracking-widest border-primary/10 bg-white/50">
                          Audit Verified
                        </Badge>
                        <span className="text-primary text-xs font-black flex items-center gap-1.5 group-hover:text-accent transition-colors uppercase tracking-widest">
                          Audit Profile <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-accent/20" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">Assembling global matrix...</p>
            </div>
          )}

          {filteredPoliticians.length === 0 && !loading && !isAutoSeeding && (
            <div className="text-center py-40 bg-white rounded-[3rem] border-4 border-dashed border-primary/5">
              <ShieldAlert className="w-20 h-20 mx-auto mb-8 text-muted-foreground opacity-10" />
              <h3 className="text-2xl font-black text-primary uppercase tracking-tight">No Dossiers Found</h3>
              <p className="text-base text-muted-foreground mt-2 font-medium">Refine your search parameters to access the archive.</p>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 space-y-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Ready to Audit?</h2>
            <p className="text-xl text-white/60 font-medium">Use the comparison engine to perform side-by-side legal and financial audits of up to three officials.</p>
          </div>
          <Link href="/compare">
            <button className="bg-accent hover:bg-accent/90 text-white h-20 px-12 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-4">
              Open Comparison Matrix
              <Scale className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
