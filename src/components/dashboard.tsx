'use client';

import { useState, useMemo } from 'react';
import type { Reminder } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { ReminderList } from '@/components/reminder-list';
import { add, set } from 'date-fns';

const initialReminders: Reminder[] = [
  {
    id: '1',
    title: 'Submit project report',
    description: 'Finalize the Q2 project report and submit it to management.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '17:00',
    userPriority: 'high',
    priorityScore: 95,
    reasoning: 'High user priority and a near-term deadline make this a critical task.',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: '2',
    title: 'Book flight tickets for vacation',
    description: 'Find and book round-trip tickets to Hawaii for the upcoming family vacation.',
    dueDate: add(new Date(), { days: 10 }).toISOString().split('T')[0],
    dueTime: '12:00',
    userPriority: 'medium',
    priorityScore: 70,
    reasoning: 'Medium user priority with a flexible deadline. Not immediately urgent.',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
    {
    id: '3',
    title: 'Call the dentist',
    description: 'Schedule a routine check-up and cleaning.',
    dueDate: add(new Date(), { days: 3 }).toISOString().split('T')[0],
    dueTime: '09:30',
    userPriority: 'low',
    priorityScore: 55,
    reasoning: 'Low user priority, but the appointment should be made within a few days.',
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
];

export function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.priorityScore - a.priorityScore;
    });
  }, [reminders]);

  const handleAddReminder = (newReminder: Reminder) => {
    setReminders((prev) => [newReminder, ...prev]);
  };

  const handleUpdateReminder = (updatedReminder: Reminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    );
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };
  
  const handleToggleComplete = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      handleUpdateReminder({ ...reminder, completed: !reminder.completed });
    }
  };

  const handleSnooze = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
        const [hours, minutes] = reminder.dueTime.split(':').map(Number);
        let currentDueDate = set(new Date(reminder.dueDate), { hours, minutes });
        const snoozedDate = add(currentDueDate, { hours: 1 });
        
        handleUpdateReminder({ 
            ...reminder, 
            dueDate: snoozedDate.toISOString().split('T')[0],
            dueTime: `${String(snoozedDate.getHours()).padStart(2, '0')}:${String(snoozedDate.getMinutes()).padStart(2, '0')}`
        });
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader onAddReminder={handleAddReminder} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ReminderList 
            reminders={sortedReminders}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteReminder}
            onSnooze={handleSnooze}
          />
        </div>
      </main>
    </div>
  );
}
