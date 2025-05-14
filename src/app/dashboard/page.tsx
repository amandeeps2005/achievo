
"use client";

import { useEffect, useState } from 'react';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, BarChartBig, Lightbulb, Brain, LayoutGrid, ArrowRight, NotebookPen, CheckSquare, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription as ShadcnCardDescription,
  CardFooter
} from '@/components/ui/card';
import { useHabits } from '@/context/habit-context';
import { format } from 'date-fns';


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
  const { habits, habitLogs, isLoading: habitsLoading } = useHabits();
  const [currentQuote, setCurrentQuote] = useState("");
  const [greeting, setGreeting] = useState("Hello");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set motivational quote
      if (motivationalQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        setCurrentQuote(motivationalQuotes[randomIndex]);
      }

      // Set dynamic greeting
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
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

  const isDataLoading = (goalsLoading || habitsLoading) && typeof window !== 'undefined' && (!localStorage.getItem('achievoGoals') || !localStorage.getItem('achievoHabits'));

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const activeHabits = habits.filter(h => !h.archived && h.userId === user.uid);
  const activeHabitsCount = activeHabits.length;
  const habitsCompletedToday = activeHabits.filter(habit => {
      const log = habitLogs.find(l => l.habitId === habit.id && l.date === todayStr && l.userId === user.uid);
      return log?.completed;
  }).length;

  return (
    <div className="space-y-8 py-4">
      <div className="p-4 sm:p-6 rounded-xl bg-card shadow-lg border border-primary/10">
        <div className="flex items-center gap-3 mb-1">
            {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
            ) : (
                <UserCircle className="w-12 h-12 text-primary" />
            )}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    {greeting}, {user.displayName?.split(' ')[0] || 'Achiever'}!
                </h1>
                <p className="text-md text-muted-foreground">
                    Ready to make progress today?
                </p>
            </div>
        </div>
      </div>

      {currentQuote && (
        <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/5 shadow-lg rounded-xl border-primary/20 overflow-hidden group">
            <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="flex flex-row items-center gap-4 pb-4 relative z-10">
                    <Lightbulb className="w-12 h-12 text-accent animate-pulse drop-shadow-lg" />
                    <div>
                        <CardTitle className="text-2xl font-bold text-primary drop-shadow-sm">Motivational Corner</CardTitle>
                        <ShadcnCardDescription className="text-sm text-muted-foreground">A spark to ignite your ambition.</ShadcnCardDescription>
                    </div>
                 </CardHeader>
                 <CardContent className="relative z-10">
                    <blockquote className="text-xl italic text-foreground pl-6 border-l-4 border-accent relative group-hover:scale-[1.01] transition-transform duration-300">
                    <span className="absolute left-[-0.3rem] top-[-0.5rem] text-6xl text-accent opacity-30 font-serif">&ldquo;</span>
                    {currentQuote.split(" - ")[0]}
                    {currentQuote.includes(" - ") && (
                        <footer className="text-base text-muted-foreground mt-3 not-italic tracking-wide">- {currentQuote.split(" - ")[1]}</footer>
                    )}
                    </blockquote>
                </CardContent>
            </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-0">
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">My Goals</CardTitle>
            </div>
            <ShadcnCardDescription>View, manage, and track all your active and completed goals.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className="text-sm text-muted-foreground">
                You currently have <span className="font-semibold text-primary">{goals.length}</span> active goal(s).
             </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/my-goals">
                Go to My Goals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1">
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

         <Card className="flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8 text-accent" />
                <CardTitle className="text-2xl text-accent">Smart Goal Tips</CardTitle>
              </div>
              <ShadcnCardDescription>Get AI-powered ideas to boost your progress on existing or new goals.</ShadcnCardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">Receive tailored advice to help you strategize and achieve more effectively.</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg">
                <Link href="/smart-suggestions">
                  Get Tips <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>


        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <NotebookPen className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">My Journal</CardTitle>
            </div>
            <ShadcnCardDescription>Record your thoughts, ideas, and reflections.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Organize entries and link them to goals if needed.</p>
          </CardContent>
          <CardFooter>
             <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/my-journal">
                Open Journal <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Habit Tracking</CardTitle>
            </div>
            <ShadcnCardDescription>Build and maintain your daily habits for consistent growth.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className="text-sm text-muted-foreground">
                Tracking <span className="font-semibold text-primary">{activeHabitsCount}</span> active habit(s).
                <br/>
                <span className="font-semibold text-accent">{habitsCompletedToday}</span> completed today!
             </p>
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

