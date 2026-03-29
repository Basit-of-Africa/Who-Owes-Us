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
import { Trash2, Search, Loader2, Sparkles, Gavel, ListPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scrapePoliticianData } from '@/ai/flows/scrape-politician-flow';
import { INITIAL_REGISTRY_SEED } from '@/lib/seed-data';
import { useToast } from '@/hooks/use-toast';
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

  const ingestPolitician = async (politicianData: any) => {
    if (!db) return;
    
    const polRef = await addDoc(collection(db, 'politicians'), {
      fullName: politicianData.fullName,
      aliasNames: politicianData.aliasNames || [],
      bio: politicianData.bio || '',
      primaryParty: politicianData.primaryParty || 'Unknown',
      accountabilityScore: 0, 
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
  };

  const handleSeedRegistry = async () => {
    if (!db || isBatching) return;
    setIsBatching(true);
    setBatchProgress(0);
    
    try {
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
    if (!db || !scrapeName.trim()) return;
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
    <div className="container mx-auto px-6 md:px-[50px] py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-primary p-10 rounded-3xl text-primary-foreground shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-accent/20 rounded-2xl border border-white/10">
            <Gavel className="w-10 h-10 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-black">Registry Management</h1>
            <p className="text-primary-foreground/60 text-sm font-medium">Verified Public Record Audits</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10" onClick={handleSeedRegistry} disabled={isBatching}>
            <ListPlus className="w-4 h-4 mr-2" />
            Seed Initial Registry
          </Button>
          <Button variant="destructive" onClick={handleClearDatabase} disabled={clearing} className="shadow-lg">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card className="shadow-sm border-primary/5">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-grow">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    placeholder="Enter politician name to AI-Scrape records..." 
                    className="h-14 pl-12 border-2 focus:border-accent rounded-xl"
                    value={scrapeName}
                    onChange={(e) => setScrapeName(e.target.value)}
                  />
                </div>
                <Button onClick={handleAIScrape} disabled={isScraping} className="h-14 px-8 bg-accent hover:bg-accent/90 rounded-xl font-bold shadow-lg">
                  {isScraping ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />} 
                  Audit & Archive
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
              <div>
                <CardTitle className="text-xl font-black">Tracked Dossiers</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{filtered.length} profiles in active registry</p>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Filter records..." className="pl-10 h-10 border shadow-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-secondary/5">
                  <TableRow>
                    <TableHead className="font-bold">Politician</TableHead>
                    <TableHead className="font-bold">Primary Party</TableHead>
                    <TableHead className="font-bold">Score</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p: any) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-bold text-primary">{p.fullName}</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-primary/5 text-primary border-none">{p.primaryParty}</Badge></TableCell>
                      <TableCell>
                        <span className="font-black text-accent">{p.accountabilityScore?.toFixed(1) || '0.0'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
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
      </div>
    </div>
  );
}
