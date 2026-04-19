'use server';
/**
 * @fileOverview A Genkit flow for finding and summarizing nearby agricultural suppliers.
 *
 * - findSuppliers - A function that handles the process of finding and summarizing nearby suppliers.
 * - SupplierFinderInput - The input type for the findSuppliers function.
 * - SupplierFinderOutput - The return type for the findSuppliers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupplierFinderInputSchema = z.object({
  latitude: z.number().describe("The user's current latitude."),
  longitude: z.number().describe("The user's current longitude."),
  productType: z.string().describe('The type of agricultural input needed (e.g., "fertilizer", "seeds").'),
});
export type SupplierFinderInput = z.infer<typeof SupplierFinderInputSchema>;

const SupplierInfoSchema = z.object({
  name: z.string().describe('The name of the supplier.'),
  address: z.string().describe('The address of the supplier.'),
  contact: z.string().describe('Contact information for the supplier (e.g., phone number, email, website).'),
  distanceKm: z.number().describe('The distance to the supplier in kilometers.'),
  mapLink: z.string().url().describe('A URL to a map showing the supplier location and directions.'),
});

const SupplierFinderOutputSchema = z.object({
  summary: z.string().describe('A natural language summary of the best supplier options.'),
  suppliers: z.array(SupplierInfoSchema).describe('A list of detailed supplier information.'),
});
export type SupplierFinderOutput = z.infer<typeof SupplierFinderOutputSchema>;

/**
 * Simulates fetching nearby agricultural suppliers based on location and product type.
 * In a real application, this would interact with a Maps API or a supplier database.
 */
const getNearbySuppliersTool = ai.defineTool(
  {
    name: 'getNearbySuppliers',
    description: 'Fetches a list of nearby agricultural suppliers for a specific product type.',
    inputSchema: z.object({
      latitude: z.number().describe("The user's current latitude."),
      longitude: z.number().describe("The user's current longitude."),
      productType: z.string().describe('The type of agricultural input needed.'),
    }),
    outputSchema: z.array(SupplierInfoSchema).describe('A list of nearby suppliers with their details.'),
  },
  async ({latitude, longitude, productType}) => {
    // Simulate API call to a supplier database or Maps API
    // For the hackathon, returning mock data.
    console.log(`Searching for ${productType} suppliers near ${latitude}, ${longitude}`);

    // Mock data for demonstration purposes
    const mockSuppliers = [
      {
        name: 'AgriSupply Central',
        address: '123 Farm Road, Agroville',
        contact: '+60123456789',
        distanceKm: 5.2,
        mapLink: `https://maps.google.com/?q=${encodeURIComponent('AgriSupply Central')}&ll=${latitude},${longitude}`,
      },
      {
        name: 'Green Harvest Depot',
        address: '456 Cultivation Lane, Rural Heights',
        contact: 'info@greenharvest.com',
        distanceKm: 12.8,
        mapLink: `https://maps.google.com/?q=${encodeURIComponent('Green Harvest Depot')}&ll=${latitude},${longitude}`,
      },
      {
        name: 'Fertile Fields Store',
        address: '789 Growth Boulevard, Planterville',
        contact: 'www.fertilefields.my',
        distanceKm: 8.1,
        mapLink: `https://maps.google.com/?q=${encodeURIComponent('Fertile Fields Store')}&ll=${latitude},${longitude}`,
      },
    ];

    return mockSuppliers.filter(supplier => {
      // Simple filtering logic; in a real app, this would be more complex
      // e.g., checking if productType is available at supplier
      return productType.toLowerCase().includes('fertilizer') || productType.toLowerCase().includes('seeds') || true; // Always return mock suppliers for any product for demo
    });
  }
);

const summarizeSuppliersPrompt = ai.definePrompt({
  name: 'summarizeSuppliersPrompt',
  input: {
    schema: z.object({
      productType: z.string().describe('The type of agricultural input needed.'),
      suppliers: z.array(SupplierInfoSchema).describe('A JSON array of nearby suppliers including name, address, contact, distance, and map link.'),
    }),
  },
  output: {schema: SupplierFinderOutputSchema},
  prompt: `You are an AI assistant helping a farmer find agricultural suppliers.

Based on the following list of nearby suppliers for {{{productType}}}, provide a concise summary of the best options. Highlight their names, approximate distances, and how to contact them or get directions. Prioritize closer options.

Suppliers:
{{#each suppliers}}
- Name: {{{name}}}
  Address: {{{address}}}
  Contact: {{{contact}}}
  Distance: {{{distanceKm}}} km
  Map: {{{mapLink}}}
{{/each}}

Your output MUST be a JSON object matching the SupplierFinderOutputSchema, including both a 'summary' string and a 'suppliers' array.`,
});

const supplierFinderFlow = ai.defineFlow(
  {
    name: 'supplierFinderFlow',
    inputSchema: SupplierFinderInputSchema,
    outputSchema: SupplierFinderOutputSchema,
  },
  async (input) => {
    // Use the tool to find nearby suppliers
    const suppliers = await getNearbySuppliersTool({
      latitude: input.latitude,
      longitude: input.longitude,
      productType: input.productType,
    });

    // If no suppliers are found, provide a default response
    if (suppliers.length === 0) {
      return {
        summary: `No suppliers found for ${input.productType} near your location. Please try a different product or adjust your search area.`, 
        suppliers: []
      };
    }

    // Use the prompt to summarize the found suppliers
    const {output} = await summarizeSuppliersPrompt({
      productType: input.productType,
      suppliers: suppliers,
    });

    // Ensure the output is not null and return it
    return output!;
  }
);

export async function findSuppliers(input: SupplierFinderInput): Promise<SupplierFinderOutput> {
  return supplierFinderFlow(input);
}
