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
    Based on the data provided, generate the content for Chapter 3: Skills Learnt. **Important: The content must be very detailed, comprehensive, and written in a formal, professional tone. Vary your wording and sentence structure to ensure the output is unique and passes plagiarism checks.**

    **Instructions:**
    - The content should be structured into two main sections: "**3.1 Description of Skills**" and "**3.2 Tools and Technologies Used**".
    - Elaborate extensively on the skills and technologies. Do not just list them. Explain how they were used, what you learned, and their importance in your field.
    - Generate at least two detailed paragraphs for each section.
    - Use this data to construct a detailed narrative:
      - Primary Skill: {{{primarySkill}}}
      - Field of Study: {{{fieldOfStudy}}}
      - Technologies Used: {{{technologiesUsed}}}
      - Programming Language: {{{programmingLanguage}}}
      - Framework: {{{framework}}}
    
    Example structure to expand upon:
    ### 3.1 Description of Skills
    During my industrial attachment, I focused on developing and honing my skills in **{{{primarySkill}}}**, which is a critical competency within the broader field of **{{{fieldOfStudy}}}**. The training was comprehensive, covering both foundational theoretical concepts and, more importantly, their practical application in a professional, project-driven environment. I learned to... (e.g., design and implement scalable web applications, analyze complex datasets, manage network infrastructures, etc. Be very specific and elaborate on the learning process and outcomes).

    My practical experience involved... (e.g., participating in daily stand-ups, collaborating with senior developers, taking ownership of specific modules, etc. Describe the professional context).

    ### 3.2 Tools and Technologies Used
    To effectively carry out my tasks, I became proficient with a variety of modern tools and technologies. The primary technologies I worked with include **{{{technologiesUsed}}}**. Specifically, I utilized the **{{{programmingLanguage}}}** programming language in conjunction with the **{{{framework}}}** framework to build, test, and deploy software solutions. This involved... (e.g., writing clean, efficient code, managing state with React Hooks, building RESTful APIs with Node.js/Express, interacting with databases, using version control with Git, etc. Provide detailed explanations).

    Furthermore, I gained experience with... (mention other tools or platforms, and explain their role in the workflow, for example, Docker for containerization, Jira for project management, or Figma for UI/UX design).

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
