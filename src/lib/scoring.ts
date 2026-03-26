
import { Politician, ScoreBreakdown } from './types';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Scoring Algorithm
 * Score = 
 *   (Alleged × 1) + 
 *   (Investigations × 2) + 
 *   (Charges × 4) + 
 *   (Convictions × 8) + 
 *   log10(Total Forfeited + 1) × 5 + 
 *   (Detention Days / 30)
 */
export function calculateAccountabilityScore(politician: Politician): ScoreBreakdown {
  const counts = {
    alleged: politician.cases.filter(c => c.status === 'alleged').length,
    under_investigation: politician.cases.filter(c => c.status === 'under_investigation').length,
    charged: politician.cases.filter(c => c.status === 'charged').length,
    convicted: politician.cases.filter(c => c.status === 'convicted').length,
  };

  const totalForfeited = politician.forfeitures.reduce((sum, f) => sum + f.amount, 0);
  const forfeitedFactor = Math.log10(totalForfeited + 1) * 5;

  const detentionDays = politician.detentions.reduce((sum, d) => {
    const start = parseISO(d.startDate);
    const end = d.endDate ? parseISO(d.endDate) : new Date();
    return sum + differenceInDays(end, start);
  }, 0);

  const detentionFactor = detentionDays / 30;

  const total = 
    (counts.alleged * 1) +
    (counts.under_investigation * 2) +
    (counts.charged * 4) +
    (counts.convicted * 8) +
    forfeitedFactor +
    detentionFactor;

  return {
    alleged: counts.alleged,
    investigations: counts.under_investigation,
    charges: counts.charged,
    convictions: counts.convicted,
    forfeitedFactor: Math.round(forfeitedFactor * 100) / 100,
    detentionDays: Math.round(detentionFactor * 100) / 100,
    total: Math.round(total * 10) / 10
  };
}
