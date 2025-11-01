'use server';

/**
 * @fileOverview Suggests common technical challenges and solutions based on the technologies used during SIWES.
 *
 * - suggestTechnicalChallenges - A function that handles the suggestion of technical challenges.
 * - SuggestTechnicalChallengesInput - The input type for the suggestTechnicalChallenges function.
 * - SuggestTechnicalChallengesOutput - The return type for the suggestTechnicalChallenges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTechnicalChallengesInputSchema = z.object({
  technologiesUsed: z
    .string()
    .describe('The technologies used during SIWES, comma separated.'),
});
export type SuggestTechnicalChallengesInput = z.infer<typeof SuggestTechnicalChallengesInputSchema>;

const SuggestTechnicalChallengesOutputSchema = z.object({
  challengesAndSolutions: z
    .string()
    .describe('A list of common challenges and solutions, formatted with markdown.'),
});
export type SuggestTechnicalChallengesOutput = z.infer<typeof SuggestTechnicalChallengesOutputSchema>;

export async function suggestTechnicalChallenges(
  input: SuggestTechnicalChallengesInput
): Promise<SuggestTechnicalChallengesOutput> {
  return suggestTechnicalChallengesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTechnicalChallengesPrompt',
  input: {schema: SuggestTechnicalChallengesInputSchema},
  output: {schema: SuggestTechnicalChallengesOutputSchema},
  prompt: `You are a senior developer and mentor. Provide practical advice for a beginner.

  What are 3-5 common challenges and their solutions for a beginner learning {{technologiesUsed}}?

  Format the response with markdown (e.g., **Challenge:**, *Solution:*).`,
});

const suggestTechnicalChallengesFlow = ai.defineFlow(
  {
    name: 'suggestTechnicalChallengesFlow',
    inputSchema: SuggestTechnicalChallengesInputSchema,
    outputSchema: SuggestTechnicalChallengesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      challengesAndSolutions: output!,
    };
  }
);
