
'use client';

import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  History, Scale, Gavel, Info, 
  ShieldCheck, ArrowRight, BarChart3, Database,
  Landmark, Users, Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const { db } = useFirebase();
  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians } = useCollection(politiciansRef);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-primary text-white py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <Badge className="bg-accent text-white hover:bg-accent border-none px-6 py-1.5 font-black uppercase tracking-[0.3em] text-[10px] shadow-lg">
              Official Nigerian Registry
            </Badge>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
              Who Owes Us?
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/70 max-w-2xl mx-auto leading-relaxed">
              Monitoring verified legal footprints, asset forfeitures, and accountability scores of Nigerian public officials.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link href="/leaderboard" className="w-full sm:w-auto">
                <button className="w-full bg-white text-primary hover:bg-accent hover:text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all transform hover:-translate-y-1">
                  Access Registry
                </button>
              </Link>
              <Link href="/compare" className="w-full sm:w-auto">
                <button className="w-full bg-accent hover:bg-white hover:text-primary text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all transform hover:-translate-y-1">
                  Audit Matrix
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-accent font-black uppercase tracking-[0.4em] text-xs flex items-center gap-3">
                  <div className="w-10 h-[2px] bg-accent" />
                  National Mandate
                </p>
                <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tight leading-none">
                  Transparency <br/><span className="text-accent">Built on Data.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                  "Who Owes Us?" is an independent platform archiving verifiable public records. We provide citizens with a data-first view of legal history to foster national accountability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4 group">
                  <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                    <History className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-lg uppercase tracking-tight">Verified Records</h3>
                  <p className="text-sm text-muted-foreground font-medium">Indexed from court gazettes, investigative media, and official anti-corruption archives.</p>
                </div>
                <div className="space-y-4 group">
                  <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Database className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-lg uppercase tracking-tight">Audit Archive</h3>
                  <p className="text-sm text-muted-foreground font-medium">Historical tenures and legal statuses tracked across all three branches of government.</p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-primary p-12 md:p-16 text-white relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <ShieldCheck className="w-64 h-64" />
              </div>
              <div className="space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full border border-white/10">
                   <Info className="w-4 h-4 text-accent" />
                   <span className="text-[10px] font-black uppercase tracking-widest">The Audit Formula</span>
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Mathematical <br/>Integrity Scoring</h3>
                <p className="text-xl text-white/70 font-medium leading-relaxed">
                  Our algorithm weights documented legal outcomes against financial impact to provide a non-biased accountability score.
                </p>
                <div className="space-y-5 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-white/60">Conviction</span>
                     <span className="text-accent">+8.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-white/60">Formal Charge</span>
                     <span className="text-accent">+4.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-white/60">Public Forfeiture</span>
                     <span className="text-accent">log10(₦) x 5</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-white py-24 border-y">
        <div className="container mx-auto px-4 text-center space-y-8">
           <h3 className="text-3xl font-black uppercase tracking-tighter text-primary">Begin Your Audit</h3>
           <p className="text-muted-foreground max-w-2xl mx-auto font-medium">Explore the registry or perform a side-by-side comparison of public officials.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link href="/leaderboard" className="flex items-center justify-center gap-2 bg-secondary text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all">
                Registry Index <ArrowRight className="w-4 h-4" />
             </Link>
             <Link href="/compare" className="flex items-center justify-center gap-2 bg-secondary text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all">
                Compare Officials <BarChart3 className="w-4 h-4" />
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
