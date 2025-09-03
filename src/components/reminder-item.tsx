'use client';

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { AlarmClock, BrainCircuit, Calendar, Clock, MoreVertical, Trash2 } from 'lucide-react';

import type { Reminder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReminderItemProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSnooze: (id: string) => void;
  isNext?: boolean;
}

export function ReminderItem({
  reminder,
  onToggleComplete,
  onDelete,
  onSnooze,
  isNext = false,
}: ReminderItemProps) {
  const priorityVariant = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary',
  } as const;

  const fullDueDate = parseISO(`${reminder.dueDate}T${reminder.dueTime}:00`);
  const isOverdue = !reminder.completed && new Date() > fullDueDate;

  return (
    <Card className={cn(
      'transition-all',
      reminder.completed && 'bg-muted/50',
      isNext && !reminder.completed && 'border-primary shadow-lg shadow-primary/10'
    )}>
      <CardContent className="flex items-start gap-4 p-4">
        <Checkbox
          id={`reminder-${reminder.id}`}
          checked={reminder.completed}
          onCheckedChange={() => onToggleComplete(reminder.id)}
          className="mt-1"
          aria-label={`Mark "${reminder.title}" as ${reminder.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              'font-semibold',
              reminder.completed && 'text-muted-foreground line-through'
            )}>
              {reminder.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant={priorityVariant[reminder.userPriority]} className="capitalize">
                {reminder.userPriority}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                      <BrainCircuit className="h-4 w-4" />
                      <span className="sr-only">AI Reasoning</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end" className="max-w-xs">
                    <p className="font-bold">AI Priority: {reminder.priorityScore}/100</p>
                    <p className="text-xs text-muted-foreground">{reminder.reasoning}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {reminder.description && (
            <p className={cn(
              'text-sm text-muted-foreground mt-1',
              reminder.completed && 'line-through'
            )}>
              {reminder.description}
            </p>
          )}
          <div className={cn(
            'flex items-center gap-4 text-xs mt-2',
            reminder.completed ? 'text-muted-foreground' : 'text-foreground'
          )}>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(fullDueDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{format(fullDueDate, 'p')}</span>
            </div>
          </div>
          {isOverdue && !reminder.completed && (
            <p className="text-xs font-medium text-destructive mt-2">
              Overdue by {formatDistanceToNow(fullDueDate, { addSuffix: false })}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!reminder.completed && (
              <DropdownMenuItem onClick={() => onSnooze(reminder.id)}>
                <AlarmClock className="mr-2 h-4 w-4" />
                <span>Snooze (1 hr)</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(reminder.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
