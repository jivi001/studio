// src/app/staff/page.tsx
'use client';

import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Timetable } from '@/components/timetable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Staff Dashboard | Attendance Monitor',
// };

export default function StaffDashboard() {
  return (
    <DashboardLayout role="Staff" title="Staff Dashboard">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Staff Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Welcome to your dashboard. Here's your weekly schedule.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="https://vetiasportal.vetias.ac.in/IMPRESVCET/" target="_blank" rel="noopener noreferrer">
              <Button>
                Submit Attendance
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>My Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Timetable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
