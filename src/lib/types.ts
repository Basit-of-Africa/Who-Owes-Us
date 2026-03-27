
export type CaseStatus = 'alleged' | 'under_investigation' | 'charged' | 'convicted' | 'dismissed';

export interface Source {
  id?: string;
  title: string;
  url: string;
  publisher: string;
  publicationDate: string;
  credibilityRating: number; // 1-5
}

export interface CaseRecord {
  id?: string;
  politicianId: string;
  title: string;
  description: string;
  status: CaseStatus;
  amountInvolved: number;
  currency: string;
  caseStartDate: string;
  caseEndDate?: string;
  sources?: Source[];
}

export interface Forfeiture {
  id?: string;
  caseId: string;
  amount: number;
  currency: string;
  forfeitureType: 'temporary' | 'permanent';
  date: string;
}

export interface Detention {
  id?: string;
  politicianId: string;
  caseId?: string;
  startDate: string;
  endDate?: string;
  location: string;
  notes?: string;
}

export interface OfficeHeld {
  id?: string;
  politicianId: string;
  officeTitle: string;
  state?: string;
  constituency?: string;
  startDate: string;
  endDate?: string;
}

export interface Politician {
  id: string;
  fullName: string;
  aliasNames: string[];
  dateOfBirth?: string;
  profileImageUrl: string;
  bio: string;
  primaryParty: string;
  offices: OfficeHeld[];
  cases: CaseRecord[];
  forfeitures: Forfeiture[];
  detentions: Detention[];
  accountabilityScore: number;
  totalForfeiture: number; // Normalized to NGN for ranking
  partyHistory: { party: string; years: string }[];
  sourceOrigin?: string;
  sourceUrl?: string;
}

export interface ScoreBreakdown {
  allegedCount: number;
  investigationCount: number;
  chargeCount: number;
  convictionCount: number;
  forfeitureScore: number;
  detentionScore: number;
  total: number;
}
