import { cn } from '@/lib/utils';
import { GraduationCap, Bell } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6', props.className)}
      {...props}
    >
      <title>Attendance Monitor Logo</title>
      {/* Bell shape */}
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      {/* Graduation Cap shape */}
      <path d="m22 10-10 4-10-4" />
      <path d="M6 12v5c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-5" />
    </svg>
  );
}
