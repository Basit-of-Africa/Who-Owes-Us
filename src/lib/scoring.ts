
import { Politician, ScoreBreakdown } from './types';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Scoring Algorithm
 * Formula:
 * Score = 
 *   (Alleged × 1) + 
 *   (Investigations × 2) + 
 *   (Charges × 4) + 
 *   (Convictions × 8) + 
 *   log10(Total Forfeited in NGN + 1) × 5 + 
 *   (Detention Days / 30)
 */
export function calculateAccountabilityScore(politician: Politician): ScoreBreakdown {
  const counts = {
    alleged: politician.cases.filter(c => c.status === 'alleged').length,
    under_investigation: politician.cases.filter(c => c.status === 'under_investigation').length,
    charged: politician.cases.filter(c => c.status === 'charged').length,
    convicted: politician.cases.filter(c => c.status === 'convicted').length,
  };

  // Ensure totalForfeiture is treated as NGN.
  // We assume the data in the DB is already normalized or we use a baseline.
  const forfeitedFactor = Math.log10(politician.totalForfeiture + 1) * 5;

  const totalDetentionDays = (politician.detentions || []).reduce((sum, d) => {
    const start = parseISO(d.startDate);
    const end = d.endDate ? parseISO(d.endDate) : new Date();
    return sum + Math.max(0, differenceInDays(end, start));
  }, 0);

  const detentionScore = totalDetentionDays / 30;

  const total = 
    (counts.alleged * 1) +
    (counts.under_investigation * 2) +
    (counts.charged * 4) +
    (counts.convicted * 8) +
    forfeitedFactor +
    detentionScore;

  return {
    allegedCount: counts.alleged,
    investigationCount: counts.under_investigation,
    chargeCount: counts.charged,
    convictionCount: counts.convicted,
    forfeitureScore: Math.round(forfeitedFactor * 100) / 100,
    detentionScore: Math.round(detentionScore * 100) / 100,
    total: Math.round(total * 10) / 10
  };
}
