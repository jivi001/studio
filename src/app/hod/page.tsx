// src/app/hod/page.tsx
import { DashboardLayout } from '@/components/dashboard-layout';
import { Timetable } from '@/components/timetable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function HodDashboard() {
  return (
    <DashboardLayout role="HOD">
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">HOD Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Welcome to the Head of Department dashboard.</p>
          </div>
          <Link href="https://vetiasportal.vetias.ac.in/IMPRESVCET/" target="_blank" rel="noopener noreferrer">
            <Button>
              Submit Attendance
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Timetable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
