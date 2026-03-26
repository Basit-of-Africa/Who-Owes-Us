'use client';

import { ShieldAlert, Gavel, Scale, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function DisclaimerPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-8 gap-2 text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-primary/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-accent/10 rounded-2xl">
            <ShieldAlert className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">Legal Disclaimer</h1>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              1. Nature of the Platform
            </h2>
            <p>
              "Who Owes Us?" is an independent, non-partisan civic accountability platform. The information provided on this website is for general informational and educational purposes only. This platform is not affiliated with any government agency, political party, or judicial body.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Gavel className="w-5 h-5 text-accent" />
              2. Data Sourcing and Accuracy
            </h2>
            <p>
              The records archived on this platform are aggregated from publicly available sources, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Official court documents and judicial rulings.</li>
              <li>Legislative archives (including PLAC Bills Track).</li>
              <li>Verified investigative media reports (Premium Times, Punch, Vanguard, etc.).</li>
              <li>Official gazettes from anti-corruption agencies (EFCC, ICPC).</li>
            </ul>
            <p>
              While we strive to ensure that all data is attributed to a primary source, "Who Owes Us?" does not warrant the absolute accuracy, completeness, or reliability of any information found on the platform. The "Accountability Score" is a mathematical representation based on available data and should not be interpreted as a final legal judgment.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" />
              3. No Legal Advice or Defamation
            </h2>
            <p>
              The content on this platform does not constitute legal advice. We maintain a strict policy against defamation and malice. Every entry is intended to reflect documented public history. If you believe a record is inaccurate or has been superseded by a more recent legal ruling, please use the "Contribute Records" feature on the respective profile to provide a primary source for correction.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent" />
              4. Limitation of Liability
            </h2>
            <p>
              Under no circumstance shall "Who Owes Us?" or its contributors be liable for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information is solely at your own risk.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-secondary/20 rounded-2xl border border-dashed border-primary/10">
          <p className="text-xs text-center font-medium uppercase tracking-widest text-primary/60">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
