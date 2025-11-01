import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
      googleSearch: {
        customSearchEngineId: process.env.CUSTOM_SEARCH_ENGINE_ID,
      },
    }),
  ],
});
