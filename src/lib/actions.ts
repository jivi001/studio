'use server';

import { z } from 'zod';
import { prioritizeReminder } from '@/ai/flows/intelligent-reminder-prioritization';
import type { Reminder, PrioritizeReminderInput, ReminderFormValues } from './types';
import { reminderSchema } from './schemas';

export async function createReminderAction(values: ReminderFormValues): Promise<{ data?: Reminder; error?: string }> {
  try {
    const validatedData = reminderSchema.parse(values);

    const aiInput: PrioritizeReminderInput = {
      title: validatedData.title,
      description: validatedData.description || '',
      dueDate: validatedData.dueDate.toISOString().split('T')[0], // format to YYYY-MM-DD
      dueTime: validatedData.dueTime,
      userPriority: validatedData.userPriority,
    };

    const aiResult = await prioritizeReminder(aiInput);

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      title: validatedData.title,
      description: validatedData.description || '',
      dueDate: aiInput.dueDate,
      dueTime: validatedData.dueTime,
      userPriority: validatedData.userPriority,
      priorityScore: aiResult.priorityScore,
      reasoning: aiResult.reasoning,
      completed: false,
      createdAt: Date.now(),
    };

    return { data: newReminder };
  } catch (error) {
    console.error("Error creating reminder:", error);
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data. Please check your fields.' };
    }
    return { error: 'Failed to create reminder due to a server error.' };
  }
}
