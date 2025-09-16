import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Attendance Monitor',
  description: 'An intelligent attendance monitoring and alert system for educational institutions.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0A102A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'h-full font-body antialiased',
          fontBody.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
