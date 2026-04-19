'use server';
/**
 * @fileOverview A Genkit flow for farm planning and new farmer guidance.
 * 
 * - farmSetupGuide - Provides a roadmap for new farmers or optimizes existing ones.
 * - findLand - AI-simulated land search with pricing and suitability.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FarmSetupInputSchema = z.object({
  status: z.enum(['beginner', 'existing']).describe('Current status: new farmer or existing farm owner.'),
  locationPreference: z.object({
    country: z.string().describe('Target country (e.g., Malaysia, Indonesia).'),
    region: z.string().describe('Specific state or region.'),
  }).optional(),
  hasLand: z.boolean().describe('Whether the user already has agricultural land.'),
  cropInterest: z.string().describe('Type of crops the user is interested in (e.g., Padi, Durian).'),
  budget: z.number().optional().describe('Estimated budget for setup.'),
});

export type FarmSetupInput = z.infer<typeof FarmSetupInputSchema>;

const LandOptionSchema = z.object({
  location: z.string(),
  size: z.string(),
  priceEstimate: z.string(),
  suitabilityReason: z.string(),
});

const FarmSetupOutputSchema = z.object({
  roadmap: z.array(z.string()).describe('Step-by-step guide for the user.'),
  landOptions: z.array(LandOptionSchema).optional().describe('Recommended land locations and estimated prices if user has no land.'),
  calculatedNeeds: z.object({
    seeds: z.string(),
    fertilizer: z.string(),
    estimatedInitialCost: z.string(),
  }).describe('Technical calculation for future needs.'),
  motivation: z.string().describe('AI encouragement and reasoning for choosing this path to reduce export dependency.'),
});

export type FarmSetupOutput = z.infer<typeof FarmSetupOutputSchema>;

export async function farmSetupGuide(input: FarmSetupInput): Promise<FarmSetupOutput> {
  return farmSetupFlow(input);
}

const farmSetupPrompt = ai.definePrompt({
  name: 'farmSetupPrompt',
  input: { schema: FarmSetupInputSchema },
  output: { schema: FarmSetupOutputSchema },
  prompt: `You are a high-level agricultural consultant and regional land expert for ASEAN. 
  
  User Status: {{{status}}}
  Target Region: {{{locationPreference.region}}}, {{{locationPreference.country}}}
  Interest: {{{cropInterest}}}
  Has Land: {{#if hasLand}}Yes{{else}}No{{/if}}

  If the user is a BEGINNER (0 to hero):
  1. Provide a step-by-step guide from zero to a successful harvest.
  2. If they DON'T have land, use your knowledge to suggest 3 specific sub-regions in {{{locationPreference.region}}} that are suitable for {{{cropInterest}}}. Provide realistic price estimates (e.g., in MYR per hectare).
  3. Explain WHY they should choose this path (food security, reducing export dependency).
  4. Recommend where to get the best seeds.

  If the user is EXISTING:
  1. Provide a high-level calculation for their next season's needs (seeds per acre, fertilizer types, cost estimates).
  2. Focus on maximizing yield and sustainable practices.

  Make the motivation section inspiring.`,
});

const farmSetupFlow = ai.defineFlow(
  {
    name: 'farmSetupFlow',
    inputSchema: FarmSetupInputSchema,
    outputSchema: FarmSetupOutputSchema,
  },
  async (input) => {
    const { output } = await farmSetupPrompt(input);
    if (!output) throw new Error('AI failed to generate farm plan.');
    return output;
  }
);
