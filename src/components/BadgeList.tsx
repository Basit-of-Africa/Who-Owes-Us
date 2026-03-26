
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
          forfeitureAmount: c.forfeitureAmount
        }))
      });
      setBadges(result);
    } catch (e) {
      console.error(e);
      // Fallback
      setBadges(['Civic Enigma', 'Frequent Court Visitor']);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBadges();
  }, [politician.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Citizen Badges
        </h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => (
          <Badge key={idx} variant="secondary" className="px-3 py-1 bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors cursor-default border-accent/20">
            {badge}
          </Badge>
        ))}
        {badges.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">No badges generated yet.</p>
        )}
      </div>
    </div>
  );
}
