
'use client';

import { ShieldAlert, Gavel, Scale, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DisclaimerPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-8 gap-2 text-muted-foreground hover:text-primary uppercase text-[10px] font-bold"
      >
        <ArrowLeft className="w-3 h-3" />
        Return
      </Button>

      <div className="bg-white rounded-xl p-8 md:p-12 border shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b pb-6">
          <ShieldAlert className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-black text-primary uppercase tracking-tight">Public Disclosure & Disclaimer</h1>
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-6">
          <p className="font-bold text-primary">
            "Who Owes Us?" is an independent public accountability platform that aggregates information from publicly available sources, including court records, government agency publications, and reputable media outlets.
          </p>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" /> 1. Purpose
            </h2>
            <p>
              The platform is intended for informational, research, and civic engagement purposes only. It serves as a centralized archive of historical legal and administrative footprints for Nigerian public officials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Gavel className="w-4 h-4 text-accent" /> 2. Record Integrity
            </h2>
            <p>
              All case records are presented with clear attribution to their original sources. The inclusion of any individual does not imply guilt or wrongdoing beyond what has been established by a court of law. Case statuses such as “alleged,” “under investigation,” or “charged” indicate that matters are ongoing or unproven.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent" /> 3. Satire Layer
            </h2>
            <p>
              The platform may include satirical elements for engagement; these do not constitute factual claims and are clearly distinguished from the verifiable legal registry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent" /> 4. Source Verification
            </h2>
            <p>
              Users are encouraged to verify information via original sources linked in each dossier. While we strive for accuracy, the platform does not warrant the completeness of information aggregating across multiple legacy sources.
            </p>
          </section>
        </div>

        <div className="pt-8 border-t text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Independent Nigerian Civic Tech Initiative
          </p>
        </div>
      </div>
    </div>
  );
}
