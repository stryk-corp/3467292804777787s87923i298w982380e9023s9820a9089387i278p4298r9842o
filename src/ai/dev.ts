import { config } from 'dotenv';
config();

import '@/ai/flows/provide-ai-suggestions.ts';
import '@/ai/flows/suggest-technical-challenges.ts';
import '@/ai/flows/generate-report-sections.ts';
import '@/ai/flows/generate-company-profile.ts';