
export type CaseStatus = 'alleged' | 'under_investigation' | 'charged' | 'convicted' | 'dismissed';

export type VerificationAgency = 
  | 'EFCC' 
  | 'ICPC' 
  | 'CCB' 
  | 'FEDERAL_HIGH_COURT' 
  | 'SUPREME_COURT' 
  | 'UK_NCA' 
  | 'US_DOJ' 
  | 'GAZETTE';

export interface VerificationSource {
  agency: VerificationAgency;
  agencyLabel: string;
  certifiedDocId?: string;
  gazetteNotice?: string;
  courtOrderDate?: string;
  verificationStatus: 'verified_official' | 'gazetted' | 'court_certified';
  directDocUrl?: string;
}

export interface Source {
  id?: string;
  title: string;
  url: string;
  publisher: string;
  publicationDate: string;
  credibilityRating: number; // 1–5
}

export type CaseSourceType =
  | 'EFCC Certified'
  | 'Court Judgment'
  | 'ICPC Documented'
  | 'Official Gazette'
  | 'Supreme Court Ruling'
  | 'Code of Conduct Bureau'
  | 'International Inquiry'
  | 'Investigative Report'
  | string;

export interface CaseRecord {
  id?: string;
  politicianId?: string;
  title: string;
  description: string;
  status: CaseStatus;
  amountInvolved: number;
  currency: string;
  caseStartDate: string;
  caseEndDate?: string;
  sources?: Source[];
  courtJurisdiction?: string;
  suitNumber?: string;
  presidingJudge?: string;
  adjournmentsCount?: number;
  prolongedDelay?: boolean;
  delayReason?: string;
  verification?: VerificationSource;
  sourceType?: CaseSourceType;
}

export interface Forfeiture {
  id?: string;
  caseId?: string;
  politicianId?: string;
  amount: number;
  currency: string;
  forfeitureType: 'temporary' | 'permanent';
  date: string;
  description?: string;
  courtOrderNumber?: string;
  verification?: VerificationSource;
}

export interface Detention {
  id?: string;
  politicianId?: string;
  caseId?: string;
  startDate: string;
  endDate?: string;
  location: string;
  notes?: string;
}

export interface OfficeHeld {
  id?: string;
  politicianId?: string;
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
  stateOfOrigin?: string;
  currentOfficeType?: 'president' | 'vice_president' | 'governor' | 'senator' | 'minister' | 'other';
  candidateFor?: string;
  isIncumbent?: boolean;
  accountabilityScore?: number;
  totalForfeiture?: number;
  partyHistory?: { party: string; years: string }[];
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

export interface CivicWhistleblowerTip {
  id: string;
  politicianId?: string;
  politicianName?: string;
  agencyTarget: 'EFCC' | 'ICPC' | 'CCB' | 'COURT' | 'GENERAL';
  title: string;
  description: string;
  allegedAmount?: number;
  currency?: string;
  jurisdictionOrState?: string;
  documentRefNumber?: string;
  evidenceLinks?: string[];
  status: 'submitted' | 'under_civic_review' | 'verified_in_registry' | 'dismissed';
  submittedAt: string;
  submitterAlias?: string;
}

export interface CaseAlertSubscription {
  id: string;
  politicianId: string;
  politicianName: string;
  emailOrPhone: string;
  frequency: 'immediate' | 'weekly_digest';
  subscribedAt: string;
  active: boolean;
}
