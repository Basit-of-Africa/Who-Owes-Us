'use client';

import Link from 'next/link';
import { useFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  ShieldCheck, ArrowRight, BarChart3, Database,
  Landmark, Users, TrendingUp, Fingerprint,
  FileSearch, Activity, Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const { db } = useFirebase();
  const politiciansRef = db ? collection(db, 'politicians') : null;
  const { data: politicians } = useCollection(politiciansRef);

  const totalTracked = politicians?.length || 0;
  const totalForfeited = politicians?.reduce((acc, p: any) => acc + (p.totalForfeiture || 0), 0) || 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION - Edge-to-Edge Background */}
      <section className="bg-primary text-white py-12 md:py-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        
        {/* Hero Content - Padding to match container */}
        <div className="container mx-auto px-6 md:px-[50px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 animate-in fade-in slide-in-from-top-4 duration-700">
                <Activity className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Live Registry Active</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-left-8 duration-700">
                Who <br className="md:hidden" /> Owes <br className="md:hidden" /> <span className="text-accent">Us?</span>
              </h1>
              
              <p className="text-base md:text-xl font-medium text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Monitoring verified legal footprints, asset forfeitures, and accountability scores of Nigerian public officials since 2014.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 md:pt-6 animate-in fade-in zoom-in-95 duration-700 delay-300">
                <Link href="/leaderboard" className="w-full sm:w-auto">
                  <button className="w-full bg-accent text-white hover:bg-white hover:text-primary h-14 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all flex items-center justify-center gap-2 group">
                    Explore Registry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/compare" className="w-full sm:w-auto">
                  <button className="w-full bg-white/5 hover:bg-white/10 text-white h-14 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">
                    Audit Matrix
                  </button>
                </Link>
              </div>

              {/* Ticker for "Trending Audits" */}
              <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 opacity-60">
                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-accent" /> Trending Audits:
                </span>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {['Bola Tinubu', 'Ahmed Idris', 'Peter Obi', 'Atiku Abubakar'].map((name) => (
                    <span key={name} className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest bg-white/5 px-2 md:px-3 py-1 rounded-md">{name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white shadow-none rounded-[1.5rem] md:rounded-[2rem]">
                  <CardContent className="p-6 md:p-8 space-y-2">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-accent mb-2 md:mb-4" />
                    <h4 className="text-3xl md:text-4xl font-black tracking-tighter">{totalTracked}</h4>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">Dossiers Tracked</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white shadow-none rounded-[1.5rem] md:rounded-[2rem] sm:mt-8">
                  <CardContent className="p-6 md:p-8 space-y-2">
                    <Fingerprint className="w-6 h-6 md:w-8 md:h-8 text-accent mb-2 md:mb-4" />
                    <h4 className="text-3xl md:text-4xl font-black tracking-tighter">100%</h4>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">Source-Backed</p>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2 bg-accent/20 border-accent/30 backdrop-blur-md text-white shadow-none rounded-[1.5rem] md:rounded-[2rem]">
                  <CardContent className="p-6 md:p-8 flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-black tracking-tighter">
                        ₦{totalForfeited >= 1000000000 
                          ? `${(totalForfeited / 1000000000).toFixed(1)}B` 
                          : `${(totalForfeited / 1000000).toFixed(0)}M`}
                      </h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60">Total Restitution Logged</p>
                    </div>
                    <Database className="w-10 h-10 md:w-12 md:h-12 text-accent opacity-40" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-[50px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px] md:text-xs flex items-center gap-3">
                  <span className="w-10 h-[2px] bg-accent" />
                  National Mandate
                </p>
                <h2 className="text-3xl md:text-6xl font-black text-primary uppercase tracking-tight leading-none">
                  Transparency <br/><span className="text-accent">Built on Data.</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                  "Who Owes Us?" is an independent platform archiving verifiable public records. We provide citizens with a data-first view of legal history to foster national accountability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-4 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white shadow-md rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                    <FileSearch className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-base md:text-lg uppercase tracking-tight">Verified Records</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Indexed from court gazettes, investigative media, and official anti-corruption archives.</p>
                </div>
                <div className="space-y-4 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white shadow-md rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Database className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-base md:text-lg uppercase tracking-tight">Audit Archive</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Historical tenures and legal statuses tracked across all branches of government.</p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-primary p-8 md:p-16 text-white relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                <ShieldCheck className="w-48 h-48 md:w-64 md:h-64" />
              </div>
              <div className="space-y-6 md:space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                   <Info className="w-4 h-4 text-accent" />
                   <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">The Audit Formula</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">Mathematical <br/>Integrity Scoring</h3>
                <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed">
                  Our algorithm weights documented legal outcomes against financial impact to provide a non-biased accountability score.
                </p>
                <div className="space-y-4 md:space-y-5 pt-6 md:pt-8 border-t border-white/10">
                  <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-white/60">Conviction</span>
                     <span className="text-accent font-bold">+8.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-white/60">Formal Charge</span>
                     <span className="text-accent font-bold">+4.0 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-white/60">Public Forfeiture</span>
                     <span className="text-accent font-bold">log10(₦) x 5</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-white py-16 md:py-24 border-y md:rounded-[3rem] shadow-sm">
        <div className="container mx-auto px-6 md:px-[50px] text-center space-y-6 md:space-y-8">
           <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-none px-4 md:px-6 py-1 md:py-1.5 font-black uppercase tracking-widest text-[9px] md:text-[10px]">
             Registry Status: Live
           </Badge>
           <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-primary">Begin Your Audit</h3>
           <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-base md:text-lg">Explore the national registry or perform a side-by-side comparison of public officials.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
             <Link href="/leaderboard" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl transform hover:-translate-y-1">
                Registry Index <ArrowRight className="w-4 h-4" />
             </Link>
             <Link href="/compare" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-secondary text-primary px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-md transform hover:-translate-y-1">
                Compare Officials <BarChart3 className="w-4 h-4" />
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
