'use client';

import { useState, useMemo } from 'react';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { X, Scale, Wallet, Loader2, Users, User, Landmark, ShieldCheck, Search } from 'lucide-react';
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
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredOptions = useMemo(() => {
    if (!politicians) return [];
    return politicians.filter((p: any) => 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [politicians, searchQuery]);

  const selectedPoliticians = useMemo(() => {
    if (!politicians) return [];
    return selectedIds.map(id => politicians.find((p: any) => p.id === id)!).filter(Boolean);
  }, [selectedIds, politicians]);

  if (loading && !politicians) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground font-medium uppercase tracking-widest text-xs">Opening Audit Matrix...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-headline font-black text-primary mb-2 uppercase tracking-tight">Audit Comparison</h1>
        <p className="text-sm md:text-base text-muted-foreground font-medium">Select up to 3 figures to audit their records side-by-side.</p>
      </div>

      <section className="mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-[10px] md:text-xs font-black flex items-center gap-2 text-primary uppercase tracking-widest">
            <Users className="w-4 h-4 text-accent" />
            Registry Selection ({politicians?.length || 0})
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search registry..." 
              className="pl-10 h-10 bg-white border-primary/10 rounded-xl md:rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredOptions.map((p: any) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={cn(
                  "group relative p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 md:gap-3",
                  isSelected 
                    ? "bg-primary border-primary shadow-xl scale-105" 
                    : "bg-white border-transparent hover:border-accent/30 shadow-sm"
                )}
              >
                <div className={cn(
                  "p-2 md:p-3 rounded-lg md:rounded-xl transition-colors",
                  isSelected ? "bg-white/10" : "bg-primary/5 group-hover:bg-primary/10"
                )}>
                  <Landmark className={cn("w-5 h-5 md:w-6 md:h-6", isSelected ? "text-white" : "text-primary")} />
                </div>
                <div className="space-y-1">
                  <p className={cn("font-black text-[9px] md:text-[10px] leading-tight line-clamp-2", isSelected ? "text-white" : "text-primary")}>
                    {p.fullName}
                  </p>
                  <p className={cn("text-[7px] md:text-[8px] font-bold uppercase tracking-tighter", isSelected ? "text-white/60" : "text-muted-foreground")}>
                    {p.primaryParty}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 bg-accent text-white p-1 rounded-full shadow-lg">
                    <X className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="relative mb-8 md:mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-primary/5"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 md:px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Comparative Matrix</span>
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        {selectedPoliticians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {selectedPoliticians.map((p: any) => (
              <Card key={p.id} className="border-none overflow-hidden relative shadow-2xl bg-white rounded-2xl md:rounded-3xl group">
                <button 
                  onClick={() => toggleSelect(p.id)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-lg backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-[4/3] relative bg-primary/5 flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Landmark className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                     <p className="text-accent text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">{p.primaryParty}</p>
                     <h2 className="text-white text-xl md:text-2xl font-black leading-tight">{p.fullName}</h2>
                  </div>
                </div>

                <CardContent className="p-0 divide-y divide-primary/5">
                  <div className="p-4 md:p-6 flex items-center justify-between bg-secondary/10">
                    <span className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Accountability Score</span>
                    <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-sm bg-white border-none text-xs" />
                  </div>

                  <div className="p-4 md:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] md:text-xs font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                        <Wallet className="w-3.5 md:w-4 h-3.5 md:h-4 text-accent" />
                        Restitution
                      </span>
                      <span className="text-xl md:text-2xl font-black text-accent truncate">
                        ₦{p.totalForfeiture >= 1000000000 
                          ? `${(p.totalForfeiture / 1000000000).toFixed(1)}B` 
                          : `${(p.totalForfeiture / 1000000).toFixed(0)}M`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 space-y-4">
                     <div className="flex justify-between text-[10px] md:text-xs">
                        <span className="text-muted-foreground font-black uppercase tracking-tighter">Archived Cases</span>
                        <span className="font-black text-primary">{p.cases?.length || 0}</span>
                     </div>
                     <div className="flex justify-between text-[10px] md:text-xs items-center">
                        <span className="text-muted-foreground font-black uppercase tracking-tighter">Status</span>
                        <Badge variant="outline" className="border-accent/20 text-accent font-black text-[8px] md:text-[9px] uppercase tracking-widest bg-accent/5">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-40 bg-white rounded-2xl md:rounded-3xl border-4 border-dashed border-primary/5">
             <Scale className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-muted-foreground opacity-20" />
             <h2 className="text-xl md:text-2xl font-black text-primary mb-2 uppercase tracking-tight">Audit Matrix Ready</h2>
             <p className="text-sm md:text-base text-muted-foreground max-w-[280px] md:max-w-sm mx-auto font-medium">Select figures from the registry above to begin a comparative audit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
