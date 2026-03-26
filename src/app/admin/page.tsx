
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
import { Plus, Edit2, Trash2, Search, ShieldCheck, Database, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { politicians as mockPoliticians } from '@/lib/mock-data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { db } = useFirebase();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);

  const politiciansQuery = db ? collection(db, 'politicians') : null;
  const { data: politicians, loading } = useCollection(politiciansQuery);

  const filtered = politicians?.filter(p => 
    (p as any).fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      console.error(e);
      toast({
        variant: "destructive",
        title: "Clear Failed",
        description: "Could not clear the database. Check console for details.",
      });
    } finally {
      setClearing(false);
    }
  };

  const handleSeedData = async () => {
    if (!db) return;
    setSeeding(true);
    try {
      for (const p of mockPoliticians) {
        // Prepare Politician Data (exclude sub-collections from the root doc)
        const { id, cases, offices, forfeitures, detentions, ...data } = p;
        
        // 1. Add Politician Root Doc
        const polRef = await addDoc(collection(db, 'politicians'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 2. Add Cases and their Sources
        if (cases) {
          for (const c of cases) {
            const { id: cid, sources, ...caseData } = c;
            const caseRef = await addDoc(collection(db, 'politicians', polRef.id, 'cases'), {
              ...caseData,
              politicianId: polRef.id
            });

            if (sources) {
              for (const s of sources) {
                const { id: sid, ...sourceData } = s;
                await addDoc(collection(db, 'politicians', polRef.id, 'cases', caseRef.id, 'sources'), sourceData);
              }
            }
          }
        }

        // 3. Add Offices
        if (offices) {
          for (const o of offices) {
            const { id: oid, ...officeData } = o;
            await addDoc(collection(db, 'politicians', polRef.id, 'offices'), {
              ...officeData,
              politicianId: polRef.id
            });
          }
        }

        // 4. Add Detentions
        if (detentions) {
          for (const d of detentions) {
            const { id: did, ...detentionData } = d;
            await addDoc(collection(db, 'politicians', polRef.id, 'detentions'), {
              ...detentionData,
              politicianId: polRef.id
            });
          }
        }
      }
      
      toast({
        title: "Registry Seeded",
        description: "Sample Nigerian politician dossiers successfully uploaded.",
      });
    } catch (e: any) {
      console.error(e);
      const permissionError = new FirestorePermissionError({
        path: 'politicians',
        operation: 'create',
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setSeeding(false);
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
            <h1 className="text-3xl font-headline font-extrabold">Registry Management</h1>
            <p className="opacity-80">Verified portal for updating public records and accountability data.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            className="gap-2 h-12 px-6"
            onClick={handleClearDatabase}
            disabled={clearing || seeding}
          >
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear All
          </Button>
          <Button 
            variant="outline" 
            className="text-primary bg-white hover:bg-white/90 h-12 px-6"
            onClick={handleSeedData}
            disabled={seeding || clearing}
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
            Seed Registry
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2 h-12 px-6 font-bold shadow-lg">
            <Plus className="w-5 h-5" />
            Add Politician
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b mb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Active Records {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
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
                    <TableHead className="font-bold">Score</TableHead>
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
                        <Badge variant="outline" className="font-mono border-primary/20">{p.accountabilityScore?.toFixed(1) || '0.0'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5">
                            <Edit2 className="w-4 h-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                        <div className="flex flex-col items-center gap-2">
                          <Database className="w-8 h-8 opacity-20" />
                          <p>No records found in the registry.</p>
                          <Button variant="link" onClick={handleSeedData} className="text-accent font-bold">Seed Sample Data</Button>
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
          <Card className="bg-white border-2 border-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Integrity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="font-bold">{filtered.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Source Coverage</span>
                <span className="font-bold text-accent">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Seeded</span>
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-2 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Data Rule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Ensure every politician entry includes at least one primary source link for legal history to maintain verified status.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
