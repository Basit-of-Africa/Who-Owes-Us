'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, limit, getDocs } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { 
  Search, ArrowUpDown, Landmark, Trophy, Medal, 
  Award, Loader2, ShieldAlert, ChevronRight 
} from 'lucide-react';
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

export default function LeaderboardPage() {
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

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <Badge className="bg-primary text-white hover:bg-primary border-none px-4 py-1 font-black uppercase text-[10px] tracking-widest">
            Audit Leaderboard
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none">National Registry</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl">Sorted by **Amount Tied** to public records. Higher values reflect greater fiscal impact on the registry.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by name or party..." 
              className="pl-12 h-14 bg-white border-none shadow-xl rounded-2xl focus:ring-2 focus:ring-accent font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-full md:w-[220px] h-14 bg-white border-none shadow-xl rounded-2xl font-black uppercase text-[10px] tracking-widest px-6">
              <div className="flex items-center gap-3">
                <ArrowUpDown className="w-4 h-4 text-accent" />
                <SelectValue placeholder="Sort Registry" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="forfeiture">Restitution (High-Low)</SelectItem>
              <SelectItem value="score">Accountability Score</SelectItem>
              <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAutoSeeding && (
        <div className="mb-12 p-20 bg-white border-4 border-dashed border-accent/10 rounded-[4rem] flex flex-col items-center justify-center gap-6 text-center shadow-sm">
          <Loader2 className="w-16 h-16 animate-spin text-accent" />
          <div>
            <h3 className="font-black text-3xl text-primary uppercase tracking-tighter">Assembling Master Dossiers...</h3>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Archiving high-value records for investigative audit.</p>
          </div>
        </div>
      )}

      {!loading || filteredPoliticians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredPoliticians.map((p: any, index: number) => {
            const rank = index + 1;
            const isTop3 = rank <= 3 && sortBy === 'forfeiture';
            
            return (
              <Link key={p.id} href={`/politician/${p.id}`} className="group">
                <Card className="h-full hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 border-none shadow-xl bg-white rounded-[3rem] flex flex-col overflow-hidden relative">
                  <div className="aspect-[4/5] relative overflow-hidden bg-primary/5 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                    <div className="flex flex-col items-center gap-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
                      <Landmark className="w-28 h-28 text-primary" />
                    </div>
                    
                    <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-3">
                      <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-2xl bg-white/95 backdrop-blur-md border-none px-5 py-2.5" />
                      {isTop3 && (
                        <Badge className={cn(
                          "px-5 py-2 font-black uppercase text-[10px] tracking-widest border-none flex items-center gap-2 shadow-2xl",
                          rank === 1 ? "bg-yellow-500 text-white" :
                          rank === 2 ? "bg-slate-400 text-white" :
                          "bg-orange-600 text-white"
                        )}>
                          {rank === 1 ? <Trophy className="w-4 h-4" /> : rank === 2 ? <Medal className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                          Rank #{rank}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent z-10">
                       <p className="text-accent text-[11px] font-black uppercase tracking-[0.3em] mb-2">{p.primaryParty}</p>
                       <h3 className="text-white text-3xl font-black leading-tight uppercase tracking-tighter">{p.fullName}</h3>
                    </div>
                  </div>
                  <CardContent className="p-10 flex-grow">
                    <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">Archived Cases</p>
                        <p className="text-3xl font-black text-primary">{(p as any).cases?.length || 0}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">Amount Tied</p>
                        <p className="text-3xl font-black text-accent truncate">
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
                  <CardFooter className="px-10 py-8 bg-secondary/10 border-t border-primary/5 flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-primary/10 bg-white/50">
                      Audit Verified
                    </Badge>
                    <span className="text-primary text-xs font-black flex items-center gap-2 group-hover:text-accent transition-colors uppercase tracking-widest">
                      Full Dossier <ChevronRight className="w-4 h-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-60 space-y-4">
          <Loader2 className="w-20 h-20 animate-spin text-accent/20" />
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[12px]">Assembling national matrix...</p>
        </div>
      )}

      {filteredPoliticians.length === 0 && !loading && !isAutoSeeding && (
        <div className="text-center py-60 bg-white rounded-[4rem] border-4 border-dashed border-primary/5">
          <ShieldAlert className="w-24 h-24 mx-auto mb-8 text-muted-foreground opacity-10" />
          <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">No Dossiers Found</h3>
          <p className="text-xl text-muted-foreground mt-2 font-medium">Refine your search parameters to access the archive.</p>
        </div>
      )}
    </div>
  );
}
