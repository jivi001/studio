// src/app/admin/page.tsx
import { DashboardLayout } from '@/components/dashboard-layout';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="Admin">
      <div className="p-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the admin control panel.</p>
        {/* Admin-specific components will go here */}
      </div>
    </DashboardLayout>
  );
}
