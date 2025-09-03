'use client';

import { Logo } from '@/components/icons';
import { AddReminderDialog } from './add-reminder-dialog';
import type { Reminder } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppHeaderProps {
  onAddReminder: (newReminder: Reminder) => void;
}

export function AppHeader({ onAddReminder }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            ReminderPro
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <AddReminderDialog onAddReminder={onAddReminder} />
           <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="person face" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
