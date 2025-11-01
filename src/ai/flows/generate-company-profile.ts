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
  services: z.array(z.string()).describe("A list of the company's main services."),
  attachmentLocation: z.string().optional().describe("The company's physical address."),
  ceoName: z.string().optional().describe("The name of the company's CEO or a key leader."),
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
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a business analyst. Based on your general knowledge about the company provided, provide the following:
    
    1. A concise, professional company profile.
    2. A list of their main services.
    3. The full physical address of their main office (for 'attachmentLocation').
    4. The name of the CEO or a key leader (for 'ceoName').
    
    Return the information in JSON format.

    Company Name: "{{{placeOfAttachment}}}".`,
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
