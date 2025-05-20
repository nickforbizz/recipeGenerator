// src/ai/flows/detect-ingredients.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting ingredients in a photo of food.
 *
 * - detectIngredients -  A function that takes an image of food and returns a list of ingredients.
 * - DetectIngredientsInput - The input type for the detectIngredients function.
 * - DetectIngredientsOutput - The return type for the detectIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectIngredientsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectIngredientsInput = z.infer<typeof DetectIngredientsInputSchema>;

const DetectIngredientsOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients detected in the photo.'),
});
export type DetectIngredientsOutput = z.infer<typeof DetectIngredientsOutputSchema>;

export async function detectIngredients(input: DetectIngredientsInput): Promise<DetectIngredientsOutput> {
  return detectIngredientsFlow(input);
}

const detectIngredientsPrompt = ai.definePrompt({
  name: 'detectIngredientsPrompt',
  input: {schema: DetectIngredientsInputSchema},
  output: {schema: DetectIngredientsOutputSchema},
  prompt: `You are a chef who specializes in identifying ingredients in food photos.

  Analyze the photo and return a list of ingredients.

  Photo: {{media url=photoDataUri}}`,
});

const detectIngredientsFlow = ai.defineFlow(
  {
    name: 'detectIngredientsFlow',
    inputSchema: DetectIngredientsInputSchema,
    outputSchema: DetectIngredientsOutputSchema,
  },
  async input => {
    const {output} = await detectIngredientsPrompt(input);
    return output!;
  }
);
