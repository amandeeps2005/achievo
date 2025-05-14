
"use client";

import { useEffect, useState } from 'react';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, BarChartBig, Lightbulb, Brain, LayoutGrid, ArrowRight, NotebookPen, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription as ShadcnCardDescription,
  CardFooter
} from '@/components/ui/card';


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
  const { goals, isLoading: goalsLoading } = useGoals();
  const [currentQuote, setCurrentQuote] = useState("");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Ensure this runs only on the client after mount
    if (typeof window !== 'undefined' && motivationalQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }
  }, []);


  if (authLoading || (!authLoading && user === null)) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">
          { authLoading ? 'Authenticating...' : 'Redirecting...' }
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (goalsLoading && typeof window !== 'undefined' && !localStorage.getItem('achievoGoals')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Goals Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Your central hub for goal management, progress tracking, and smart insights.
        </p>
      </div>

      {currentQuote && (
        <Card className="bg-gradient-to-r from-primary/10 via-card to-card/50 shadow-lg rounded-xl border-primary/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <Lightbulb className="w-10 h-10 text-accent animate-pulse" />
            <div>
                <CardTitle className="text-2xl font-bold text-primary">Motivational Corner</CardTitle>
                <ShadcnCardDescription className="text-sm text-muted-foreground">A spark to ignite your ambition.</ShadcnCardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="text-xl italic text-foreground pl-6 border-l-4 border-accent relative">
              <span className="absolute left-1 top-0 text-4xl text-accent opacity-50">&ldquo;</span>
              {currentQuote.split(" - ")[0]}
              {currentQuote.includes(" - ") && (
                 <footer className="text-base text-muted-foreground mt-3 not-italic tracking-wide">- {currentQuote.split(" - ")[1]}</footer>
              )}
            </blockquote>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-0">
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">My Goals</CardTitle>
            </div>
            <ShadcnCardDescription>View, manage, and track all your active and completed goals.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className="text-sm text-muted-foreground">You have {goals.length} goal(s) currently.</p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/my-goals">
                Go to My Goals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <BarChartBig className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Progress Overview</CardTitle>
              </div>
              <ShadcnCardDescription>A visual summary of your current goal progress.</ShadcnCardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">See charts and summaries of how you're doing across all goals.</p>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                <Link href="/progress-overview">
                    View Overview <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                </Button>
            </CardFooter>
        </Card>

         <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8 text-accent" />
                <CardTitle className="text-2xl text-accent">Smart Goal Suggestions</CardTitle>
              </div>
              <ShadcnCardDescription>Get AI-powered tips and ideas to boost your progress.</ShadcnCardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">Receive tailored advice for existing or custom goals.</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg">
                <Link href="/smart-suggestions">
                  Get Tips <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>


        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <NotebookPen className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">My Journal</CardTitle>
            </div>
            <ShadcnCardDescription>Record your thoughts, ideas, and reflections.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Organize your journal entries and link them to specific goals if needed.</p>
          </CardContent>
          <CardFooter>
             <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/my-journal">
                Open Journal <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Habit Tracking</CardTitle>
            </div>
            <ShadcnCardDescription>Build and maintain your daily habits.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Define habits, track your progress, and build consistency.</p>
          </CardContent>
          <CardFooter>
             <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/my-habits">
                Track Habits <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

      </div>

      {goals.length === 0 && !goalsLoading && (
        <Card className="mt-8 text-center py-12 bg-card shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Ready to Start Achieving?</CardTitle>
          </CardHeader>
          <CardContent>
            <LayoutGrid className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't set any goals yet. Click the "My Goals" section above and then "Add New Goal" to begin your journey.
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
