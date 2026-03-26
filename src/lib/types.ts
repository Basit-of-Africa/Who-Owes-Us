
export interface CorruptionCase {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'convicted' | 'acquitted' | 'settled';
  forfeitureAmount: number;
  sources: string[];
}

export interface Politician {
  id: string;
  fullName: string;
  offices: string[];
  party: string;
  yearsInService: string;
  status: 'active' | 'under investigation' | 'convicted' | 'retired';
  accountabilityScore: number; // 0 to 100, higher is worse reputation
  caseCount: number;
  totalForfeiture: number;
  imageUrl: string;
  cases: CorruptionCase[];
  biography?: string;
  partyHistory: { party: string; years: string }[];
}
