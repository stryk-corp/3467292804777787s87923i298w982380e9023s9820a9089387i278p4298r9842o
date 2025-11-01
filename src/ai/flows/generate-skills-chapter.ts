'use server';

/**
 * @fileOverview AI-powered generation of SIWES report's "Skills Learnt" chapter.
 *
 * This file defines a Genkit flow and prompt to generate the content for Chapter 3.
 *
 * @module src/ai/flows/generate-skills-chapter
 *
 * @exports generateSkillsChapter - An async function that orchestrates the generation of the chapter.
 * @exports GenerateSkillsChapterInput - The input type for the generateSkillsChapter function.
 * @exports GenerateSkillsChapterOutput - The output type for the generateSkillsChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSkillsChapterInputSchema = z.object({
  primarySkill: z.string().describe('The primary skill acquired during the attachment.'),
  fieldOfStudy: z.string().describe('The field of study.'),
  technologiesUsed: z.string().describe('The technologies used.'),
  programmingLanguage: z.string().describe('The primary programming language used.'),
  framework: z.string().describe('The primary framework used.'),
});

export type GenerateSkillsChapterInput = z.infer<
  typeof GenerateSkillsChapterInputSchema
>;

const GenerateSkillsChapterOutputSchema = z.object({
  skillsChapterText: z.string().describe('The generated content for the skills learnt chapter.'),
});

export type GenerateSkillsChapterOutput = z.infer<
  typeof GenerateSkillsChapterOutputSchema
>;

const skillsChapterPrompt = ai.definePrompt({
  name: 'skillsChapterPrompt',
  input: {schema: GenerateSkillsChapterInputSchema},
  output: {schema: GenerateSkillsChapterOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI assistant for writing detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Based on the data provided, generate the content for Chapter 3: Skills Learnt. **Important: Vary your wording and sentence structure to ensure the output is unique and passes plagiarism checks.**

    **Instructions:**
    - The content should be structured into two sections: "3.1 Description of Skills" and "3.2 Tools and Technologies Used".
    - The tone should be formal and professional.
    - Elaborate on the skills and technologies, do not just list them.
    - Use this data to construct a detailed narrative:
      - Primary Skill: {{{primarySkill}}}
      - Field of Study: {{{fieldOfStudy}}}
      - Technologies Used: {{{technologiesUsed}}}
      - Programming Language: {{{programmingLanguage}}}
      - Framework: {{{framework}}}
    
    Example structure:
    ### 3.1 Description of Skills
    During my attachment, I focused on developing skills in **{{{primarySkill}}}** within the broader field of **{{{fieldOfStudy}}}**. The training was comprehensive, covering both theoretical concepts and practical application in a professional environment. I learned... (elaborate more here).

    ### 3.2 Tools and Technologies Used
    The primary tools and technologies I worked with include **{{{technologiesUsed}}}**. Specifically, I used the **{{{programmingLanguage}}}** language and the **{{{framework}}}** framework to build and manage projects. This involved... (elaborate more here).

    Return the final result as a single JSON object with a 'skillsChapterText' key. The value should be a single string containing the full chapter content with markdown for headings.
    `,
});

const generateSkillsChapterFlow = ai.defineFlow(
  {
    name: 'generateSkillsChapterFlow',
    inputSchema: GenerateSkillsChapterInputSchema,
    outputSchema: GenerateSkillsChapterOutputSchema,
  },
  async input => {
    const {output} = await skillsChapterPrompt(input);

    if (!output) {
      throw new Error(
        'Failed to generate skills chapter. The AI returned empty content.'
      );
    }
    
    return output;
  }
);

export async function generateSkillsChapter(
  input: GenerateSkillsChapterInput
): Promise<GenerateSkillsChapterOutput> {
  return generateSkillsChapterFlow(input);
}
