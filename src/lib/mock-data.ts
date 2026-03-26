
import { Politician } from './types';

export const politicians: Politician[] = [
  {
    id: '1',
    fullName: 'Chief Barnaby Sterling',
    offices: ['Minister of Finance', 'Governor of East Province'],
    party: 'National Prosperity Party',
    yearsInService: '1998 - 2012',
    status: 'convicted',
    accountabilityScore: 92,
    caseCount: 4,
    totalForfeiture: 125000000,
    imageUrl: 'https://picsum.photos/seed/pol1/400/400',
    biography: 'Barnaby Sterling served two terms as Governor before being appointed Minister of Finance. His tenure was marked by rapid infrastructure development and later, massive embezzlement scandals.',
    partyHistory: [
      { party: 'National Prosperity Party', years: '2005 - 2012' },
      { party: 'Progressive Alliance', years: '1998 - 2005' }
    ],
    cases: [
      {
        id: 'c1',
        title: 'The Great Road Fund Embezzlement',
        description: 'Misappropriation of $50M intended for the trans-provincial highway construction project.',
        date: '2010-05-15',
        status: 'convicted',
        forfeitureAmount: 45000000,
        sources: ['https://example.com/report1', 'https://example.com/court-records']
      },
      {
        id: 'c2',
        title: 'Swiss Bank Account Scandal',
        description: 'Discovery of undeclared foreign accounts totaling $80M in various tax havens.',
        date: '2013-11-20',
        status: 'settled',
        forfeitureAmount: 80000000,
        sources: ['https://example.com/leak']
      }
    ]
  },
  {
    id: '2',
    fullName: 'Senator Elena Valerius',
    offices: ['Chair of Energy Committee', 'Senator'],
    party: 'Global Liberty Front',
    yearsInService: '2010 - Present',
    status: 'under investigation',
    accountabilityScore: 65,
    caseCount: 2,
    totalForfeiture: 1500000,
    imageUrl: 'https://picsum.photos/seed/pol2/400/400',
    biography: 'Senator Valerius is a high-ranking legislator known for her influence in the energy sector. Current investigations focus on lobbying irregularities.',
    partyHistory: [
      { party: 'Global Liberty Front', years: '2010 - Present' }
    ],
    cases: [
      {
        id: 'c3',
        title: 'Energy Sector Kickback Probe',
        description: 'Allegations of receiving illicit payments from major utility corporations in exchange for favorable legislation.',
        date: '2023-02-10',
        status: 'pending',
        forfeitureAmount: 0,
        sources: ['https://example.com/news/valerius-probe']
      }
    ]
  },
  {
    id: '3',
    fullName: 'Dr. Marcus Thorne',
    offices: ['Health Commissioner', 'City Councilman'],
    party: 'United People Union',
    yearsInService: '2002 - 2018',
    status: 'retired',
    accountabilityScore: 40,
    caseCount: 1,
    totalForfeiture: 500000,
    imageUrl: 'https://picsum.photos/seed/pol3/400/400',
    biography: 'Dr. Thorne had a long career in public health management. One minor conviction for contract mismanagement later in his career.',
    partyHistory: [
      { party: 'United People Union', years: '2002 - 2018' }
    ],
    cases: [
      {
        id: 'c4',
        title: 'Medical Supplies Procurement Lapses',
        description: 'Administrative negligence leading to overpayment for diagnostic equipment.',
        date: '2017-08-12',
        status: 'convicted',
        forfeitureAmount: 500000,
        sources: ['https://example.com/audit-report']
      }
    ]
  }
];
