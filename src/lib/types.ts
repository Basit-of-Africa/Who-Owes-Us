
export type CaseStatus = 'alleged' | 'under_investigation' | 'charged' | 'convicted' | 'dismissed';

export interface Source {
  id?: string;
  title: string;
  url: string;
  publisher: string;
  publicationDate: string;
  credibilityRating: number; // 1–5
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
  politicianId: string;
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
  sourceOrigin?: string;
  sourceUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  
  // Computed fields (from summary or aggregation)
  offices?: OfficeHeld[];
  cases?: CaseRecord[];
  forfeitures?: Forfeiture[];
  detentions?: Detention[];
}

export interface AccountabilitySummary {
  politicianId: string;
  accountabilityScore: number;
  totalCases: number;
  totalConvictions: number;
  totalForfeited: number;
  lastCalculatedAt: any;
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
