'use server';

/**
 * @fileOverview AI-powered image generation from Mermaid syntax.
 *
 * This file defines a Genkit flow that takes Mermaid.js syntax and
 * uses an image generation model to create a diagram image.
 *
 * @exports generateImageFromMermaid - An async function that orchestrates the image generation.
 * @exports GenerateImageFromMermaidInput - The input type for the generateImageFromMermaid function.
 * @exports GenerateImageFromMermaidOutput - The output type for the generateImageFromMermaid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromMermaidInputSchema = z.object({
  mermaidSyntax: z
    .string()
    .describe('The Mermaid.js syntax to be rendered as an image.'),
});
export type GenerateImageFromMermaidInput = z.infer<
  typeof GenerateImageFromMermaidInputSchema
>;

const GenerateImageFromMermaidOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe("The generated image as a data URI ('data:image/png;base64,...')."),
});
export type GenerateImageFromMermaidOutput = z.infer<
  typeof GenerateImageFromMermaidOutputSchema
>;

const mermaidImagePrompt = `You are a helpful AI that converts MermaidJS syntax into a clean, professional-looking diagram image.
- The background should be a subtle off-white like #f9fafb.
- The lines should be a dark gray.
- The text should be black.
- Node boxes should have a light blue fill (e.g., #DBEAFE) and a slightly darker blue border (e.g., #BFDBFE).
- Maintain a clean and modern aesthetic.
- The output MUST be a PNG image.

Mermaid Syntax:
{{mermaidSyntax}}`;

const generateImageFromMermaidFlow = ai.defineFlow(
  {
    name: 'generateImageFromMermaidFlow',
    inputSchema: GenerateImageFromMermaidInputSchema,
    outputSchema: GenerateImageFromMermaidOutputSchema,
  },
  async ({mermaidSyntax}) => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate an image from this mermaid syntax, rendering it as a clean, professional-looking diagram. The background should be off-white (#f9fafb), with dark gray lines and black text. Node boxes should have a light blue fill (#DBEAFE) with a darker blue border (#BFDBFE). Output a PNG image. Mermaid Syntax: \n\n ${mermaidSyntax}`,
    });

    const imageUrl = media?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate diagram image.');
    }

    return {imageUrl};
  }
);

export async function generateImageFromMermaid(
  input: GenerateImageFromMermaidInput
): Promise<GenerateImageFromMermaidOutput> {
  return generateImageFromMermaidFlow(input);
}
