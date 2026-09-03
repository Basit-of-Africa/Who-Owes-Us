'use client';

import { useState } from 'react';
import { useFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2, Search, Loader2, Sparkles, Gavel, ListPlus, 
  ShieldAlert, Bell, CheckCircle2, Clock, Eye, AlertCircle, FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scrapePoliticianData } from '@/ai/flows/scrape-politician-flow';
import { INITIAL_REGISTRY_SEED } from '@/lib/seed-data';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { fallbackStore, tipStore, alertStore } from '@/lib/fallback-registry';
import { CivicWhistleblowerTip, CaseAlertSubscription } from '@/lib/types';
import { useEffect } from 'react';

export default function AdminPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [scrapeName, setScrapeName] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isBatching, setIsBatching] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [clearing, setClearing] = useState(false);
  const [adminTab, setAdminTab] = useState<'dossiers' | 'tips' | 'alerts'>('dossiers');
  const [tips, setTips] = useState<CivicWhistleblowerTip[]>([]);
  const [alerts, setAlerts] = useState<CaseAlertSubscription[]>([]);

  useEffect(() => {
    setTips(tipStore.getAll());
    setAlerts(alertStore.getAll());
    const unsubTips = tipStore.subscribe(() => setTips(tipStore.getAll()));
    return () => {
      unsubTips();
    };
  }, []);

  const politiciansQuery = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansQuery);

  const filtered = politicians?.filter(p => 
    (p as any).fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const ingestPolitician = async (politicianData: any) => {
    fallbackStore.add(politicianData);

    if (db) {
      try {
        const polRef = await addDoc(collection(db, 'politicians'), {
          fullName: politicianData.fullName,
          aliasNames: politicianData.aliasNames || [],
          bio: politicianData.bio || '',
          primaryParty: politicianData.primaryParty || 'Unknown',
          accountabilityScore: politicianData.accountabilityScore || 0, 
          totalForfeiture: politicianData.totalForfeiture || 0,
          profileImageUrl: politicianData.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(politicianData.fullName)}/400/400`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        if (politicianData.offices) {
          for (const office of politicianData.offices) {
            await addDoc(collection(db, 'politicians', polRef.id, 'offices'), office);
          }
        }

        if (politicianData.cases) {
          for (const c of politicianData.cases) {
            await addDoc(collection(db, 'politicians', polRef.id, 'cases'), c);
          }
        }
      } catch (err) {
        console.warn('Firestore write skipped or failed, saved to in-memory store:', err);
      }
    }
  };

  const handleSeedRegistry = async () => {
    if (isBatching) return;
    setIsBatching(true);
    setBatchProgress(0);
    
    try {
      fallbackStore.reset();
      for (let i = 0; i < INITIAL_REGISTRY_SEED.length; i++) {
        await ingestPolitician(INITIAL_REGISTRY_SEED[i]);
        setBatchProgress(((i + 1) / INITIAL_REGISTRY_SEED.length) * 100);
      }
      toast({ title: "Registry Seeded", description: `${INITIAL_REGISTRY_SEED.length} high-profile dossiers archived.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Seeding Failed" });
    } finally {
      setIsBatching(false);
    }
  };

  const handleAIScrape = async () => {
    if (!scrapeName.trim()) return;
    setIsScraping(true);
    try {
      const data = await scrapePoliticianData({ fullName: scrapeName });
      await ingestPolitician(data);
      toast({
        title: "Dossier Ingested",
        description: `Verified public record for ${scrapeName} has been archived.`,
      });
      setScrapeName('');
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Audit Failed",
        description: "Could not verify records for this individual.",
      });
    } finally {
      setIsScraping(false);
    }
  };

  const handleClearDatabase = async () => {
    setClearing(true);
    try {
      fallbackStore.clear();
      if (db) {
        try {
          const snapshot = await getDocs(collection(db, 'politicians'));
          for (const d of snapshot.docs) {
            await deleteDoc(doc(db, 'politicians', d.id));
          }
        } catch (err) {
          console.warn('Firestore clear skipped, in-memory store cleared:', err);
        }
      }
      toast({ title: "Registry Cleared" });
    } finally {
      setClearing(false);
    }
  };

  const handleDeletePolitician = async (id: string) => {
    fallbackStore.delete(id);
    if (db) {
      try {
        await deleteDoc(doc(db, 'politicians', id));
      } catch (err) {
        console.warn('Firestore delete skipped, in-memory store updated:', err);
      }
    }
    toast({ title: "Profile Removed" });
  };

  return (
    <div className="container mx-auto px-6 md:px-[50px] py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-primary p-8 md:p-10 rounded-[1.5rem] md:rounded-3xl text-primary-foreground shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 md:p-4 bg-accent/20 rounded-2xl border border-white/10">
            <Gavel className="w-8 h-8 md:w-10 md:h-10 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-black uppercase">Registry Management</h1>
            <p className="text-primary-foreground/60 text-[10px] md:text-sm font-medium uppercase tracking-widest">Verified Public Record Audits</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest" onClick={handleSeedRegistry} disabled={isBatching}>
            <ListPlus className="w-4 h-4 mr-2" />
            Seed Initial Registry
          </Button>
          <Button variant="destructive" onClick={handleClearDatabase} disabled={clearing} className="shadow-lg text-[10px] font-black uppercase tracking-widest">
            Wipe Registry
          </Button>
        </div>
      </div>

      {isBatching && (
        <Card className="mb-8 border-accent/20 shadow-lg overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                Seeding Master Dossiers...
              </span>
              <span>{Math.round(batchProgress)}%</span>
            </div>
            <Progress value={batchProgress} className="h-3 rounded-full" />
          </CardContent>
        </Card>
      )}

      {/* Tab Controls for Registry, Tips & Alerts */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b pb-4">
        <button
          type="button"
          onClick={() => setAdminTab('dossiers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            adminTab === 'dossiers'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-white text-muted-foreground hover:text-primary hover:bg-secondary/40'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Active Dossiers ({filtered.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('tips')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
            adminTab === 'tips'
              ? 'bg-red-600 text-white border-red-600 shadow-sm'
              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Civic Tips Moderation ({tips.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('alerts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
            adminTab === 'alerts'
              ? 'bg-accent text-primary border-accent shadow-sm'
              : 'bg-accent/10 text-primary border-accent/20 hover:bg-accent/20'
          }`}
        >
          <Bell className="w-4 h-4 text-primary" />
          <span>Trial Alert Dispatch ({alerts.length})</span>
        </button>
      </div>

      {adminTab === 'dossiers' && (
        <div className="grid grid-cols-1 gap-8">
          <Card className="shadow-sm border-primary/5">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    placeholder="Enter politician name to AI-Scrape records..." 
                    className="h-14 pl-12 border-2 focus:border-accent rounded-xl"
                    value={scrapeName}
                    onChange={(e) => setScrapeName(e.target.value)}
                  />
                </div>
                <Button onClick={handleAIScrape} disabled={isScraping} className="h-14 px-8 bg-accent hover:bg-accent/90 rounded-xl font-bold shadow-lg w-full md:w-auto">
                  {isScraping ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />} 
                  Audit & Archive
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-primary/5">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b gap-4">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Tracked Dossiers</CardTitle>
                <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">{filtered.length} profiles in active registry</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Filter records..." className="pl-10 h-10 border shadow-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/5">
                  <TableRow>
                    <TableHead className="font-bold uppercase text-[10px]">Politician</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Party</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Score</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p: any) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-bold text-primary">{p.fullName}</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] uppercase">{p.primaryParty}</Badge></TableCell>
                      <TableCell>
                        <span className="font-black text-accent">{p.accountabilityScore?.toFixed(1) || '0.0'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => handleDeletePolitician(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {adminTab === 'tips' && (
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider">
                  Whistleblower Queue
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {tips.length} confidential citizen leads
                </span>
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight mt-1">
                Civic Tip & Inquiry Moderation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {tips.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold uppercase text-xs">All civic leads verified & reviewed</p>
              </div>
            ) : (
              <div className="divide-y">
                {tips.map((tip) => (
                  <div key={tip.id} className="p-6 space-y-3 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary text-white text-[9px] font-bold uppercase">
                          {tip.agencyTarget}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] font-bold uppercase ${
                            tip.status === 'verified_in_registry'
                              ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                              : tip.status === 'under_civic_review'
                              ? 'border-amber-500 text-amber-700 bg-amber-50'
                              : 'border-slate-400 text-slate-700'
                          }`}
                        >
                          {tip.status.replace(/_/g, ' ')}
                        </Badge>
                        {tip.jurisdictionOrState && (
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            • {tip.jurisdictionOrState}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(tip.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-primary uppercase">
                        {tip.title}
                      </h4>
                      {tip.politicianName && (
                        <p className="text-xs font-bold text-accent mt-0.5">
                          Target Official: {tip.politicianName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600 pt-1">
                      {tip.allegedAmount ? (
                        <span>Amount: <strong>₦{(tip.allegedAmount / 1000000000).toFixed(2)}B</strong></span>
                      ) : null}
                      {tip.documentRefNumber && (
                        <span>Ref / Suit: <strong>{tip.documentRefNumber}</strong></span>
                      )}
                      <span>Submitter: <em>{tip.submitterAlias}</em></span>
                    </div>

                    {tip.evidenceLinks && tip.evidenceLinks.length > 0 && (
                      <div className="text-[11px] space-y-1 pt-1">
                        <span className="font-bold text-slate-700">Evidence URLs:</span>
                        {tip.evidenceLinks.map((url, idx) => (
                          <div key={idx}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:opacity-80 break-all">
                              {url}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          tipStore.updateStatus(tip.id, 'verified_in_registry');
                          toast({ title: "Lead Verified", description: "Marked as verified public record." });
                        }}
                        className="h-8 text-[10px] font-bold uppercase text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Mark Verified
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          tipStore.updateStatus(tip.id, 'under_civic_review');
                          toast({ title: "Status Updated", description: "Marked under civic review." });
                        }}
                        className="h-8 text-[10px] font-bold uppercase text-amber-700 border-amber-300 hover:bg-amber-50"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Under Review
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          tipStore.delete(tip.id);
                          toast({ title: "Tip Dismissed" });
                        }}
                        className="h-8 text-[10px] font-bold uppercase text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {adminTab === 'alerts' && (
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-accent text-primary text-[9px] font-bold uppercase tracking-wider">
                  Trial Dispatch Subscriptions
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {alerts.length} active monitors
                </span>
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight mt-1">
                Court Docket Notification Engine
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {alerts.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground space-y-2">
                <Bell className="w-8 h-8 text-accent mx-auto" />
                <p className="font-bold uppercase text-xs">No citizens subscribed to trial alerts yet</p>
                <p className="text-xs max-w-sm mx-auto">Users can subscribe to any politician's profile page using the "Track Trial Alerts" action button.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-secondary/5">
                  <TableRow>
                    <TableHead className="font-bold uppercase text-[10px]">Tracked Official</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Subscriber Contact</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Mode</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Subscribed At</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/30">
                      <TableCell className="font-bold text-primary">{a.politicianName}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-700">{a.emailOrPhone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] uppercase font-mono border-accent/40 text-primary bg-accent/10">
                          {a.frequency.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(a.subscribedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            alertStore.unsubscribe(a.id);
                            toast({ title: "Subscriber Removed" });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
