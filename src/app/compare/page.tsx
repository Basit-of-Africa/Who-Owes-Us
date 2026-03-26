
'use client';

import { useState, useMemo } from 'react';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Plus, X, BarChart3, Scale, Wallet, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import Image from 'next/image';

export default function ComparePage() {
  const { db } = useFirebase();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const politiciansQuery = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansQuery);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedPoliticians = useMemo(() => {
    if (!politicians) return [];
    return selectedIds.map(id => politicians.find((p: any) => p.id === id)!).filter(Boolean);
  }, [selectedIds, politicians]);

  if (loading && !politicians) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground">Loading Registry...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-extrabold text-primary mb-2">Registry Comparison</h1>
        <p className="text-muted-foreground">Select up to 3 public officials to audit their corruption footprints side-by-side.</p>
      </div>

      <div className="mb-12">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-primary uppercase tracking-widest">
          <Users className="w-4 h-4" />
          Quick Select
        </h3>
        <div className="flex flex-wrap gap-3">
          {politicians?.map((p: any) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                    : "bg-white hover:border-accent text-muted-foreground border-transparent shadow-sm"
                }`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
                  <Image 
                    src={p.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(p.fullName)}/400/400`} 
                    alt={p.fullName} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <span className="font-bold text-xs">{p.fullName}</span>
                {isSelected && <X className="w-3 h-3 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedPoliticians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedPoliticians.map((p: any) => (
            <Card key={p.id} className="border-2 border-primary/10 overflow-hidden relative shadow-xl hover:border-accent/20 transition-all">
              <button 
                onClick={() => toggleSelect(p.id)}
                className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="aspect-[4/3] relative bg-muted">
                <Image 
                  src={p.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(p.fullName)}/400/400`} 
                  alt={p.fullName} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                   <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{p.primaryParty}</p>
                   <h2 className="text-white text-xl font-bold leading-tight">{p.fullName}</h2>
                </div>
              </div>

              <CardContent className="p-0 divide-y">
                <div className="p-5 flex items-center justify-between bg-secondary/10">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Accountability</span>
                  <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} />
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-accent" />
                      Forfeitures
                    </span>
                    <span className="text-xl font-black text-accent">${((p.totalForfeiture || 0) / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                   <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Verified Cases</span>
                      <span className="font-bold">{p.cases?.length || 0}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Conviction Status</span>
                      <span className="font-bold text-red-600">
                        {p.cases?.some((c: any) => c.status === 'convicted') ? 'Convicted' : 'None'}
                      </span>
                   </div>
                </div>

                <div className="p-5">
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 italic">
                    {p.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {selectedIds.length < 3 && (
             <div className="border-4 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-secondary/5 border-primary/5">
                <BarChart3 className="w-12 h-12 mb-4 opacity-10" />
                <p className="font-bold text-primary mb-1">Add to Compare</p>
                <p className="text-xs">Compare side-by-side audit scores.</p>
             </div>
          )}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-3xl border-4 border-dashed border-primary/5">
           <Scale className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
           <h2 className="text-2xl font-bold text-primary mb-2">No Profiles Selected</h2>
           <p className="text-muted-foreground max-w-sm mx-auto">Pick up to 3 Nigerian politicians from the registry above to begin a comparative audit.</p>
        </div>
      )}
    </div>
  );
}
