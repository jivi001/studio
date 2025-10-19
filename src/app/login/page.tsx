'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { requestNotificationPermission } from '@/lib/fcm';
import { VcetLogo } from '@/components/vcet-logo';
import placeholderImages from '@/lib/placeholder-images.json';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const { headerLogo } = placeholderImages;

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
        const updateData = { lastLogin: serverTimestamp() };
        updateDoc(userRef, updateData)
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
        role = userSnap.data().role || 'staff';
      } else {
        const createData = {
          uid: user.uid,
          displayName: user.displayName || user.email,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: 'staff'
        };
        setDoc(userRef, createData)
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'create',
              requestResourceData: createData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }
      
      toast({
        title: 'Login Successful',
        description: `Welcome! Requesting notification permissions...`,
      });

      if ('serviceWorker' in navigator) {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        const swUrl = `/firebase-messaging-sw.js?firebaseConfig=${encodeURIComponent(JSON.stringify(firebaseConfig))}`;
        
        navigator.serviceWorker.register(swUrl)
        .then(async (swReg) => {
            console.log('Service Worker is registered', swReg);
            await requestNotificationPermission(user.uid);
        }).catch((err) => {
            console.error('Service Worker Error', err);
        });
      } else {
        await requestNotificationPermission(user.uid);
      }


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
        description = 'Invalid email or password. Please check your credentials and try again.';
      }
      toast({
        title: 'Sign In Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await handleSuccessfulLogin(result.user);
    } catch (error: any)
{
      console.error('Email sign-up error:', error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already in use. Please sign in instead.';
      }
      toast({
        title: 'Sign Up Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (authMode === 'signin') {
      handleEmailSignIn(values);
    } else {
      handleEmailSignUp(values);
    }
  };

  const createDemoAccounts = async () => {
    setDemoLoading(true);
    
    const originalUser = auth.currentUser;
  
    const demoAccounts = [
      { email: 'admin@example.com', password: 'password', role: 'admin' },
      { email: 'hod@example.com', password: 'password', role: 'hod' },
      { email: 'staff@example.com', password: 'password', role: 'staff' },
    ];
  
    try {
      for (const acc of demoAccounts) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, acc.email, acc.password);
          const user = userCredential.user;
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists() || userSnap.data().role !== acc.role) {
            const setData = { role: acc.role };
            setDoc(userRef, setData, { merge: true })
              .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: userRef.path,
                  operation: 'update',
                  requestResourceData: setData,
                });
                errorEmitter.emit('permission-error', permissionError);
              });
          }
        } catch (error: any) {
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            const userCredential = await createUserWithEmailAndPassword(auth, acc.email, acc.password);
            const user = userCredential.user;
            const userRef = doc(db, "users", user.uid);
            const createData = {
              uid: user.uid,
              displayName: acc.email,
              email: acc.email,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              role: acc.role
            };
            setDoc(userRef, createData)
              .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: userRef.path,
                  operation: 'create',
                  requestResourceData: createData,
                });
                errorEmitter.emit('permission-error', permissionError);
              });
          } else if (error.code !== 'auth/wrong-password') {
            throw error;
          }
        }
      }
      
      if (auth.currentUser && auth.currentUser.email?.endsWith('@example.com')) {
        await auth.signOut();
      }
  
      if (originalUser && !auth.currentUser) {
        toast({
          title: 'You have been signed out',
          description: 'Please sign in again to continue.',
        });
      }
  
      toast({
        title: 'Demo Accounts Ready',
        description: 'Admin, HOD, and Staff accounts are set up. Use password: "password"',
      });
  
    } catch (error) {
      console.error("Error creating/updating demo accounts:", error);
      toast({
        title: 'Creation Failed',
        description: 'Could not set up demo accounts. An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      if (originalUser && !auth.currentUser) {
      } else if (auth.currentUser && !originalUser) {
        await auth.signOut();
      }
      setDemoLoading(false);
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-transparent lg:flex lg:flex-col items-center justify-center p-8">
        <div className="flex items-center gap-4">
            <Image 
              priority
              src={headerLogo.src}
              width={headerLogo.width}
              height={headerLogo.height}
              alt={headerLogo.alt}
              data-ai-hint={headerLogo.hint}
              className="h-12 w-auto"
            />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Attendance Monitor
            </h1>
        </div>
        <p className="mt-4 text-center text-xl text-muted-foreground font-medium">
            An intelligent attendance monitoring and alert system for educational institutions.
        </p>
      </div>
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className='flex-grow flex items-center justify-center w-full'>
          <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
              <CardTitle className="text-3xl">{authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
              <CardDescription>
                  {authMode === 'signin' ? 'Sign in to your account to continue' : 'Enter your details to get started'}
              </CardDescription>
              </CardHeader>
              <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {loading ? 'Submitting...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
                  </Button>
                  </form>
              </Form>

              <div className="text-center mt-4">
                  <Button
                  variant="link"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  >
                  {authMode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </Button>
              </div>

              <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                      Or
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
                      Continue with Google
                      </>
                  )}
                  </Button>
                  <div className='text-center'>
                  <Button variant="secondary" className="w-full" onClick={createDemoAccounts} disabled={demoLoading}>
                      {demoLoading ? 'Creating...' : 'Create Demo Accounts'}
                  </Button>
                  <CardDescription className="text-xs text-muted-foreground mt-2 px-4">
                      Creates demo Admin, HOD, and Staff accounts to explore the app. Use password: "password"
                  </CardDescription>
                  </div>
              </div>
              </CardContent>
          </Card>
        </div>
        <footer className="w-full border-t py-4 mt-auto">
          <div className="container mx-auto flex items-center justify-center gap-4 py-8 px-4 text-center">
            <VcetLogo />
          </div>
        </footer>
      </main>
    </div>
  );
}
