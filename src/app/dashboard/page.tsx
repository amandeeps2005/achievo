
"use client";

import { useEffect, useState } from 'react';
import GoalList from '@/components/goal-list';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

const motivationalQuotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence. - Confucius",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Our greatest glory is not in never failing, but in rising up every time we fail. - Ralph Waldo Emerson",
  "The journey of a thousand miles begins with a single step. - Lao Tzu",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar",
  "Act as if what you do makes a difference. It does. - William James"
];

export default function DashboardPage() {
  const { goals, isLoading } = useGoals();
  const [currentQuote, setCurrentQuote] = useState("");
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/'); // Redirect to landing page if not authenticated
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Select a random quote on component mount (client-side)
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);


  if (authLoading || (!user && !authLoading) ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  // This loading state is for goals context
  if (isLoading && typeof window !== 'undefined' && !localStorage.getItem('achievoGoals')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading your goals...</p>
      </div>
    );
  }
  

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-card rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Goals Dashboard</h1>
          <p className="text-muted-foreground">Your journey to achievement starts here. Track your progress and stay motivated!</p>
        </div>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform">
          <Link href="/new-goal">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Goal
          </Link>
        </Button>
      </div>
      
      <GoalList goals={goals} />

      {goals.length > 0 && currentQuote && (
        <div className="mt-12 p-6 bg-card rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-primary mb-3">Motivational Corner</h3>
          <p className="text-muted-foreground italic text-lg">
            "{currentQuote}"
          </p>
        </div>
      )}
    </div>
  );
}

