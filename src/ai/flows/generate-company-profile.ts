'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a company profile and scope of specialization.
 *
 * It includes:
 * - generateCompanyProfile - A function that generates the company profile and scope of specialization.
 * - GenerateCompanyProfileInput - The input type for the generateCompanyProfile function.
 * - GenerateCompanyProfileOutput - The output type for the generateCompanyProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompanyProfileInputSchema = z.object({
  placeOfAttachment: z
    .string()
    .describe('The name of the company to generate a profile for.'),
});
export type GenerateCompanyProfileInput = z.infer<
  typeof GenerateCompanyProfileInputSchema
>;

const GenerateCompanyProfileOutputSchema = z.object({
  profile: z.string().describe('A concise, professional company profile.'),
  services: z.array(z.string()).describe('A list of the company\'s main services.'),
});
export type GenerateCompanyProfileOutput = z.infer<
  typeof GenerateCompanyProfileOutputSchema
>;

export async function generateCompanyProfile(
  input: GenerateCompanyProfileInput
): Promise<GenerateCompanyProfileOutput> {
  return generateCompanyProfileFlow(input);
}

const companyProfilePrompt = ai.definePrompt({
  name: 'companyProfilePrompt',
  input: {schema: GenerateCompanyProfileInputSchema},
  output: {schema: GenerateCompanyProfileOutputSchema},
  prompt: `You are a business analyst. Provide a concise, professional company profile and a list of their main services, based on the search results. Return JSON only.\n\nFind the company profile and main services for \"{{{placeOfAttachment}}}\".`,
  tools: ['googleSearch'],
});

const generateCompanyProfileFlow = ai.defineFlow(
  {
    name: 'generateCompanyProfileFlow',
    inputSchema: GenerateCompanyProfileInputSchema,
    outputSchema: GenerateCompanyProfileOutputSchema,
  },
  async input => {
    const {output} = await companyProfilePrompt({
      ...input,
    });

    if (!output) {
      throw new Error('Failed to generate company profile and services.');
    }

    return output;
  }
);
