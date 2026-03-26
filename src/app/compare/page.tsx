'use client';

import { useState, useMemo } from 'react';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Plus, X, BarChart3, Scale, Wallet, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
        <h1 className="text-4xl font-headline font-extrabold text-primary mb-2">Comparison Tool</h1>
        <p className="text-muted-foreground">Select up to 3 politicians to compare records, scores, and recoveries side-by-side.</p>
      </div>

      {/* Selection Area */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
          <Plus className="w-5 h-5" />
          Select from Registry
        </h3>
        <div className="flex flex-wrap gap-4">
          {politicians?.map((p: any) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all ${
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-white hover:border-accent text-muted-foreground"
                }`}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                  {p.profileImageUrl && (
                    <Image src={p.profileImageUrl} alt={p.fullName} fill className="object-cover" />
                  )}
                </div>
                <span className="font-bold text-sm">{p.fullName}</span>
                {isSelected && <X className="w-4 h-4 ml-1" />}
              </button>
            );
          })}
          {(!politicians || politicians.length === 0) && (
            <p className="text-sm text-muted-foreground italic">The registry is empty. Populate it via the Admin panel.</p>
          )}
        </div>
      </div>

      {selectedPoliticians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedPoliticians.map((p: any) => (
            <Card key={p.id} className="border-2 border-primary/10 overflow-hidden relative shadow-lg">
              <button 
                onClick={() => toggleSelect(p.id)}
                className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="aspect-video relative bg-muted">
                {p.profileImageUrl && (
                  <Image src={p.profileImageUrl} alt={p.fullName} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                   <h2 className="text-white text-xl font-bold">{p.fullName}</h2>
                   <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{p.primaryParty}</p>
                </div>
              </div>

              <CardContent className="p-0 divide-y">
                {/* Score Section */}
                <div className="p-6 space-y-4 bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold flex items-center gap-2 text-primary">
                      <Scale className="w-4 h-4" />
                      Accountability Score
                    </span>
                    <AccountabilityBadge score={Math.round(p.accountabilityScore || 0)} />
                  </div>
                </div>

                {/* Forfeiture Section */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold flex items-center gap-2 text-primary">
                      <Wallet className="w-4 h-4 text-accent" />
                      Public Restitution
                    </span>
                    <span className="text-2xl font-black text-accent">${((p.totalForfeiture || 0) / 1000000).toFixed(1)}M</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total assets recovered from corruption proceedings.</p>
                </div>

                {/* Bio Section */}
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block mb-2">Registry Bio</span>
                  <p className="text-xs text-muted-foreground line-clamp-3">{p.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {selectedIds.length < 3 && (
             <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-secondary/5">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-primary">Add another to compare</p>
                <p className="text-sm">You can compare up to 3 side-by-side.</p>
             </div>
          )}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-2xl border-2 border-dashed">
           <BarChart3 className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-30" />
           <h2 className="text-2xl font-bold text-primary mb-2">No politicians selected</h2>
           <p className="text-muted-foreground max-w-sm mx-auto">Click on the badges above to start comparing civic records from the registry.</p>
        </div>
      )}
    </div>
  );
}
