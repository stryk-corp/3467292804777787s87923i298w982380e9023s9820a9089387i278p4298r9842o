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

const acknowledgementPrompt = ai.definePrompt({
  name: 'acknowledgementPrompt',
  input: {schema: GenerateReportSectionsInputSchema},
  output: {schema: z.string()},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI assistant for writing detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Generate a comprehensive and professional acknowledgement section. The tone should be formal and grateful.
    
    The acknowledgement must be at least 3 paragraphs long and should creatively thank the following people and entities based on the data provided, without just listing them. Elaborate on their contributions.

    - God Almighty.
    - The company: {{{placeOfAttachment}}}. Mention the CEO, {{{ceoName}}}, by name if available.
    - Key personnel at the company, including supervisors: {{{supervisorNames}}}.
    - The University: {{{universityName}}}, including the Head of Department of {{{departmentName}}} and the Dean of the Faculty of {{{facultyName}}}.
    - Family, parents, and friends for their support.
    
    Student's Name: {{{fullName}}}.
    
    Generate a long, detailed, and well-written acknowledgement.`,
});

const abstractPrompt = ai.definePrompt({
  name: 'abstractPrompt',
  input: {schema: GenerateReportSectionsInputSchema},
  output: {schema: z.string()},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI assistant for writing detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Generate a comprehensive and technical abstract for a SIWES report. 
    
    The abstract must be at least 2-3 paragraphs long and should summarize the student's experience, skills gained, and the scope of the report.

    Use the following data to construct a detailed narrative:
    - Place of Attachment: {{{placeOfAttachment}}}
    - Location: {{{attachmentLocation}}}
    - Core Field of work: {{{fieldOfStudy}}}
    - Primary Skill Acquired: {{{primarySkill}}}
    - Key Technologies: {{{programmingLanguage}}}, {{{framework}}}
    - Future Ambition: {{{careerPath}}}

    The abstract should cover:
    1. An introduction stating the purpose of the report and where the training was undertaken.
    2. A body explaining the specific skills learned, the technologies used ({instrumentation}), and the kind of projects or work done.
    3. A conclusion reflecting on the experience and how it aligns with the student's career goals in {{{careerPath}}}.

    Generate a long, detailed, and well-written abstract that is technical and professional.`,
});

const generateReportSectionsFlow = ai.defineFlow(
  {
    name: 'generateReportSectionsFlow',
    inputSchema: GenerateReportSectionsInputSchema,
    outputSchema: GenerateReportSectionsOutputSchema,
  },
  async input => {
    const acknowledgementTextPromise = acknowledgementPrompt(input).then(
      res => res.output || ''
    );
    const abstractTextPromise = abstractPrompt(input).then(res => res.output || '');

    const [acknowledgementText, abstractText] = await Promise.all([
      acknowledgementTextPromise,
      abstractTextPromise,
    ]);

    if (!acknowledgementText || !abstractText) {
      throw new Error('Failed to generate one or more report sections. The AI returned empty content.');
    }

    return {acknowledgementText, abstractText};
  }
);

export async function generateReportSections(
  input: GenerateReportSectionsInput
): Promise<GenerateReportSectionsOutput> {
  return generateReportSectionsFlow(input);
}
