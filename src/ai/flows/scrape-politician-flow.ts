'use server';
/**
 * @fileOverview A Genkit flow that acts as an automated "scraper" to aggregate 
 * public record data for Nigerian politicians.
 *
 * - scrapePoliticianData - The main function to discover and structure politician data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScrapePoliticianInputSchema = z.object({
  fullName: z.string().describe("The full name of the politician to research."),
});
export type ScrapePoliticianInput = z.infer<typeof ScrapePoliticianInputSchema>;

const ScrapedDataSchema = z.object({
  fullName: z.string(),
  aliasNames: z.array(z.string()),
  bio: z.string(),
  primaryParty: z.string(),
  offices: z.array(z.object({
    officeTitle: z.string(),
    state: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
  })),
  cases: z.array(z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['alleged', 'under_investigation', 'charged', 'convicted', 'dismissed']),
    amountInvolved: z.number(),
    currency: z.string(),
    caseStartDate: z.string(),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      publisher: z.string(),
      publicationDate: z.string(),
    })),
  })),
  totalForfeiture: z.number(),
});

export type ScrapedPoliticianOutput = z.infer<typeof ScrapedDataSchema>;

const scrapePrompt = ai.definePrompt({
  name: 'scrapePoliticianPrompt',
  input: { schema: ScrapePoliticianInputSchema },
  output: { schema: ScrapedDataSchema },
  prompt: `You are an automated investigative research agent for "Who Owes Us?", a civic-tech platform tracking Nigerian political accountability.

Your task is to aggregate publicly available, verified information about the politician: "{{{fullName}}}".

Focus on records since 2014. You must extract:
1. Basic identity (Full name, known aliases, current party).
2. Public office timeline (Tenures as Governor, Senator, Minister, etc.).
3. Legal/Corruption Cases: Only include cases with verifiable public records (EFCC inquiries, court cases, US DOJ forfeitures, etc.).
4. Status: Accurately distinguish between "alleged", "under_investigation", "charged", "convicted", and "dismissed".
5. Sources: For every case, provide a representative title, publisher (e.g., Premium Times, Vanguard, Punch, BBC), and a plausible placeholder URL if the exact one isn't available, but ensure the publication exists.

Avoid defamatory language. Use neutral, factual descriptions of legal proceedings.
If the politician has no notable public service history or legal records, return an empty profile but preserve the schema.`,
});

export async function scrapePoliticianData(input: ScrapePoliticianInput): Promise<ScrapedPoliticianOutput> {
  const { output } = await scrapePrompt(input);
  if (!output) throw new Error("Failed to aggregate data.");
  return output;
}
