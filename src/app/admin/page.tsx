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
import { calculateAccountabilityScore } from '@/lib/scoring';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const PROMINENT_POLITICIANS = [
  "Bola Ahmed Tinubu",
  "Kashim Shettima",
  "Peter Obi",
  "Atiku Abubakar",
  "Nyesom Wike",
  "Bukola Saraki",
  "Diezani Alison-Madueke",
  "James Ibori",
  "Orji Uzor Kalu",
  "Rochas Okorocha",
  "Yahaya Bello",
  "Godwin Emefiele",
  "Dino Melaye",
  "Godswill Akpabio",
  "Hope Uzodinma",
  "Seyi Makinde",
  "Babajide Sanwo-Olu"
];

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
    
    const scoreResult = calculateAccountabilityScore({
      ...data,
      id: 'temp',
      forfeitures: [],
      detentions: [],
    } as any);

    const polRef = await addDoc(collection(db, 'politicians'), {
      fullName: data.fullName,
      aliasNames: data.aliasNames,
      bio: data.bio,
      primaryParty: data.primaryParty,
      accountabilityScore: scoreResult.total,
      totalForfeiture: data.totalForfeiture,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    for (const office of data.offices) {
      await addDoc(collection(db, 'politicians', polRef.id, 'offices'), {
        ...office,
        politicianId: polRef.id
      });
    }

    for (const c of data.cases) {
      const { sources, ...caseData } = c;
      const caseRef = await addDoc(collection(db, 'politicians', polRef.id, 'cases'), {
        ...caseData,
        politicianId: polRef.id
      });

      for (const s of sources) {
        await addDoc(collection(db, 'politicians', polRef.id, 'cases', caseRef.id, 'sources'), s);
      }
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
      console.error(e);
      toast({
        variant: "destructive",
        title: "Aggregation Failed",
        description: "The AI was unable to verify records for this individual.",
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
    for (let i = 0; i < PROMINENT_POLITICIANS.length; i++) {
      const name = PROMINENT_POLITICIANS[i];
      try {
        await ingestPolitician(name);
        successCount++;
      } catch (e) {
        console.error(`Failed to ingest ${name}:`, e);
      }
      setBatchProgress(((i + 1) / PROMINENT_POLITICIANS.length) * 100);
    }

    toast({
      title: "Batch Discovery Complete",
      description: `Successfully ingested ${successCount} out of ${PROMINENT_POLITICIANS.length} dossiers.`,
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
      toast({
        title: "Registry Cleared",
        description: "All records have been removed from the database.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Clear Failed",
        description: e.message,
      });
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
            <h1 className="text-3xl font-headline font-extrabold">Ingestion Engine</h1>
            <p className="opacity-80">Automated public record discovery and verification.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 h-12 px-6 bg-white/10 hover:bg-white/20 border-white/20 text-white"
            onClick={handleBatchDiscovery}
            disabled={isBatching || isScraping || clearing}
          >
            {isBatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListPlus className="w-4 h-4" />}
            Batch Discover Prominent Figures
          </Button>
          <Button 
            variant="destructive" 
            className="gap-2 h-12 px-6"
            onClick={handleClearDatabase}
            disabled={clearing || isScraping || isBatching}
          >
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear All
          </Button>
        </div>
      </div>

      {isBatching && (
        <div className="mb-8 p-6 bg-white border-2 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              Running Batch Discovery Engine...
            </span>
            <span>{Math.round(batchProgress)}%</span>
          </div>
          <Progress value={batchProgress} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-2 border-accent/20 bg-accent/5 overflow-hidden">
            <CardHeader className="bg-white border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Targeted Public Record Discovery
                  </CardTitle>
                  <CardDescription>
                    Enter a specific politician's name to trigger the AI scraper.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white/50">
              <div className="flex gap-3">
                <Input 
                  placeholder="e.g. Bukola Saraki" 
                  className="h-12 border-2 text-lg"
                  value={scrapeName}
                  onChange={(e) => setScrapeName(e.target.value)}
                  disabled={isScraping || isBatching}
                />
                <Button 
                  onClick={handleAIScrape}
                  disabled={isScraping || isBatching || !scrapeName.trim()}
                  className="h-12 px-8 bg-accent hover:bg-accent/90 font-bold gap-2"
                >
                  {isScraping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Discover & Verify
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b mb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Registry Records {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              </CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by name..." 
                  className="pl-10 h-10 border-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Politician</TableHead>
                    <TableHead className="font-bold">Party</TableHead>
                    <TableHead className="font-bold">Accountability Score</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold text-primary">{p.fullName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-secondary/50">{p.primaryParty}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono border-primary/20 text-lg">
                          {p.accountabilityScore?.toFixed(1) || '0.0'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">
                        <div className="flex flex-col items-center gap-4">
                          <Database className="w-12 h-12 opacity-10" />
                          <p className="text-lg">The registry is empty.</p>
                          <p className="text-sm max-w-xs mx-auto">Use the AI Public Record Discovery tools above to start ingesting dossiers.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Sparkles className="h-4 w-4 text-accent" />
            <AlertTitle className="font-bold text-primary">Mass Discovery</AlertTitle>
            <AlertDescription className="text-xs">
              The Batch Discovery Engine scans for verified records for over 15 prominent Nigerian political figures simultaneously.
            </AlertDescription>
          </Alert>

          <Card className="bg-white border-2">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="font-bold">{filtered.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">AI Scrape Rate</span>
                <span className="font-bold text-accent">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
