'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Search, ArrowUpDown, Landmark, 
  Loader2, ShieldAlert, ChevronRight, Share2, Link2, Check
} from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

export default function LeaderboardPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'forfeiture' | 'name'>('forfeiture');

  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansRef);

  const filteredPoliticians = useMemo(() => {
    if (!politicians) return [];
    
    return [...politicians]
      .filter(p => {
        const fullName = (p as any).fullName || '';
        const party = (p as any).primaryParty || '';
        return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               party.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        if (sortBy === 'score') return ((b as any).accountabilityScore || 0) - ((a as any).accountabilityScore || 0);
        if (sortBy === 'forfeiture') return ((b as any).totalForfeiture || 0) - ((a as any).totalForfeiture || 0);
        return ((a as any).fullName || '').localeCompare((b as any).fullName || '');
      });
  }, [searchQuery, sortBy, politicians]);

  return (
    <div className="container mx-auto px-6 md:px-[50px] py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <Badge className="bg-primary text-white hover:bg-primary px-3 py-1 font-bold uppercase text-[10px] tracking-widest">
            National Audit Registry
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tight leading-none">Registry Ranking</h1>
          <p className="text-muted-foreground font-medium max-w-xl">Ranked by Restitution Amount and Accountability Score. Higher values reflect greater documented legal and financial impact.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or party..." 
              className="pl-10 h-12 bg-white border-none shadow-sm rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-white border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                <SelectValue placeholder="Sort Registry" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forfeiture">Amount Tied (High-Low)</SelectItem>
              <SelectItem value="score">Accountability Score</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPoliticians.map((p: any, index: number) => {
            const rank = index + 1;
            return (
              <Link key={p.id} href={`/politician/${p.id}`} className="group">
                <Card className="h-full hover:shadow-lg transition-all border-none shadow-sm bg-white rounded-xl overflow-hidden relative">
                  <div className="aspect-square relative bg-primary/5 flex items-center justify-center">
                    <div className="absolute top-4 left-4 z-20">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-lg border-2",
                        rank === 1 ? "bg-yellow-500 border-yellow-300 text-white" :
                        rank === 2 ? "bg-slate-300 border-slate-100 text-slate-700" :
                        rank === 3 ? "bg-orange-600 border-orange-400 text-white" :
                        "bg-primary border-primary-foreground/20 text-white"
                      )}>
                        #{rank}
                      </div>
                    </div>
                    <Landmark className="w-20 h-20 text-primary opacity-10 group-hover:scale-110 transition-transform" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent">
                       <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{p.primaryParty}</p>
                       <h3 className="text-white text-xl font-black uppercase tracking-tight leading-none">{p.fullName}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Amount Tied</p>
                        <p className="text-lg font-black text-primary">
                          ₦{p.totalForfeiture >= 1000000000 
                            ? `${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                            : `${(p.totalForfeiture / 1000000).toFixed(1)}M`
                          }
                        </p>
                      </div>
                      <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} />
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-secondary/30 border-t flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Audit Status: Verified</span>
                    <div className="flex items-center gap-2">
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
                        className="p-1.5 rounded-lg hover:bg-white text-muted-foreground hover:text-primary transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-accent" />
                        )}
                      </button>
                      <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="mt-4 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Assembling National Registry...</p>
        </div>
      )}

      {filteredPoliticians.length === 0 && !loading && (
        <div className="text-center py-40 bg-white rounded-xl border border-dashed">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-bold text-primary uppercase">No Records Found</h3>
          <p className="text-muted-foreground mt-2">Refine your search parameters.</p>
        </div>
      )}
    </div>
  );
}
