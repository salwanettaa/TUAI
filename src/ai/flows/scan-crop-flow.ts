'use server';
/**
 * @fileOverview A Genkit flow for identifying crop diseases from an image and providing treatment recommendations.
 *
 * - scanCrop - A function that handles the crop disease identification process.
 * - ScanCropInput - The input type for the scanCrop function.
 * - ScanCropOutput - The return type for the scanCrop function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScanCropInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A brief description of the crop and observed symptoms.'),
});
export type ScanCropInput = z.infer<typeof ScanCropInputSchema>;

const ScanCropOutputSchema = z.object({
  diseaseIdentified: z.boolean().describe('Whether a specific disease was identified.'),
  diseaseName: z.string().describe('The name of the identified disease, if any.').optional(),
  treatmentRecommendation: z.string().describe('Detailed steps for treating the identified disease or general advice if no disease is found.'),
  confidenceScore: z.number().describe('A confidence score (0-100) for the diagnosis.'),
});
export type ScanCropOutput = z.infer<typeof ScanCropOutputSchema>;

export async function scanCrop(input: ScanCropInput): Promise<ScanCropOutput> {
  return scanCropFlow(input);
}

const scanCropPrompt = ai.definePrompt({
  name: 'scanCropPrompt',
  input: { schema: ScanCropInputSchema },
  output: { schema: ScanCropOutputSchema },
  prompt: `You are an expert agricultural diagnostician. Your task is to analyze the provided image and description of a crop to identify any potential diseases and recommend appropriate treatments.

Analyze the image and the farmer's description carefully. If a disease is identified, provide its name, a detailed treatment recommendation, and a confidence score for your diagnosis (0-100). If no clear disease is identified, state 'false' for diseaseIdentified, leave diseaseName empty, and provide general advice for crop health based on the description and image.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const scanCropFlow = ai.defineFlow(
  {
    name: 'scanCropFlow',
    inputSchema: ScanCropInputSchema,
    outputSchema: ScanCropOutputSchema,
  },
  async (input) => {
    const { output } = await scanCropPrompt(input);
    return output!;
  }
);
