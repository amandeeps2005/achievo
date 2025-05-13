import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GoalProvider } from '@/context/goal-context';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/app-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Achievo - Your Personal Goal Achievement System',
  description: 'Achieve your goals with Achievo. Smart goal breakdown, progress tracking, and motivation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <GoalProvider>
          <AppHeader />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </GoalProvider>
      </body>
    </html>
  );
}
