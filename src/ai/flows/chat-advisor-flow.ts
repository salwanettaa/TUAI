'use server';
/**
 * @fileOverview A Genkit flow for an AI farmer copilot assistant.
 *
 * - chatAdvisor - A function that handles farmer questions and provides actionable advice.
 * - ChatAdvisorInput - The input type for the chatAdvisor function.
 * - ChatAdvisorOutput - The return type for the chatAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAdvisorInputSchema = z.object({
  userQuestion: z.string().describe("The farmer's question about farming practices, weather, or crop management.")
});
export type ChatAdvisorInput = z.infer<typeof ChatAdvisorInputSchema>;

const ChatAdvisorOutputSchema = z.object({
  advice: z.string().describe("Actionable advice provided by the AI assistant to the farmer.")
});
export type ChatAdvisorOutput = z.infer<typeof ChatAdvisorOutputSchema>;

export async function chatAdvisor(input: ChatAdvisorInput): Promise<ChatAdvisorOutput> {
  return chatAdvisorFlow(input);
}

const chatAdvisorPrompt = ai.definePrompt({
  name: 'chatAdvisorPrompt',
  input: {schema: ChatAdvisorInputSchema},
  output: {schema: ChatAdvisorOutputSchema},
  prompt: `You are an intelligent AI assistant, an expert in agriculture and farming practices. Your purpose is to help farmers by answering their questions and providing actionable, grounded advice on topics such as farming techniques, crop management, pest control, irrigation, soil health, and weather-related decisions.

Act as if you have access to real-time weather data, local crop records, and extensive agricultural knowledge bases (like RAG search results). When providing advice, ensure it is practical, easy to understand, and directly addresses the farmer's query.

Farmer's Question: {{{userQuestion}}}`
});

const chatAdvisorFlow = ai.defineFlow(
  {
    name: 'chatAdvisorFlow',
    inputSchema: ChatAdvisorInputSchema,
    outputSchema: ChatAdvisorOutputSchema
  },
  async (input) => {
    const {output} = await chatAdvisorPrompt(input);
    return output!;
  }
);
