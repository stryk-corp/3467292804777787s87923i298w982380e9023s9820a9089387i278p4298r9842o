import {genkit} from 'genkit';
import {googleAI, googleSearch} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI(), googleSearch()],
  model: 'googleai/gemini-2.5-flash',
});
