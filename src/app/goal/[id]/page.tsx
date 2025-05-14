
"use client";

import { useParams, useRouter, redirect } from 'next/navigation';
import { useGoals } from '@/context/goal-context';
import GoalDetailView from '@/components/goal-detail-view';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getGoalById, isLoading: isContextLoading } = useGoals();
  
  const goalId = typeof params.id === 'string' ? params.id : undefined;
  const goal = goalId ? getGoalById(goalId) : undefined;

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/'); // Redirect to landing page if not authenticated
    }
  }, [user, authLoading]);

  useEffect(() => {
    // This effect handles the case where the goal is not found AFTER auth check has passed
    // or if the user was already logged in but the goal doesn't exist.
    if (user && !isContextLoading && goalId && !goal) {
      router.replace('/dashboard'); 
    }
  }, [user, isContextLoading, goalId, goal, router]);


  if (authLoading || (!user && !authLoading)) {
    return (
     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
       <LoadingSpinner size={64} />
       <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
     </div>
   );
  }
  
  // This loading state is for the goal context itself, after auth is confirmed
  if (user && isContextLoading && !goal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading goal details...</p>
      </div>
    );
  }

  if (!goal && user) { // If user is authenticated but goal is not found
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold mb-4">Goal Not Found</h1>
        <p className="text-muted-foreground mb-6">The goal you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/my-goals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Goals
          </Link>
        </Button>
      </div>
    );
  }
  
  // If goal is still undefined here, it means auth hasn't redirected yet, or some other edge case.
  // The primary "goal not found" for authenticated users is handled above.
  // If !user, the auth redirect should handle it. If still here without a goal, show generic not found.
  if (!goal) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <p className="mt-4 text-lg text-muted-foreground">Goal not available.</p>
         <Button asChild variant="outline" className="mt-4">
          <Link href={user ? "/my-goals" : "/"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {user ? "My Goals" : "Home"}
          </Link>
        </Button>
      </div>
    );
  }
  
  if (typeof document !== 'undefined') {
     document.title = `${goal.title || goal.originalGoal} - Achievo`;
  }


  return (
    <div className="py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/my-goals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Goals
          </Link>
        </Button>
      </div>
      <GoalDetailView goal={goal} />
    </div>
  );
}

