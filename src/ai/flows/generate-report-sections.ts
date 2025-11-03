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
  prompt: `You are an expert AI assistant for writing extremely detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Based on the data provided, generate both an Acknowledgment and an Abstract section. **Critical Instruction: The content must be exceptionally detailed, elaborate, and comprehensive. Vary your wording and sentence structure to ensure the output is unique and passes plagiarism checks.**

    **Acknowledgement Instructions:**
    - The tone must be formal and deeply grateful.
    - **Generate a very long and detailed text, aiming for at least 1000 words (around 5000-6000 characters).**
    - Do not just list names. You must creatively and extensively thank the following, elaborating on their specific contributions and the profound impact they had on your professional and personal development.
      - **God Almighty:** Start with a profound and personal paragraph expressing gratitude.
      - **The Company ({{{placeOfAttachment}}}):** Dedicate several paragraphs to the company. Discuss its mission, the learning environment it fostered, and how it shaped your understanding of the industry. Mention the CEO, {{{ceoName}}}, by name if available, and discuss their leadership and vision.
      - **Key Personnel & Supervisors ({{{supervisorNames}}}):** Write multiple, detailed paragraphs describing their mentorship. Provide specific examples of their guidance, the skills they taught you, and the professional wisdom they imparted. Describe how their support helped you overcome challenges.
      - **The University ({{{universityName}}}):** Write extensively about the academic foundation provided by your university. Thank the Head of Department of {{{departmentName}}} and the Dean of the Faculty of {{{facultyName}}}, discussing how their leadership and the curriculum prepared you for this industrial experience.
      - **Family and Friends:** Dedicate a heartfelt section to your family, parents, and friends. Detail the emotional, financial, and moral support they provided throughout your academic journey and the SIWES program.
    - Conclude with your full name: {{{fullName}}}.
    
    **Abstract Instructions:**
    - Generate a comprehensive and detailed abstract. While abstracts are typically concise, make this one as thorough as possible, expanding on all points.
    - Summarize the student's experience, skills gained, and the scope of the report in great detail.
    - Use this data to construct an in-depth narrative:
      - Place of Attachment: {{{placeOfAttachment}}}
      - Location: {{{attachmentLocation}}}
      - Core Field: {{{fieldOfStudy}}}
      - Primary Skill: {{{primarySkill}}}
      - Technologies: {{{programmingLanguage}}}, {{{framework}}}
      - Future Ambition: {{{careerPath}}}
    - The abstract must cover:
      1. **Introduction:** A detailed opening stating the report's purpose, the context of the SIWES program, and the full details of the industrial training location and duration.
      2. **Body:** A comprehensive explanation of the specific skills acquired. Go into detail about the technologies used, the projects worked on, the methodologies followed, and a thorough summary of the work performed and challenges faced.
      3. **Conclusion:** A reflective conclusion on the significance of the experience, its profound impact on your learning, and how it has solidified your career aspirations in {{{careerPath}}}.

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
