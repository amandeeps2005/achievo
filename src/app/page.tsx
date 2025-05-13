"use client";

import { useEffect } from 'react';
import GoalList from '@/components/goal-list';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { goals, isLoading } = useGoals();

  if (isLoading && typeof window !== 'undefined' && !localStorage.getItem('achievoGoals')) {
    // Show loading only on initial load if goals are not yet in local storage
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading your goals...</p>
      </div>
    );
  }
  
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/login');
    }
  }, [user, authLoading]);

  if (authLoading || (!user && !authLoading)) return null; // Render nothing while auth is loading or if redirecting

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Goals</h1>
          <p className="text-muted-foreground">Your journey to achievement starts here. Track your progress and stay motivated!</p>
        </div>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/new-goal">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Goal
          </Link>
        </Button>
      </div>
      
      <GoalList goals={goals} />

      {goals.length > 0 && (
        <div className="mt-12 p-6 bg-card rounded-lg shadow">
          <h3 className="text-xl font-semibold text-primary mb-3">Motivational Corner</h3>
          <p className="text-muted-foreground italic">
            "The secret of getting ahead is getting started." - Mark Twain
          </p>
        </div>
      )}
    </div>
  );
}
