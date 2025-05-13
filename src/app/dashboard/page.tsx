
"use client";

import { useEffect, useState } from 'react';
import GoalList from '@/components/goal-list';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, BarChartBig, Lightbulb } from 'lucide-react';
import { redirect } from 'next/navigation';
import GoalProgressChart from '@/components/goal-progress-chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


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
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/'); 
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined' && motivationalQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }
  }, []);


  if (authLoading || (!user && !authLoading) ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-card rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Goals Dashboard</h1>
          <p className="text-muted-foreground">Your journey to achievement starts here. Track your progress and stay motivated!</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-0 self-center sm:self-auto">
          <Dialog open={isOverviewModalOpen} onOpenChange={setIsOverviewModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
                <BarChartBig className="mr-2 h-5 w-5" />
                View Progress Overview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center">
                   <BarChartBig className="mr-3 w-7 h-7" />
                   Goal Progress Overview
                </DialogTitle>
                <DialogDescription>
                  A visual summary of your current goal progress. Add more goals to see them reflected here!
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <GoalProgressChart goals={goals} />
              </div>
              <DialogFooter className="sm:justify-start pt-4">
                 <Button type="button" variant="outline" onClick={() => setIsOverviewModalOpen(false)} className="w-full sm:w-auto">
                    Close
                  </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
            <Link href="/new-goal">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Goal
            </Link>
          </Button>
        </div>
      </div>

      {currentQuote && (
        <Card className="bg-gradient-to-r from-primary/10 via-card to-card/50 shadow-lg rounded-xl border-primary/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <Lightbulb className="w-8 h-8 text-accent" />
            <CardTitle className="text-2xl font-semibold text-primary">Motivational Spark</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic text-foreground pl-4 border-l-4 border-accent">
              "{currentQuote.split(" - ")[0]}"
              {currentQuote.includes(" - ") && (
                 <footer className="text-sm text-muted-foreground mt-2 not-italic">- {currentQuote.split(" - ")[1]}</footer>
              )}
            </blockquote>
          </CardContent>
        </Card>
      )}
      
      <GoalList goals={goals} />

    </div>
  );
}
