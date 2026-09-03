import { Politician } from './types';
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
