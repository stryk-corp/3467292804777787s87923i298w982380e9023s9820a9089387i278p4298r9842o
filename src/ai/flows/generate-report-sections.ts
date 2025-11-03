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
  prompt: `You are an expert AI assistant for writing detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Based on the data provided, generate both an Acknowledgment and an Abstract section. **Important: Vary your wording and sentence structure to ensure the output is unique and passes plagiarism checks. The content should be very detailed and comprehensive.**

    **Acknowledgement Instructions:**
    - The tone should be formal and grateful.
    - Generate at least 3 long, detailed paragraphs.
    - Creatively thank the following, without just listing them. Elaborate on their contributions and the impact they had:
      - God Almighty.
      - The company: {{{placeOfAttachment}}}. Mention the CEO, {{{ceoName}}}, by name if available, and discuss the company's role in your development.
      - Key personnel, including supervisors: {{{supervisorNames}}}. Describe their mentorship and guidance in detail.
      - The University: {{{universityName}}}, including the Head of Department of {{{departmentName}}} and the Dean of the Faculty of {{{facultyName}}}.
      - Family, parents, and friends for their support.
    - Conclude with your name: {{{fullName}}}.
    
    **Abstract Instructions:**
    - Generate a brief and concise abstract of about one long, detailed paragraph.
    - Summarize the student's experience, skills gained, and the scope of the report.
    - Use this data to construct a detailed narrative:
      - Place of Attachment: {{{placeOfAttachment}}}
      - Location: {{{attachmentLocation}}}
      - Core Field: {{{fieldOfStudy}}}
      - Primary Skill: {{{primarySkill}}}
      - Technologies: {{{programmingLanguage}}}, {{{framework}}}
      - Future Ambition: {{{careerPath}}}
    - The abstract should cover:
      1. An introduction stating the report's purpose and the location of the industrial training.
      2. A body explaining the specific skills acquired, technologies used, and a summary of the work performed.
      3. A conclusion reflecting on the significance of the experience and its alignment with the student's career aspirations.

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
