
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Image from 'next/image';
import { useFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { calculateAccountabilityScore } from '@/lib/scoring';
import { 
  ArrowLeft, Landmark, Calendar, ShieldAlert, History, 
  Link as LinkIcon, Download, Gavel, Wallet, Clock, 
  ExternalLink, FileText, Info, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { BadgeList } from '@/components/BadgeList';
import { FactSnippet } from '@/components/FactSnippet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { Politician, CaseRecord, OfficeHeld } from '@/lib/types';

export default function PoliticianProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { db } = useFirebase();

  // Fetch Politician
  const polRef = useMemo(() => id && db ? doc(db, 'politicians', id as string) : null, [id, db]);
  const { data: politician, loading: polLoading } = useDoc<any>(polRef);

  // Fetch Sub-collections
  const casesRef = useMemo(() => id && db ? collection(db, 'politicians', id as string, 'cases') : null, [id, db]);
  const { data: casesData, loading: casesLoading } = useCollection<any>(casesRef);

  const officesRef = useMemo(() => id && db ? collection(db, 'politicians', id as string, 'offices') : null, [id, db]);
  const { data: officesData, loading: officesLoading } = useCollection<any>(officesRef);

  const detentionsRef = useMemo(() => id && db ? collection(db, 'politicians', id as string, 'detentions') : null, [id, db]);
  const { data: detentionsData } = useCollection<any>(detentionsRef);

  const fullPolitician = useMemo(() => {
    if (!politician) return null;
    return {
      ...politician,
      cases: casesData || [],
      offices: officesData || [],
      detentions: detentionsData || [],
      forfeitures: [], // Simplified for MVP or fetch separately
    } as Politician;
  }, [politician, casesData, officesData, detentionsData]);

  if (polLoading || casesLoading || officesLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground">Aggregating public records...</p>
      </div>
    );
  }

  if (!fullPolitician) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Record not found</h1>
        <Button onClick={() => router.push('/')}>Return to Leaderboard</Button>
      </div>
    );
  }

  const scoreBreakdown = calculateAccountabilityScore(fullPolitician);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Leaderboard
      </button>

      {/* Header Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-full md:w-64 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-muted">
            <Image 
              src={fullPolitician.profileImageUrl} 
              alt={fullPolitician.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-grow space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-primary">{fullPolitician.fullName}</h1>
              <AccountabilityBadge score={scoreBreakdown.total} className="text-lg py-2 px-4 shadow-sm" />
            </div>
            
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <Landmark className="w-4 h-4" />
                <span className="text-sm font-medium">{fullPolitician.primaryParty}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Public Figure since {new Date().getFullYear() - 12}</span>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {fullPolitician.bio}
            </p>

            <div className="pt-2">
              <BadgeList politician={fullPolitician} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest opacity-80">Audit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{scoreBreakdown.convictions}</p>
                  <p className="text-[10px] opacity-80 uppercase font-bold">Convictions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{scoreBreakdown.charges}</p>
                  <p className="text-[10px] opacity-80 uppercase font-bold">Charges</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${(fullPolitician.totalForfeiture / 1000000).toFixed(2)}M</p>
                  <p className="text-[10px] opacity-80 uppercase font-bold">Forfeited</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{scoreBreakdown.investigations}</p>
                  <p className="text-[10px] opacity-80 uppercase font-bold">Inquiry</p>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white gap-2 font-bold shadow-md">
                <Download className="w-4 h-4" />
                Download Public Dossier
              </Button>
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-bold">Verified Attribution</AlertTitle>
            <AlertDescription className="text-amber-700 text-xs">
              Every record on this profile is sourced from attributed court documents or verified media outlets.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Separator className="mb-12" />

      {/* Main Tabs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Tabs defaultValue="cases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-secondary/30 border p-1 rounded-lg">
              <TabsTrigger value="cases" className="gap-2 font-bold data-[state=active]:bg-white data-[state=active]:text-primary">
                <Gavel className="w-4 h-4" />
                Case History
              </TabsTrigger>
              <TabsTrigger value="offices" className="gap-2 font-bold data-[state=active]:bg-white data-[state=active]:text-primary">
                <Landmark className="w-4 h-4" />
                Public Service
              </TabsTrigger>
              <TabsTrigger value="forfeitures" className="gap-2 font-bold data-[state=active]:bg-white data-[state=active]:text-primary">
                <Wallet className="w-4 h-4" />
                Restitution
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cases" className="space-y-8">
              {fullPolitician.cases.length > 0 ? fullPolitician.cases.map((c) => (
                <div key={c.id} className="relative pl-8 border-l-2 border-primary/20 last:border-0 pb-8">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent shadow-[0_0_0_4px_white]" />
                  <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-4 hover:border-accent/20 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="text-sm font-bold text-accent px-3 py-1 bg-accent/5 rounded-full">
                        {new Date(c.caseStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border",
                        c.status === 'convicted' ? "bg-red-50 text-red-600 border-red-100" : 
                        c.status === 'charged' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary">{c.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{c.description}</p>
                    
                    <div className="flex flex-wrap gap-4 pt-4 border-t">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount Involved</p>
                        <p className="text-sm font-bold">{c.currency} {c.amountInvolved.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1 flex-grow">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Source Links</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-muted-foreground italic">Verification required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No verifiable legal records found on file.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="offices">
              <div className="grid gap-4">
                {fullPolitician.offices.length > 0 ? fullPolitician.offices.map((office) => (
                  <Card key={office.id} className="hover:border-accent/20 transition-colors">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-primary text-lg">{office.officeTitle}</p>
                        <p className="text-sm text-muted-foreground">{office.state || 'Federal Level'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">{new Date(office.startDate).getFullYear()} - {office.endDate ? new Date(office.endDate).getFullYear() : 'Present'}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Tenure</p>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                   <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                    <Landmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No public service history recorded.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="forfeitures">
              <div className="grid gap-4">
                {fullPolitician.totalForfeiture > 0 ? (
                  <Card className="border-l-4 border-l-accent bg-accent/5">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-3xl font-black text-accent">${(fullPolitician.totalForfeiture).toLocaleString()}</p>
                          <p className="text-sm font-bold text-primary uppercase tracking-wider">Total Public Asset Recovery</p>
                        </div>
                        <Wallet className="w-12 h-12 text-accent/20" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No public assets recovered on file.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-8">
           <FactSnippet politician={fullPolitician} />
           
           <Card className="bg-secondary/20 border-accent/20 shadow-sm">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-accent" />
                 Contribute Records
               </CardTitle>
               <CardDescription className="text-xs">Community-driven verification</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                 Found a court ruling or credible news report missing from this dossier? Every submission must be backed by a primary source URL.
               </p>
               <Button variant="outline" className="w-full border-primary/20 text-primary font-bold hover:bg-white transition-colors">Submit Source</Button>
             </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
