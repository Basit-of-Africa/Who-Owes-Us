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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-black text-primary mb-2 uppercase tracking-tight">Audit Comparison</h1>
        <p className="text-muted-foreground font-medium">Select up to 3 figures to audit their records side-by-side.</p>
      </div>

      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-widest">
            <Users className="w-4 h-4 text-accent" />
            Registry Selection ({politicians?.length || 0})
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search registry..." 
              className="pl-10 h-10 bg-white border-primary/10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredOptions.map((p: any) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={cn(
                  "group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3",
                  isSelected 
                    ? "bg-primary border-primary shadow-xl scale-105" 
                    : "bg-white border-transparent hover:border-accent/30 shadow-sm"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  isSelected ? "bg-white/10" : "bg-primary/5 group-hover:bg-primary/10"
                )}>
                  <Landmark className={cn("w-6 h-6", isSelected ? "text-white" : "text-primary")} />
                </div>
                <div className="space-y-1">
                  <p className={cn("font-black text-[10px] leading-tight line-clamp-2", isSelected ? "text-white" : "text-primary")}>
                    {p.fullName}
                  </p>
                  <p className={cn("text-[8px] font-bold uppercase tracking-tighter", isSelected ? "text-white/60" : "text-muted-foreground")}>
                    {p.primaryParty}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-accent text-white p-1 rounded-full shadow-lg">
                    <X className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-primary/5"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Comparative Matrix</span>
        </div>
      </div>

      <div className="mt-12">
        {selectedPoliticians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedPoliticians.map((p: any) => (
              <Card key={p.id} className="border-none overflow-hidden relative shadow-2xl bg-white rounded-3xl group">
                <button 
                  onClick={() => toggleSelect(p.id)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-lg backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-[4/3] relative bg-primary/5 flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Landmark className="w-20 h-20 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                     <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">{p.primaryParty}</p>
                     <h2 className="text-white text-2xl font-black leading-tight">{p.fullName}</h2>
                  </div>
                </div>

                <CardContent className="p-0 divide-y divide-primary/5">
                  <div className="p-6 flex items-center justify-between bg-secondary/10">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Accountability Score</span>
                    <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} className="shadow-sm bg-white border-none" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                        <Wallet className="w-4 h-4 text-accent" />
                        Restitution
                      </span>
                      <span className="text-2xl font-black text-accent">${((p.totalForfeiture || 0) / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                     <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-black uppercase tracking-tighter">Archived Cases</span>
                        <span className="font-black text-primary">{p.cases?.length || 0}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-black uppercase tracking-tighter">Status</span>
                        <Badge variant="outline" className="border-accent/20 text-accent font-black text-[9px] uppercase tracking-widest bg-accent/5">
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
          <div className="text-center py-40 bg-white rounded-3xl border-4 border-dashed border-primary/5">
             <Scale className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
             <h2 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">Audit Matrix Ready</h2>
             <p className="text-muted-foreground max-w-sm mx-auto font-medium">Select figures from the registry above to begin a comparative audit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
