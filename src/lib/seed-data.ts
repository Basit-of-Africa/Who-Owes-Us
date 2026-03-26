import { Politician } from './types';

/**
 * A comprehensive, research-backed seed of Nigerian politicians and their 
 * verified public record "corruption footprints" based on the provided dataset.
 */
export const INITIAL_REGISTRY_SEED: Partial<Politician>[] = [
  // CATEGORY A: ADDITIONAL GOVERNORS (REOPENED / INVESTIGATED)
  {
    fullName: 'Kayode Fayemi',
    primaryParty: 'APC',
    bio: 'Former Governor of Ekiti State and Minister. Subject of reopened probes regarding state fund management and procurement.',
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
  },
  {
    fullName: 'Ayo Fayose',
    primaryParty: 'PDP',
    bio: 'Former Governor of Ekiti State. Facing a long-running trial regarding allegations of public fund misappropriation.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N6.9 Billion Fraud Trial',
        description: 'Ongoing trial regarding alleged misappropriation of funds from state coffers.',
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
    bio: 'Former Governor of Zamfara State and current Minister. Investigation into security fund management during his tenure.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Security Funds Investigation',
        description: 'Inquiry into the management of security votes and state contracts.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-05-10',
      }
    ]
  },
  {
    fullName: 'Chimaroke Nnamani',
    primaryParty: 'PDP',
    bio: 'Former Governor of Enugu State. Historical money laundering cases revived for further audit.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Money Laundering Audit',
        description: 'Revived investigation into historical financial transactions and asset acquisitions.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-01-15',
      }
    ]
  },
  {
    fullName: 'Sullivan Chime',
    primaryParty: 'APC',
    bio: 'Former Governor of Enugu State. Subject of inquiries regarding state fund utilization.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'State Funds Probe',
        description: 'Ongoing inquiry into financial management during his gubernatorial tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2023-11-01',
      }
    ]
  },
  {
    fullName: 'Abdullahi Adamu',
    primaryParty: 'APC',
    bio: 'Former Governor of Nasarawa State. Historical N15bn fraud allegations resurfaced recently.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N15 Billion Fraud Case',
        description: 'Allegations of financial misappropriation that have been revisited for judicial review.',
        status: 'under_investigation',
        amountInvolved: 15000000000,
        currency: 'NGN',
        caseStartDate: '2023-01-01',
      }
    ]
  },
  {
    fullName: 'Rabiu Kwankwaso',
    primaryParty: 'NNPP',
    bio: 'Former Governor of Kano State. Investigation into pension fund management and state contracts.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Pension / Contracts Inquiry',
        description: 'Audit of worker pension funds and related infrastructure contracts.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-03-15',
      }
    ]
  },
  {
    fullName: 'Aliyu Wamakko',
    primaryParty: 'APC',
    bio: 'Former Governor of Sokoto State. Probe into state fund allocations and treasury management.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'State Funds Allocation Probe',
        description: 'Audit of state financial records during his tenure as Governor.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2024-02-10',
      }
    ]
  },
  {
    fullName: 'Theodore Orji',
    primaryParty: 'PDP',
    bio: 'Former Governor of Abia State. Facing trial regarding the alleged diversion of state funds.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Diversion of Funds',
        description: 'Ongoing trial regarding allegations of treasury looting and fund diversion.',
        status: 'charged',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2020-02-24',
      }
    ]
  },
  {
    fullName: 'Danjuma Goje',
    primaryParty: 'APC',
    bio: 'Former Governor of Gombe State. Previous N25bn fraud case withdrawn by judicial authorities.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N25 Billion Fraud Case',
        description: 'Allegations of financial misappropriation which were subsequently withdrawn.',
        status: 'dismissed',
        amountInvolved: 25000000000,
        currency: 'NGN',
        caseStartDate: '2011-10-10',
      }
    ]
  },
  {
    fullName: 'Sule Lamido',
    primaryParty: 'PDP',
    bio: 'Former Governor of Jigawa State. Trial regarding alleged money laundering involving state contracts.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N1.35 Billion Money Laundering',
        description: 'Ongoing/retrial regarding alleged kickbacks and laundering of public funds.',
        status: 'charged',
        amountInvolved: 1350000000,
        currency: 'NGN',
        caseStartDate: '2015-07-09',
      }
    ]
  },
  {
    fullName: 'Peter Odili',
    primaryParty: 'PDP',
    bio: 'Former Governor of Rivers State. Long-standing allegations revived following challenges to historical legal shields.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N100 Billion Allegations',
        description: 'Revived inquiries into massive state treasury management issues.',
        status: 'under_investigation',
        amountInvolved: 100000000000,
        currency: 'NGN',
        caseStartDate: '2024-04-01',
      }
    ]
  },

  // CATEGORY B: CURRENT / RECENT GOVERNORS & ACTIVE POLITICIANS
  {
    fullName: 'Willie Obiano',
    primaryParty: 'APGA',
    bio: 'Former Governor of Anambra State. Facing trial regarding the alleged laundering of N4 billion.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N4 Billion Laundering Trial',
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
    bio: 'Former Governor of Imo State. Subject of multiple probes regarding state assets and treasury funds.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N3 Billion Fraud Case',
        description: 'Dismissed cases subject to revival attempts by anti-corruption agencies.',
        status: 'dismissed',
        amountInvolved: 3000000000,
        currency: 'NGN',
        caseStartDate: '2022-01-31',
      }
    ]
  },
  {
    fullName: 'Abdulfatah Ahmed',
    primaryParty: 'PDP',
    bio: 'Former Governor of Kwara State. Facing trial for the alleged misappropriation of N10 billion.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N10 Billion Misappropriation',
        description: 'Ongoing trial regarding state financial records and fund allocations.',
        status: 'charged',
        amountInvolved: 10000000000,
        currency: 'NGN',
        caseStartDate: '2024-02-19',
      }
    ]
  },
  {
    fullName: 'Tanko Al-Makura',
    primaryParty: 'APC',
    bio: 'Senator and former Governor. Investigation into procurement processes and state contracts.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Procurement Fraud Inquiry',
        description: 'Audit of infrastructure contracts and procurement during his tenure.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2023-09-01',
      }
    ]
  },
  {
    fullName: 'Abdulaziz Yari',
    primaryParty: 'APC',
    bio: 'Senator and former Governor. Investigation into the diversion of state and local government funds.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Funds Diversion Probe',
        description: 'Investigation into the management of state resources and Paris Club refund allocations.',
        status: 'under_investigation',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2021-05-10',
      }
    ]
  },
  {
    fullName: 'Godswill Akpabio',
    primaryParty: 'APC',
    bio: 'Senate President and former Governor. Subject of historical contract inquiries.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Contract Scandals',
        description: 'Historical investigations into large-scale state infrastructure funding.',
        status: 'alleged',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2015-01-01',
      }
    ]
  },
  {
    fullName: 'Bukola Saraki',
    primaryParty: 'PDP',
    bio: 'Former Senate President and Governor. Acquitted in asset declaration cases after long judicial battles.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Asset Declaration Case',
        description: 'Long-running legal battle regarding asset disclosure; ultimately acquitted.',
        status: 'dismissed',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2015-09-22',
      }
    ]
  },

  // CATEGORY C: MINISTERS / FEDERAL EXECUTIVES
  {
    fullName: 'Diezani Alison-Madueke',
    primaryParty: 'PDP',
    bio: 'Former Minister of Petroleum Resources. Central figure in massive international asset recovery cases.',
    totalForfeiture: 153000000,
    cases: [
      {
        title: 'Oil Bribery Trial (UK)',
        description: 'International legal proceedings regarding oil-linked bribery and asset acquisition.',
        status: 'charged',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2023-08-22',
      }
    ]
  },
  {
    fullName: 'Timipre Sylva',
    primaryParty: 'APC',
    bio: 'Former Minister of State for Petroleum and Governor. Charged regarding financial transactions during tenure.',
    totalForfeiture: 0,
    cases: [
      {
        title: '$14.8 Million Fraud Charge',
        description: 'Charges related to financial misappropriation and asset transfers.',
        status: 'charged',
        amountInvolved: 14800000,
        currency: 'USD',
        caseStartDate: '2015-01-01',
      }
    ]
  },
  {
    fullName: 'Mohammed Bello Adoke',
    primaryParty: 'PDP',
    bio: 'Former Attorney General of the Federation. Charged regarding roles in the Malabu Oil Deal.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Malabu Oil Deal Transaction',
        description: 'Allegations of conspiracy and money laundering related to OPL 245.',
        status: 'charged',
        amountInvolved: 0,
        currency: 'USD',
        caseStartDate: '2020-01-23',
      }
    ]
  },
  {
    fullName: 'Ahmed Idris',
    primaryParty: 'Independent',
    bio: 'Former Accountant-General. Trial regarding the alleged misappropriation of N109 billion.',
    totalForfeiture: 30000000000,
    cases: [
      {
        title: 'N109 Billion Treasury Fraud',
        description: 'Ongoing trial for allegedly diverting over N100bn from the federation account.',
        status: 'charged',
        amountInvolved: 109000000000,
        currency: 'NGN',
        caseStartDate: '2022-05-16',
      }
    ]
  },

  // CATEGORY D: SENATORS / NATIONAL ASSEMBLY
  {
    fullName: 'Olisa Metuh',
    primaryParty: 'PDP',
    bio: 'Former Party Spokesman. Convicted for his role in receiving funds from the ONSA armsgate fund.',
    totalForfeiture: 400000000,
    cases: [
      {
        title: 'N400 Million Armsgate Fund',
        description: 'Convicted for receiving illicit funds meant for security procurement.',
        status: 'convicted',
        amountInvolved: 400000000,
        currency: 'NGN',
        caseStartDate: '2016-01-15',
      }
    ]
  },
  {
    fullName: 'Orji Uzor Kalu',
    primaryParty: 'APC',
    bio: 'Senator and former Governor. Case involves N7.65bn in state funds.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N7.65 Billion Treasury Fraud',
        description: 'Initial conviction followed by an order for a retrial on technical grounds.',
        status: 'convicted',
        amountInvolved: 7650000000,
        currency: 'NGN',
        caseStartDate: '2007-07-11',
      }
    ]
  },
  {
    fullName: 'Stella Oduah',
    primaryParty: 'PDP',
    bio: 'Senator and former Minister. Charged regarding financial misappropriation of aviation funds.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'N5 Billion Misappropriation',
        description: 'Allegations of money laundering and conspiracy involving public aviation funds.',
        status: 'charged',
        amountInvolved: 5000000000,
        currency: 'NGN',
        caseStartDate: '2021-02-22',
      }
    ]
  },
  {
    fullName: 'Enyinnaya Abaribe',
    primaryParty: 'APGA',
    bio: 'Senator and former Deputy Governor. Previously involved in fraud-linked cases; ultimately discharged.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Fraud-linked Case',
        description: 'Legal review of financial transactions; discharged by the courts.',
        status: 'dismissed',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2018-01-01',
      }
    ]
  },
  {
    fullName: 'Dino Melaye',
    primaryParty: 'PDP',
    bio: 'Former Senator and Governor candidate. Subject of various asset and misconduct issues.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'Asset Issues',
        description: 'Judicial inquiry into asset filings and public statements; cases collapsed.',
        status: 'dismissed',
        amountInvolved: 0,
        currency: 'NGN',
        caseStartDate: '2017-01-01',
      }
    ]
  },

  // CATEGORY E: PRESIDENTIAL / TOP-TIER
  {
    fullName: 'Bola Ahmed Tinubu',
    primaryParty: 'APC',
    bio: 'Current President of Nigeria. Historical financial probes and US asset forfeitures are documented in the public archive.',
    totalForfeiture: 460000,
    cases: [
      {
        title: 'Historical Financial Probe',
        description: 'Settlement involving assets linked to investigations in the 1990s; no formal conviction.',
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
    bio: 'Former Vice President. Involved in various international inquiries regarding business transactions.',
    totalForfeiture: 0,
    cases: [
      {
        title: 'PTDF / International Inquiry',
        description: 'Allegations related to business transactions and offshore transfers.',
        status: 'alleged',
        amountInvolved: 40000000,
        currency: 'USD',
        caseStartDate: '2010-02-04',
      }
    ]
  },

  // CATEGORY F: FORFEITURE & ASSET SEIZURE
  {
    fullName: 'Abdulrasheed Maina',
    primaryParty: 'Independent',
    bio: 'Former Pension Reform Boss. Convicted for massive diversion of public pension funds.',
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
