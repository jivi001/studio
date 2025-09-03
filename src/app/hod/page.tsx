// src/app/hod/page.tsx
import { DashboardLayout } from '@/components/dashboard-layout';

export default function HodDashboard() {
  return (
    <DashboardLayout role="HOD">
      <div className="p-8">
        <h1 className="text-2xl font-bold">HOD Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the Head of Department dashboard.</p>
        {/* HOD-specific components will go here */}
      </div>
    </DashboardLayout>
  );
}
