'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { calculateAccountabilityScore } from '@/lib/scoring';
import { 
  ArrowLeft, ShieldAlert, 
  ExternalLink, FileText, Loader2, User,
  ShieldCheck, History, Share2, MapPin, Award, CheckCircle2, Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { CaseVelocityMeter } from '@/components/CaseVelocityMeter';
import { BadgeList } from '@/components/BadgeList';
import { FactSnippet } from '@/components/FactSnippet';
import { HistoricalTrendChart } from '@/components/HistoricalTrendChart';
import { ScoreBreakdownChart } from '@/components/ScoreBreakdownChart';
import { ShareProfileModal, ShareProfileCard, QuickCopyLinkButton } from '@/components/ShareProfileModal';
import { VerificationBadge } from '@/components/VerificationBadge';
import { SourceTypeBadge } from '@/components/SourceTypeBadge';
import { DossierExportModal } from '@/components/DossierExportModal';
import { CaseAlertModal } from '@/components/CaseAlertModal';
import { SubmitTipModal } from '@/components/SubmitTipModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  const forfeituresRef = useMemo(() => id && db ? collection(db, 'politicians', id as string, 'forfeitures') : null, [id, db]);
  const { data: forfeituresData } = useCollection<any>(forfeituresRef);

  const fullPolitician = useMemo(() => {
    if (!politician) return null;
    return {
      ...politician,
      cases: casesData || [],
      offices: officesData || [],
      forfeitures: forfeituresData || [],
      detentions: [],
    } as Politician;
  }, [politician, casesData, officesData, forfeituresData]);

  if (polLoading || casesLoading || officesLoading) {
    return (
      <div className="container mx-auto px-6 md:px-[50px] py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Accessing Archive...</p>
      </div>
    );
  }

  if (!fullPolitician) {
    return (
      <div className="container mx-auto px-6 md:px-[50px] py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-2 uppercase">Record Not Found</h1>
        <Button onClick={() => router.push('/leaderboard')} className="bg-primary mt-4">Return to Registry</Button>
      </div>
    );
  }

  const scoreBreakdown = calculateAccountabilityScore(fullPolitician);

  return (
    <div className="container mx-auto px-6 md:px-[50px] py-8 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[10px] font-bold tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Registry
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <CaseAlertModal politician={fullPolitician} />
          <SubmitTipModal 
            politicianId={fullPolitician.id} 
            politicianName={fullPolitician.fullName} 
          />
          <DossierExportModal politician={fullPolitician} />
          <Link href={`/compare?p1=${fullPolitician.id}`}>
            <Button 
              size="sm"
              variant="outline"
              className="h-9 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider gap-2 border-primary/20 hover:bg-primary/5 text-primary shadow-sm"
            >
              <Scale className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Compare Candidate</span>
              <span className="sm:hidden">Compare</span>
            </Button>
          </Link>
          <QuickCopyLinkButton politicianId={fullPolitician.id} />
          <ShareProfileModal 
            politician={fullPolitician}
            trigger={
              <Button 
                size="sm"
                className="h-9 px-4 rounded-xl font-black text-xs uppercase tracking-wider gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-accent" />
                <span>Share Dossier</span>
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 rounded-2xl bg-primary/5 border flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-sm">
              {fullPolitician.profileImageUrl ? (
                <img 
                  src={fullPolitician.profileImageUrl} 
                  alt={fullPolitician.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-24 h-24 text-primary opacity-20" />
              )}
            </div>
            <div className="flex-grow space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-none px-3 py-1 font-bold uppercase text-[10px] tracking-widest">
                    {fullPolitician.primaryParty} Affiliate
                  </Badge>
                  {fullPolitician.stateOfOrigin && (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20 bg-white">
                      <MapPin className="w-3 h-3 mr-1 text-accent" />
                      {fullPolitician.stateOfOrigin} State
                    </Badge>
                  )}
                  {fullPolitician.candidateFor && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[10px] font-bold uppercase">
                      <Award className="w-3 h-3 mr-1 text-primary" />
                      {fullPolitician.candidateFor}
                    </Badge>
                  )}
                  {((fullPolitician.cases || []).length === 0 && (fullPolitician.forfeitures || []).length === 0 && (fullPolitician.accountabilityScore || 0) <= 5) && (
                    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-[10px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
                      Hall of Integrity Record
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight uppercase">
                  {fullPolitician.fullName}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                {fullPolitician.bio || "No biography available in the public archive. Dossier based strictly on legal and financial footprints."}
              </p>
              <BadgeList politician={fullPolitician} />
            </div>
          </div>

          {((fullPolitician.cases || []).length === 0 && (fullPolitician.forfeitures || []).length === 0 && (fullPolitician.accountabilityScore || 0) <= 5) && (
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-4">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm uppercase tracking-wider text-emerald-900">
                  Clean Audit Certified • Hall of Integrity
                </h4>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  This public official holds verified administrative tenures with <strong>zero criminal indictments</strong>, <strong>zero asset forfeiture orders</strong>, and no pending EFCC or ICPC court charges registered in the national archive.
                </p>
              </div>
            </div>
          )}

          <HistoricalTrendChart politician={fullPolitician} />

          <Tabs defaultValue="cases" className="w-full">
            <TabsList className="bg-secondary/50 border p-1 rounded-lg">
              <TabsTrigger value="cases" className="uppercase text-[10px] font-bold tracking-widest px-6">
                Case Registry ({fullPolitician.cases?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="offices" className="uppercase text-[10px] font-bold tracking-widest px-6">
                Offices Held ({fullPolitician.offices?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="forfeitures" className="uppercase text-[10px] font-bold tracking-widest px-6">
                Asset Audit ({fullPolitician.forfeitures?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cases" className="pt-8 space-y-6">
              {(fullPolitician.cases || []).length > 0 ? (fullPolitician.cases || []).map((c, idx) => (
                <Card key={idx} className="border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-6 border-l-4 border-accent space-y-4">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20">{c.status.replace('_', ' ')}</Badge>
                        <SourceTypeBadge sourceType={c.sourceType} caseRecord={c} />
                        <VerificationBadge 
                          verification={c.verification} 
                          suitNumber={c.suitNumber} 
                          courtJurisdiction={c.courtJurisdiction} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground">{new Date(c.caseStartDate).getFullYear()}</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <h3 className="text-xl font-black text-primary uppercase">{c.title}</h3>
                        <SourceTypeBadge sourceType={c.sourceType} caseRecord={c} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                    </div>

                    {/* Case Velocity & Delay Meter */}
                    <CaseVelocityMeter caseRecord={c} />

                    <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[10px] font-bold text-primary uppercase">Amount Involved: {c.currency} {c.amountInvolved.toLocaleString()}</div>
                      <VerificationBadge 
                        verification={c.verification} 
                        suitNumber={c.suitNumber} 
                        courtJurisdiction={c.courtJurisdiction} 
                        compact={false}
                      />
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-20 bg-primary/5 rounded-xl border border-dashed">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                  <p className="text-xs font-bold text-muted-foreground uppercase">No verifiable cases in registry.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="offices" className="pt-8 space-y-4">
              {(fullPolitician.offices || []).length > 0 ? (fullPolitician.offices || []).map((office, idx) => (
                <div key={idx} className="p-6 bg-white border rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-primary uppercase">{office.officeTitle}</h4>
                    <p className="text-xs text-muted-foreground uppercase">{office.state || 'Federal'}</p>
                  </div>
                  <div className="text-right text-[10px] font-bold text-accent uppercase">
                    {new Date(office.startDate).getFullYear()} — {office.endDate ? new Date(office.endDate).getFullYear() : 'Present'}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No administrative history found.</p>
              )}
            </TabsContent>

            <TabsContent value="forfeitures" className="pt-8 space-y-4">
              {(fullPolitician.forfeitures || []).length > 0 ? (fullPolitician.forfeitures || []).map((forfeiture, idx) => (
                <div key={idx} className="p-6 bg-white border rounded-xl flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase border-primary/20">
                        {forfeiture.forfeitureType} forfeiture
                      </Badge>
                      <VerificationBadge 
                        verification={forfeiture.verification || {
                          agency: 'FEDERAL_HIGH_COURT',
                          agencyLabel: 'High Court Asset Forfeiture Order',
                          certifiedDocId: forfeiture.courtOrderNumber || 'FHC/ASSET-REC/ORDER',
                          verificationStatus: 'court_certified'
                        }}
                      />
                    </div>
                    <h4 className="font-black text-primary uppercase text-lg">
                      {forfeiture.currency} {forfeiture.amount?.toLocaleString()}
                    </h4>
                    <p className="text-xs text-muted-foreground uppercase">Court-ordered restitution to Federal Treasury</p>
                  </div>
                  <div className="text-right text-[10px] font-bold text-accent uppercase">
                    {forfeiture.date ? new Date(forfeiture.date).getFullYear() : 'Ordered'}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-primary/5 rounded-xl border border-dashed">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                  <p className="text-xs font-bold text-muted-foreground uppercase">No asset restitution orders on file.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg border-none overflow-hidden rounded-xl">
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="text-[10px] uppercase font-bold tracking-widest opacity-60">Accountability Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-primary">{scoreBreakdown.total.toFixed(1)}</span>
                <AccountabilityBadge score={Math.round(scoreBreakdown.total)} className="mb-1" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-2xl font-black text-primary">{scoreBreakdown.convictionCount}</p>
                  <p className="text-[8px] font-bold uppercase text-muted-foreground">Convictions</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary">{scoreBreakdown.chargeCount}</p>
                  <p className="text-[8px] font-bold uppercase text-muted-foreground">Charges</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                 <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Total Restitution Tied</p>
                 <p className="text-2xl font-black text-accent">₦{(fullPolitician.totalForfeiture || 0).toLocaleString()}</p>
              </div>

              <ScoreBreakdownChart breakdown={scoreBreakdown} />
            </CardContent>
          </Card>

          <ShareProfileCard politician={fullPolitician} />

          <FactSnippet politician={fullPolitician} />
          
          <Alert className="bg-white border rounded-xl">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <AlertTitle className="text-[10px] font-bold uppercase tracking-widest text-primary">Verification Policy</AlertTitle>
            <AlertDescription className="text-[9px] leading-relaxed text-muted-foreground mt-1">
              "Who Owes Us?" relies strictly on verifiable public records. Requests for correction require a primary source document.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
