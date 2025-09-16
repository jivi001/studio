// src/components/dashboard-layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { LogOut, User, Bell } from 'lucide-react';
import { onMessage, messaging } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
  title?: string;
}

export function DashboardLayout({ children, role, title = 'Attendance Monitor' }: DashboardLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
      { id: 1, title: 'New Leave Request', body: 'John Doe submitted a leave request.' },
      { id: 2, title: 'Attendance Alert', body: 'Jane Smith marked absent.' },
      { id: 3, title: 'System Update', body: 'Scheduled maintenance at midnight.' },
  ]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
        if (!messaging) return;
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received.', payload);
            
            const { notification } = payload;
            
            // Add to our notifications list
            const newNotification = {
              id: Date.now(), // simple unique id
              title: notification?.title || 'New Message',
              body: notification?.body || 'You have a new message.',
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setNotificationCount(prev => prev + 1);

            // Show a toast
            toast({
                title: notification?.title,
                description: notification?.body,
            });
        });

        return () => {
            unsubscribe();
        };
    }
  }, [toast]);


  const handleLogout = () => {
    // In a real app, you would sign out from Firebase here
    router.push('/login');
  };
  
  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setNotificationCount(c => Math.max(0, c - 1));
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/20 bg-white/10 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
             <Logo className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Attendance Monitor
            </h1>
          </div>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Badge variant="outline" className="text-sm border-white/30">
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
            <DropdownMenuContent align="end" className="bg-card/80 backdrop-blur-lg border-white/20">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                  notifications.map(notif => (
                      <DropdownMenuItem key={notif.id} onSelect={() => clearNotification(notif.id)}>
                          <div className="flex flex-col">
                              <p className="font-medium">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.body}</p>
                          </div>
                      </DropdownMenuItem>
                  ))
              ) : (
                  <DropdownMenuItem disabled>
                      <p className="text-xs text-muted-foreground">No new notifications</p>
                  </DropdownMenuItem>
              )}
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
            <DropdownMenuContent align="end" className="bg-card/80 backdrop-blur-lg border-white/20">
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
    </>
  );
}
