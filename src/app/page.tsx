
'use client';

import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Landmark, History, Scale, Gavel, Info, 
  ShieldCheck, ArrowRight, BarChart3, Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useMemo } from 'react';

export default function HomePage() {
  const { db } = useFirebase();
  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians } = useCollection(politiciansRef);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-primary text-white py-24 md:py-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-accent/20 text-accent hover:bg-accent/20 border-accent/30 px-4 py-1 font-bold uppercase tracking-widest text-xs">
              Independent Nigerian Registry
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-none">
              Who Owes Us?
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/80 max-w-2xl mx-auto leading-relaxed">
              Tracking transparency by monitoring verified corruption records and accountability scores of Nigerian public officials.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/leaderboard" className="w-full sm:w-auto">
                <button className="w-full bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg transition-all">
                  National Leaderboard
                </button>
              </Link>
              <Link href="/compare" className="w-full sm:w-auto">
                <button className="w-full bg-accent hover:bg-accent/90 text-white h-14 px-8 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg transition-all">
                  Audit Matrix
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-accent font-bold uppercase tracking-widest text-sm">The Mandate</p>
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tight leading-none">Civic Accountability Through Data.</h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  "Who Owes Us?" is an independent platform archiving verifiable public records. We provide citizens with a data-first view of legal and financial history to foster national restitution.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <History className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Verified Footprints</h3>
                  <p className="text-sm text-muted-foreground">Every record is indexed from court gazettes, investigative media, and anti-corruption archives.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg">Audit Matrix</h3>
                  <p className="text-sm text-muted-foreground">Perform side-by-side comparisons of restitution history and legal status across officials.</p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-primary p-12 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Gavel className="w-32 h-32" />
              </div>
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full">
                   <Info className="w-4 h-4 text-accent" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">The Audit Formula</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight">Mathematical Integrity Scoring</h3>
                <p className="text-lg text-white/70 font-medium">
                  Our algorithm weights documented legal outcomes against financial impact to provide a non-biased accountability score.
                </p>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                     <span>Conviction</span>
                     <span className="text-accent">+8.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                     <span>Formal Charge</span>
                     <span className="text-accent">+4.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                     <span>Public Forfeiture</span>
                     <span className="text-accent">log10(₦) x 5</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER DISCLAIMER STRIP */}
      <section className="bg-secondary/50 py-8 border-y">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground italic max-w-3xl mx-auto">
            Disclaimer: "Who Owes Us?" is an independent platform that aggregates information from publicly available sources. Inclusion does not imply guilt beyond established court rulings.
          </p>
          <Link href="/disclaimer" className="text-[10px] font-bold uppercase text-accent mt-2 inline-block hover:underline">
            Read Full Disclosure
          </Link>
        </div>
      </section>
    </div>
  );
}
