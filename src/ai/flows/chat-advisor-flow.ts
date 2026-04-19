'use server';
/**
 * @fileOverview A Genkit flow for an AI farmer copilot assistant.
 */

import {ai, getAiWithKey} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAdvisorInputSchema = z.object({
  userQuestion: z.string().describe("The farmer's question about farming practices."),
  apiKey: z.string().optional().describe("User's own Gemini API key.")
});
export type ChatAdvisorInput = z.infer<typeof ChatAdvisorInputSchema>;

const ChatAdvisorOutputSchema = z.object({
  advice: z.string().describe("Actionable advice provided by the AI assistant.")
});
export type ChatAdvisorOutput = z.infer<typeof ChatAdvisorOutputSchema>;

export async function chatAdvisor(input: ChatAdvisorInput): Promise<ChatAdvisorOutput> {
  const aiInstance = getAiWithKey(input.apiKey);
  const {output} = await aiInstance.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are an intelligent AI assistant, an expert in agriculture. 
    Question: ${input.userQuestion}`,
    output: {schema: ChatAdvisorOutputSchema}
  });
  return output!;
}
