
import { Politician } from './types';

/**
 * Enhanced mock data for Nigerian politicians including President, VP, 
 * and key Governors as per the project requirements.
 */
export const politicians: Politician[] = [
  {
    id: '1',
    fullName: 'Bola Ahmed Tinubu',
    aliasNames: ['Jagaban', 'Asiwaju'],
    profileImageUrl: 'https://picsum.photos/seed/tinubu/400/400',
    bio: 'Current President of Nigeria. Previously served as Governor of Lagos State (1999–2007). Known for his political influence in the South-West region.',
    primaryParty: 'APC',
    stateOfOrigin: 'Lagos',
    currentOfficeType: 'president',
    candidateFor: 'Incumbent President (2027 Eligible)',
    isIncumbent: true,
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
        caseEndDate: '1993-10-04',
        suitNumber: 'No. 93-C-4483',
        courtJurisdiction: 'US District Court, Northern District of Illinois',
        adjournmentsCount: 14,
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
    fullName: 'Kashim Shettima',
    aliasNames: [],
    profileImageUrl: 'https://picsum.photos/seed/shettima/400/400',
    bio: 'Current Vice President of Nigeria. Previously served as Governor of Borno State (2011–2019) and Senator for Borno Central.',
    primaryParty: 'APC',
    stateOfOrigin: 'Borno',
    currentOfficeType: 'vice_president',
    candidateFor: 'Incumbent Vice President',
    isIncumbent: true,
    offices: [
      { id: 'o3', politicianId: '2', officeTitle: 'Vice President', startDate: '2023-05-29' },
      { id: 'o4', politicianId: '2', officeTitle: 'Senator', state: 'Borno', constituency: 'Borno Central', startDate: '2019-06-11', endDate: '2023-05-28' },
      { id: 'o5', politicianId: '2', officeTitle: 'Governor', state: 'Borno', startDate: '2011-05-29', endDate: '2019-05-29' }
    ],
    partyHistory: [
      { party: 'All Progressives Congress (APC)', years: '2013 - Present' },
      { party: 'All Nigeria Peoples Party (ANPP)', years: '2007 - 2013' }
    ],
    cases: [],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 0.0,
    totalForfeiture: 0
  },
  {
    id: '3',
    fullName: 'Peter Obi',
    aliasNames: ['Okute'],
    profileImageUrl: 'https://picsum.photos/seed/obi/400/400',
    bio: 'Presidential candidate in 2023. Served as Governor of Anambra State (2006–2014). Noted for his focus on cost-cutting in governance.',
    primaryParty: 'LP',
    stateOfOrigin: 'Anambra',
    currentOfficeType: 'governor',
    candidateFor: 'Presidential Aspirant 2027',
    isIncumbent: false,
    offices: [
      { id: 'o6', politicianId: '3', officeTitle: 'Governor', state: 'Anambra', startDate: '2006-03-17', endDate: '2014-03-17' }
    ],
    partyHistory: [
      { party: 'Labour Party (LP)', years: '2022 - Present' },
      { party: 'Peoples Democratic Party (PDP)', years: '2014 - 2022' },
      { party: 'All Progressives Grand Alliance (APGA)', years: '2002 - 2014' }
    ],
    cases: [
      {
        id: 'c2',
        politicianId: '3',
        title: 'Pandora Papers Disclosure',
        description: 'Investigation into offshore accounts and business entities not fully declared during his tenure as governor.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2021-10-03',
        suitNumber: 'EFCC/INV/ABJ/2021/49',
        courtJurisdiction: 'EFCC Headquarters, Abuja',
        adjournmentsCount: 8,
        sources: [
          { id: 's2', title: 'Pandora Papers Investigation', url: 'https://example.com/obi-pandora', publisher: 'Premium Times', publicationDate: '2021-10-04', credibilityRating: 5 }
        ]
      }
    ],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 12.5,
    totalForfeiture: 0
  },
  {
    id: '4',
    fullName: 'Atiku Abubakar',
    aliasNames: ['Turaki Adamawa', 'Waziri Adamawa'],
    profileImageUrl: 'https://picsum.photos/seed/atiku/400/400',
    bio: 'Vice President of Nigeria (1999–2007). A prominent businessman and serial presidential candidate.',
    primaryParty: 'PDP',
    stateOfOrigin: 'Adamawa',
    currentOfficeType: 'vice_president',
    candidateFor: 'Presidential Aspirant 2027',
    isIncumbent: false,
    offices: [
      { id: 'o7', politicianId: '4', officeTitle: 'Vice President', startDate: '1999-05-29', endDate: '2007-05-29' }
    ],
    partyHistory: [
      { party: 'Peoples Democratic Party (PDP)', years: '2017 - Present' },
      { party: 'All Progressives Congress (APC)', years: '2013 - 2017' },
      { party: 'Action Congress (AC)', years: '2006 - 2007' }
    ],
    cases: [
      {
        id: 'c3',
        politicianId: '4',
        title: 'Jefferson Bribery Investigation',
        description: 'US Senate report highlighting allegations of bribery and illicit transfers involving offshore accounts.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2005-01-01',
        suitNumber: 'US Senate PSI Report 111-43',
        courtJurisdiction: 'US Senate Permanent Subcommittee on Investigations',
        adjournmentsCount: 22,
        sources: [
          { id: 's3', title: 'Keeping Foreign Corruption out of the United States', url: 'https://example.com/atiku-report', publisher: 'US Senate Permanent Subcommittee on Investigations', publicationDate: '2010-02-04', credibilityRating: 5 }
        ]
      }
    ],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 38.4,
    totalForfeiture: 0
  },
  {
    id: '5',
    fullName: 'Babajide Sanwo-Olu',
    aliasNames: [],
    profileImageUrl: 'https://picsum.photos/seed/sanwo/400/400',
    bio: 'Current Governor of Lagos State. Assumed office in 2019.',
    primaryParty: 'APC',
    stateOfOrigin: 'Lagos',
    currentOfficeType: 'governor',
    candidateFor: 'Incumbent Governor',
    isIncumbent: true,
    offices: [
      { id: 'o8', politicianId: '5', officeTitle: 'Governor', state: 'Lagos', startDate: '2019-05-29' }
    ],
    partyHistory: [
      { party: 'All Progressives Congress (APC)', years: '2013 - Present' }
    ],
    cases: [],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 2.0,
    totalForfeiture: 0
  },
  {
    id: '6',
    fullName: 'Nyesom Wike',
    aliasNames: ['The Emperor'],
    profileImageUrl: 'https://picsum.photos/seed/wike/400/400',
    bio: 'Current Minister of the FCT. Previously served as Governor of Rivers State (2015–2023). Known for his outspoken nature.',
    primaryParty: 'PDP',
    stateOfOrigin: 'Rivers',
    currentOfficeType: 'minister',
    candidateFor: 'Federal Minister (Ex-Governor)',
    isIncumbent: true,
    offices: [
      { id: 'o9', politicianId: '6', officeTitle: 'Minister of FCT', startDate: '2023-08-21' },
      { id: 'o10', politicianId: '6', officeTitle: 'Governor', state: 'Rivers', startDate: '2015-05-29', endDate: '2023-05-29' }
    ],
    partyHistory: [
      { party: 'Peoples Democratic Party (PDP)', years: '1998 - Present' }
    ],
    cases: [
      {
        id: 'c4',
        politicianId: '6',
        title: 'State Financial Inquiry',
        description: 'General inquiries into state infrastructure funding and procurement allocations.',
        status: 'alleged',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2022-06-15',
        suitNumber: 'FHC/PHC/CS/120/2022',
        courtJurisdiction: 'Federal High Court, Port Harcourt',
        adjournmentsCount: 11,
        sources: []
      }
    ],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 15.0,
    totalForfeiture: 0
  },
  {
    id: '7',
    fullName: 'Donald Duke',
    aliasNames: ['The Architect of Tinapa'],
    profileImageUrl: 'https://picsum.photos/seed/duke/400/400',
    bio: 'Former Governor of Cross River State (1999–2007). Known for pioneering ecotourism development, the Calabar Carnival, and zero indictments across two full terms.',
    primaryParty: 'PDP',
    stateOfOrigin: 'Cross River',
    currentOfficeType: 'governor',
    candidateFor: 'Elder Statesman',
    isIncumbent: false,
    offices: [
      { id: 'o11', politicianId: '7', officeTitle: 'Governor', state: 'Cross River', startDate: '1999-05-29', endDate: '2007-05-29' }
    ],
    partyHistory: [
      { party: 'Peoples Democratic Party (PDP)', years: '1998 - 2018, 2021 - Present' },
      { party: 'Social Democratic Party (SDP)', years: '2018 - 2021' }
    ],
    cases: [],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 0.0,
    totalForfeiture: 0
  },
  {
    id: '8',
    fullName: 'Babatunde Raji Fashola',
    aliasNames: ['BRF'],
    profileImageUrl: 'https://picsum.photos/seed/fashola/400/400',
    bio: 'Senior Advocate of Nigeria (SAN). Served as Governor of Lagos State (2007–2015) and Minister of Works and Housing (2015–2023). High regulatory compliance record.',
    primaryParty: 'APC',
    stateOfOrigin: 'Lagos',
    currentOfficeType: 'minister',
    candidateFor: 'Senior Advocate of Nigeria',
    isIncumbent: false,
    offices: [
      { id: 'o12', politicianId: '8', officeTitle: 'Minister of Works and Housing', startDate: '2015-11-11', endDate: '2023-05-29' },
      { id: 'o13', politicianId: '8', officeTitle: 'Governor', state: 'Lagos', startDate: '2007-05-29', endDate: '2015-05-29' }
    ],
    partyHistory: [
      { party: 'All Progressives Congress (APC)', years: '2013 - Present' },
      { party: 'Action Congress of Nigeria (ACN)', years: '2006 - 2013' }
    ],
    cases: [],
    forfeitures: [],
    detentions: [],
    accountabilityScore: 0.0,
    totalForfeiture: 0
  }
];
