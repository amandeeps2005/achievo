
"use client";

import { useEffect, useState } from 'react';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
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
import GoalProgressChart from '@/components/goal-progress-chart'; 


export default function DashboardPage() {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { habits, habitLogs, isLoading: habitsLoading } = useHabits();
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

  if (isDataLoading && !user) { 
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

  const dashboardFeatures = [
    { title: "My Goals", href: "/my-goals", icon: LayoutGrid, description: "View, manage, and track all your active and completed goals.", stats: `You currently have ${goals.length} active goal(s).` },
    { title: "Smart Goal Tips", href: "/smart-suggestions", icon: Brain, description: "Get AI-powered ideas to boost your progress on existing or new goals.", stats: "Receive tailored advice to help you strategize." },
    { title: "My Journal", href: "/my-journal", icon: NotebookPen, description: "Record your thoughts, ideas, and reflections.", stats: "Organize entries and link them to goals if needed." },
    { title: "Habit Tracking", href: "/my-habits", icon: CheckSquare, description: "Build and maintain your daily habits for consistent growth.", stats: `Tracking ${activeHabitsCount} active habit(s). ${habitsCompletedToday} completed today!` }
  ];

  return (
    <div className="space-y-8 py-4">
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-card to-card shadow-xl border border-primary/20">
        <div className="flex items-center gap-4 mb-1">
            {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-md" />
            ) : (
                <UserCircle className="w-16 h-16 text-primary" />
            )}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                    {greeting}, {user.displayName?.split(' ')[0] || 'Achiever'}!
                </h1>
                <p className="text-md text-muted-foreground">
                    Ready to make progress today?
                </p>
            </div>
        </div>
      </div>

      {/* Integrated Goal Progress Chart */}
      <Card className="shadow-xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="p-6 bg-gradient-to-br from-primary/20 to-primary/5">
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
                <BarChartBig className="mr-3 h-7 w-7" />
                My Goal Progress
            </CardTitle>
            <ShadcnCardDescription className="text-primary/80">
                A visual summary of your progress across all your goals.
            </ShadcnCardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-card/80">
          {goalsLoading && typeof window !== 'undefined' && !localStorage.getItem('achievoGoals') ? (
              <div className="flex flex-col items-center justify-center min-h-[250px]">
                <LoadingSpinner size={48} />
                <p className="mt-4 text-muted-foreground">Loading progress data...</p>
              </div>
            ) : (
              <GoalProgressChart goals={goals} />
            )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-0">
        {dashboardFeatures.map(item => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-xl shadow-xl hover:shadow-[0_0_25px_hsl(var(--primary)/0.2),0_0_10px_hsl(var(--accent)/0.1)] border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden"
          >
            <Card className="flex flex-col h-full border-none shadow-none bg-transparent"> {/* Remove Card's own border/shadow if Link provides it */}
              <CardHeader className="bg-gradient-to-br from-primary/15 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl text-primary">{item.title}</CardTitle>
                </div>
                <ShadcnCardDescription className="text-muted-foreground h-10 line-clamp-2">{item.description}</ShadcnCardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground h-12 line-clamp-2">
                  {item.stats}
                </p>
              </CardContent>
              {/* CardFooter with Button is removed */}
            </Card>
          </Link>
        ))}
      </div>

      {goals.length === 0 && !goalsLoading && (
        <Card className="mt-8 text-center py-12 bg-gradient-to-br from-card to-card/80 shadow-md rounded-xl border border-border">
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

