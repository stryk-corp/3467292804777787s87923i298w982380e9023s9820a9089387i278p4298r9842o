'use server';

/**
 * @fileOverview AI-powered generation of SIWES report sections.
 *
 * This file defines Genkit flows and prompts to generate the Acknowledgment and Abstract sections of a SIWES report.
 *
 * @module src/ai/flows/generate-report-sections
 *
 * @exports generateReportSections - An async function that orchestrates the generation of report sections.
 * @exports GenerateReportSectionsInput - The input type for the generateReportSections function.
 * @exports GenerateReportSectionsOutput - The output type for the generateReportSections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportSectionsInputSchema = z.object({
  placeOfAttachment: z.string().describe('The name of the place of attachment.'),
  supervisorNames: z.string().describe('Comma-separated names of supervisors.'),
  departmentName: z.string().describe('The name of the department.'),
  fieldOfStudy: z.string().describe('The field of study.'),
  attachmentLocation: z.string().describe('The location of the attachment.'),
  primarySkill: z.string().describe('The primary skill acquired during the attachment.'),
  framework: z.string().describe('The primary framework used.'),
  programmingLanguage: z.string().describe('The primary programming language used.'),
  careerPath: z.string().describe('The desired career path.'),
});

export type GenerateReportSectionsInput = z.infer<
  typeof GenerateReportSectionsInputSchema
>;

const GenerateReportSectionsOutputSchema = z.object({
  acknowledgementText: z.string().describe('The generated acknowledgement text.'),
  abstractText: z.string().describe('The generated abstract text.'),
});

export type GenerateReportSectionsOutput = z.infer<
  typeof GenerateReportSectionsOutputSchema
>;

const acknowledgementPrompt = ai.definePrompt({
  name: 'acknowledgementPrompt',
  input: {schema: GenerateReportSectionsInputSchema},
  output: {schema: z.string()},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI assistant that helps students write their SIWES report.
    Generate an acknowledgement based on the following data:
    - Place of Attachment: {{{placeOfAttachment}}}
    - Supervisors: {{{supervisorNames}}}
    - Department: {{{departmentName}}}
    - Field of Study: {{{fieldOfStudy}}}
    - Also include thanks to: the Dean, friends, and parents.

    Regenerate an acknowledgement in this format (I extend my deepest gratitude to {{{placeOfAttachment}}} for providing the invaluable opportunity... To the Head of Department of {{{departmentName}}}, IT Coordinator... To my friends... my Parents... all Staff...) but it wont be exactly like this, it can put everything in other words.
`,
});

const abstractPrompt = ai.definePrompt({
  name: 'abstractPrompt',
  input: {schema: GenerateReportSectionsInputSchema},
  output: {schema: z.string()},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI assistant that helps students write their SIWES report.
    Generate a new abstract based on the following data:
    - Place of Attachment: {{{placeOfAttachment}}}
    - Location: {{{attachmentLocation}}}
    - Skill Acquired: {{{primarySkill}}}
    - Applications/Frameworks Used: {{{framework}}}
    - Programming Language: {{{programmingLanguage}}}
    - Career Path: {{{careerPath}}}

    Regenerate an abstract in this format (This report provides an overview of my Industrial Training (SIWES) at {{{placeOfAttachment}}}, {{{attachmentLocation}}} where I focused on {{{primarySkill}}}... The training focused on the use of {{{programmingLanguage}}} language... I learnt the basics... The report includes screenshots... The hands-on-experience... pursuing a career in {{{careerPath}}}) but it will be based on the user’s input... eg for web development will be html react or Django etc..
`,
});

const generateReportSectionsFlow = ai.defineFlow(
  {
    name: 'generateReportSectionsFlow',
    inputSchema: GenerateReportSectionsInputSchema,
    outputSchema: GenerateReportSectionsOutputSchema,
  },
  async input => {
    const acknowledgementTextPromise = acknowledgementPrompt(input).then(
      res => res.output!
    );
    const abstractTextPromise = abstractPrompt(input).then(res => res.output!);

    const [acknowledgementText, abstractText] = await Promise.all([
      acknowledgementTextPromise,
      abstractTextPromise,
    ]);

    return {acknowledgementText, abstractText};
  }
);

export async function generateReportSections(
  input: GenerateReportSectionsInput
): Promise<GenerateReportSectionsOutput> {
  return generateReportSectionsFlow(input);
}
