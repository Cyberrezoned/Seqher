import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const hasGoogleAiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

export const ai = genkit({
  plugins: hasGoogleAiKey ? [googleAI()] : [],
  model: hasGoogleAiKey ? 'googleai/gemini-2.5-flash' : undefined,
});

export const isGoogleAiConfigured = hasGoogleAiKey;
