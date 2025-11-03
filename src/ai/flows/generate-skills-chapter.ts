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
  prompt: `You are an expert AI assistant for writing extremely detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Based on the data provided, generate the content for Chapter 3: Skills Learnt. **Critical Instruction: The content must be exceptionally detailed, comprehensive, and written in a formal, professional tone, aiming for a total length of at least 1000 words (around 5000-6000 characters). Vary your wording and sentence structure to ensure the output is unique and passes plagiarism checks.**

    **Instructions:**
    - The content must be structured into two main sections: "**3.1 Description of Skills**" and "**3.2 Tools and Technologies Used**".
    - You must elaborate extensively on all skills and technologies. Do not just list them. Explain the concepts, how they were used in a real-world context, what you learned, the challenges you faced, and their importance in your field.
    - Generate multiple, detailed paragraphs for each section, ensuring a deep and thorough explanation.
    - Use this data to construct a detailed narrative:
      - Primary Skill: {{{primarySkill}}}
      - Field of Study: {{{fieldOfStudy}}}
      - Technologies Used: {{{technologiesUsed}}}
      - Programming Language: {{{programmingLanguage}}}
      - Framework: {{{framework}}}
    
    **Example structure to expand upon in extreme detail:**

    ### 3.1 Description of Skills
    (This section should be very long and detailed)
    During my industrial attachment, I undertook an intensive and immersive program to develop and master my skills in **{{{primarySkill}}}**, which is a cornerstone competency within the broader field of **{{{fieldOfStudy}}}**. The training was multifaceted and comprehensive, moving far beyond foundational theoretical concepts to emphasize their practical application in a dynamic, professional, project-driven environment. I learned to... (e.g., design and implement scalable, resilient, and secure web applications from scratch; analyze complex datasets to derive actionable insights; manage and troubleshoot sophisticated network infrastructures; etc. Be extremely specific and elaborate on the learning process, the methodologies (like Agile/Scrum), and the tangible outcomes. Discuss the 'why' behind the techniques, not just the 'what').

    My practical experience involved deep integration into the development team. This included... (e.g., participating in daily stand-up meetings, sprint planning, and retrospectives; collaborating with senior developers on complex codebases; taking full ownership of specific application modules from conception to deployment; conducting code reviews; writing technical documentation. Describe the professional context and your growth within it in great detail).

    ### 3.2 Tools and Technologies Used
    (This section should also be very long and detailed)
    To effectively carry out my duties and bring projects to fruition, I became proficient with a wide variety of modern tools and industry-standard technologies. The primary technology stack I worked with includes **{{{technologiesUsed}}}**. Specifically, I utilized the **{{{programmingLanguage}}}** programming language in conjunction with the **{{{framework}}}** framework to build, test, and deploy robust software solutions. This involved... (e.g., writing clean, maintainable, and efficient code following best practices; architecting and building RESTful APIs with Node.js/Express; managing application state with advanced techniques in React Hooks; interacting with both SQL and NoSQL databases, including schema design and query optimization; implementing robust authentication and authorization systems; using version control with Git and engaging in collaborative workflows like pull requests and branching strategies. Provide highly detailed explanations and code concepts).

    Furthermore, I gained extensive hands-on experience with a suite of ancillary tools that were critical to the development lifecycle. This included... (e.g., using Docker for containerization to ensure consistent development and production environments; leveraging CI/CD pipelines with tools like Jenkins or GitHub Actions to automate testing and deployment; using Jira for agile project management and ticket tracking; utilizing Figma for collaborating on and implementing UI/UX designs. Explain the specific role each tool played in your workflow and the proficiency you gained).

    Return the final result as a single JSON object with a 'skillsChapterText' key. The value should be a single string containing the full, extremely detailed chapter content with markdown for headings.
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
