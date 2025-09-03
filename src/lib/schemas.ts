import { z } from 'zod';

export const reminderSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  dueDate: z.date({ required_error: 'Please select a date.' }),
  dueTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  userPriority: z.enum(['low', 'medium', 'high']),
});

export const PrioritizeReminderInputSchema = z.object({
    title: z.string().describe('The title of the reminder.'),
    description: z.string().describe('A detailed description of the reminder.'),
    dueDate: z.string().describe('The due date of the reminder in ISO format (YYYY-MM-DD).'),
    dueTime: z.string().describe('The due time of the reminder in HH:mm format.'),
    userPriority: z.enum(['high', 'medium', 'low']).describe('The priority assigned by the user.'),
});

export const PrioritizeReminderOutputSchema = z.object({
    priorityScore: z.number().describe('A numerical score representing the priority of the reminder (higher is more urgent).'),
    reasoning: z.string().describe('Explanation of why the reminder was prioritized in this way, including factors considered.'),
});
