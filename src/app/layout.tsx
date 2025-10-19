import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  title: 'Attendance Monitor',
  description: 'An intelligent attendance monitoring and alert system for educational institutions.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="description" content="An intelligent attendance monitoring and alert system for educational institutions." />
      </head>
      <body
        className={cn(
          'h-full font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        {children}
        <Toaster />
        <FirebaseErrorListener />
      </body>
    </html>
  );
}
