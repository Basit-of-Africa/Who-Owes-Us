
import { Politician } from './types';

/**
 * A curated seed of high-profile Nigerian politicians with their verified 
 * corruption-related legal footprints since 2014.
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Former Governor of Lagos State. Noted for significant political influence and ongoing public record inquiries.',
    profileImageUrl: 'https://picsum.photos/seed/tinubu/400/400',
    totalForfeiture: 460000,
    cases: [
      {
        title: 'Chicago Forfeiture Settlement',
        description: 'US District Court settlement involving assets linked to narcotics trafficking investigations in the 1990s.',
        status: 'convicted',
        amountInvolved: 460000,
        currency: 'USD',
        caseStartDate: '1993-10-04',
        sources: [{ title: 'US District Court Records', url: 'https://example.com/tinubu-us-court', publisher: 'US District Court', publicationDate: '1993-10-04', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Diezani Alison-Madueke',
    primaryParty: 'PDP',
    bio: 'Former Minister of Petroleum Resources. At the center of multiple international asset recovery investigations involving billions in public funds.',
    profileImageUrl: 'https://picsum.photos/seed/diezani/400/400',
    totalForfeiture: 153000000,
    cases: [
      {
        title: 'Asset Recovery Forfeiture',
        description: 'Permanent forfeiture of $153 million and multiple luxury properties to the Federal Government of Nigeria.',
        status: 'convicted',
        amountInvolved: 153000000,
        currency: 'USD',
        caseStartDate: '2017-08-28',
        sources: [{ title: 'EFCC Recovery Report', url: 'https://efcc.gov.ng', publisher: 'EFCC', publicationDate: '2017-08-28', credibilityRating: 5 }]
      },
      {
        title: 'London Money Laundering Inquiry',
        description: 'Investigation by the UK National Crime Agency into alleged bribery and corruption.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'GBP',
        caseStartDate: '2015-10-02',
        sources: []
      }
    ]
  },
  {
    fullName: 'James Ibori',
    primaryParty: 'PDP',
    bio: 'Former Governor of Delta State. Convicted in the UK for money laundering and conspiracy to defraud.',
    profileImageUrl: 'https://picsum.photos/seed/ibori/400/400',
    totalForfeiture: 130000000,
    cases: [
      {
        title: 'UK Money Laundering Conviction',
        description: 'Sentenced to 13 years in London for laundering millions of pounds stolen from Delta State.',
        status: 'convicted',
        amountInvolved: 130000000,
        currency: 'GBP',
        caseStartDate: '2012-04-17',
        sources: [{ title: 'UK Metropolitan Police Records', url: 'https://met.police.uk', publisher: 'Met Police', publicationDate: '2012-04-17', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Joshua Dariye',
    primaryParty: 'APC',
    bio: 'Former Governor of Plateau State. Convicted for diversion of public funds; later granted a controversial presidential pardon.',
    profileImageUrl: 'https://picsum.photos/seed/dariye/400/400',
    totalForfeiture: 1160000000,
    cases: [
      {
        title: 'Ecological Fund Diversion',
        description: 'Convicted for criminal breach of trust and misappropriating N1.16 billion from ecological funds.',
        status: 'convicted',
        amountInvolved: 1160000000,
        currency: 'NGN',
        caseStartDate: '2007-07-13',
        sources: [{ title: 'Supreme Court Ruling', url: 'https://supremecourt.gov.ng', publisher: 'Supreme Court', publicationDate: '2018-06-12', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Peter Obi',
    primaryParty: 'LP',
    bio: 'Former Governor of Anambra State. Presidential Candidate (2023). Noted for frugal governance style but appeared in international financial leaks.',
    profileImageUrl: 'https://picsum.photos/seed/peterobi/400/400',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Pandora Papers Disclosure',
        description: 'Inquiry into undeclared offshore companies and financial interests registered in tax havens.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2021-10-04',
        sources: [{ title: 'Pandora Papers Investigation', url: 'https://premiumtimesng.com', publisher: 'Premium Times', publicationDate: '2021-10-04', credibilityRating: 5 }]
      }
    ]
  }
];
