// src/components/dashboard-layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Bell } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'Admin' | 'HOD' | 'Staff';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(3);

  const handleLogout = () => {
    // In a real app, you would sign out from Firebase here
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex items-center gap-3">
           <Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Attendance Monitor
          </h1>
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Badge variant="outline" className="text-sm">
            {role}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Button variant="outline" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
              </Button>
              {notificationCount > 0 && (
                <Badge variant="destructive" className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                  {notificationCount}
                </Badge>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setNotificationCount(c => Math.max(0, c - 1))}>
              <div className="flex flex-col">
                <p className="font-medium">New Leave Request</p>
                <p className="text-xs text-muted-foreground">John Doe submitted a leave request.</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setNotificationCount(c => Math.max(0, c - 1))}>
              <div className="flex flex-col">
                <p className="font-medium">Attendance Alert</p>
                <p className="text-xs text-muted-foreground">Jane Smith marked absent.</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setNotificationCount(c => Math.max(0, c - 1))}>
              <div className="flex flex-col">
                <p className="font-medium">System Update</p>
                <p className="text-xs text-muted-foreground">Scheduled maintenance at midnight.</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full h-9 w-9">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="person face" />
                <AvatarFallback>{role.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
    </div>
  );
}
