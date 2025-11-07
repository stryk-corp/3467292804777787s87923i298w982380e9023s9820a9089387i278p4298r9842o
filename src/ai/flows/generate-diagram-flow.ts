'use server';

/**
 * @fileOverview AI-powered generation of diagrams from text descriptions.
 *
 * This file defines a Genkit flow to convert a natural language description
 * of a hierarchy (like an organogram) into a structured Mermaid.js graph syntax.
 *
 * @exports generateDiagram - An async function that orchestrates the diagram generation.
 * @exports GenerateDiagramInput - The input type for the generateDiagram function.
 * @exports GenerateDiagramOutput - The output type for the generateDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagramInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A text description of the diagram, such as a list of roles for an organogram or steps for a use case diagram.'
    ),
});

export type GenerateDiagramInput = z.infer<typeof GenerateDiagramInputSchema>;

const GenerateDiagramOutputSchema = z.object({
  mermaidSyntax: z
    .string()
    .describe(
      'The generated diagram in Mermaid.js graph syntax (top-down). Each node should have a unique ID and a label. Use "-->" for arrows.'
    ),
});

export type GenerateDiagramOutput = z.infer<typeof GenerateDiagramOutputSchema>;

const diagramPrompt = ai.definePrompt({
  name: 'diagramPrompt',
  input: {schema: GenerateDiagramInputSchema},
  output: {schema: GenerateDiagramOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert in creating organizational charts. Based on the provided text describing roles, generate a Mermaid.js graph syntax for a top-down flowchart.

    **Critical Instructions:**
    1.  The output must be ONLY the Mermaid.js syntax. Do not include any explanations or markdown formatting like \`\`\`mermaid.
    2.  The graph must be top-down ('graph TD').
    3.  Analyze the roles and create a logical hierarchy. Infer relationships if they are not explicitly stated (e.g., CTO, CFO, COO usually report to a CEO).
    4.  Each node must have a unique ID (e.g., 'ceo', 'cfo') and a label (e.g., 'CEO'). Format: \`ID["Label"]\`.
    5.  Use rounded rectangles for all nodes. Example: \`ceo("CEO")\`. The syntax for rounded rectangles is \`id("text")\`.
    6.  Use '-->' to represent arrows between nodes.
    7.  Do not use subgraphs.

    **Example Input:**
    "CEO - Chief Executive Officer, CTO - Chief Technology Officer, Dev - Developer"

    **Example Output:**
    graph TD
        ceo("CEO") --> cto("CTO")
        cto("CTO") --> dev("Developer")

    **User Input:**
    {{{description}}}
    `,
});

const generateDiagramFlow = ai.defineFlow(
  {
    name: 'generateDiagramFlow',
    inputSchema: GenerateDiagramInputSchema,
    outputSchema: GenerateDiagramOutputSchema,
  },
  async input => {
    const {output} = await diagramPrompt(input);

    if (!output) {
      throw new Error('Failed to generate diagram syntax.');
    }

    return output;
  }
);

export async function generateDiagram(
  input: GenerateDiagramInput
): Promise<GenerateDiagramOutput> {
  return generateDiagramFlow(input);
}
