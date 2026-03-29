'use client';

import { useState, useMemo } from 'react';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { X, Scale, Wallet, Loader2, Users, Landmark, Search, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { db } = useFirebase();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const politiciansQuery = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansQuery);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const filteredOptions = useMemo(() => {
    if (!politicians) return [];
    return [...politicians]
      .filter((p: any) => {
        const nameMatch = (p.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const partyMatch = (p.primaryParty || '').toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || partyMatch;
      })
      .sort((a, b) => ((b as any).totalForfeiture || 0) - ((a as any).totalForfeiture || 0));
  }, [politicians, searchQuery]);

  const selectedPoliticians = useMemo(() => {
    if (!politicians) return [];
    return selectedIds
      .map(id => politicians.find((p: any) => p.id === id))
      .filter((p): p is any => !!p);
  }, [selectedIds, politicians]);

  // Loading state
  if (loading && (!politicians || politicians.length === 0)) {
    return (
      <div className="container mx-auto px-6 md:px-[50px] py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground font-black uppercase tracking-widest text-[10px]">Opening Audit Matrix...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-[50px] py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-none px-4 py-1 font-black uppercase text-[10px] tracking-widest">
            Comparative Matrix
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter">Cross-Audit Figures</h1>
          <p className="text-muted-foreground font-medium max-w-lg">Select up to three political figures from the registry to perform a side-by-side accountability audit.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or party..." 
            className="pl-12 h-12 bg-white border-none shadow-sm rounded-xl focus:ring-2 focus:ring-accent font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
          <Users className="w-5 h-5 text-accent" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Registry Selection ({selectedIds.length}/3)</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOptions.map((p: any, index: number) => {
            const isSelected = selectedIds.includes(p.id);
            const rank = index + 1;
            
            return (
              <Card 
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={cn(
                  "group cursor-pointer transition-all duration-300 border-none overflow-hidden relative rounded-2xl md:rounded-[2rem] flex flex-col",
                  isSelected 
                    ? "ring-4 ring-accent shadow-2xl scale-[1.02] bg-accent/5" 
                    : "bg-white shadow-md hover:shadow-xl hover:translate-y-[-4px]"
                )}
              >
                <div className="aspect-[4/3] relative bg-primary/5 flex items-center justify-center">
                  <div className={cn(
                    "flex flex-col items-center gap-3 transition-all duration-500",
                    isSelected ? "opacity-30 scale-110" : "opacity-10 group-hover:opacity-20"
                  )}>
                    <Landmark className="w-16 h-16 text-primary" />
                  </div>
                  
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                    {isSelected ? (
                      <div className="bg-accent text-white p-2 rounded-full shadow-lg animate-in zoom-in-50">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-lg bg-white/95 backdrop-blur-md border-none text-[10px]" />
                    )}
                  </div>

                  {rank <= 3 && !isSelected && (
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className={cn(
                        "px-2 py-0.5 font-black uppercase text-[8px] tracking-widest border-none flex items-center gap-1 shadow-sm",
                        rank === 1 ? "bg-yellow-500 text-white" : rank === 2 ? "bg-slate-400 text-white" : "bg-orange-600 text-white"
                      )}>
                        #{rank}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent">
                     <p className="text-accent text-[8px] font-black uppercase tracking-[0.2em] mb-1">{p.primaryParty}</p>
                     <h3 className="text-white text-lg font-black leading-tight uppercase tracking-tight">{p.fullName}</h3>
                  </div>
                </div>
                <CardContent className="p-4 flex items-center justify-between bg-white">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Amount Tied</p>
                    <p className="text-sm font-black text-primary">
                      {p.totalForfeiture >= 1000000000 
                        ? `₦${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                        : p.totalForfeiture >= 1000000 
                          ? `₦${(p.totalForfeiture / 1000000).toFixed(0)}M`
                          : `₦${(p.totalForfeiture || 0).toLocaleString()}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className={cn(
                    "text-[10px] font-black uppercase tracking-widest h-8 rounded-lg",
                    isSelected ? "text-accent bg-accent/10" : "text-muted-foreground"
                  )}>
                    {isSelected ? 'Remove' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-primary/5"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
            <Scale className="w-4 h-4" />
            Comparative Audit Matrix
          </span>
        </div>
      </div>

      <div className="mt-12">
        {selectedPoliticians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedPoliticians.map((p: any) => (
              <Card key={p.id} className="border-none overflow-hidden relative shadow-2xl bg-white rounded-[2rem] group flex flex-col">
                <button 
                  onClick={() => toggleSelect(p.id)}
                  className="absolute top-6 right-6 z-20 p-2.5 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-lg backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-video relative bg-primary/5 flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Landmark className="w-20 h-20 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                  <div className="absolute bottom-6 left-8 right-8">
                     <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-2">{p.primaryParty}</p>
                     <h2 className="text-white text-3xl font-black leading-tight uppercase tracking-tighter">{p.fullName}</h2>
                  </div>
                </div>

                <CardContent className="p-0 flex-grow divide-y divide-primary/5">
                  <div className="p-8 flex items-center justify-between bg-secondary/10">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Audit Score</span>
                    <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-sm bg-white border-none text-xs font-black px-4 py-2" />
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                        <Wallet className="w-4 h-4 text-accent" />
                        Restitution Tied
                      </span>
                      <span className="text-2xl font-black text-accent truncate">
                        ₦{p.totalForfeiture >= 1000000000 
                          ? `${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                          : p.totalForfeiture >= 1000000
                            ? `${(p.totalForfeiture / 1000000).toFixed(0)}M`
                            : (p.totalForfeiture || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-primary/5">
                       <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="text-muted-foreground uppercase tracking-widest">Archived Cases</span>
                          <span className="text-primary text-base">{(p.cases?.length) || 0}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="text-muted-foreground uppercase tracking-widest">Audit Status</span>
                          <Badge variant="outline" className="border-accent/20 text-accent font-black text-[9px] uppercase tracking-widest bg-accent/5 px-3 py-1">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                            Verified
                          </Badge>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] border-4 border-dashed border-primary/5 shadow-inner">
             <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
               <Scale className="w-10 h-10 text-muted-foreground opacity-30" />
             </div>
             <h2 className="text-2xl font-black text-primary mb-3 uppercase tracking-tight">Audit Matrix Ready</h2>
             <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">Select up to three figures from the registry above to begin a comparative accountability audit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
