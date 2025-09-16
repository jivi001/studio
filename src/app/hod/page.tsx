// src/app/hod/page.tsx
'use client';

import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Timetable } from '@/components/timetable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { sendAlert } from '@/ai/flows/send-alert-flow';

// export const metadata: Metadata = {
//   title: 'HOD Dashboard | Attendance Monitor',
// };

export default function HodDashboard() {
  const { toast } = useToast();

  const handleSendAlert = async () => {
    try {
      const alertMessage = "This is an urgent alert from the HOD.";
      const result = await sendAlert({ message: alertMessage, targetRoles: ['admin', 'staff'] });
      
      if (result.success) {
        toast({
          title: "Alert Sent",
          description: "Admin and Staff have been notified.",
        });
      } else {
        throw new Error("Flow reported failure");
      }
    } catch (error) {
      console.error("Failed to send alert:", error);
      toast({
        title: "Alert Failed",
        description: "Could not send the alert. Please check the console and ensure the backend function is deployed.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="HOD" title="HOD Dashboard">
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">HOD Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Welcome to the Head of Department dashboard.</p>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Send Alert
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to send an alert?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will attempt to immediately notify all Staff and Admins with a high-priority alert. Use this for urgent matters only.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSendAlert}>Confirm & Send</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
