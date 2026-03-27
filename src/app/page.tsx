'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, limit, getDocs } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, ExternalLink, ShieldCheck, Loader2, Landmark, ShieldAlert, Trophy, Medal, Award } from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-12 bg-primary rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] md:blur-[100px]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 md:mb-8">
              <Badge className="bg-accent hover:bg-accent text-white border-none px-4 py-1.5 font-black uppercase text-[8px] md:text-[10px] tracking-widest">
                Audit Registry
              </Badge>
              <div className="h-px w-8 md:w-12 bg-white/20" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60">Verified Corruption Footprints</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-black leading-none mb-6 md:mb-8 uppercase tracking-tighter">
              Who Owes Us?
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-white/80 leading-snug lg:leading-tight max-w-2xl font-medium italic mx-auto lg:mx-0">
              "An independent civic registry archiving the public records of Nigerian political figures. Data-first accountability scoring."
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/10 lg:min-w-[360px] shadow-2xl text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Verified Registry Assets</p>
            </div>
            <p className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-2">
              ₦{(totalRestitution / 1000000000).toFixed(1)}B
            </p>
            <p className="text-[8px] md:text-[10px] text-white/40 font-bold uppercase tracking-widest">
              Total Cumulative Record Value
            </p>
          </div>
        </div>
      </section>

      {isAutoSeeding && (
        <div className="mb-12 p-8 md:p-16 bg-white border-4 border-dashed border-accent/10 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center gap-6 text-center shadow-sm">
          <div className="p-4 md:p-5 bg-accent/10 rounded-2xl md:rounded-3xl">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-accent" />
          </div>
          <div>
            <h3 className="font-black text-xl md:text-2xl text-primary uppercase tracking-tight">Syncing Master Dossiers...</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 font-medium">Archiving high-value records for top political figures.</p>
          </div>
        </div>
      )}

      <section className="mb-8 md:mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, party, or amount..." 
            className="pl-12 md:pl-14 h-14 md:h-16 bg-white border-none shadow-sm text-base md:text-lg rounded-xl md:rounded-2xl focus:ring-2 focus:ring-accent font-medium placeholder:text-muted-foreground/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-full md:w-[240px] h-14 md:h-16 bg-white border-none shadow-sm rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest px-4 md:px-6">
              <div className="flex items-center gap-3">
                <ArrowUpDown className="w-4 h-4 text-accent" />
                <SelectValue placeholder="Sort Registry" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl md:rounded-2xl border-none shadow-2xl">
              <SelectItem value="forfeiture">Amount Tied (High-Low)</SelectItem>
              <SelectItem value="score">Accountability Score</SelectItem>
              <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {!loading || filteredPoliticians.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPoliticians.map((p: any, index: number) => {
              const rank = index + 1;
              const isTop3ByAmount = rank <= 3 && sortBy === 'forfeiture';
              const isTop3ByScore = rank <= 3 && sortBy === 'score';
              const isTop3 = isTop3ByAmount || isTop3ByScore;
              
              return (
                <Link key={p.id} href={`/politician/${p.id}`} className="group">
                  <Card className="h-full hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border-none shadow-md bg-white rounded-2xl md:rounded-[2rem] flex flex-col overflow-hidden relative">
                    <div className="aspect-[4/5] relative overflow-hidden bg-primary/5 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                      <div className="flex flex-col items-center gap-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                        <Landmark className="w-16 h-16 md:w-24 md:h-24 text-primary" />
                      </div>
                      
                      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                        <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-2xl bg-white/95 backdrop-blur-md border-none px-3 py-1.5 md:px-4 md:py-2" />
                        {isTop3 && (
                          <Badge className={cn(
                            "px-3 py-1 md:px-4 md:py-1.5 font-black uppercase text-[8px] md:text-[9px] tracking-widest border-none flex items-center gap-1 md:gap-1.5 shadow-lg",
                            rank === 1 ? "bg-yellow-500 text-white" :
                            rank === 2 ? "bg-slate-400 text-white" :
                            "bg-orange-600 text-white"
                          )}>
                            {rank === 1 ? <Trophy className="w-3 h-3" /> : rank === 2 ? <Medal className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                            Rank #{rank}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent z-10">
                         <p className="text-accent text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 md:mb-2">{p.primaryParty}</p>
                         <h3 className="text-white text-xl md:text-2xl font-black leading-tight uppercase tracking-tighter">{p.fullName}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6 md:p-8 flex-grow">
                      <div className="grid grid-cols-2 gap-4 md:gap-8">
                        <div className="space-y-1">
                          <p className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Archived Cases</p>
                          <p className="text-xl md:text-2xl font-black text-primary">{(p as any).cases?.length || 0}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Amount Tied</p>
                          <p className="text-xl md:text-2xl font-black text-accent">
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
                    <CardFooter className="px-6 md:px-8 py-4 md:py-6 bg-secondary/10 border-t border-primary/5 flex items-center justify-between">
                      <Badge variant="outline" className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest border-primary/10 bg-white/50">
                        Audit Verified
                      </Badge>
                      <span className="text-primary text-[10px] md:text-xs font-black flex items-center gap-1.5 group-hover:text-accent transition-colors uppercase tracking-widest">
                        Audit Profile <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          {filteredPoliticians.length === 0 && !loading && !isAutoSeeding && (
            <div className="text-center py-20 md:py-40 bg-white rounded-2xl md:rounded-[2.5rem] border-4 border-dashed border-primary/5">
              <ShieldAlert className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 text-muted-foreground opacity-10" />
              <h3 className="text-xl md:text-2xl font-black text-primary uppercase tracking-tight">Registry Empty</h3>
              <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">No archived records match your search criteria.</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 md:py-40 space-y-4">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-accent/20" />
          <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Assembling registry...</p>
        </div>
      )}

      <footer className="mt-20 md:mt-32 pt-12 md:pt-16 border-t border-primary/5 text-center">
        <p className="text-[9px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.2em] md:tracking-[0.3em] leading-relaxed max-w-3xl mx-auto italic opacity-60">
          "Who Owes Us?" is an independent registry. Ranking is determined by documented public records of financial misappropriation and legal status.
        </p>
      </footer>
    </div>
  );
}
