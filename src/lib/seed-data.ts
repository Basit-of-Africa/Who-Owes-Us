import { Politician } from './types';

/**
 * A comprehensive, research-backed seed of Nigerian politicians and their 
 * verified public record "corruption footprints" since 2014.
 * This dataset includes reopened probes, active trials, and high-profile asset recovery cases.
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  // CATEGORY A: REOPENED GOVERNORS
  {
    fullName: 'Kayode Fayemi',
    primaryParty: 'APC',
    bio: 'Former Governor of Ekiti State and Minister of Mines and Steel Development. Subject of reopened probes regarding Ekiti state fund management and procurement.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Ekiti Fund / Procurement Probe',
        description: 'Reopened investigation into state fund management and procurement processes during his gubernatorial tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-05-01',
      }
    ]
  },
  {
    fullName: 'Ayo Fayose',
    primaryParty: 'PDP',
    bio: 'Former Governor of Ekiti State. Facing a long-running trial regarding allegations of N6.9 billion public fund misappropriation.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N6.9 Billion Fraud Trial',
        description: 'Ongoing trial regarding the alleged misappropriation of funds from the office of the National Security Adviser (ONSA).',
        status: 'charged',
        amountInvolved: 6900000000,
        currency: 'NGN',
        caseStartDate: '2018-10-22',
      }
    ]
  },
  {
    fullName: 'Bello Matawalle',
    primaryParty: 'APC',
    bio: 'Current Minister of State for Defence and former Governor of Zamfara State. Investigation into security fund management during his tenure.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Zamfara Security Fund Investigation',
        description: 'Inquiry into the management of security votes and state contracts.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-05-10',
      }
    ]
  },
  {
    fullName: 'Rabiu Kwankwaso',
    primaryParty: 'NNPP',
    bio: 'Former Governor of Kano State and Minister of Defence. Subject of investigation regarding pension fund management.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Kano Pension Fund Inquiry',
        description: 'Investigation into worker pension funds management and related state contracts.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-03-15',
      }
    ]
  },
  {
    fullName: 'Abdullahi Adamu',
    primaryParty: 'APC',
    bio: 'Former National Chairman of the APC and Governor of Nasarawa State. Historical N15bn fraud allegations resurfaced in recent years.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N15 Billion Fraud Case',
        description: 'Historical allegations of financial misappropriation during his governorship that resurfaced for review.',
        status: 'under_investigation',
        amountInvolved: 15000000000,
        currency: 'NGN',
        caseStartDate: '2023-01-01',
      }
    ]
  },

  // CATEGORY B: CURRENT / RECENT GOVERNORS
  {
    fullName: 'Willie Obiano',
    primaryParty: 'APGA',
    bio: 'Former Governor of Anambra State. Facing trial regarding the alleged laundering of N4 billion.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N4 Billion Money Laundering',
        description: 'Charges related to the diversion of Anambra State security votes.',
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
    bio: 'Former Governor of Imo State and Senator. Involved in multiple probes regarding Imo state assets and treasury funds.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N2.9 Billion Fraud Probe',
        description: 'Allegations of diversion of public funds to his private accounts and family-linked entities.',
        status: 'under_investigation',
        amountInvolved: 2900000000,
        currency: 'NGN',
        caseStartDate: '2022-01-31',
      }
    ]
  },

  // CATEGORY C: MINISTERS / FEDERAL EXECUTIVES
  {
    fullName: 'Diezani Alison-Madueke',
    primaryParty: 'PDP',
    bio: 'Former Minister of Petroleum Resources. At the center of massive international asset recovery cases involving oil bribery.',
    totalForfeiture: 153000000,
    cases: [
      {
        title: 'Permanent Asset Forfeiture',
        description: 'Permanent forfeiture of $153 million and dozens of properties to the FGN.',
        status: 'convicted',
        amountInvolved: 153000000,
        currency: 'USD',
        caseStartDate: '2017-08-28',
      },
      {
        title: 'UK Oil Bribery Trial',
        description: 'Charges brought by the UK NCA regarding oil-linked bribery.',
        status: 'charged',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2023-08-22',
      }
    ]
  },
  {
    fullName: 'Ahmed Idris',
    primaryParty: 'Independent',
    bio: 'Former Accountant-General of the Federation. Facing trial for the alleged misappropriation of N109 billion.',
    totalForfeiture: 30000000000,
    cases: [
      {
        title: 'N109 Billion Treasury Fraud',
        description: 'Trial for allegedly misappropriating N109 billion in public funds.',
        status: 'charged',
        amountInvolved: 109000000000,
        currency: 'NGN',
        caseStartDate: '2022-05-16',
      }
    ]
  },
  {
    fullName: 'Mohammed Bello Adoke',
    primaryParty: 'PDP',
    bio: 'Former Attorney General of the Federation. Charged regarding roles in the controversial Malabu Oil Deal.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Malabu Oil Transaction',
        description: 'Allegations of money laundering and conspiracy relating to the OPL 245 deal.',
        status: 'charged',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2020-01-23',
      }
    ]
  },

  // CATEGORY D: SENATORS / NATIONAL ASSEMBLY
  {
    fullName: 'Orji Uzor Kalu',
    primaryParty: 'APC',
    bio: 'Senator and former Governor of Abia State. Case involves state treasury funds, currently facing retrial proceedings.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N7.65 Billion Retrial',
        description: 'Retrial for alleged fraud committed during his tenure as Governor.',
        status: 'charged',
        amountInvolved: 7650000000,
        currency: 'NGN',
        caseStartDate: '2007-07-11',
      }
    ]
  },
  {
    fullName: 'Stella Oduah',
    primaryParty: 'PDP',
    bio: 'Senator and former Minister of Aviation. Facing charges related to financial misappropriation of N5 billion.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N5 Billion Money Laundering',
        description: 'Allegations of conspiracy and money laundering involving aviation funds.',
        status: 'charged',
        amountInvolved: 5000000000,
        currency: 'NGN',
        caseStartDate: '2021-02-22',
      }
    ]
  },
  {
    fullName: 'Olisa Metuh',
    primaryParty: 'PDP',
    bio: 'Former National Publicity Secretary of the PDP. Convicted for his role in the N400 million ONSA armsgate fund.',
    totalForfeiture: 400000000,
    cases: [
      {
        title: 'N400 Million Armsgate Fund',
        description: 'Convicted for receiving funds meant for security procurement from the ONSA.',
        status: 'convicted',
        amountInvolved: 400000000,
        currency: 'NGN',
        caseStartDate: '2016-01-15',
      }
    ]
  },

  // CATEGORY E: TOP-TIER / PRESIDENTIAL FIGURES
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Historical financial probes and US asset forfeitures are documented in the public archive.',
    totalForfeiture: 460000,
    cases: [
      {
        title: 'Historical Financial Settlement',
        description: 'Asset settlement involving funds in US bank accounts during the 1990s.',
        status: 'alleged',
        amountInvolved: 460000,
        currency: 'USD',
        caseStartDate: '1993-10-04',
      }
    ]
  },
  {
    fullName: 'Atiku Abubakar',
    primaryParty: 'PDP',
    bio: 'Former Vice President of Nigeria. Involved in various international inquiries regarding business transactions.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'PTDF / International Inquiry',
        description: 'US Senate reports and local inquiries into business transactions and offshore transfers.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2010-02-04',
      }
    ]
  },

  // ADDITIONAL FORFEITURE CLUSTER
  {
    fullName: 'Abdulrasheed Maina',
    primaryParty: 'Independent',
    bio: 'Former Chairman of the Pension Reform Task Team. Convicted for massive pension fund diversion.',
    totalForfeiture: 2000000000,
    cases: [
      {
        title: 'Pension Fund Diversion',
        description: 'Convicted for laundering and diverting over N2 billion in pension funds.',
        status: 'convicted',
        amountInvolved: 2000000000,
        currency: 'NGN',
        caseStartDate: '2019-10-25',
      }
    ]
  }
];
