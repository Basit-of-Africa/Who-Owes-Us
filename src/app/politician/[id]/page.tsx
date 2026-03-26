
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { politicians } from '@/lib/mock-data';
import { calculateAccountabilityScore } from '@/lib/scoring';
import { 
  ArrowLeft, Landmark, Calendar, ShieldAlert, History, 
  Link as LinkIcon, Download, Gavel, Wallet, Clock, 
  ExternalLink, FileText, Info
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

export default function PoliticianProfile() {
  const { id } = useParams();
  const router = useRouter();
  const politician = politicians.find(p => p.id === id);

  if (!politician) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Politician not found</h1>
        <Button onClick={() => router.push('/')}>Return to Leaderboard</Button>
      </div>
    );
  }

  const scoreBreakdown = calculateAccountabilityScore(politician);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Research
      </button>

      {/* Header Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-full md:w-64 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
            <Image 
              src={politician.profileImageUrl} 
              alt={politician.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-grow space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-primary">{politician.fullName}</h1>
              <AccountabilityBadge score={scoreBreakdown.total} className="text-lg py-2 px-4" />
            </div>
            
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <Landmark className="w-4 h-4" />
                <span className="text-sm font-medium">{politician.primaryParty}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Nigerian Politics</span>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {politician.bio}
            </p>

            <div className="pt-2">
              <BadgeList politician={politician} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest opacity-80">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{scoreBreakdown.convictions}</p>
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Convictions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{scoreBreakdown.charges}</p>
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Charges</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${(politician.totalForfeiture / 1000000).toFixed(2)}M</p>
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Forfeited</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{scoreBreakdown.investigations}</p>
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Under Investigation</p>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white gap-2 font-bold">
                <Download className="w-4 h-4" />
                Download Report Dossier
              </Button>
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-bold">Disclaimer</AlertTitle>
            <AlertDescription className="text-amber-700 text-xs">
              Statuses such as "alleged" or "charged" indicate matters are unproven by a court of law.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Separator className="mb-12" />

      {/* Main Tabs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Tabs defaultValue="cases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
              <TabsTrigger value="cases" className="gap-2 font-bold">
                <Gavel className="w-4 h-4" />
                Case Records
              </TabsTrigger>
              <TabsTrigger value="offices" className="gap-2 font-bold">
                <Landmark className="w-4 h-4" />
                Public Service
              </TabsTrigger>
              <TabsTrigger value="forfeitures" className="gap-2 font-bold">
                <Wallet className="w-4 h-4" />
                Restitution
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cases" className="space-y-8">
              {politician.cases.length > 0 ? politician.cases.map((c) => (
                <div key={c.id} className="relative pl-8 border-l-2 border-primary/20 last:border-0 pb-8">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent shadow-[0_0_0_4px_white]" />
                  <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
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
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount</p>
                        <p className="text-sm font-bold">{c.currency} {c.amountInvolved.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1 flex-grow">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Verified Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {c.sources.map((src, i) => (
                            <a key={i} href={src.url} target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-accent transition-colors">
                              <ExternalLink className="w-3 h-3" />
                              {src.publisher}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No specific case records found on file.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="offices">
              <div className="grid gap-4">
                {politician.offices.map((office) => (
                  <Card key={office.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-primary text-lg">{office.officeTitle}</p>
                        <p className="text-sm text-muted-foreground">{office.state || 'National Level'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">{new Date(office.startDate).getFullYear()} - {office.endDate ? new Date(office.endDate).getFullYear() : 'Present'}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Term</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="forfeitures">
              <div className="grid gap-4">
                {politician.forfeitures.length > 0 ? politician.forfeitures.map((f) => (
                  <Card key={f.id} className="border-l-4 border-l-accent">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-accent">{f.currency} {f.amount.toLocaleString()}</p>
                          <p className="text-sm font-medium text-muted-foreground capitalize">{f.forfeitureType} Forfeiture</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{new Date(f.date).toLocaleDateString()}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Date Processed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-12 bg-muted/30 rounded-xl">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No public assets recovered on file.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-8">
           <FactSnippet politician={politician} />
           
           <Card className="bg-secondary/20 border-accent/20">
             <CardHeader>
               <CardTitle className="text-lg">Submit Verification</CardTitle>
               <CardDescription className="text-xs">Help us maintain source integrity</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                 Found a missing court record or source? Every contribution must be backed by a verifiable URL.
               </p>
               <Button variant="outline" className="w-full border-primary/20 text-primary font-bold">Contribute Record</Button>
             </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
