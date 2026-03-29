'use client';

import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Landmark, History, Scale, Gavel, Info, ChevronRight, 
  ShieldCheck, ArrowRight, BarChart3, Trophy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

export default function HomePage() {
  const { db } = useFirebase();
  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians } = useCollection(politiciansRef);

  const totalRestitution = useMemo(() => {
    return politicians?.reduce((sum, p) => sum + ((p as any).totalForfeiture || 0), 0) || 0;
  }, [politicians]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-primary text-white overflow-hidden py-24 md:py-40">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/50 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <Badge className="bg-accent/20 text-accent hover:bg-accent/20 border-accent/30 px-6 py-2 font-black uppercase tracking-[0.4em] text-xs">
              National Restitution Registry
            </Badge>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9]">
              Who Owes Us?
            </h1>
            <p className="text-xl md:text-4xl font-medium text-white/70 max-w-2xl mx-auto italic leading-tight">
              "An independent, data-driven archive monitoring the corruption records and financial restitution history of public officials."
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
              <Link href="/leaderboard">
                <button className="bg-white text-primary hover:bg-white/90 h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3">
                  <Trophy className="w-5 h-5" />
                  View Global Leaderboard
                </button>
              </Link>
              <Link href="/compare">
                <button className="bg-accent hover:bg-accent/90 text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3">
                  <Scale className="w-5 h-5" />
                  Audit Matrix
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-secondary/20 border-y border-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tracked Restitution</p>
              <p className="text-4xl font-black text-accent">₦{(totalRestitution / 1000000000).toFixed(1)}B+</p>
            </div>
            <div className="space-y-1 border-x border-primary/5 px-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Dossiers</p>
              <p className="text-4xl font-black text-primary">{(politicians?.length) || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Inquiries</p>
              <p className="text-4xl font-black text-primary">244+</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & PILLARS SECTION */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-accent font-black uppercase tracking-[0.3em] text-xs">The Mandate</p>
                <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none">Civic Accountability <br/>Through Data.</h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                  We believe that transparency is the first step toward national restitution. By archiving verifiable public records, we provide citizens with a clear view of the legal and financial footprints of those entrusted with public power.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 p-8 bg-secondary/10 rounded-[2.5rem] border border-primary/5 group hover:bg-primary hover:text-white transition-all duration-500">
                  <div className="w-14 h-14 bg-primary group-hover:bg-accent rounded-2xl flex items-center justify-center transition-colors">
                    <History className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black uppercase tracking-tight text-xl">Verified Footprints</h3>
                  <p className="text-sm font-medium opacity-70">Every record is indexed from court gazettes, investigative media, and anti-corruption archives.</p>
                </div>
                <div className="space-y-4 p-8 bg-secondary/10 rounded-[2.5rem] border border-primary/5 group hover:bg-accent hover:text-white transition-all duration-500">
                  <div className="w-14 h-14 bg-accent group-hover:bg-primary rounded-2xl flex items-center justify-center transition-colors">
                    <Scale className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black uppercase tracking-tight text-xl">Audit Matrix</h3>
                  <p className="text-sm font-medium opacity-70">Perform side-by-side comparisons of restitution history and legal status across officials.</p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden bg-primary p-16 text-white relative group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Gavel className="w-48 h-48" />
              </div>
              <div className="space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md">
                   <Info className="w-4 h-4 text-accent" />
                   <span className="text-[10px] font-black uppercase tracking-widest">The Audit Formula</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Mathematical Integrity Scoring</h3>
                <p className="text-xl text-white/70 font-medium leading-relaxed">
                  Our algorithm weights legal outcomes against financial impact. Convictions carry more weight than charges, and the volume of public funds involved adds a logarithmic factor to the final score.
                </p>
                <div className="space-y-5 pt-10 border-t border-white/10">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                     <span>Conviction Weight</span>
                     <span className="text-accent">+8.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                     <span>Formal Charge</span>
                     <span className="text-accent">+4.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                     <span>Public Forfeiture</span>
                     <span className="text-accent">log10(₦) x 5</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-secondary/10 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 space-y-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-8xl font-black text-primary uppercase tracking-tighter leading-none">Ready to Audit?</h2>
            <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
              Access the most comprehensive public record archive of Nigerian political figures. 
              Search the registry or compare multiple dossiers in the matrix.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <Link href="/leaderboard">
              <button className="bg-primary hover:bg-primary/90 text-white h-24 px-14 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-4">
                Enter Global Registry
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/compare">
              <button className="bg-accent hover:bg-accent/90 text-white h-24 px-14 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-4">
                Open Audit Matrix
                <BarChart3 className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
