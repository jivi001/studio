// src/components/dashboard-layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { LogOut, User, Bell, MessageSquareQuote, X } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { VcetLogo } from './vcet-logo';

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
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');


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

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      console.log('--- User Feedback ---');
      console.log(feedback);
      console.log('---------------------');
      
      toast({
        title: 'Feedback Sent',
        description: "Thank you! We've received your feedback.",
      });

      setFeedback(''); // Clear textarea
      setIsFeedbackDialogOpen(false); // Close dialog
    } else {
      toast({
        title: 'Feedback Empty',
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/10 px-4 backdrop-blur-lg sm:px-6 border-white/20">
          <div className="flex items-center gap-3">
             <Logo className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">
              Attendance Monitor
            </h1>
            <Badge variant="outline" className="text-sm border-primary/50 text-primary-foreground bg-primary">
              {role}
            </Badge>
          </div>
          <div className="relative ml-auto flex items-center gap-2 md:grow-0">
            <Sheet>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent hover:bg-white/20 text-foreground hover:text-foreground border-foreground/30">
                      <Bell className="h-4 w-4" />
                      <span className="sr-only">Toggle notifications</span>
                  </Button>
                  {notificationCount > 0 && (
                    <Badge variant="destructive" className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                      {notificationCount}
                    </Badge>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent className="bg-white/10 backdrop-blur-lg border-white/20">
                  <SheetHeader>
                      <SheetTitle>Notifications</SheetTitle>
                      <SheetDescription>
                          {notifications.length > 0 ? `You have ${notificationCount} unread messages.` : 'You have no new notifications.'}
                      </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-3 rounded-lg border bg-card/80 text-card-foreground flex justify-between items-start gap-2 bg-white/10 backdrop-blur-lg border-white/20 shadow-lg">
                                <div className="flex flex-col">
                                    <p className="font-medium">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground">{notif.body}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => clearNotification(notif.id)}>
                                  <X className='h-4 w-4'/>
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">All caught up!</p>
                    )}
                  </div>
              </SheetContent>
            </Sheet>
            <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="overflow-hidden rounded-full h-9 w-9 bg-transparent hover:bg-white/20 border-foreground/30">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="person face" />
                      <AvatarFallback>{role.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/20">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsFeedbackDialogOpen(true)}>
                    <MessageSquareQuote className="mr-2 h-4 w-4" />
                    <span>Provide Feedback</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20">
                <DialogHeader>
                  <DialogTitle>Provide Feedback</DialogTitle>
                  <DialogDescription>
                    We value your feedback. Please let us know your thoughts, suggestions, or any issues you've encountered.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid w-full gap-2">
                    <Label htmlFor="feedback-message">Your Feedback</Label>
                    <Textarea 
                      id="feedback-message"
                      placeholder="Type your message here..." 
                      rows={6}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="bg-transparent"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={handleFeedbackSubmit}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <footer className="mt-auto border-t border-white/20 bg-white/5 backdrop-blur-lg">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-6 text-foreground">
            <VcetLogo />
            <div className="text-center md:text-right mt-4 md:mt-0">
                <p className="text-sm">
                © {new Date().getFullYear()} Velalar College of Engineering and Technology. All Rights Reserved.
                </p>
                <p className="text-xs text-muted-foreground">
                Autonomous Institution, Approved by AICTE, New Delhi & Affiliated to Anna University.
                </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
