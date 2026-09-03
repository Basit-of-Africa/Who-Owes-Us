import { Politician } from './types';
import { calculateAccountabilityScore } from './scoring';

export interface HistoricalTrendPoint {
  year: number;
  label: string;
  score: number;
  delta: number;
  isInflection: boolean;
  events: string[];
  offices: string[];
  casesCount: number;
  totalForfeiture: number;
  riskTier: string;
  riskColor: string;
}

export interface TrendSummary {
  points: HistoricalTrendPoint[];
  initialScore: number;
  currentScore: number;
  netChange: number;
  peakScore: number;
  peakYear: number;
  highestVelocityYear: number;
  highestVelocityDelta: number;
  startYear: number;
  endYear: number;
}

function getRiskTier(score: number): { tier: string; color: string } {
  if (score < 10) return { tier: 'Low / Clean Record', color: '#16A34A' };
  if (score < 25) return { tier: 'Moderate Inquiries', color: '#0284C7' };
  if (score < 45) return { tier: 'Substantial Risk', color: '#D97706' };
  if (score < 70) return { tier: 'High Scrutiny', color: '#EA580C' };
  return { tier: 'Critical Accountability Footprint', color: '#DC2626' };
}

function parseYear(dateStr?: string): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})/);
  if (match) {
    const yr = parseInt(match[1], 10);
    if (yr >= 1970 && yr <= 2030) return yr;
  }
  const parsed = new Date(dateStr);
  const yr = parsed.getFullYear();
  if (!isNaN(yr) && yr >= 1970 && yr <= 2030) return yr;
  return null;
}

export function computeHistoricalScoreTrend(politician: Politician): TrendSummary {
  const currentYear = new Date().getFullYear();
  const allYears: number[] = [];

  (politician.offices || []).forEach(o => {
    const yStart = parseYear(o.startDate);
    const yEnd = parseYear(o.endDate);
    if (yStart) allYears.push(yStart);
    if (yEnd) allYears.push(yEnd);
  });

  (politician.cases || []).forEach(c => {
    const yCase = parseYear(c.caseStartDate);
    if (yCase) allYears.push(yCase);
  });

  (politician.forfeitures || []).forEach(f => {
    const yForf = parseYear(f.date);
    if (yForf) allYears.push(yForf);
  });

  (politician.detentions || []).forEach(d => {
    const yDet = parseYear(d.startDate);
    if (yDet) allYears.push(yDet);
  });

  let startYear = allYears.length > 0 ? Math.min(...allYears) : currentYear - 5;
  // Guard start year to be reasonable
  if (startYear > currentYear - 3) {
    startYear = currentYear - 4;
  }
  if (startYear < 1990) {
    startYear = 1990;
  }

  const endYear = currentYear;

  // Build a continuous yearly array from startYear to endYear
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  let prevScore = 0;
  let highestVelocityDelta = 0;
  let highestVelocityYear = startYear;

  const points: HistoricalTrendPoint[] = years.map((yr, idx) => {
    // Filter cases on or before Dec 31 of this year
    const casesUpToYear = (politician.cases || []).filter(c => {
      const cYear = parseYear(c.caseStartDate);
      return cYear !== null ? cYear <= yr : true;
    });

    const forfeituresUpToYear = (politician.forfeitures || []).filter(f => {
      const fYear = parseYear(f.date);
      return fYear !== null ? fYear <= yr : true;
    });

    const detentionsUpToYear = (politician.detentions || []).filter(d => {
      const dYear = parseYear(d.startDate);
      return dYear !== null ? dYear <= yr : true;
    });

    let score = 0;
    if (yr === endYear) {
      // Pin to exact current score for consistency
      score = calculateAccountabilityScore(politician).total;
    } else {
      const scoreResult = calculateAccountabilityScore({
        ...politician,
        cases: casesUpToYear,
        forfeitures: forfeituresUpToYear,
        detentions: detentionsUpToYear,
      });
      score = scoreResult.total;
    }

    const delta = idx === 0 ? score : Math.max(0, Math.round((score - prevScore) * 10) / 10);
    const isInflection = delta > 0 || idx === 0;

    if (delta > highestVelocityDelta && idx > 0) {
      highestVelocityDelta = delta;
      highestVelocityYear = yr;
    }

    prevScore = score;

    // Events logged specifically in this year
    const yrEvents: string[] = [];
    (politician.cases || []).forEach(c => {
      if (parseYear(c.caseStartDate) === yr) {
        yrEvents.push(`${c.title} (${c.status.replace('_', ' ')})`);
      }
    });

    (politician.forfeitures || []).forEach(f => {
      if (parseYear(f.date) === yr) {
        yrEvents.push(`₦${f.amount?.toLocaleString()} forfeiture order`);
      }
    });

    const yrOffices: string[] = [];
    (politician.offices || []).forEach(o => {
      const sYear = parseYear(o.startDate);
      const eYear = parseYear(o.endDate);
      if (sYear === yr) {
        yrOffices.push(`Assumed: ${o.officeTitle}${o.state ? ` (${o.state})` : ''}`);
      } else if (eYear === yr) {
        yrOffices.push(`Concluded: ${o.officeTitle}`);
      } else if (sYear && sYear < yr && (!eYear || eYear >= yr)) {
        yrOffices.push(`Serving: ${o.officeTitle}`);
      }
    });

    const totalForfeitureInPeriod = forfeituresUpToYear.reduce((s, f) => s + (f.amount || 0), 0);
    const { tier, color } = getRiskTier(score);

    return {
      year: yr,
      label: yr.toString(),
      score: Math.round(score * 10) / 10,
      delta,
      isInflection,
      events: yrEvents,
      offices: yrOffices,
      casesCount: casesUpToYear.length,
      totalForfeiture: totalForfeitureInPeriod,
      riskTier: tier,
      riskColor: color,
    };
  });

  const initialScore = points[0]?.score || 0;
  const currentScore = points[points.length - 1]?.score || 0;
  const netChange = Math.round((currentScore - initialScore) * 10) / 10;
  
  let peakScore = 0;
  let peakYear = endYear;
  points.forEach(p => {
    if (p.score >= peakScore) {
      peakScore = p.score;
      peakYear = p.year;
    }
  });

  return {
    points,
    initialScore,
    currentScore,
    netChange,
    peakScore,
    peakYear,
    highestVelocityYear,
    highestVelocityDelta,
    startYear,
    endYear,
  };
}
