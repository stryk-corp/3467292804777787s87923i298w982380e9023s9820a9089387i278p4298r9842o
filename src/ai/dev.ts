'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/provide-ai-suggestions.ts';
import '@/ai/flows/generate-report-sections.ts';
import '@/ai/flows/generate-company-profile.ts';
import '@/ai/flows/generate-skills-chapter.ts';
