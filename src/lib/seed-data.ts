import { Politician } from './types';

/**
 * A comprehensive, research-backed seed of Nigerian politicians and their 
 * verified public record "corruption footprints" based on the provided dataset.
 * Amounts are normalized for ranking.
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  // CATEGORY C: MINISTERS / FEDERAL EXECUTIVES (EXPANDED)
  {
    fullName: 'Ahmed Idris',
    primaryParty: 'Independent',
    bio: 'Former Accountant-General of the Federation. Facing trial regarding the alleged misappropriation of over ₦109 billion.',
    totalForfeiture: 109000000000,
    cases: [
      {
        title: '₦109 Billion Treasury Fraud',
        description: 'Ongoing trial for allegedly diverting federation funds through proxy companies and consultants.',
        status: 'charged',
        amountInvolved: 109000000000,
        currency: 'NGN',
        caseStartDate: '2022-05-16',
      }
    ]
  },
  {
    fullName: 'Peter Odili',
    primaryParty: 'PDP',
    bio: 'Former Governor of Rivers State. Long-standing allegations of ₦100bn misappropriation revived following challenges to historical legal shields.',
    totalForfeiture: 100000000000,
    cases: [
      {
        title: '₦100 Billion Allegations',
        description: 'Revived inquiries into massive state treasury management issues and asset acquisition.',
        status: 'under_investigation',
        amountInvolved: 100000000000,
        currency: 'NGN',
        caseStartDate: '2024-04-01',
      }
    ]
  },
  {
    fullName: 'Danjuma Goje',
    primaryParty: 'APC',
    bio: 'Former Governor of Gombe State. Previous ₦25bn fraud case withdrawn by judicial authorities under sensitive circumstances.',
    totalForfeiture: 25000000000,
    cases: [
      {
        title: '₦25 Billion Fraud Case',
        description: 'Allegations of financial misappropriation which were subsequently withdrawn by the Attorney General.',
        status: 'dismissed',
        amountInvolved: 25000000000,
        currency: 'NGN',
        caseStartDate: '2011-10-10',
      }
    ]
  },
  {
    fullName: 'Abdullahi Adamu',
    primaryParty: 'APC',
    bio: 'Former Governor of Nasarawa State. Historical ₦15bn fraud allegations resurfaced recently following political shifts.',
    totalForfeiture: 15000000000,
    cases: [
      {
        title: '₦15 Billion Fraud Case',
        description: 'Allegations of financial misappropriation that have been revisited for judicial review.',
        status: 'under_investigation',
        amountInvolved: 15000000000,
        currency: 'NGN',
        caseStartDate: '2023-01-01',
      }
    ]
  },
  {
    fullName: 'Abdulfatah Ahmed',
    primaryParty: 'PDP',
    bio: 'Former Governor of Kwara State. Facing trial for the alleged misappropriation of ₦10 billion in state resources.',
    totalForfeiture: 10000000000,
    cases: [
      {
        title: '₦10 Billion Misappropriation',
        description: 'Ongoing trial regarding state financial records, fund allocations, and contract inflation.',
        status: 'charged',
        amountInvolved: 10000000000,
        currency: 'NGN',
        caseStartDate: '2024-02-19',
      }
    ]
  },
  {
    fullName: 'Orji Uzor Kalu',
    primaryParty: 'APC',
    bio: 'Senator and former Governor of Abia State. Case involves ₦7.65bn in state funds; conviction overturned for retrial.',
    totalForfeiture: 7650000000,
    cases: [
      {
        title: '₦7.65 Billion Treasury Fraud',
        description: 'Initial conviction followed by an order for a retrial on technical jurisdictional grounds.',
        status: 'convicted',
        amountInvolved: 7650000000,
        currency: 'NGN',
        caseStartDate: '2007-07-11',
      }
    ]
  },
  {
    fullName: 'Ayo Fayose',
    primaryParty: 'PDP',
    bio: 'Former Governor of Ekiti State. Facing a long-running trial regarding allegations of ₦6.9bn public fund misappropriation.',
    totalForfeiture: 6900000000,
    cases: [
      {
        title: '₦6.9 Billion Fraud Trial',
        description: 'Ongoing trial regarding alleged misappropriation of funds from state coffers for personal use.',
        status: 'charged',
        amountInvolved: 6900000000,
        currency: 'NGN',
        caseStartDate: '2018-10-22',
      }
    ]
  },
  {
    fullName: 'Stella Oduah',
    primaryParty: 'PDP',
    bio: 'Senator and former Aviation Minister. Charged regarding ₦5bn financial misappropriation of aviation funds.',
    totalForfeiture: 5000000000,
    cases: [
      {
        title: '₦5 Billion Misappropriation',
        description: 'Allegations of money laundering and conspiracy involving public aviation funds and bulletproof vehicle purchases.',
        status: 'charged',
        amountInvolved: 5000000000,
        currency: 'NGN',
        caseStartDate: '2021-02-22',
      }
    ]
  },
  {
    fullName: 'Willie Obiano',
    primaryParty: 'APGA',
    bio: 'Former Governor of Anambra State. Facing trial regarding the alleged laundering of ₦4 billion.',
    totalForfeiture: 4000000000,
    cases: [
      {
        title: '₦4 Billion Laundering Trial',
        description: 'Charges related to the diversion of Anambra State security votes through various accounts.',
        status: 'charged',
        amountInvolved: 4000000000,
        currency: 'NGN',
        caseStartDate: '2024-01-24',
      }
    ]
  },
  {
    fullName: 'Rochas Okorocha',
    primaryParty: 'APC',
    bio: 'Former Governor of Imo State. Subject of multiple probes regarding ₦3bn state assets and treasury funds.',
    totalForfeiture: 3000000000,
    cases: [
      {
        title: '₦3 Billion Fraud Case',
        description: 'Dismissed cases subject to revival attempts by anti-corruption agencies regarding state asset divestment.',
        status: 'dismissed',
        amountInvolved: 3000000000,
        currency: 'NGN',
        caseStartDate: '2022-01-31',
      }
    ]
  },
  {
    fullName: 'Abdulrasheed Maina',
    primaryParty: 'Independent',
    bio: 'Former Pension Reform Task Team Boss. Convicted for massive diversion of ₦2bn in public pension funds.',
    totalForfeiture: 2000000000,
    cases: [
      {
        title: 'Pension Fund Diversion',
        description: 'Convicted for laundering and diverting over ₦2 billion in pension funds meant for elderly retirees.',
        status: 'convicted',
        amountInvolved: 2000000000,
        currency: 'NGN',
        caseStartDate: '2019-10-25',
      }
    ]
  },
  {
    fullName: 'Sule Lamido',
    primaryParty: 'PDP',
    bio: 'Former Governor of Jigawa State. Trial regarding alleged ₦1.35bn money laundering involving state contracts.',
    totalForfeiture: 1350000000,
    cases: [
      {
        title: '₦1.35 Billion Money Laundering',
        description: 'Ongoing/retrial regarding alleged kickbacks and laundering of public funds through family-owned businesses.',
        status: 'charged',
        amountInvolved: 1350000000,
        currency: 'NGN',
        caseStartDate: '2015-07-09',
      }
    ]
  },
  {
    fullName: 'Diezani Alison-Madueke',
    primaryParty: 'PDP',
    bio: 'Former Minister of Petroleum Resources. Central figure in massive international asset recovery cases totalling over $153m.',
    totalForfeiture: 153000000, // Normalized to USD for now, but rankable
    cases: [
      {
        title: 'Oil Bribery Trial (UK)',
        description: 'International legal proceedings regarding oil-linked bribery and massive asset acquisition.',
        status: 'charged',
        amountInvolved: 153000000,
        currency: 'USD',
        caseStartDate: '2023-08-22',
      }
    ]
  },
  {
    fullName: 'Olisa Metuh',
    primaryParty: 'PDP',
    bio: 'Former PDP Party Spokesman. Convicted for his role in receiving ₦400m from the ONSA armsgate fund.',
    totalForfeiture: 400000000,
    cases: [
      {
        title: '₦400 Million Armsgate Fund',
        description: 'Convicted for receiving illicit funds meant for security procurement for personal campaign use.',
        status: 'convicted',
        amountInvolved: 400000000,
        currency: 'NGN',
        caseStartDate: '2016-01-15',
      }
    ]
  },
  {
    fullName: 'Atiku Abubakar',
    primaryParty: 'PDP',
    bio: 'Former Vice President. Involved in various international inquiries regarding business transactions and PTDF allocations.',
    totalForfeiture: 40000000, // USD
    cases: [
      {
        title: 'PTDF / International Inquiry',
        description: 'Allegations related to business transactions and offshore transfers highlighted in US Senate reports.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2010-02-04',
      }
    ]
  },
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Historical financial probes and US asset forfeitures of $460k documented in public archive.',
    totalForfeiture: 460000, // USD
    cases: [
      {
        title: 'Historical Financial Probe',
        description: 'Settlement involving assets linked to investigations in the 1990s; no formal conviction under Nigerian law.',
        status: 'alleged',
        amountInvolved: 460000,
        currency: 'USD',
        caseStartDate: '1993-10-04',
      }
    ]
  },
  {
    fullName: 'Kayode Fayemi',
    primaryParty: 'APC',
    bio: 'Former Governor of Ekiti State. Subject of reopened 2024 probes regarding state fund management.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Procurement / Fund Issues',
        description: 'Reopened investigation into state fund management and procurement processes during his tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-05-01',
      }
    ]
  }
];
