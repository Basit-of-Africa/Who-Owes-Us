'use server';
/**
 * @fileOverview This file contains a Genkit flow for generating concise and engaging "Did you know?" snippets
 * about a politician's corruption records, suitable for social media sharing.
 *
 * - generateShareableFacts - A function that handles the generation of shareable facts.
 * - GenerateShareableFactsInput - The input type for the generateShareableFacts function.
 * - GenerateShareableFactsOutput - The return type for the generateShareableFacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShareableFactsInputSchema = z.object({
  fullName: z.string().describe("The politician's full name."),
  corruptionRecords: z
    .array(
      z.object({
        caseTitle: z.string().describe('The title of the corruption case.'),
        description: z.string().describe('A brief description of the case.'),
        convictionStatus: z
          .string()
          .describe("Status of the conviction (e.g., 'convicted', 'acquitted', 'pending')."),
        forfeitureAmount: z.number().optional().describe('The amount of money forfeited, if applicable.'),
        sources: z.array(z.string()).describe('URLs or descriptions of sources for the case information.'),
      })
    )
    .describe("A list of the politician's corruption cases and their details."),
});
export type GenerateShareableFactsInput = z.infer<typeof GenerateShareableFactsInputSchema>;

const GenerateShareableFactsOutputSchema = z.object({
  snippets: z
    .array(
      z.string().describe("An engaging 'Did you know?' snippet about the politician's corruption record.")
    )
    .describe("A list of concise, engaging 'Did you know?' snippets."),
});
export type GenerateShareableFactsOutput = z.infer<typeof GenerateShareableFactsOutputSchema>;

export async function generateShareableFacts(
  input: GenerateShareableFactsInput
): Promise<GenerateShareableFactsOutput> {
  return generateShareableFactsFlow(input);
}

const generateShareableFactsPrompt = ai.definePrompt({
  name: 'generateShareableFactsPrompt',
  input: {schema: GenerateShareableFactsInputSchema},
  output: {schema: GenerateShareableFactsOutputSchema},
  prompt: `You are an expert content creator specializing in civic accountability. Your task is to generate concise and engaging "Did you know?" snippets about a politician's corruption records, suitable for social media sharing. These snippets should be factual, impactful, and designed to raise public awareness without being defamatory.

Politician: {{{fullName}}}

Corruption Records:
{{#each corruptionRecords}}
- Case Title: {{{caseTitle}}}
- Description: {{{description}}}
- Conviction Status: {{{convictionStatus}}}
{{#if forfeitureAmount}}- Forfeiture Amount: $\n{{{forfeitureAmount}}}{{/if}}
- Sources: {{#each sources}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Based on the information above, generate 3-5 distinct "Did you know?" snippets. Each snippet should start with "Did you know?" and be a single sentence. Ensure they highlight key facts about their corruption records in an engaging way.

Examples:
- Did you know? [Fact about politician A's case].
- Did you know? [Another fact about politician A's forfeiture].

`,
});

const generateShareableFactsFlow = ai.defineFlow(
  {
    name: 'generateShareableFactsFlow',
    inputSchema: GenerateShareableFactsInputSchema,
    outputSchema: GenerateShareableFactsOutputSchema,
  },
  async (input) => {
    const {output} = await generateShareableFactsPrompt(input);
    return output!;
  }
);