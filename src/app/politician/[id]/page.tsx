
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { calculateAccountabilityScore } from '@/lib/scoring';
import { 
  ArrowLeft, Landmark, Calendar, ShieldAlert, 
  Download, Gavel, Wallet, Clock, 
  ExternalLink, FileText, Info, Loader2, User, ChevronRight
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
        <p className="mt-4 text-muted-foreground font-medium uppercase tracking-widest text-xs">Aggregating public records...</p>
      </div>
    );
  }

  if (!fullPolitician) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black mb-4">Record not found</h1>
        <Button onClick={() => router.push('/')}>Return to Registry</Button>
      </div>
    );
  }

  const scoreBreakdown = calculateAccountabilityScore(fullPolitician);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group uppercase text-xs font-black tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Registry Leaderboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 aspect-square rounded-3xl bg-primary/5 border-4 border-white shadow-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
               <User className="w-32 h-32 text-primary opacity-20 relative z-10" />
            </div>
            <div className="flex-grow space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-headline font-black text-primary leading-tight">
                  {fullPolitician.fullName}
                </h1>
                <AccountabilityBadge score={scoreBreakdown.total} className="text-xl py-3 px-6 shadow-xl bg-white border-none" />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/5">
                  <Landmark className="w-4 h-4 text-accent" />
                  <span className="text-xs font-black text-primary uppercase tracking-widest">{fullPolitician.primaryParty}</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/5">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Active Figure</span>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground font-medium italic border-l-4 border-accent/20 pl-6 py-2">
                {fullPolitician.bio || "No biography available in the public archive."}
              </p>

              <BadgeList politician={fullPolitician} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 bg-white/5 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-widest font-black opacity-60 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Audit Scorecard
              </CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-white/40 hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white p-6 rounded-2xl shadow-2xl border-none">
                  <h4 className="font-black text-primary text-sm uppercase tracking-widest mb-3">Scoring Formula</h4>
                  <div className="space-y-3 text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tighter">
                    <div className="flex justify-between"><span>Conviction</span><span className="text-accent">+8 pts</span></div>
                    <div className="flex justify-between"><span>Charge</span><span className="text-accent">+4 pts</span></div>
                    <div className="flex justify-between"><span>Inquiry</span><span className="text-accent">+2 pts</span></div>
                    <div className="flex justify-between"><span>Restitution</span><span className="text-accent">log10($) x 5</span></div>
                    <div className="flex justify-between"><span>Detention</span><span className="text-accent">Days / 30</span></div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-3xl font-black">{scoreBreakdown.convictions}</p>
                  <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">Convictions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black">{scoreBreakdown.charges}</p>
                  <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">Charges</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-accent">${(fullPolitician.totalForfeiture / 1000000).toFixed(1)}M</p>
                  <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">Restitution</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black">{scoreBreakdown.investigations}</p>
                  <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">Inquiries</p>
                </div>
              </div>

              <ScoreBreakdownChart breakdown={scoreBreakdown} />

              <Button className="w-full mt-8 bg-accent hover:bg-accent/90 text-white gap-2 font-black shadow-lg rounded-xl h-12 uppercase tracking-widest text-xs">
                <Download className="w-4 h-4" />
                Archive Dossier
              </Button>
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-white border-primary/5 rounded-3xl p-6 shadow-sm">
            <Info className="h-5 w-5 text-accent" />
            <AlertTitle className="text-primary font-black uppercase tracking-widest text-[10px] ml-2">Integrity Verification</AlertTitle>
            <AlertDescription className="text-muted-foreground text-xs leading-relaxed ml-2 mt-2">
              Every case record is attributed to official gazettes or verified investigative media.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Separator className="mb-12 opacity-5" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Tabs defaultValue="cases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 h-14 bg-primary/5 border-none p-1 rounded-2xl">
              <TabsTrigger value="cases" className="gap-2 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-xl">
                <Gavel className="w-4 h-4" />
                Case History
              </TabsTrigger>
              <TabsTrigger value="offices" className="gap-2 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-xl">
                <Landmark className="w-4 h-4" />
                Public Service
              </TabsTrigger>
              <TabsTrigger value="restitution" className="gap-2 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-xl">
                <Wallet className="w-4 h-4" />
                Recovery
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cases" className="space-y-8">
              {fullPolitician.cases.length > 0 ? fullPolitician.cases.map((c, idx) => (
                <div key={idx} className="relative pl-10 border-l-4 border-primary/5 last:border-0 pb-10">
                  <div className="absolute left-[-10px] top-0 w-5 h-5 rounded-full bg-accent shadow-xl border-4 border-white" />
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 bg-secondary/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full">
                        {new Date(c.caseStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex gap-2">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                          c.status === 'convicted' ? "bg-red-500 text-white" : 
                          c.status === 'charged' ? "bg-orange-500 text-white" :
                          "bg-blue-500 text-white"
                        )}>
                          {c.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-black text-primary">{c.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm font-medium">{c.description}</p>
                      
                      <div className="pt-4 border-t border-primary/5 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Amount Involved</p>
                          <p className="text-sm font-black text-primary">{c.currency} {c.amountInvolved.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Verification</p>
                          <span className="text-[10px] text-accent font-black underline flex items-center justify-end gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                            Primary Source <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )) : (
                <div className="text-center py-20 bg-primary/5 rounded-3xl border-4 border-dashed border-primary/5">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No verifiable legal records archived.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="offices">
              <div className="grid gap-4">
                {fullPolitician.offices.length > 0 ? fullPolitician.offices.map((office, idx) => (
                  <Card key={idx} className="border-none shadow-sm rounded-2xl hover:bg-secondary/5 transition-colors">
                    <CardContent className="p-8 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-black text-primary text-xl">{office.officeTitle}</p>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{office.state || 'Federal Level'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-accent text-lg">{new Date(office.startDate).getFullYear()} - {office.endDate ? new Date(office.endDate).getFullYear() : 'Present'}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Tenure Audit</p>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                   <div className="text-center py-20 bg-primary/5 rounded-3xl border-4 border-dashed border-primary/5">
                    <Landmark className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No public service history recorded.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="restitution">
              <div className="grid gap-4">
                {fullPolitician.totalForfeiture > 0 ? (
                  <Card className="border-none shadow-2xl bg-accent text-white rounded-3xl overflow-hidden relative group">
                    <Wallet className="w-40 h-40 absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform" />
                    <CardContent className="p-10 relative z-10">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Public Asset Recovery</p>
                          <p className="text-5xl font-black">${(fullPolitician.totalForfeiture).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-20 bg-primary/5 rounded-3xl border-4 border-dashed border-primary/5">
                    <Wallet className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No public assets recovered on file.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-10">
           <FactSnippet politician={fullPolitician} />
           
           <Card className="bg-white border-2 border-primary/5 shadow-sm rounded-3xl p-6">
             <CardHeader className="p-0 mb-6">
               <CardTitle className="text-lg font-black flex items-center gap-3 text-primary uppercase tracking-tight">
                 <ShieldAlert className="w-6 h-6 text-accent" />
                 Contribute Records
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <p className="text-xs font-medium text-muted-foreground mb-6 leading-relaxed">
                 Every entry in our registry must be backed by documented evidence. Found a court ruling or credible news report missing? 
               </p>
               <Button variant="outline" className="w-full border-primary/10 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all rounded-xl h-12 gap-2">
                 Submit Primary Source
                 <ChevronRight className="w-3 h-3" />
               </Button>
             </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
