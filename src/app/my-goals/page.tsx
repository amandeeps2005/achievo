
"use client";

import { useEffect } from 'react';
import GoalList from '@/components/goal-list';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, LayoutGrid, ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyGoalsPage() {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "My Goals - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/'); 
    }
  }, [user, authLoading]);

  if (authLoading || (!user && !authLoading) ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  if (goalsLoading && typeof window !== 'undefined' && !localStorage.getItem('achievoGoals')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading your goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            </Button>
        </div>

      <Card className="shadow-xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-primary/5">
            <div>
                <CardTitle className="text-3xl font-bold text-primary flex items-center">
                    <LayoutGrid className="mr-3 h-7 w-7" />
                    My Goals
                </CardTitle>
                <CardDescription className="text-primary/80">
                    View, manage, and track all your active and completed goals.
                </CardDescription>
            </div>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
                <Link href="/new-goal">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add New Goal
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="p-6">
          {goals.length > 0 ? (
            <GoalList goals={goals} />
          ) : (
            <div className="text-center py-12">
                 <LayoutGrid className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Goals Here Yet!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                It looks like you haven't added any goals. Click the "Add New Goal" button to start your journey to achievement.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/new-goal">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Your First Goal
                </Link>
                </Button>
            </div>
          )}
        </CardContent>
        {goals.length > 0 && (
            <CardFooter className="p-6 bg-muted/20 border-t border-border justify-center">
                <p className="text-sm text-muted-foreground">
                    Showing {goals.length} goal{goals.length === 1 ? '' : 's'}. Keep up the great work!
                </p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
