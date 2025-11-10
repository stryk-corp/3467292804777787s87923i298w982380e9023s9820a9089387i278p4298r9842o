'use server';

/**
 * @fileOverview AI-powered generation of SIWES report's "Chapter 5".
 *
 * This file defines a Genkit flow and prompt to generate the content for Chapter 5.
 *
 * @module src/ai/flows/generate-chapter-five
 *
 * @exports generateChapterFive - An async function that orchestrates the generation of the chapter.
 * @exports GenerateChapterFiveInput - The input type for the generateChapterFive function.
 * @exports GenerateChapterFiveOutput - The output type for the generateChapterFive function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChapterFiveInputSchema = z.object({
  fullName: z.string().describe("The student's full name."),
  universityName: z.string().describe("The name of the university."),
  placeOfAttachment: z.string().describe('The name of the place of attachment.'),
  fieldOfStudy: z.string().describe('The field of study.'),
  primarySkill: z.string().describe('The primary skill acquired during the attachment.'),
  technologiesUsed: z.string().describe('The technologies used.'),
  careerPath: z.string().describe('The desired career path.'),
  projectsDescription: z.string().optional().describe('A manual description of the projects worked on.'),
});

export type GenerateChapterFiveInput = z.infer<
  typeof GenerateChapterFiveInputSchema
>;

const GenerateChapterFiveOutputSchema = z.object({
  challengesText: z.string().describe('The generated content for the challenges section.'),
  conclusionText: z.string().describe('The generated content for the conclusion section.'),
});

export type GenerateChapterFiveOutput = z.infer<
  typeof GenerateChapterFiveOutputSchema
>;

const chapterFivePrompt = ai.definePrompt({
  name: 'chapterFivePrompt',
  input: {schema: GenerateChapterFiveInputSchema},
  output: {schema: GenerateChapterFiveOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI assistant for writing extremely detailed SIWES (Students Industrial Work Experience Scheme) reports.
    Based on the data provided, generate the content for Chapter 5: Challenges Encountered and Conclusion. **Critical Instruction: The content must be exceptionally detailed, comprehensive, and written in a formal, professional tone, aiming for a total length of at least 2000 words (around 10,000 characters). Vary your wording and sentence structure to ensure the output is unique and passes plagiarism checks.**

    **Data Provided:**
    - Student Name: {{{fullName}}}
    - University: {{{universityName}}}
    - Place of Attachment: {{{placeOfAttachment}}}
    - Field of Study: {{{fieldOfStudy}}}
    - Primary Skill: {{{primarySkill}}}
    - Technologies Used: {{{technologiesUsed}}}
    - Career Path: {{{careerPath}}}
    - Projects Worked On: {{{projectsDescription}}}

    **Instructions for "Challenges Encountered and Solutions":**
    - This section must be very long and detailed, with a heading "### 5.1 Challenges Encountered and Solutions".
    - Brainstorm and elaborate on a wide range of realistic challenges a student might face during an internship in **{{{fieldOfStudy}}}**.
    - For each challenge, provide a detailed description, explain its impact on your work, and most importantly, describe the specific steps you took to overcome it.
    - Examples of challenge categories to expand upon in extreme detail:
      - **Technical Challenges:** e.g., learning a new framework (like {{{primarySkill}}}) on the fly, debugging complex code, dealing with legacy systems, integrating difficult APIs, environment setup issues.
      - **Project Management Challenges:** e.g., understanding vague requirements, scope creep, tight deadlines, collaborating with a team using Agile/Scrum.
      - **Interpersonal/Workplace Challenges:** e.g., communication gaps, adapting to company culture, receiving critical feedback, working remotely.
      - **Resource Constraints:** e.g., lack of proper documentation, limited access to tools or hardware.
    - For each solution, explain what you learned from the experience and how it contributed to your growth.

    **Instructions for "Conclusion":**
    - This section must also be very long and detailed.
    - Do not just write a short summary. This is a final, reflective chapter.
    - Structure the conclusion with the following detailed parts:
      - **Summary of Experience:** Provide a comprehensive recap of your internship at **{{{placeOfAttachment}}}**. Reiterate the goals of the SIWES program and how your experience met them.
      - **Skills and Knowledge Gained:** Go into extensive detail about the skills you acquired, both technical (e.g., proficiency in **{{{technologiesUsed}}}**) and soft skills (e.g., teamwork, communication, problem-solving). Connect these skills directly to your projects and challenges.
      - **Impact on Career Goals:** Reflect deeply on how the internship has shaped your professional ambitions. Discuss how the practical experience solidified your interest in **{{{careerPath}}}**. Talk about your future plans for skill development.
      - **Relevance to Academic Study:** Create a strong link between your industrial training and your academic coursework at **{{{universityName}}}**. Explain how the internship brought theoretical concepts from your **{{{fieldOfStudy}}}** to life.
      - **Recommendation and Final Thoughts:** Provide a thoughtful recommendation for future SIWES students and offer concluding remarks about the value of the program and your gratitude for the opportunity.
    
    Return the final result as a single JSON object with 'challengesText' and 'conclusionText' keys. The value for each should be a single string containing the full, extremely detailed chapter content with markdown for headings if appropriate.
    `,
});

const generateChapterFiveFlow = ai.defineFlow(
  {
    name: 'generateChapterFiveFlow',
    inputSchema: GenerateChapterFiveInputSchema,
    outputSchema: GenerateChapterFiveOutputSchema,
  },
  async input => {
    const {output} = await chapterFivePrompt(input);

    if (!output) {
      throw new Error(
        'Failed to generate Chapter 5. The AI returned empty content.'
      );
    }
    
    return output;
  }
);

export async function generateChapterFive(
  input: GenerateChapterFiveInput
): Promise<GenerateChapterFiveOutput> {
  return generateChapterFiveFlow(input);
}
