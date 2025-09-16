import type { Metadata, Viewport } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

const fontBody = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Attendance Monitor',
  description: 'An intelligent attendance monitoring and alert system for educational institutions.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#FF9933',
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
        <meta name="theme-color" content="#FF9933" />
      </head>
      <body
        className={cn(
          'h-full font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
