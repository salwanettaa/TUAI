import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

/**
 * Helper to get a Genkit instance configured with a specific API key.
 * If no key is provided, it falls back to the default instance.
 */
export function getAiWithKey(apiKey?: string) {
  if (!apiKey) return ai;
  return genkit({
    plugins: [googleAI({ apiKey })],
    model: 'googleai/gemini-2.5-flash',
  });
}
