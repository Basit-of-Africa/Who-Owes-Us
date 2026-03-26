
'use client';

import { useState, useEffect } from 'react';
import { generateSatiricalBadges } from '@/ai/flows/generate-satirical-badges';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { Politician } from '@/lib/types';

export function BadgeList({ politician }: { politician: Politician }) {
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadBadges() {
    setLoading(true);
    try {
      const result = await generateSatiricalBadges({
        politicianName: politician.fullName,
        accountabilityScore: politician.accountabilityScore,
        caseSummaries: politician.cases.map(c => ({
          title: c.title,
          description: c.description,
          status: c.status,
          forfeitureAmount: c.amountInvolved
        }))
      });
      setBadges(result);
    } catch (e) {
      // Satirical fallback badges as per prompt
      setBadges(['Frequent Court Visitor', 'Asset Recovery Contributor']);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBadges();
  }, [politician.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Satirical Designations
        </h3>
        {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => (
          <Badge key={idx} variant="secondary" className="px-3 py-1 bg-accent/5 text-accent border-accent/20 hover:bg-accent hover:text-white transition-colors cursor-default">
            {badge}
          </Badge>
        ))}
      </div>
    </div>
  );
}
