// src/ai/flows/intelligent-reminder-prioritization.ts
'use server';

/**
 * @fileOverview An AI agent that intelligently prioritizes reminders based on urgency, importance, and contextual data.
 *
 * - prioritizeReminder - A function that prioritizes a reminder.
 * - PrioritizeReminderInput - The input type for the prioritizeReminder function.
 * - PrioritizeReminderOutput - The return type for the prioritizeReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PrioritizeReminderInput, PrioritizeReminderOutput } from '@/lib/types';
import { PrioritizeReminderInputSchema, PrioritizeReminderOutputSchema } from '@/lib/schemas';

export async function prioritizeReminder(input: PrioritizeReminderInput): Promise<PrioritizeReminderOutput> {
  return prioritizeReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeReminderPrompt',
  input: {schema: PrioritizeReminderInputSchema},
  output: {schema: PrioritizeReminderOutputSchema},
  prompt: `You are an AI assistant that helps users prioritize their reminders.

  Analyze the reminder details provided and assign a priority score between 1 and 100 (higher is more urgent).
  Consider the following factors:
  - Urgency (how soon is the due date and time?)
  - Importance (what is the user-assigned priority?)
  - Contextual data (what is the reminder about?  Are there any keywords that suggest high importance?)

  Provide a reasoning for the assigned priority score, explaining which factors were most influential.

  Reminder Title: {{{title}}}
  Reminder Description: {{{description}}}
  Due Date: {{{dueDate}}} {{{dueTime}}}
  User Priority: {{{userPriority}}}

  Output a JSON object with the priorityScore and reasoning.
  `,
});

const prioritizeReminderFlow = ai.defineFlow(
  {
    name: 'prioritizeReminderFlow',
    inputSchema: PrioritizeReminderInputSchema,
    outputSchema: PrioritizeReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
