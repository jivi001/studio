import { z } from 'zod';
import { reminderSchema, PrioritizeReminderInputSchema, PrioritizeReminderOutputSchema } from './schemas';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string; // "YYYY-MM-DD"
  dueTime: string; // "HH:mm"
  userPriority: 'low' | 'medium' | 'high';
  priorityScore: number;
  reasoning: string;
  completed: boolean;
  createdAt: number; // timestamp
}

export type ReminderFormValues = z.infer<typeof reminderSchema>;
export type PrioritizeReminderInput = z.infer<typeof PrioritizeReminderInputSchema>;
export type PrioritizeReminderOutput = z.infer<typeof PrioritizeReminderOutputSchema>;
