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
  fullName: z.string().optional().describe("The student's full name."),
  universityName: z.string().optional().describe("The name of the university."),
  facultyName: z.string().optional().describe("The name of the faculty."),
  departmentName: z.string().optional().describe('The name of the department.'),
  courseCode: z.string().optional().describe("The course code for the SIWES report."),
  placeOfAttachment: z.string().optional().describe("The name of the company."),
  fieldOfStudy: z.string().optional().describe('The field of study.'),
  primarySkill: z.string().optional().describe('The primary skill area.'),
  projectsDescription: z.string().optional().describe('A manual description of the projects worked on.'),
});
export type ProvideAISuggestionsInput = z.infer<typeof ProvideAISuggestionsInputSchema>;

const ProvideAISuggestionsOutputSchema = z.object({
  courseCode: z.string().optional().describe("A suggested course code for the SIWES report."),
  fieldOfStudy: z.string().optional().describe('A suggested field of study.'),
  primarySkill: z.string().optional().describe('A suggested primary skill.'),
  technologiesUsed: z.string().optional().describe('Suggested technologies used.'),
  programmingLanguage: z.string().optional().describe('Suggested programming language.'),
  framework: z.string().optional().describe('Suggested framework.'),
  careerPath: z.string().optional().describe('Suggested career path.'),
  challengesText: z.string().optional().describe('Suggested challenges encountered.'),
  conclusionText: z.string().optional().describe('A suggested conclusion for the report.'),
  projectIntro: z.string().optional().describe("A brief introduction for the projects section."),
  companyVision: z.string().optional().describe("A suggested company vision statement based on the company's name."),
  companyMission: z.string().optional().describe("A suggested company mission statement based on the company's name."),
  companyValues: z.string().optional().describe("Suggested company core values based on the company's name."),
  organogramAbbreviations: z.string().optional().describe("Suggested abbreviations for a standard corporate organogram."),
  project1_intro: z.string().optional().describe("A suggested introduction for Project 1."),
  project1_desc: z.string().optional().describe("A suggested description for Project 1."),
  project2_intro: z.string().optional().describe("A suggested introduction for Project 2."),
  project2_desc: z.string().optional().describe("A suggested description for Project 2."),
});
export type ProvideAISuggestionsOutput = z.infer<typeof ProvideAISuggestionsOutputSchema>;

export async function provideAISuggestions(input: ProvideAISuggestionsInput): Promise<ProvideAISuggestionsOutput> {
  return provideAISuggestionsFlow(input);
}

const provideAISuggestionsPrompt = ai.definePrompt({
  name: 'provideAISuggestionsPrompt',
  input: {schema: ProvideAISuggestionsInputSchema},
  output: {schema: ProvideAISuggestionsOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an academic and business analyst assistant. Based on the user's partial input for a SIWES report, suggest relevant and detailed content for the empty fields.

  Here is the student's partial data:
  - University: {{{universityName}}}
  - Faculty: {{{facultyName}}}
  - Department: {{{departmentName}}}
  - Place of Attachment: {{{placeOfAttachment}}}
  - Field of Study: {{{fieldOfStudy}}}
  - Primary Skill: {{{primarySkill}}}
  - Projects Description: {{{projectsDescription}}}

  Based on this context, provide helpful and relevant suggestions for any of the following fields that the user has not yet filled out. Be creative, professional, and realistic.
  If the user has provided a "Projects Description", use it to generate detailed and distinct suggestions for 'project1_intro', 'project1_desc', 'project2_intro', and 'project2_desc'.
  If the user has provided a "Place of Attachment", use it to suggest a 'companyVision', 'companyMission', and 'companyValues'.

  - courseCode
  - fieldOfStudy
  - primarySkill
  - technologiesUsed
  - programmingLanguage
  - framework
  - careerPath
  - challengesText
  - conclusionText
  - projectIntro
  - companyVision
  - companyMission
  - companyValues
  - organogramAbbreviations
  - project1_intro
  - project1_desc
  - project2_intro
  - project2_desc

  Return the suggestions in JSON format. Only provide suggestions for fields that are likely to be relevant based on the input. Do not suggest a value for a field if the user has already provided one.
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
