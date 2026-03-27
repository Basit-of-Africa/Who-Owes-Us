'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { calculateAccountabilityScore } from '@/lib/scoring';
import { 
  ArrowLeft, Landmark, Calendar, ShieldAlert, 
  Download, Gavel, Wallet, Clock, 
  ExternalLink, FileText, Info, Loader2, User, ChevronRight,
  ShieldCheck, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { BadgeList } from '@/components/BadgeList';
import { FactSnippet } from '@/components/FactSnippet';
import { ScoreBreakdownChart } from '@/components/ScoreBreakdownChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Politician } from '@/lib/types';

export default function PoliticianProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { db } = useFirebase();

  const polRef = useMemo(() => id && db ? doc(db, 'politicians', id as string) : null, [id, db]);
  const { data: politician, loading: polLoading } = useDoc<any>(polRef);

  const casesRef = useMemo(() => id && db ? collection(db, 'politicians', id as string, 'cases') : null, [id, db]);
  const { data: casesData, loading: casesLoading } = useCollection<any>(casesRef);

  const officesRef = useMemo(() => id && db ? collection(db, 'politicians', id as string, 'offices') : null, [id, db]);
  const { data: officesData, loading: officesLoading } = useCollection<any>(officesRef);

  const fullPolitician = useMemo(() => {
    if (!politician) return null;
    return {
      ...politician,
      cases: casesData || [],
      offices: officesData || [],
      detentions: [],
      forfeitures: [],
    } as Politician;
  }, [politician, casesData, officesData]);

  if (polLoading || casesLoading || officesLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground font-black uppercase tracking-widest text-[10px]">Assembling Investigative Dossier...</p>
      </div>
    );
  }

  if (!fullPolitician) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary/5 p-12 rounded-[3rem] inline-block mb-8">
           <ShieldAlert className="w-16 h-16 text-muted-foreground/30 mx-auto" />
        </div>
        <h1 className="text-2xl font-black mb-4 uppercase tracking-tight">Record Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested dossier is not currently archived in our registry.</p>
        <Button onClick={() => router.push('/')} className="bg-primary font-black uppercase tracking-widest px-8 h-12 rounded-xl">Return to Registry</Button>
      </div>
    );
  }

  const scoreBreakdown = calculateAccountabilityScore(fullPolitician);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group uppercase text-[10px] font-black tracking-[0.2em]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Global Audit Leaderboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-48 md:w-72 aspect-square rounded-[2rem] md:rounded-[3rem] bg-white border-8 border-primary/5 shadow-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:opacity-50 transition-opacity" />
               <User className="w-24 md:w-32 h-24 md:h-32 text-primary opacity-20 relative z-10 group-hover:scale-110 transition-transform duration-500" />
               {scoreBreakdown.total >= 50 && (
                 <div className="absolute top-4 left-4 z-20">
                   <Badge variant="destructive" className="font-black text-[8px] uppercase tracking-widest px-2 py-0.5 shadow-lg border-none">
                     High Risk
                   </Badge>
                 </div>
               )}
            </div>
            <div className="flex-grow space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest">
                    {fullPolitician.primaryParty} Affiliate
                  </Badge>
                  <Badge variant="outline" className="border-primary/5 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
                    Verified ID: {fullPolitician.id.substring(0, 8).toUpperCase()}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-primary leading-none uppercase tracking-tighter">
                  {fullPolitician.fullName}
                </h1>
              </div>
              
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium italic border-l-4 border-accent/20 pl-6 py-2">
                {fullPolitician.bio || "No biography available in the public archive. Dossier based strictly on legal and financial footprints."}
              </p>

              <BadgeList politician={fullPolitician} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4 bg-primary/5 border-b border-primary/5 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/60 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                Audit Scorecard
              </CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-primary/20 hover:text-primary transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white p-6 rounded-2xl shadow-2xl border-none">
                  <h4 className="font-black text-primary text-xs uppercase tracking-widest mb-4">Accountability Algorithm</h4>
                  <div className="space-y-3 text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
                    <div className="flex justify-between border-b border-primary/5 pb-2"><span>Conviction</span><span className="text-accent">+8 pts</span></div>
                    <div className="flex justify-between border-b border-primary/5 pb-2"><span>Formal Charge</span><span className="text-accent">+4 pts</span></div>
                    <div className="flex justify-between border-b border-primary/5 pb-2"><span>Active Inquiry</span><span className="text-accent">+2 pts</span></div>
                    <div className="flex justify-between border-b border-primary/5 pb-2"><span>Restitution</span><span className="text-accent">log10($) x 5</span></div>
                    <div className="flex justify-between"><span>Detention</span><span className="text-accent">Days / 30</span></div>
                  </div>
                  <p className="mt-4 text-[8px] text-muted-foreground italic font-medium leading-relaxed">
                    Higher scores indicate greater documented legal entanglements and public fund misappropriation.
                  </p>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-end gap-4 mb-8">
                <div className="text-6xl font-black text-primary leading-none tracking-tighter">
                  {scoreBreakdown.total.toFixed(1)}
                </div>
                <div className="pb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Score</p>
                  <AccountabilityBadge score={Math.round(scoreBreakdown.total)} className="py-0.5 text-[9px] font-black uppercase border-none px-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-primary/5">
                <div className="space-y-1">
                  <p className="text-2xl font-black text-primary">{scoreBreakdown.convictionCount}</p>
                  <p className="text-[8px] opacity-60 uppercase font-black tracking-[0.2em]">Convictions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-primary">{scoreBreakdown.chargeCount}</p>
                  <p className="text-[8px] opacity-60 uppercase font-black tracking-[0.2em]">Charges</p>
                </div>
                <div className="space-y-1 col-span-2 pt-4">
                  <p className="text-3xl font-black text-accent truncate">
                    ₦{fullPolitician.totalForfeiture >= 1000000000 
                      ? `${(fullPolitician.totalForfeiture / 1000000000).toFixed(1)}B` 
                      : `${(fullPolitician.totalForfeiture / 1000000).toFixed(0)}M`}
                  </p>
                  <p className="text-[8px] opacity-60 uppercase font-black tracking-[0.2em]">Public Asset Restitution</p>
                </div>
              </div>

              <ScoreBreakdownChart breakdown={scoreBreakdown} />

              <Button className="w-full mt-10 bg-primary hover:bg-primary/90 text-white gap-3 font-black shadow-xl rounded-xl h-14 uppercase tracking-widest text-[10px]">
                <Download className="w-4 h-4" />
                Download Integrity Report
              </Button>
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-white border-primary/5 rounded-3xl p-6 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <AlertTitle className="text-primary font-black uppercase tracking-widest text-[10px] ml-2">Verification Policy</AlertTitle>
            <AlertDescription className="text-muted-foreground text-[10px] leading-relaxed ml-2 mt-2 font-medium">
              Every case record is indexed from official court gazettes, EFCC/ICPC archives, or verified investigative media partners.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <Tabs defaultValue="footprint" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 h-16 bg-primary/5 border-none p-1.5 rounded-[1.5rem] md:rounded-[2rem]">
              <TabsTrigger value="footprint" className="gap-2 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl rounded-xl md:rounded-[1.5rem]">
                <History className="w-4 h-4" />
                Corruption Footprint
              </TabsTrigger>
              <TabsTrigger value="service" className="gap-2 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl rounded-xl md:rounded-[1.5rem]">
                <Landmark className="w-4 h-4" />
                Public Service
              </TabsTrigger>
              <TabsTrigger value="assets" className="gap-2 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl rounded-xl md:rounded-[1.5rem]">
                <Wallet className="w-4 h-4" />
                Asset Audit
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="footprint" className="space-y-10">
              <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                 <Gavel className="w-5 h-5 text-accent" />
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Chronological Case Registry</h2>
              </div>

              {fullPolitician.cases.length > 0 ? fullPolitician.cases.map((c, idx) => (
                <div key={idx} className="relative pl-12 border-l-4 border-primary/5 last:border-0 pb-12">
                  <div className="absolute left-[-10px] top-0 w-4 h-4 rounded-full bg-accent shadow-[0_0_20px_rgba(20,184,166,0.5)] border-4 border-white" />
                  <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4 bg-secondary/5 group-hover:bg-accent/5 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">
                        {new Date(c.caseStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </span>
                      <Badge className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm border-none",
                        c.status === 'convicted' ? "bg-red-500 text-white" : 
                        c.status === 'charged' ? "bg-orange-500 text-white" :
                        "bg-sky-500 text-white"
                      )}>
                        {c.status.replace('_', ' ')}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <h3 className="text-2xl font-black text-primary leading-tight uppercase tracking-tight">{c.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm font-medium">{c.description}</p>
                      
                      <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Verified Amount Involved</p>
                          <p className="text-lg font-black text-primary">
                            {c.currency} {c.amountInvolved.toLocaleString()}
                            <span className="text-[10px] font-medium text-muted-foreground ml-2 opacity-50 uppercase">Public Funds</span>
                          </p>
                        </div>
                        <Button variant="ghost" className="h-10 px-6 rounded-xl text-accent font-black uppercase tracking-widest text-[9px] gap-2 hover:bg-accent/5">
                          View Verification Sources
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )) : (
                <div className="text-center py-32 bg-primary/5 rounded-[3rem] border-4 border-dashed border-primary/5">
                  <div className="bg-white p-6 rounded-full inline-block mb-6 shadow-sm">
                    <FileText className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-[11px] px-8">No formal legal records found in the investigative database.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="service">
              <div className="grid gap-6">
                {fullPolitician.offices.length > 0 ? fullPolitician.offices.map((office, idx) => (
                  <Card key={idx} className="border-none shadow-sm rounded-3xl hover:bg-secondary/5 transition-all p-8 md:p-10">
                    <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-2">
                        <p className="font-black text-primary text-2xl md:text-3xl uppercase tracking-tighter">{office.officeTitle}</p>
                        <div className="flex items-center gap-3">
                           <Badge className="bg-primary/5 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3">
                             {office.state || 'Federal Executive'}
                           </Badge>
                           <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Administrative Audit</span>
                        </div>
                      </div>
                      <div className="text-left md:text-right flex-shrink-0">
                        <div className="flex items-center md:justify-end gap-2 text-accent font-black text-xl mb-1">
                           <Clock className="w-4 h-4" />
                           {new Date(office.startDate).getFullYear()} — {office.endDate ? new Date(office.endDate).getFullYear() : 'Active'}
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Verified Tenure Timeline</p>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                   <div className="text-center py-32 bg-primary/5 rounded-[3rem] border-4 border-dashed border-primary/5">
                    <Landmark className="w-12 h-12 mx-auto mb-6 text-muted-foreground/20" />
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-[11px] px-8">No public service history found in the administrative archive.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="assets">
              <div className="grid gap-8">
                {fullPolitician.totalForfeiture > 0 ? (
                  <Card className="border-none shadow-2xl bg-primary text-white rounded-[3rem] overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                    <Wallet className="w-48 h-48 absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
                    <CardContent className="p-12 md:p-16 relative z-10 space-y-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Total Public Recovery Value</p>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">₦{(fullPolitician.totalForfeiture).toLocaleString()}</h2>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
                         <Badge className="bg-white/10 text-white border-none px-4 py-2 font-black uppercase text-[9px] tracking-widest backdrop-blur-md">
                           Asset Seizure Verified
                         </Badge>
                         <Badge className="bg-white/10 text-white border-none px-4 py-2 font-black uppercase text-[9px] tracking-widest backdrop-blur-md">
                           Court Ordered Restitution
                         </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-32 bg-primary/5 rounded-[3rem] border-4 border-dashed border-primary/5">
                    <div className="bg-white p-6 rounded-full inline-block mb-6">
                      <Wallet className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-[11px] px-8">No public assets have been officially recovered from this individual's record.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-12">
           <FactSnippet politician={fullPolitician} />
           
           <Card className="bg-white border-4 border-primary/5 shadow-2xl rounded-[2.5rem] p-8 space-y-8">
             <div className="p-4 bg-accent/5 rounded-2xl inline-block">
                <ShieldAlert className="w-8 h-8 text-accent" />
             </div>
             <div className="space-y-4">
               <h3 className="text-xl font-black text-primary uppercase tracking-tight">
                 Contribute Records
               </h3>
               <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                 Every record archived here must be verifiable by primary sources. If you possess documented court rulings, official gazettes, or verified media reports missing from this dossier, please submit them for peer-review.
               </p>
             </div>
             <Button variant="outline" className="w-full border-primary/10 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all rounded-xl h-14 gap-2 shadow-sm">
               Submit Primary Source
               <ChevronRight className="w-4 h-4" />
             </Button>
           </Card>

           <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-dashed border-primary/10">
              <p className="text-[9px] text-center font-black uppercase tracking-[0.3em] text-primary/40 leading-relaxed italic">
                "Archive access is provided for transparency and civic education. All scores are dynamic based on evolving legal status."
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
