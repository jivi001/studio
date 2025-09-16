// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSuccessfulLogin = async (user: any) => {
    if (user.email) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let role = 'staff'; // Default role

      if (userSnap.exists()) {
        // User exists, update last login
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        });
        role = userSnap.data().role || 'staff';
      } else {
        // New user, create profile
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || user.email,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: 'staff' // Assign default role
        });
      }
      
      toast({
        title: 'Login Successful',
        description: `Welcome, ${user.displayName || user.email}! Redirecting...`,
      });

      router.push(`/${role}`);
    } else {
      throw new Error('No email found for user.');
    }
  };


  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(result.user);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };
  
  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, values.email, values.password);
      await handleSuccessfulLogin(result.user);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please try again or create an account.';
      }
      toast({
        title: 'Authentication Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoAccounts = async () => {
    setDemoLoading(true);
    // It's good practice to sign out before creating accounts
    if (auth.currentUser) {
        await auth.signOut();
    }

    const demoAccounts = [
      { email: 'admin@example.com', password: 'password', role: 'admin' },
      { email: 'hod@example.com', password: 'password', role: 'hod' },
      { email: 'staff@example.com', password: 'password', role: 'staff' },
    ];

    try {
      for (const acc of demoAccounts) {
        try {
          // Attempt to create the user. If they already exist, this will fail.
          const userCredential = await createUserWithEmailAndPassword(auth, acc.email, acc.password);
          const user = userCredential.user;
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: acc.email,
            email: acc.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: acc.role
          });
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            // User already exists, sign in to get UID and update role if needed.
            const userCredential = await signInWithEmailAndPassword(auth, acc.email, acc.password);
            const user = userCredential.user;
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { role: acc.role }, { merge: true });
          } else {
            // Another error occurred during creation
            throw error;
          }
        }
         // Sign out after each operation to ensure a clean state
        if (auth.currentUser) {
            await auth.signOut();
        }
      }
      toast({
        title: 'Demo Accounts Ready',
        description: 'Admin, HOD, and Staff accounts are ready. Use password: "password"',
      });
    } catch (error) {
      console.error("Error creating/updating demo accounts:", error);
      toast({
        title: 'Creation Failed',
        description: 'Could not create demo accounts. Check the console for errors.',
        variant: 'destructive',
      });
    } finally {
      setDemoLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-3 mb-8">
        <Logo className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Attendance Monitor
        </h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in with Email'}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading}>
              {googleLoading ? (
                'Signing in...'
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 25.4 169.5 67.2l-62.4 62.4c-21.6-20.5-51.5-32.6-86.2-32.6-64.2 0-116.6 54.2-116.6 121.3s52.4 121.3 116.6 121.3c71.3 0 95.8-52.9 98.8-79.1H248v-61.6h236.4c2.4 12.8 3.6 26.4 3.6 41.8z"
                    ></path>
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
            <Button variant="secondary" className="w-full" onClick={createDemoAccounts} disabled={demoLoading}>
              {demoLoading ? 'Creating...' : 'Create Demo Accounts'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
