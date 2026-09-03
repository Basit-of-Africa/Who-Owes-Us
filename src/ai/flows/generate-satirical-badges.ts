'use server';
/**
 * @fileOverview A Genkit flow for generating satirical badges for politicians based on their case history and accountability score.
 *
 * - generateSatiricalBadges - A function that generates satirical badges.
 * - GenerateSatiricalBadgesInput - The input type for the generateSatiricalBadges function.
 * - GenerateSatiricalBadgesOutput - The return type for the generateSatiricalBadges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSatiricalBadgesInputSchema = z.object({
  politicianName: z.string().describe("The full name of the politician."),
  accountabilityScore: z.number().describe("The politician's overall accountability score (higher score implies more issues/notoriety)."),
  caseSummaries: z.array(
    z.object({
      title: z.string().describe("Title of the case."),
      description: z.string().describe("A brief description of the case."),
      status: z.string().describe("The current status of the case (e.g., 'convicted', 'settled', 'pending')."),
      forfeitureAmount: z.number().optional().describe("Amount of money or assets forfeited in this case."),
    })
  ).describe("A summary of the politician's relevant case history, to inform badge generation."),
});
export type GenerateSatiricalBadgesInput = z.infer<typeof GenerateSatiricalBadgesInputSchema>;

const GenerateSatiricalBadgesOutputSchema = z.array(z.string()).describe("A list of satirical badges generated for the politician.");
export type GenerateSatiricalBadgesOutput = z.infer<typeof GenerateSatiricalBadgesOutputSchema>;

export async function generateSatiricalBadges(input: GenerateSatiricalBadgesInput): Promise<GenerateSatiricalBadgesOutput> {
  try {
    return await generateSatiricalBadgesFlow(input);
  } catch (err) {
    console.warn("AI badges error or key missing, using fallback badges:", err);
    return ['Frequent Court Visitor', 'Asset Recovery Contributor', 'Public Purse Purveyor'];
  }
}

const satiricalBadgesPrompt = ai.definePrompt({
  name: 'satiricalBadgesPrompt',
  input: {schema: GenerateSatiricalBadgesInputSchema},
  output: {schema: GenerateSatiricalBadgesOutputSchema},
  prompt: `You are an expert in political satire and accountability, tasked with generating context-relevant, non-defamatory satirical badges for a politician based on their track record.

Generate 3 to 5 unique and witty satirical badges for the politician named "{{{politicianName}}}", considering their overall accountability score and specific case histories. The badges should subtly highlight their "corruption-related notoriety" or legal entanglements in a satirical, non-defamatory manner.

Consider the following information:
Politician Name: {{{politicianName}}}
Accountability Score: {{{accountabilityScore}}} (Higher score implies more issues/notoriety)

Case History Summaries:
{{#if caseSummaries}}
  {{#each caseSummaries}}
    - Case Title: {{{title}}}
    - Description: {{{description}}}
    - Status: {{{status}}}
    {{#if forfeitureAmount}}- Forfeiture Amount: $\${{{forfeitureAmount}}}{{/if}}
  {{/each}}
{{else}}
  No specific case history provided. Generate badges based on general political satire or the accountability score.
{{/if}}

Examples of desired badge style:
- "Frequent Court Visitor"
- "Asset Recovery Contributor"
- "Public Purse Purveyor"
- "Ethical Gymnastics Gold Medalist"

Ensure the badges are creative, concise, and reflective of the provided data, without being overtly offensive or libelous.
Output an array of strings, where each string is a badge name.`,
});

const generateSatiricalBadgesFlow = ai.defineFlow(
  {
    name: 'generateSatiricalBadgesFlow',
    inputSchema: GenerateSatiricalBadgesInputSchema,
    outputSchema: GenerateSatiricalBadgesOutputSchema,
  },
  async (input) => {
    const {output} = await satiricalBadgesPrompt(input);
    return output!;
  }
);