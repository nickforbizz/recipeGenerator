'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting recipes based on a list of ingredients.
 *
 * - suggestRecipes - A function that suggests recipes based on the provided ingredients.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients identified from the photo.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const RecipeDetailSchema = z.object({
  name: z.string().describe('The name of the suggested recipe.'),
  steps: z.string().describe('Detailed, step-by-step instructions to prepare the meal, formatted clearly with newlines between steps or paragraphs.'),
  // Optional: Consider adding fields like description, estimated time, or specific ingredient quantities for this recipe in the future.
});

const SuggestRecipesOutputSchema = z.object({
  recipes: z
    .array(RecipeDetailSchema)
    .describe('A list of suggested recipes, each with a name and detailed preparation steps.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are an expert chef. Based on the ingredients provided, suggest suitable recipes.
For each recipe, you must provide:
1.  A "name" for the recipe.
2.  Detailed, step-by-step "steps" for preparing the meal. Ensure these steps are clear, comprehensive, and easy to follow. Format the steps with newlines between each step or paragraph.

Ingredients:
{{#each ingredients}}
- {{{this}}}
{{/each}}

Please provide the recipe details.`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
