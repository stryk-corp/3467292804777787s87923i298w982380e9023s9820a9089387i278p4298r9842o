import {genkit} from 'genkit';
import {googleAI, googleSearch} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      tools: [
        googleSearch({
          engine: process.env.CUSTOM_SEARCH_ENGINE_ID,
        }),
      ],
    }),
  ],
});
