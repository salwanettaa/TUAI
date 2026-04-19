'use server';
/**
 * @fileOverview A Genkit flow for identifying crop diseases.
 */

import { ai, getAiWithKey } from '@/ai/genkit';
import { z } from 'genkit';

const ScanCropInputSchema = z.object({
  photoDataUri: z.string(),
  description: z.string(),
  apiKey: z.string().optional(),
});
export type ScanCropInput = z.infer<typeof ScanCropInputSchema>;

const ScanCropOutputSchema = z.object({
  diseaseIdentified: z.boolean(),
  diseaseName: z.string().optional(),
  treatmentRecommendation: z.string(),
  confidenceScore: z.number(),
});
export type ScanCropOutput = z.infer<typeof ScanCropOutputSchema>;

export async function scanCrop(input: ScanCropInput): Promise<ScanCropOutput> {
  const aiInstance = getAiWithKey(input.apiKey);
  const { output } = await aiInstance.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: [
      { text: `Diagnose this crop: ${input.description}` },
      { media: { url: input.photoDataUri, contentType: 'image/jpeg' } }
    ],
    output: { schema: ScanCropOutputSchema },
  });
  return output!;
}
