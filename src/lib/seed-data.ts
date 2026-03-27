
import { Politician } from './types';

/**
 * Normalized Master Seed Data (NGN as Base)
 * Formula: USD amount * 1600 = NGN Baseline
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  {
    fullName: 'Diezani Alison-Madueke',
    primaryParty: 'PDP',
    bio: 'Former Minister of Petroleum Resources. Involved in massive international asset recovery cases totalling over $153m.',
    totalForfeiture: 244800000000, // $153m * 1600 = 244.8 Billion NGN
    cases: [
      {
        title: 'Oil Bribery & Asset Recovery',
        description: 'International legal proceedings regarding oil-linked bribery and massive property forfeitures.',
        status: 'charged',
        amountInvolved: 153000000,
        currency: 'USD',
        caseStartDate: '2023-08-22',
      }
    ]
  },
  {
    fullName: 'Ahmed Idris',
    primaryParty: 'Independent',
    bio: 'Former Accountant-General of the Federation. Facing trial regarding the alleged misappropriation of over ₦109 billion.',
    totalForfeiture: 109000000000,
    cases: [
      {
        title: '₦109 Billion Treasury Fraud',
        description: 'Ongoing trial for allegedly diverting federation funds through proxy companies.',
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
    bio: 'Former Governor of Rivers State. Reopened investigations into ₦100bn misappropriation following legal challenges.',
    totalForfeiture: 100000000000,
    cases: [
      {
        title: '₦100 Billion Allegations',
        description: 'Revived inquiries into massive state treasury management issues.',
        status: 'under_investigation',
        amountInvolved: 100000000000,
        currency: 'NGN',
        caseStartDate: '2024-04-01',
      }
    ]
  },
  {
    fullName: 'Atiku Abubakar',
    primaryParty: 'PDP',
    bio: 'Former Vice President. Involved in various international inquiries regarding business transactions.',
    totalForfeiture: 64000000000, // $40m * 1600 = 64 Billion NGN
    cases: [
      {
        title: 'PTDF / International Inquiry',
        description: 'Allegations related to business transactions and offshore transfers highlighted in US reports.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2010-02-04',
      }
    ]
  },
  {
    fullName: 'Danjuma Goje',
    primaryParty: 'APC',
    bio: 'Former Governor of Gombe State. Previous ₦25bn fraud case withdrawn by judicial authorities.',
    totalForfeiture: 25000000000,
    cases: [
      {
        title: '₦25 Billion Fraud Case',
        description: 'Allegations of financial misappropriation subsequently withdrawn by the Attorney General.',
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
    bio: 'Former Governor of Nasarawa State. Historical ₦15bn fraud allegations resurfaced recently.',
    totalForfeiture: 15000000000,
    cases: [
      {
        title: '₦15 Billion Fraud Case',
        description: 'Allegations of financial misappropriation revisited for judicial review.',
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
    bio: 'Former Governor of Kwara State. Facing trial for the alleged misappropriation of ₦10 billion.',
    totalForfeiture: 10000000000,
    cases: [
      {
        title: '₦10 Billion Misappropriation',
        description: 'Ongoing trial regarding state financial records and fund allocations.',
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
    bio: 'Senator and former Governor of Abia State. Case involves ₦7.65bn; conviction overturned for retrial.',
    totalForfeiture: 7650000000,
    cases: [
      {
        title: '₦7.65 Billion Treasury Fraud',
        description: 'Initial conviction followed by an order for a retrial on technical grounds.',
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
    bio: 'Former Governor of Ekiti State. Facing long-running trial regarding ₦6.9bn public fund misappropriation.',
    totalForfeiture: 6900000000,
    cases: [
      {
        title: '₦6.9 Billion Fraud Trial',
        description: 'Ongoing trial regarding alleged misappropriation of funds from state coffers.',
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
    bio: 'Senator and former Aviation Minister. Charged regarding ₦5bn financial misappropriation.',
    totalForfeiture: 5000000000,
    cases: [
      {
        title: '₦5 Billion Misappropriation',
        description: 'Allegations of money laundering involving public aviation funds.',
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
    bio: 'Former Governor of Imo State. Subject of multiple probes regarding ₦3bn state assets.',
    totalForfeiture: 3000000000,
    cases: [
      {
        title: '₦3 Billion Fraud Case',
        description: 'Cases subject to revival attempts regarding state asset divestment.',
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
    bio: 'Former Pension Reform Task Team Boss. Convicted for diversion of ₦2bn pension funds.',
    totalForfeiture: 2000000000,
    cases: [
      {
        title: 'Pension Fund Diversion',
        description: 'Convicted for laundering and diverting over ₦2 billion meant for retirees.',
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
    bio: 'Former Governor of Jigawa State. Trial regarding alleged ₦1.35bn money laundering.',
    totalForfeiture: 1350000000,
    cases: [
      {
        title: '₦1.35 Billion Money Laundering',
        description: 'Alleged kickbacks through family-owned businesses.',
        status: 'charged',
        amountInvolved: 1350000000,
        currency: 'NGN',
        caseStartDate: '2015-07-09',
      }
    ]
  },
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Historical financial probes and US asset forfeitures archived.',
    totalForfeiture: 736000000, // $460k * 1600 = 736 Million NGN
    cases: [
      {
        title: 'Historical Financial Probe',
        description: 'Settlement involving assets linked to investigations in the 1990s.',
        status: 'alleged',
        amountInvolved: 460000,
        currency: 'USD',
        caseStartDate: '1993-10-04',
      }
    ]
  },
  {
    fullName: 'Olisa Metuh',
    primaryParty: 'PDP',
    bio: 'Former PDP Party Spokesman. Convicted for role in receiving ₦400m from ONSA fund.',
    totalForfeiture: 400000000,
    cases: [
      {
        title: '₦400 Million Armsgate Fund',
        description: 'Convicted for receiving illicit funds meant for security procurement.',
        status: 'convicted',
        amountInvolved: 400000000,
        currency: 'NGN',
        caseStartDate: '2016-01-15',
      }
    ]
  },
  {
    fullName: 'Kayode Fayemi',
    primaryParty: 'APC',
    bio: 'Former Governor of Ekiti State. Subject of reopened 2024 probes regarding fund management.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Procurement / Fund Issues',
        description: 'Reopened investigation into state fund management and procurement.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-05-01',
      }
    ]
  }
];
