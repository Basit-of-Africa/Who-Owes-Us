
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
import { Trash2, Search, ShieldCheck, Database, Loader2, Sparkles, AlertCircle, ListPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scrapePoliticianData } from '@/ai/flows/scrape-politician-flow';
import { PROMINENT_NIGERIAN_POLITICIANS } from '@/lib/politician-names';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function AdminPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [scrapeName, setScrapeName] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isBatching, setIsBatching] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [clearing, setClearing] = useState(false);

  const politiciansQuery = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansQuery);

  const filtered = politicians?.filter(p => 
    (p as any).fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const ingestPolitician = async (name: string) => {
    if (!db) return;
    const data = await scrapePoliticianData({ fullName: name });
    
    const polRef = await addDoc(collection(db, 'politicians'), {
      fullName: data.fullName,
      aliasNames: data.aliasNames,
      bio: data.bio,
      primaryParty: data.primaryParty,
      accountabilityScore: 0, 
      totalForfeiture: data.totalForfeiture,
      profileImageUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    for (const office of data.offices) {
      await addDoc(collection(db, 'politicians', polRef.id, 'offices'), office);
    }

    for (const c of data.cases) {
      await addDoc(collection(db, 'politicians', polRef.id, 'cases'), c);
    }
  };

  const handleAIScrape = async () => {
    if (!db || !scrapeName.trim()) return;
    setIsScraping(true);
    try {
      await ingestPolitician(scrapeName);
      toast({
        title: "Dossier Aggregated",
        description: `Public records for ${scrapeName} have been structured and saved.`,
      });
      setScrapeName('');
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Aggregation Failed",
        description: "Verification failed for this individual.",
      });
    } finally {
      setIsScraping(false);
    }
  };

  const handleBatchDiscovery = async () => {
    if (!db || isBatching) return;
    setIsBatching(true);
    setBatchProgress(0);
    
    let successCount = 0;
    for (let i = 0; i < PROMINENT_NIGERIAN_POLITICIANS.length; i++) {
      const name = PROMINENT_NIGERIAN_POLITICIANS[i];
      try {
        await ingestPolitician(name);
        successCount++;
      } catch (e) {}
      setBatchProgress(((i + 1) / PROMINENT_NIGERIAN_POLITICIANS.length) * 100);
    }

    toast({
      title: "Batch Discovery Complete",
      description: `Successfully ingested ${successCount} dossiers.`,
    });
    setIsBatching(false);
  };

  const handleClearDatabase = async () => {
    if (!db) return;
    setClearing(true);
    try {
      const snapshot = await getDocs(collection(db, 'politicians'));
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'politicians', d.id));
      }
      toast({ title: "Registry Cleared" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-primary p-8 rounded-2xl text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-extrabold">Autonomous Engine</h1>
            <p className="opacity-80">Managing 500+ tracked records from PLAC & Court Gazettes.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/10 border-white/20" onClick={handleBatchDiscovery} disabled={isBatching}>
            Batch Ingest All
          </Button>
          <Button variant="destructive" onClick={handleClearDatabase} disabled={clearing}>
            Clear Registry
          </Button>
        </div>
      </div>

      {isBatching && (
        <div className="mb-8 p-6 bg-white border-2 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              Ingesting Legislative Records...
            </span>
            <span>{Math.round(batchProgress)}%</span>
          </div>
          <Progress value={batchProgress} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="border-2 border-accent/20 bg-accent/5 overflow-hidden mb-8">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input 
                  placeholder="Target new name for AI Discovery..." 
                  className="h-12 border-2"
                  value={scrapeName}
                  onChange={(e) => setScrapeName(e.target.value)}
                />
                <Button onClick={handleAIScrape} disabled={isScraping} className="h-12 bg-accent hover:bg-accent/90">
                  {isScraping ? <Loader2 className="animate-spin" /> : <Sparkles />} Discover
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b mb-6">
              <CardTitle className="text-xl">Registry Status ({filtered.length} Tracked)</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Filter registry..." className="pl-10 h-10 border-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Politician</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold">{p.fullName}</TableCell>
                      <TableCell><Badge variant="secondary">{p.primaryParty}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{p.accountabilityScore?.toFixed(1) || '0.0'}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
