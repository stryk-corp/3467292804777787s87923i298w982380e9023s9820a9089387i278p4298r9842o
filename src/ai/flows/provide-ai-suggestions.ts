'use server';

/**
 * @fileOverview AI-powered suggestions for SIWES report fields.
 *
 * This file defines a Genkit flow that provides suggestions for fields like
 * 'Field of Study', 'Technologies Used', etc., based on the user's input for
 * other fields like 'Department'.
 *
 * - provideAISuggestions - A function that calls the AI suggestion flow.
 * - ProvideAISuggestionsInput - The input type for the provideAISuggestions function.
 * - ProvideAISuggestionsOutput - The output type for the provideAISuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAISuggestionsInputSchema = z.object({
  departmentName: z.string().describe('The name of the department.'),
  fieldOfStudy: z.string().describe('The field of study.'),
  primarySkill: z.string().describe('The primary skill area.'),
});
export type ProvideAISuggestionsInput = z.infer<typeof ProvideAISuggestionsInputSchema>;

const ProvideAISuggestionsOutputSchema = z.object({
  fieldOfStudy: z.string().describe('A suggested field of study.'),
  primarySkill: z.string().describe('A suggested primary skill.'),
  technologiesUsed: z.string().describe('Suggested technologies used.'),
  programmingLanguage: z.string().describe('Suggested programming language.'),
  framework: z.string().describe('Suggested framework.'),
  careerPath: z.string().describe('Suggested career path.'),
});
export type ProvideAISuggestionsOutput = z.infer<typeof ProvideAISuggestionsOutputSchema>;

export async function provideAISuggestions(input: ProvideAISuggestionsInput): Promise<ProvideAISuggestionsOutput> {
  return provideAISuggestionsFlow(input);
}

const provideAISuggestionsPrompt = ai.definePrompt({
  name: 'provideAISuggestionsPrompt',
  input: {schema: ProvideAISuggestionsInputSchema},
  output: {schema: ProvideAISuggestionsOutputSchema},
  prompt: `You are an academic assistant. Based on the user's partial input for a SIWES report, suggest related technical fields and skills.

  Here is the student's partial data:
  - Department: {{{departmentName}}}
  - Field of Study: {{{fieldOfStudy}}}
  - Primary Skill: {{{primarySkill}}}

  Based on this, suggest other related fields. Only suggest values for fields that are not already filled out by the user. Return the suggestions in JSON format.
  `,
});

const provideAISuggestionsFlow = ai.defineFlow(
  {
    name: 'provideAISuggestionsFlow',
    inputSchema: ProvideAISuggestionsInputSchema,
    outputSchema: ProvideAISuggestionsOutputSchema,
  },
  async input => {
    const {output} = await provideAISuggestionsPrompt(input);
    return output!;
  }
);
