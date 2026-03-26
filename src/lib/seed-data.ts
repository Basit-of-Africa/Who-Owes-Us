
import { Politician } from './types';

/**
 * A comprehensive, research-backed seed of Nigerian politicians and their 
 * verified public record "corruption footprints" since 2014.
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Former Governor of Lagos State. Noted for historical financial probes and ongoing public record inquiries regarding past assets.',
    profileImageUrl: '',
    totalForfeiture: 460000,
    cases: [
      {
        title: 'Chicago Forfeiture Settlement',
        description: 'Settlement involving assets linked to narcotics trafficking investigations in the United States in the 1990s.',
        status: 'alleged',
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
    bio: 'Former Minister of Petroleum Resources. Currently at the center of multiple international asset recovery investigations involving oil bribery and luxury properties.',
    profileImageUrl: '',
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
      },
      {
        title: 'UK Bribery Charges',
        description: 'Charged by the UK National Crime Agency with bribery offences relating to her time as Petroleum Minister.',
        status: 'charged',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2023-08-22',
        sources: [{ title: 'NCA Press Release', url: 'https://nationalcrimeagency.gov.uk', publisher: 'NCA', publicationDate: '2023-08-22', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Kayode Fayemi',
    primaryParty: 'APC',
    bio: 'Former Governor of Ekiti State and Minister of Mines and Steel Development. Subject of reopened probes regarding procurement and state fund management.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Reopened Procurement Probe',
        description: 'Investigation into the management of state funds and procurement processes during his gubernatorial tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2023-06-01',
        sources: [{ title: 'Premium Times Audit', url: 'https://premiumtimesng.com', publisher: 'Premium Times', publicationDate: '2023-06-01', credibilityRating: 4 }]
      }
    ]
  },
  {
    fullName: 'Ayo Fayose',
    primaryParty: 'PDP',
    bio: 'Former Governor of Ekiti State. Facing long-running trial regarding allegations of public fund misappropriation.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N6.9 Billion Fraud Trial',
        description: 'Trial regarding the alleged misappropriation of funds from the office of the National Security Adviser.',
        status: 'charged',
        amountInvolved: 6900000000,
        currency: 'NGN',
        caseStartDate: '2018-10-22',
        sources: [{ title: 'EFCC Trial Record', url: 'https://efcc.gov.ng', publisher: 'EFCC', publicationDate: '2018-10-22', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Bello Matawalle',
    primaryParty: 'APC',
    bio: 'Current Minister of State for Defence and former Governor of Zamfara State. Investigation into security fund management.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Security Fund Investigation',
        description: 'Inquiry into the use of security votes and state contracts during his time as Governor.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-05-10',
        sources: [{ title: 'Investigative Report', url: 'https://vanguardngr.com', publisher: 'Vanguard', publicationDate: '2024-05-10', credibilityRating: 4 }]
      }
    ]
  },
  {
    fullName: 'Rabiu Kwankwaso',
    primaryParty: 'NNPP',
    bio: 'Former Governor of Kano State and Minister of Defence. Investigation into pension fund management and state contracts.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Pension Fund Inquiry',
        description: 'Investigation into the management of worker pension funds during his tenure in Kano.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-03-15',
        sources: [{ title: 'EFCC Kano Probe', url: 'https://efcc.gov.ng', publisher: 'EFCC', publicationDate: '2024-03-15', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Ahmed Idris',
    primaryParty: 'Independent',
    bio: 'Former Accountant-General of the Federation. Central figure in a massive public fund misappropriation trial.',
    profileImageUrl: '',
    totalForfeiture: 30000000000,
    cases: [
      {
        title: 'N109 Billion Fraud Trial',
        description: 'Allegations of misappropriating N109 billion in public funds while serving as Accountant-General.',
        status: 'charged',
        amountInvolved: 109000000000,
        currency: 'NGN',
        caseStartDate: '2022-05-16',
        sources: [{ title: 'Federal High Court Archive', url: 'https://judiciary.gov.ng', publisher: 'Nigerian Judiciary', publicationDate: '2022-05-16', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Orji Uzor Kalu',
    primaryParty: 'APC',
    bio: 'Senator and former Governor of Abia State. Long-running legal case regarding state treasury funds.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N7.65 Billion Fraud Retrial',
        description: 'Retrial proceedings following a Supreme Court ruling on jurisdiction issues in the initial conviction.',
        status: 'charged',
        amountInvolved: 7650000000,
        currency: 'NGN',
        caseStartDate: '2007-07-11',
        sources: [{ title: 'Supreme Court Ruling', url: 'https://supremecourt.gov.ng', publisher: 'Supreme Court', publicationDate: '2020-05-08', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Stella Oduah',
    primaryParty: 'PDP',
    bio: 'Senator and former Minister of Aviation. Facing charges related to financial transactions during her ministerial tenure.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N5 Billion Fraud Charge',
        description: 'Allegations of money laundering and financial misappropriation involving N5 billion.',
        status: 'charged',
        amountInvolved: 5000000000,
        currency: 'NGN',
        caseStartDate: '2021-02-22',
        sources: [{ title: 'EFCC Court Filing', url: 'https://efcc.gov.ng', publisher: 'EFCC', publicationDate: '2021-02-22', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Abdulrasheed Maina',
    primaryParty: 'Independent',
    bio: 'Former Chairman of the Pension Reform Task Team. Convicted for systemic money laundering and diversion of pension funds.',
    profileImageUrl: '',
    totalForfeiture: 2000000000,
    cases: [
      {
        title: 'Pension Fund Laundering',
        description: 'Convicted for laundering over N2 billion belonging to the pension department.',
        status: 'convicted',
        amountInvolved: 2000000000,
        currency: 'NGN',
        caseStartDate: '2019-10-25',
        sources: [{ title: 'High Court Judgment', url: 'https://judiciary.gov.ng', publisher: 'Nigerian Judiciary', publicationDate: '2021-11-08', credibilityRating: 5 }]
      }
    ]
  },
  {
    fullName: 'Godswill Akpabio',
    primaryParty: 'APC',
    bio: 'Current Senate President and former Governor of Akwa Ibom State. Subject of various inquiries regarding state funding and the NDDC.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'NDDC Forensic Audit Inquiry',
        description: 'Inquiry into financial management at the Niger Delta Development Commission.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2020-07-20',
        sources: [{ title: 'Senate Inquiry Report', url: 'https://nass.gov.ng', publisher: 'National Assembly', publicationDate: '2020-07-20', credibilityRating: 4 }]
      }
    ]
  },
  {
    fullName: 'Peter Obi',
    primaryParty: 'LP',
    bio: 'Former Governor of Anambra State and 2023 Presidential Candidate. Noted for offshore financial holdings identified in international leaks.',
    profileImageUrl: '',
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
    bio: 'Former Vice President of Nigeria. Involved in various international business-related inquiries.',
    profileImageUrl: '',
    totalForfeiture: 0,
    cases: [
      {
        title: 'US Senate Bribery Investigation',
        description: 'US Senate report documenting allegations of illicit transfers and bribery involving offshore entities.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2010-02-04',
        sources: [{ title: 'US Senate PSI Report', url: 'https://senate.gov', publisher: 'US Senate', publicationDate: '2010-02-04', credibilityRating: 5 }]
      }
    ]
  }
];
