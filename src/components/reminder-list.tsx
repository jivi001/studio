'use client';

import type { Reminder } from '@/lib/types';
import { ReminderItem } from './reminder-item';
import { EmptyState } from './empty-state';

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSnooze: (id: string) => void;
}

export function ReminderList({
  reminders,
  onToggleComplete,
  onDelete,
  onSnooze,
}: ReminderListProps) {
  if (reminders.length === 0) {
    return <EmptyState />;
  }

  const upcomingReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-foreground mb-4">Upcoming</h2>
        {upcomingReminders.length > 0 ? (
          <div className="space-y-3">
            {upcomingReminders.map((reminder, index) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onSnooze={onSnooze}
                isNext={index === 0}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Nothing upcoming. All caught up! ✨</p>
        )}
      </div>

       {completedReminders.length > 0 && (
         <div>
            <h2 className="text-lg font-medium text-foreground mb-4">Completed</h2>
            <div className="space-y-3">
                {completedReminders.map((reminder) => (
                <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onSnooze={onSnooze}
                />
                ))}
            </div>
         </div>
       )}
    </div>
  );
}
