
import { Politician } from './types';

export const politicians: Politician[] = [
  {
    id: '1',
    fullName: 'Bola Ahmed Tinubu',
    aliasNames: ['Jagaban'],
    profileImageUrl: 'https://picsum.photos/seed/tinubu/400/400',
    bio: 'Current President of Nigeria. Previously served as Governor of Lagos State from 1999 to 2007 and Senator for Lagos West in 1993.',
    primaryParty: 'APC',
    offices: [
      { id: 'o1', politicianId: '1', officeTitle: 'President', startDate: '2023-05-29' },
      { id: 'o2', politicianId: '1', officeTitle: 'Governor', state: 'Lagos', startDate: '1999-05-29', endDate: '2007-05-29' }
    ],
    partyHistory: [
      { party: 'All Progressives Congress (APC)', years: '2013 - Present' },
      { party: 'Action Congress of Nigeria (ACN)', years: '2006 - 2013' },
      { party: 'Alliance for Democracy (AD)', years: '1998 - 2006' }
    ],
    cases: [
      {
        id: 'c1',
        politicianId: '1',
        title: 'Chicago Forfeiture Case',
        description: 'Settlement involving assets linked to narcotics trafficking investigations in the United States in the 1990s.',
        status: 'convicted',
        amountInvolved: 460000,
        currency: 'USD',
        caseStartDate: '1993-01-01',
        sources: [
          { id: 's1', title: 'Court Records', url: 'https://example.com/tinubu-case', publisher: 'US District Court', publicationDate: '1993-10-04', credibilityRating: 5 }
        ]
      }
    ],
    forfeitures: [
      { id: 'f1', caseId: 'c1', amount: 460000, currency: 'USD', forfeitureType: 'permanent', date: '1993-10-04' }
    ],
    detentions: [],
    accountabilityScore: 45.2,
    totalForfeiture: 460000
  },
  {
    id: '2',
    fullName: 'Peter Obi',
    aliasNames: ['Okute'],
    profileImageUrl: 'https://picsum.photos/seed/obi/400/400',
    bio: 'Presidential candidate in 2023. Served as Governor of Anambra State from 2006 to 2014.',
    primaryParty: 'LP',
    offices: [
      { id: 'o3', politicianId: '2', officeTitle: 'Governor', state: 'Anambra', startDate: '2006-03-17', endDate: '2014-03-17' }
    ],
    partyHistory: [
      { party: 'Labour Party (LP)', years: '2022 - Present' },
      { party: 'Peoples Democratic Party (PDP)', years: '2014 - 2022' },
      { party: 'All Progressives Grand Alliance (APGA)', years: '2002 - 2014' }
    ],
    cases: [
      {
        id: 'c2',
        politicianId: '2',
        title: 'Pandora Papers Disclosure',
        description: 'Investigation into offshore accounts and business entities not fully declared during his tenure as governor.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2021-10-03',
        sources: [
          { id: 's2', title: 'Pandora Papers', url: 'https://example.com/obi-pandora', publisher: 'ICIJ', publicationDate: '2021-10-03', credibilityRating: 5 }
        ]
      }
    ],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 12.5,
    totalForfeiture: 0
  },
  {
    id: '3',
    fullName: 'Atiku Abubakar',
    aliasNames: ['Turaki Adamawa'],
    profileImageUrl: 'https://picsum.photos/seed/atiku/400/400',
    bio: 'Vice President of Nigeria from 1999 to 2007. Frequent presidential candidate.',
    primaryParty: 'PDP',
    offices: [
      { id: 'o4', politicianId: '3', officeTitle: 'Vice President', startDate: '1999-05-29', endDate: '2007-05-29' }
    ],
    partyHistory: [
      { party: 'Peoples Democratic Party (PDP)', years: '2017 - Present' },
      { party: 'All Progressives Congress (APC)', years: '2013 - 2017' }
    ],
    cases: [
      {
        id: 'c3',
        politicianId: '3',
        title: 'Jefferson Bribery Investigation',
        description: 'US Senate investigation into allegations of bribery and illicit transfers.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2005-01-01',
        sources: [
          { id: 's3', title: 'Senate Report', url: 'https://example.com/atiku-report', publisher: 'US Senate', publicationDate: '2010-02-04', credibilityRating: 5 }
        ]
      }
    ],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 38.4,
    totalForfeiture: 0
  }
];
