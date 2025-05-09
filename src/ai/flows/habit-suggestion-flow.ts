'use server';
/**
 * @fileOverview A flow to suggest new habits to the user.
 *
 * - suggestHabit - A function that suggests a new habit based on existing ones.
 * - HabitSuggestionInput - The input type for the suggestHabit function.
 * - HabitSuggestionOutput - The return type for the suggestHabit function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { HabitFrequency } from '@/types/habit';

const HabitSuggestionInputSchema = z.object({
  existingHabits: z.array(z.string()).describe('A list of current habit names the user is tracking.'),
  language: z.string().optional().default('English').describe('The language for the suggested habit name.'),
});
export type HabitSuggestionInput = z.infer<typeof HabitSuggestionInputSchema>;

const HabitSuggestionOutputSchema = z.object({
  name: z.string().describe('The name of the suggested habit.'),
  reason: z.string().describe('A brief reason why this habit is suggested.'),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional().describe('Suggested frequency for the habit.'),
});
export type HabitSuggestionOutput = z.infer<typeof HabitSuggestionOutputSchema>;

export async function suggestHabit(input: HabitSuggestionInput): Promise<HabitSuggestionOutput> {
  return suggestHabitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHabitPrompt',
  input: { schema: HabitSuggestionInputSchema },
  output: { schema: HabitSuggestionOutputSchema },
  prompt: `You are a helpful assistant that suggests new habits.
The user is currently tracking the following habits:
{{#if existingHabits}}
{{#each existingHabits}}
- {{{this}}}
{{/each}}
{{else}}
The user is not tracking any habits yet.
{{/if}}

Suggest a new, complementary, and healthy habit for the user in {{language}}.
The habit should be specific and actionable.
Provide a brief, encouraging reason for the suggestion.
Suggest a suitable frequency (daily, weekly, or monthly) if applicable.
Avoid suggesting habits that are too similar to the existing ones.
If no habits are provided, suggest a common beneficial habit.
For example, if the user tracks "Drink 2L of water" and "Exercise 30 minutes", you could suggest "Meditate for 10 minutes daily" because it complements physical health with mental well-being.
Another example: if user tracks "Read a book" and "Learn a new language", you could suggest "Write a journal entry daily".
If the user tracks "Go for a run", do not suggest "Go for a walk".
Make sure the habit name is in {{language}}.
`,
});

const suggestHabitFlow = ai.defineFlow(
  {
    name: 'suggestHabitFlow',
    inputSchema: HabitSuggestionInputSchema,
    outputSchema: HabitSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('No output from AI');
    }
    // Ensure frequency is one of the allowed values or undefined
    const validFrequencies: HabitFrequency[] = ['daily', 'weekly', 'monthly'];
    if (output.frequency && !validFrequencies.includes(output.frequency as HabitFrequency)) {
      output.frequency = 'daily'; // Default to daily if invalid
    }
    return output;
  }
);
