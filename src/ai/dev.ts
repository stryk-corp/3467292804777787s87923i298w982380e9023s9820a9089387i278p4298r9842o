'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/provide-ai-suggestions.ts';
import '@/ai/flows/generate-report-sections.ts';
import '@/ai/flows/generate-company-profile.ts';
import '@/ai/flows/generate-skills-chapter.ts';
import '@/ai/flows/generate-chapter-five.ts';
import '@/ai/flows/generate-diagram-flow.ts';
import '@/ai/flows/generate-image-from-mermaid.ts';
