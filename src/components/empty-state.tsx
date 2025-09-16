import { Button } from "./ui/button";
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export function EmptyState() {
  const { emptyState } = placeholderImages;
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Image
            src={emptyState.src}
            alt={emptyState.alt}
            width={emptyState.width}
            height={emptyState.height}
            className="rounded-full"
            data-ai-hint={emptyState.hint}
        />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">You're all clear!</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        No reminders here. Let's add one to get you started.
      </p>
      <p className="mt-1 text-xs text-muted-foreground/80">
        Just 2 more steps to stay on top.
      </p>
    </div>
  );
}
