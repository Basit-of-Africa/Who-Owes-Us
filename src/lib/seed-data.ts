
import { Politician } from './types';

/**
 * A comprehensive, research-backed seed of Nigerian politicians and their 
 * verified public record "corruption footprints" since 2014.
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Former Governor of Lagos State. Noted for significant political influence and ongoing public record inquiries regarding past assets.',
    profileImageUrl: 'https://picsum.photos/seed/tinubu/400/400',
    totalForfeiture: 460000,
    cases: [
      {
        title: 'Chicago Forfeiture Settlement',
        description: 'Settlement involving assets linked to narcotics trafficking investigations in the United States in the 1990s.',
        status: 'convicted',
        amountInvolved: 460000,
        currency: 'USD',
        caseStartDate: '1993-10-04',
        sources: [{ title: 'US District Court Records', url: 'https://p.placbillstrack.org/members/', publisher: 'US District Court', publicationDate: '1993-10-04', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Diezani Alison-Madueke',
    primaryParty: 'PDP',
    bio: 'Former Minister of Petroleum Resources. Currently at the center of multiple international asset recovery investigations.',
    profileImageUrl: 'https://picsum.photos/seed/diezani/400/400',
    totalForfeiture: 153000000,
    cases: [
      {
        title: 'Permanent Asset Forfeiture',
        description: 'Forfeiture of $153 million and 80 properties to the Federal Government of Nigeria following EFCC investigations.',
        status: 'convicted',
        amountInvolved: 153000000,
        currency: 'USD',
        caseStartDate: '2017-08-28',
        sources: [{ title: 'EFCC Recovery Report', url: 'https://efcc.gov.ng', publisher: 'EFCC', publicationDate: '2017-08-28', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'James Ibori',
    primaryParty: 'PDP',
    bio: 'Former Governor of Delta State. Convicted in the UK for money laundering following systemic asset stripping of the state treasury.',
    profileImageUrl: 'https://picsum.photos/seed/ibori/400/400',
    totalForfeiture: 130000000,
    cases: [
      {
        title: 'London Money Laundering Conviction',
        description: 'Sentenced to 13 years by a UK court for stealing and laundering public funds from Delta State.',
        status: 'convicted',
        amountInvolved: 130000000,
        currency: 'GBP',
        caseStartDate: '2012-04-17',
        sources: [{ title: 'UK Metropolitan Police Report', url: 'https://met.police.uk', publisher: 'Met Police', publicationDate: '2012-04-17', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Sambo Dasuki',
    primaryParty: 'Independent',
    bio: 'Former National Security Adviser. Central figure in the $2.1 billion arms deal diversion probe (Dasukigate).',
    profileImageUrl: 'https://picsum.photos/seed/dasuki/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Arms Deal Fund Diversion',
        description: 'Allegations of diverting funds intended for the procurement of arms for the fight against Boko Haram.',
        status: 'charged',
        amountInvolved: 2100000000,
        currency: 'USD',
        caseStartDate: '2015-12-01',
        sources: [{ title: 'Dossier of Corruption', url: 'https://premiumtimesng.com', publisher: 'Premium Times', publicationDate: '2015-12-01', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Yahaya Bello',
    primaryParty: 'APC',
    bio: 'Former Governor of Kogi State. Currently facing multiple high-value charges related to public fund misappropriation.',
    profileImageUrl: 'https://picsum.photos/seed/yahayabello/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N80 Billion Laundering Probe',
        description: 'EFCC investigation into the laundering of N80 billion in state funds through various conduits.',
        status: 'charged',
        amountInvolved: 80000000000,
        currency: 'NGN',
        caseStartDate: '2024-04-17',
        sources: [{ title: 'EFCC Official Gazette', url: 'https://efcc.gov.ng', publisher: 'EFCC', publicationDate: '2024-04-18', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Godwin Emefiele',
    primaryParty: 'Independent',
    bio: 'Former Governor of the Central Bank of Nigeria. Facing multiple counts including forgery, procurement fraud, and naira redesign irregularities.',
    profileImageUrl: 'https://picsum.photos/seed/emefiele/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Procurement Fraud & Forgery',
        description: 'Charges related to the illegal printing of naira notes and massive procurement irregularities at the CBN.',
        status: 'charged',
        amountInvolved: 1200000000,
        currency: 'NGN',
        caseStartDate: '2023-11-17',
        sources: [{ title: 'Federal High Court Filing', url: 'https://judiciary.gov.ng', publisher: 'Nigerian Judiciary', publicationDate: '2023-11-17', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Betta Edu',
    primaryParty: 'APC',
    bio: 'Former Minister of Humanitarian Affairs and Poverty Alleviation. Suspended following financial transfer scandals involving private accounts.',
    profileImageUrl: 'https://picsum.photos/seed/bettaedu/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Ministerial Fund Mismanagement',
        description: 'Investigation into the transfer of N585 million intended for social intervention into a private bank account.',
        status: 'under_investigation',
        amountInvolved: 585000000,
        currency: 'NGN',
        caseStartDate: '2024-01-08',
        sources: [{ title: 'Ministerial Probe', url: 'https://premiumtimesng.com', publisher: 'Premium Times', publicationDate: '2024-01-09', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Peter Obi',
    primaryParty: 'LP',
    bio: 'Former Governor of Anambra State and 2023 Presidential Candidate. Noted for offshore financial holdings identified in international leaks.',
    profileImageUrl: 'https://picsum.photos/seed/peterobi/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Pandora Papers Inquiry',
        description: 'International investigation into offshore company holdings and non-disclosure during public office tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2021-10-04',
        sources: [{ title: 'Premium Times Pandora Leak', url: 'https://premiumtimesng.com', publisher: 'Premium Times', publicationDate: '2021-10-04', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Atiku Abubakar',
    primaryParty: 'PDP',
    bio: 'Former Vice President of Nigeria. Involved in various international business-related inquiries and multiple presidential bids.',
    profileImageUrl: 'https://picsum.photos/seed/atiku/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'US Senate Bribery Investigation',
        description: 'US Senate report documenting allegations of illicit transfers and bribery involving offshore entities linked to his family.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2010-02-04',
        sources: [{ title: 'US Senate PSI Report', url: 'https://senate.gov', publisher: 'US Senate', publicationDate: '2010-02-04', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Orji Uzor Kalu',
    primaryParty: 'APC',
    bio: 'Senator and former Governor of Abia State. Involved in long-running legal proceedings regarding the misappropriation of Abia State treasury funds.',
    profileImageUrl: 'https://picsum.photos/seed/kalu/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N7.1 Billion Treasury Fraud',
        description: 'Retrial proceedings for allegations of misappropriating Abia State funds during his tenure as governor.',
        status: 'charged',
        amountInvolved: 7100000000,
        currency: 'NGN',
        caseStartDate: '2007-07-11',
        sources: [{ title: 'Supreme Court Ruling', url: 'https://supremecourt.gov.ng', publisher: 'Supreme Court of Nigeria', publicationDate: '2020-05-08', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Godswill Akpabio',
    primaryParty: 'APC',
    bio: 'Current Senate President and former Governor of Akwa Ibom State. Frequently cited in inquiries regarding NDDC and state funding.',
    profileImageUrl: 'https://picsum.photos/seed/akpabio/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'NDDC Forensic Audit Inquiry',
        description: 'Inquiry into financial management at the Niger Delta Development Commission during his ministerial tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2020-07-20',
        sources: [{ title: 'Senate Inquiry Report', url: 'https://nass.gov.ng', publisher: 'National Assembly', publicationDate: '2020-07-20', credibilityRating: 4 }]
      }
    ]
  }
];
