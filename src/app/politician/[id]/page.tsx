
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { politicians } from '@/lib/mock-data';
import { ArrowLeft, Landmark, Calendar, ShieldAlert, History, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { BadgeList } from '@/components/BadgeList';
import { FactSnippet } from '@/components/FactSnippet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
              src={politician.imageUrl} 
              alt={politician.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-grow space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-primary">{politician.fullName}</h1>
              <AccountabilityBadge score={politician.accountabilityScore} className="text-lg py-2 px-4" />
            </div>
            
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <Landmark className="w-4 h-4" />
                <span className="text-sm font-medium">{politician.party}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{politician.yearsInService}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-sm font-medium capitalize">{politician.status}</span>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {politician.biography}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest opacity-80">Accountability Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{politician.caseCount}</p>
                  <p className="text-xs opacity-80 uppercase font-semibold">Total Cases</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">${(politician.totalForfeiture / 1000000).toFixed(1)}M</p>
                  <p className="text-xs opacity-80 uppercase font-semibold">Funds Recovered</p>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white gap-2 font-bold">
                <Download className="w-4 h-4" />
                Download Report Dossier
              </Button>
            </CardContent>
          </Card>
          
          <BadgeList politician={politician} />
        </div>
      </div>

      <Separator className="mb-12" />

      {/* Main Tabs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="timeline" className="gap-2 font-bold">
                <History className="w-4 h-4" />
                Case Timeline
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 font-bold">
                <Landmark className="w-4 h-4" />
                Office History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-8">
              {politician.cases.map((c, idx) => (
                <div key={c.id} className="relative pl-8 border-l-2 border-primary/20 last:border-0 pb-8">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent shadow-[0_0_0_4px_white]" />
                  <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="text-sm font-bold text-accent px-3 py-1 bg-accent/5 rounded-full">
                        {new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border",
                        c.status === 'convicted' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {c.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary">{c.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{c.description}</p>
                    {c.forfeitureAmount > 0 && (
                      <div className="bg-secondary/20 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-medium">Forfeiture Amount</span>
                        <span className="text-lg font-bold text-accent">${c.forfeitureAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {c.sources.map((src, i) => (
                        <a key={i} href={src} target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-accent underline transition-colors">
                          <LinkIcon className="w-3 h-3" />
                          Source {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {politician.partyHistory.map((h, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-primary">{h.party}</p>
                          <p className="text-sm text-muted-foreground">Political Affiliation</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{h.years}</p>
                          <p className="text-sm text-muted-foreground">Term Duration</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-8">
           <FactSnippet politician={politician} />
           
           <Card className="bg-secondary/20 border-accent/20">
             <CardHeader>
               <CardTitle className="text-lg">Contribute Information</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                 Found an error or have additional sources regarding this politician's record? Help us maintain the highest standards of accuracy.
               </p>
               <Button variant="outline" className="w-full">Submit Correction</Button>
             </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
