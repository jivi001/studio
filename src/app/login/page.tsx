// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: 'admin' | 'hod' | 'staff') => {
    setLoading(true);
    // Mock login logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would use Firebase Auth here
    // For now, we'll just redirect based on role
    toast({
        title: 'Login Successful',
        description: `Redirecting to ${role} dashboard...`
    });
    router.push(`/${role}`);

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="flex items-center gap-3 mb-8">
          <Logo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Attendance Monitor
          </h1>
        </div>
      <Tabs defaultValue="staff" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="hod">HOD</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Login</CardTitle>
              <CardDescription>Enter your credentials to access the staff dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input id="staff-email" type="email" placeholder="staff@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-password">Password</Label>
                <Input id="staff-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleLogin('staff')} disabled={loading}>
                {loading ? 'Logging in...' : 'Login as Staff'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="hod">
          <Card>
            <CardHeader>
              <CardTitle>HOD Login</CardTitle>
              <CardDescription>Enter your credentials to access the HOD dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hod-email">Email</Label>
                <Input id="hod-email" type="email" placeholder="hod@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hod-password">Password</Label>
                <Input id="hod-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleLogin('hod')} disabled={loading}>
                 {loading ? 'Logging in...' : 'Login as HOD'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleLogin('admin')} disabled={loading}>
                {loading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
