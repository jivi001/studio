// src/app/staff/page.tsx
import { DashboardLayout } from '@/components/dashboard-layout';

export default function StaffDashboard() {
  return (
    <DashboardLayout role="Staff">
      <div className="p-8">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the staff dashboard.</p>
        {/* Staff-specific components will go here */}
      </div>
    </DashboardLayout>
  );
}
