
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GoalProvider } from '@/context/goal-context';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/app-header';
import { AuthProvider } from '@/context/auth-context';
import { JournalProvider } from '@/context/journal-context';
import { HabitProvider } from '@/context/habit-context';
import AppFooter from '@/components/app-footer';
import ChatbotWidget from '@/components/chatbot/chatbot-widget'; // Import ChatbotWidget

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
  return (<html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans flex flex-col min-h-screen`}>
          <AuthProvider>
            <GoalProvider>
              <JournalProvider>
                <HabitProvider>
                  <AppHeader />
                  <main className="container mx-auto px-4 py-8 flex-grow">
                    {children}
                  </main>
                  <Toaster />
                  <AppFooter />
                  <ChatbotWidget /> {/* Add ChatbotWidget here */}
                </HabitProvider>
              </JournalProvider>
            </GoalProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
