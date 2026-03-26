
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, ExternalLink, ShieldCheck, Loader2, Filter, Sparkles } from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { INITIAL_REGISTRY_SEED } from '@/lib/seed-data';

export default function HomePage() {
  const { db } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'forfeiture' | 'name'>('score');
  const [isAutoSeeding, setIsAutoSeeding] = useState(false);

  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansRef);

  // Auto-Seed Logic: Trigger if database is empty on first load
  useEffect(() => {
    async function performAutoSeed() {
      if (!db || loading || !politicians || politicians.length > 0 || isAutoSeeding) return;
      
      setIsAutoSeeding(true);
      try {
        for (const data of INITIAL_REGISTRY_SEED) {
          const polRef = await addDoc(collection(db, 'politicians'), {
            fullName: data.fullName,
            aliasNames: data.aliasNames || [],
            bio: data.bio || '',
            primaryParty: data.primaryParty || 'Unknown',
            accountabilityScore: 0, 
            totalForfeiture: data.totalForfeiture || 0,
            profileImageUrl: data.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(data.fullName!)}/400/400`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          if (data.cases) {
            for (const c of data.cases) {
              await addDoc(collection(db, 'politicians', polRef.id, 'cases'), c);
            }
          }
        }
      } catch (e) {
        console.error("Auto-seed failed", e);
      } finally {
        setIsAutoSeeding(false);
      }
    }

    performAutoSeed();
  }, [db, loading, politicians, isAutoSeeding]);

  const filteredPoliticians = useMemo(() => {
    if (!politicians) return [];
    
    return [...politicians]
      .filter(p => {
        const matchesSearch = (p as any).fullName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return ((b as any).accountabilityScore || 0) - ((a as any).accountabilityScore || 0);
        if (sortBy === 'forfeiture') return ((b as any).totalForfeiture || 0) - ((a as any).totalForfeiture || 0);
        return (a as any).fullName.localeCompare((b as any).fullName);
      });
  }, [searchQuery, sortBy, politicians]);

  const totalRestitution = useMemo(() => {
    return politicians?.reduce((sum, p) => sum + ((p as any).totalForfeiture || 0), 0) || 0;
  }, [politicians]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-12 bg-primary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-accent hover:bg-accent text-white border-none px-3 py-1">Master Registry</Badge>
              <div className="h-px w-12 bg-white/20" />
              <span className="text-sm font-medium text-white/60">Verified Corruption Footprints</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-black leading-tight mb-6">
              Who Owes Us?
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-medium">
              A civic accountability platform aggregating verified corruption records of Nigerian politicians. Tracking national restitution through data-first audit scores.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 lg:min-w-[300px] shadow-inner">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Verified Asset Recovery</p>
            <p className="text-4xl md:text-5xl font-black text-accent">${(totalRestitution / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-white/40 mt-4 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Source-Attributed Documents
            </p>
          </div>
        </div>
      </section>

      {isAutoSeeding && (
        <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center gap-3 text-accent font-bold animate-pulse">
          <Sparkles className="w-5 h-5" />
          Initializing Global Politician Dossiers...
        </div>
      )}

      <section className="mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, alias, or corruption case..." 
            className="pl-12 h-14 bg-white border-none shadow-sm text-lg rounded-2xl focus:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[200px] h-14 bg-white border-none shadow-sm rounded-2xl font-bold">
              <ArrowUpDown className="w-4 h-4 mr-2 text-accent" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Accountability Score</SelectItem>
              <SelectItem value="forfeiture">Forfeiture Amount</SelectItem>
              <SelectItem value="name">A - Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {loading && !isAutoSeeding ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="text-muted-foreground font-medium">Opening Registry...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPoliticians.map((p: any) => (
              <Link key={p.id} href={`/politician/${p.id}`}>
                <Card className="h-full hover:shadow-2xl transition-all group overflow-hidden border-none shadow-md bg-white rounded-2xl flex flex-col">
                  <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                    <Image 
                      src={p.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(p.fullName)}/400/400`} 
                      alt={p.fullName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <AccountabilityBadge score={p.accountabilityScore || 0} className="shadow-lg bg-white/90 backdrop-blur-md" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                       <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{p.primaryParty}</p>
                       <h3 className="text-white text-xl font-bold leading-tight">{p.fullName}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Verified Cases</p>
                        <p className="text-lg font-black text-primary">{(p as any).cases?.length || 0}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Restitution</p>
                        <p className="text-lg font-black text-accent">${((p.totalForfeiture || 0) / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-secondary/10 border-t border-primary/5 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      Audit Status: Verified
                    </span>
                    <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:text-accent transition-colors">
                      Profile <ExternalLink className="w-3 h-3" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          
          {filteredPoliticians.length === 0 && !loading && (
            <div className="text-center py-40">
              <Filter className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-bold text-primary">No dossiers found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </>
      )}

      <footer className="mt-20 pt-10 border-t border-primary/10 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed max-w-2xl mx-auto italic">
          "Who Owes Us?" is an independent platform for civic transparency. All data is aggregated from public court documents and legislative records.
        </p>
      </footer>
    </div>
  );
}
