
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GoalProvider } from '@/context/goal-context';
import { AuthProvider } from '@/context/auth-context';
import { JournalProvider } from '@/context/journal-context';
import { HabitProvider } from '@/context/habit-context';
import AuthenticatedLayoutWrapper from '@/components/layout/authenticated-layout-wrapper';
// ThemeProvider import removed


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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans flex flex-col min-h-screen`}>
        {/* ThemeProvider is removed */}
          <AuthProvider>
            <GoalProvider>
              <JournalProvider>
                <HabitProvider>
                  <AuthenticatedLayoutWrapper>
                    {children}
                  </AuthenticatedLayoutWrapper>
                </HabitProvider>
              </JournalProvider>
            </GoalProvider>
          </AuthProvider>
        {/* ThemeProvider is removed */}
      </body>
    </html>
  );
}
