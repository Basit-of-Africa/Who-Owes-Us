
import { Politician, ScoreBreakdown } from './types';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Scoring Algorithm (Strictly per PRD)
 * Formula:
 * Score = 
 *   (Alleged × 1) + 
 *   (Investigations × 2) + 
 *   (Charges × 4) + 
 *   (Convictions × 8) + 
 *   log10(Total Forfeited + 1) × 5 + 
 *   (Detention Days / 30)
 * 
 * Note: Excludes dismissed cases.
 */
export function calculateAccountabilityScore(politician: Politician): ScoreBreakdown {
  const activeCases = (politician.cases || []).filter(c => c.status !== 'dismissed');
  
  const counts = {
    alleged: activeCases.filter(c => c.status === 'alleged').length,
    under_investigation: activeCases.filter(c => c.status === 'under_investigation').length,
    charged: activeCases.filter(c => c.status === 'charged').length,
    convicted: activeCases.filter(c => c.status === 'convicted').length,
  };

  // Sum up all amounts normalized to NGN
  const totalForfeitedNGN = (politician.cases || []).reduce((sum, c) => {
    if (c.status === 'dismissed') return sum;
    const amount = c.amountInvolved || 0;
    // Standardizing conversion: 1 USD = ₦1,600
    const multiplier = (c.currency === 'USD') ? 1600 : 1;
    return sum + (amount * multiplier);
  }, 0);

  const forfeitureScore = Math.log10(totalForfeitedNGN + 1) * 5;

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
    forfeitureScore +
    detentionScore;

  return {
    allegedCount: counts.alleged,
    investigationCount: counts.under_investigation,
    chargeCount: counts.charged,
    convictionCount: counts.convicted,
    forfeitureScore: Math.round(forfeitureScore * 100) / 100,
    detentionScore: Math.round(detentionScore * 100) / 100,
    total: Math.round(total * 10) / 10
  };
}
