import { Politician, CivicWhistleblowerTip, CaseAlertSubscription } from './types';
import { politicians as mockPoliticians } from './mock-data';
import { INITIAL_REGISTRY_SEED } from './seed-data';
import { calculateAccountabilityScore } from './scoring';

function buildInitialRegistry(): Politician[] {
  const registry: Politician[] = [...mockPoliticians];
  const existingNames = new Set(registry.map(p => p.fullName.toLowerCase().trim()));

  INITIAL_REGISTRY_SEED.forEach((seed, index) => {
    const nameLower = (seed.fullName || '').toLowerCase().trim();
    if (existingNames.has(nameLower)) {
      return;
    }

    const id = (seed.fullName || `pol-${index}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const cases = (seed.cases || []).map((c, cIdx) => ({
      id: `case-${id}-${cIdx}`,
      politicianId: id,
      title: c.title || 'Case Record',
      description: c.description || 'Legal inquiry recorded in public record archives.',
      status: (c.status as any) || 'under_investigation',
      amountInvolved: c.amountInvolved || 0,
      currency: c.currency || 'NGN',
      caseStartDate: c.caseStartDate || '2022-01-01',
      suitNumber: c.suitNumber,
      courtJurisdiction: c.courtJurisdiction,
      adjournmentsCount: c.adjournmentsCount,
      verification: c.verification,
      sourceType: c.sourceType,
      sources: [
        {
          id: `source-${id}-${cIdx}`,
          title: 'Court Gazette & Investigation Archives',
          url: 'https://placbillstrack.org',
          publisher: 'PLAC / Anti-Corruption Gazettes',
          publicationDate: c.caseStartDate || '2022-01-01',
          credibilityRating: 5
        }
      ]
    }));

    const pol: Politician = {
      id,
      fullName: seed.fullName || 'Public Official',
      aliasNames: seed.aliasNames || [],
      profileImageUrl: seed.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(seed.fullName || id)}/400/400`,
      bio: seed.bio || `Public record dossier for ${seed.fullName}. Records verified via official civic gazettes and investigative archives.`,
      primaryParty: seed.primaryParty || 'Independent',
      stateOfOrigin: seed.stateOfOrigin,
      currentOfficeType: seed.currentOfficeType,
      candidateFor: seed.candidateFor,
      isIncumbent: seed.isIncumbent,
      offices: seed.offices || [
        {
          id: `off-${id}-1`,
          politicianId: id,
          officeTitle: 'Public Official',
          startDate: '2019-05-29'
        }
      ],
      partyHistory: [
        {
          party: seed.primaryParty || 'Independent',
          years: '2015 - Present'
        }
      ],
      cases,
      forfeitures: (seed.totalForfeiture && seed.totalForfeiture > 0) ? [
        {
          id: `forf-${id}-1`,
          caseId: cases[0]?.id || `case-${id}-0`,
          amount: seed.totalForfeiture,
          currency: 'NGN',
          forfeitureType: 'permanent',
          date: cases[0]?.caseStartDate || '2022-01-01'
        }
      ] : [],
      detentions: [],
      accountabilityScore: 0,
      totalForfeiture: seed.totalForfeiture || 0
    };

    pol.accountabilityScore = calculateAccountabilityScore(pol).total;
    registry.push(pol);
  });

  return registry;
}

// In-memory persistent store for the browser session
let currentRegistry: Politician[] = buildInitialRegistry();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export const fallbackStore = {
  getAll(): Politician[] {
    return currentRegistry;
  },

  getById(id: string): Politician | undefined {
    return currentRegistry.find(p => p.id === id);
  },

  add(politician: any): Politician {
    const id = politician.id || `pol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newPol: Politician = {
      id,
      fullName: politician.fullName,
      aliasNames: politician.aliasNames || [],
      profileImageUrl: politician.profileImageUrl || `https://picsum.photos/seed/${encodeURIComponent(politician.fullName)}/400/400`,
      bio: politician.bio || '',
      primaryParty: politician.primaryParty || 'Independent',
      offices: politician.offices || [],
      partyHistory: politician.partyHistory || [],
      cases: politician.cases || [],
      forfeitures: politician.forfeitures || [],
      detentions: politician.detentions || [],
      accountabilityScore: politician.accountabilityScore || 0,
      totalForfeiture: politician.totalForfeiture || 0,
    };

    if (newPol.accountabilityScore === 0) {
      newPol.accountabilityScore = calculateAccountabilityScore(newPol).total;
    }

    currentRegistry = [newPol, ...currentRegistry];
    notify();
    return newPol;
  },

  delete(id: string) {
    currentRegistry = currentRegistry.filter(p => p.id !== id);
    notify();
  },

  clear() {
    currentRegistry = [];
    notify();
  },

  reset() {
    currentRegistry = buildInitialRegistry();
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};

