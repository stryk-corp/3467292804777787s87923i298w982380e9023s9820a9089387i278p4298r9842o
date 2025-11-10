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
  fullName: z.string().describe("The student's full name."),
  universityName: z.string().describe("The name of the university."),
  departmentName: z.string().describe('The name of the department.'),
  facultyName: z.string().describe("The name of the faculty."),
  placeOfAttachment: z.string().describe('The name of the place of attachment.'),
  supervisorNames: z.string().describe('Comma-separated names of supervisors.'),
  fieldOfStudy: z.string().describe('The field of study.'),
  attachmentLocation: z.string().describe('The location of the attachment.'),
  primarySkill: z.string().describe('The primary skill acquired during the attachment.'),
  framework: z.string().describe('The primary framework used.'),
  programmingLanguage: z.string().describe('The primary programming language used.'),
  careerPath: z.string().describe('The desired career path.'),
  ceoName: z.string().optional().describe("The name of the company's CEO."),
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

const reportSectionsPrompt = ai.definePrompt({
  name: 'reportSectionsPrompt',
  input: {schema: GenerateReportSectionsInputSchema},
  output: {schema: GenerateReportSectionsOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI assistant for writing SIWES (Students Industrial Work Experience Scheme) reports.
    Based on the data provided, generate both an Acknowledgment and an Abstract section.

    **Acknowledgement Instructions:**
    - The tone must be formal and grateful.
    - Thank the key people and institutions involved.
    - **Crucially, the final text must not exceed 300 words.**
    - Mention the following if provided:
      - The Company ({{{placeOfAttachment}}}) and its CEO ({{{ceoName}}}).
      - Supervisors ({{{supervisorNames}}}).
      - Your University ({{{universityName}}}), Department ({{{departmentName}}}), and Faculty ({{{facultyName}}}).
      - Family and friends.
    - Conclude with your full name: {{{fullName}}}.
    
    **Abstract Instructions:**
    - Generate a concise and comprehensive summary of the industrial training.
    - **Crucially, the final text must not exceed 150 words.**
    - It must briefly cover:
      1. **Introduction:** The purpose of the report in the context of the SIWES program at {{{placeOfAttachment}}}.
      2. **Body:** The specific skills acquired (e.g., {{{primarySkill}}}) and technologies used (e.g., {{{programmingLanguage}}}, {{{framework}}}). Briefly mention the work performed.
      3. **Conclusion:** The significance of the experience and its impact on your career goals in {{{careerPath}}}.

    Return the final result as a single JSON object with 'acknowledgementText' and 'abstractText' keys.
    `,
});

const generateReportSectionsFlow = ai.defineFlow(
  {
    name: 'generateReportSectionsFlow',
    inputSchema: GenerateReportSectionsInputSchema,
    outputSchema: GenerateReportSectionsOutputSchema,
  },
  async input => {
    const {output} = await reportSectionsPrompt(input);

    if (!output) {
      throw new Error(
        'Failed to generate report sections. The AI returned empty content.'
      );
    }
    
    return output;
  }
);

export async function generateReportSections(
  input: GenerateReportSectionsInput
): Promise<GenerateReportSectionsOutput> {
  return generateReportSectionsFlow(input);
}
