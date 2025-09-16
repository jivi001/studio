// src/app/staff/page.tsx
import { DashboardLayout } from '@/components/dashboard-layout';
import { Timetable } from '@/components/timetable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StaffDashboard() {
  return (
    <DashboardLayout role="Staff">
      <div className="p-8">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your dashboard. Here's your weekly schedule.</p>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>My Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <Timetable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