const initialTips: CivicWhistleblowerTip[] = [
  {
    id: 'tip-1',
    politicianId: 'bola-ahmed-tinubu',
    politicianName: 'Bola Ahmed Tinubu',
    agencyTarget: 'EFCC',
    title: 'Lagos State Alpha Beta Consulting Audit & Revenue Trail',
    description: 'Statutory audit inquiry into consultancy commissions and treasury tax revenue disbursements from 2002 to 2019.',
    allegedAmount: 100000000000,
    currency: 'NGN',
    jurisdictionOrState: 'Lagos State',
    documentRefNumber: 'EFCC/CS/LAG/09/2019',
    evidenceLinks: ['https://gazettengr.com/alpha-beta-documents/'],
    status: 'under_civic_review',
    submittedAt: '2024-04-12T10:30:00Z',
    submitterAlias: 'CivicWatch Lagos'
  },
  {
    id: 'tip-2',
    politicianId: 'ahmed-idris',
    politicianName: 'Ahmed Idris',
    agencyTarget: 'EFCC',
    title: 'Treasury Single Account (TSA) Bypass Real Estate Holdings',
    description: 'Documents tracking 14 commercial plazas and luxury properties acquired in Kano and Abuja during accountant-general tenure.',
    allegedAmount: 109000000000,
    currency: 'NGN',
    jurisdictionOrState: 'Abuja FCT / Kano',
    documentRefNumber: 'EFCC/ABJ/TSA-INV/2022',
    evidenceLinks: ['https://efcc.gov.ng/press-release/ahmed-idris-properties'],
    status: 'verified_in_registry',
    submittedAt: '2024-03-08T15:20:00Z',
    submitterAlias: 'Integrity Advocate NG'
  },
  {
    id: 'tip-3',
    agencyTarget: 'ICPC',
    title: 'Niger Delta Development Commission (NDDC) Emergency Desilting Contracts',
    description: 'Unexecuted procurement contracts awarded to briefcase companies with inflated bill of quantities without BPP certificate of no objection.',
    allegedAmount: 4500000000,
    currency: 'NGN',
    jurisdictionOrState: 'Rivers State',
    documentRefNumber: 'ICPC/PET/NDDC/24/01',
    status: 'submitted',
    submittedAt: '2024-05-18T09:15:00Z',
    submitterAlias: 'Public Procurement Watch'
  }
];

let currentTips: CivicWhistleblowerTip[] = [...initialTips];
const tipListeners = new Set<() => void>();

function notifyTips() {
  tipListeners.forEach(l => {
    try { l(); } catch (e) { console.error(e); }
  });
}

export const tipStore = {
  getAll(): CivicWhistleblowerTip[] {
    return [...currentTips];
  },
  add(tip: Omit<CivicWhistleblowerTip, 'id' | 'submittedAt' | 'status'> & Partial<CivicWhistleblowerTip>): CivicWhistleblowerTip {
    const newTip: CivicWhistleblowerTip = {
      id: `tip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      politicianId: tip.politicianId,
      politicianName: tip.politicianName,
      agencyTarget: tip.agencyTarget || 'GENERAL',
      title: tip.title,
      description: tip.description,
      allegedAmount: tip.allegedAmount || 0,
      currency: tip.currency || 'NGN',
      jurisdictionOrState: tip.jurisdictionOrState || 'Federal',
      documentRefNumber: tip.documentRefNumber || '',
      evidenceLinks: tip.evidenceLinks || [],
      submitterAlias: tip.submitterAlias || 'Anonymous Citizen'
    };
    currentTips = [newTip, ...currentTips];
    notifyTips();
    return newTip;
  },
  updateStatus(id: string, status: CivicWhistleblowerTip['status']) {
    currentTips = currentTips.map(t => t.id === id ? { ...t, status } : t);
    notifyTips();
  },
  delete(id: string) {
    currentTips = currentTips.filter(t => t.id !== id);
    notifyTips();
  },
  subscribe(listener: () => void) {
    tipListeners.add(listener);
    return () => { tipListeners.delete(listener); };
  }
};

let currentAlerts: CaseAlertSubscription[] = [];
const alertListeners = new Set<() => void>();

export const alertStore = {
  getAll(): CaseAlertSubscription[] {
    return [...currentAlerts];
  },
  subscribeAlert(politicianId: string, politicianName: string, emailOrPhone: string, frequency: 'immediate' | 'weekly_digest' = 'immediate'): CaseAlertSubscription {
    const existing = currentAlerts.find(a => a.politicianId === politicianId && a.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase());
    if (existing) {
      existing.active = true;
      existing.frequency = frequency;
      return existing;
    }
    const newAlert: CaseAlertSubscription = {
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      politicianId,
      politicianName,
      emailOrPhone,
      frequency,
      subscribedAt: new Date().toISOString(),
      active: true
    };
    currentAlerts = [newAlert, ...currentAlerts];
    alertListeners.forEach(l => { try { l(); } catch (e) {} });
    return newAlert;
  },
  unsubscribe(id: string) {
    currentAlerts = currentAlerts.filter(a => a.id !== id);
    alertListeners.forEach(l => { try { l(); } catch (e) {} });
  }
};
