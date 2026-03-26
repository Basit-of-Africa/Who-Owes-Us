
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { calculateAccountabilityScore } from '@/lib/scoring';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const { db } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'forfeiture' | 'name'>('score');

  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansRef);

  const filteredPoliticians = useMemo(() => {
    if (!politicians) return [];
    
    return politicians
      .filter(p => {
        const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.accountabilityScore || 0) - (a.accountabilityScore || 0);
        if (sortBy === 'forfeiture') return (b.totalForfeiture || 0) - (a.totalForfeiture || 0);
        return a.fullName.localeCompare(b.fullName);
      });
  }, [searchQuery, sortBy, politicians]);

  const totalRestitution = useMemo(() => {
    return politicians?.reduce((sum, p) => sum + (p.totalForfeiture || 0), 0) || 0;
  }, [politicians]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between bg-primary/5 p-8 rounded-2xl border border-primary/10">
        <div className="md:max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
             <ShieldCheck className="w-8 h-8 text-accent" />
             <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary leading-tight">
                Who Owes Us?
             </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Public Accountability Registry tracking corruption records, public service timelines, and financial restitution of Nigerian public officials since 2014.
          </p>
        </div>
        <div className="hidden lg:block">
           <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-primary/5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">National Restitution</p>
              <p className="text-3xl font-bold text-accent">${(totalRestitution / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-muted-foreground">Source-Verified Public Asset Recoveries</p>
           </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:flex md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search politicians by name, alias, or office..." 
            className="pl-10 h-12 bg-white border-2 focus:border-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[200px] h-12 bg-white border-2">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Accountability Score</SelectItem>
              <SelectItem value="forfeiture">Forfeiture Amount</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoliticians.map((p: any) => (
            <Link key={p.id} href={`/politician/${p.id}`}>
              <Card className="h-full hover:shadow-xl transition-all group overflow-hidden border-2 border-primary/5 hover:border-accent/20">
                <CardHeader className="p-0">
                  <div className="aspect-square relative bg-muted overflow-hidden">
                    <Image 
                      src={p.profileImageUrl} 
                      alt={p.fullName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <AccountabilityBadge score={p.accountabilityScore || 0} className="shadow-md bg-white/95 backdrop-blur-sm" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                       <p className="text-white text-xs font-bold uppercase tracking-widest">{p.primaryParty}</p>
                       <h3 className="text-white text-xl font-bold">{p.fullName}</h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-xs font-medium text-muted-foreground mb-4 line-clamp-1">
                     Public Record Dossier • Nigeria
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Verified Cases</p>
                      <p className="text-lg font-bold">{p.cases?.length || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Public Restitution</p>
                      <p className="text-lg font-bold text-accent">${((p.totalForfeiture || 0) / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-3 bg-secondary/20 border-t flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Data Verified
                  </span>
                  <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Dossier <ExternalLink className="w-3 h-3" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-16 text-center text-xs text-muted-foreground max-w-2xl mx-auto italic">
         "Who Owes Us?" is an independent platform. Records are aggregated from public court documents and verified news media. Disclaimers apply.
      </section>
    </div>
  );
}
