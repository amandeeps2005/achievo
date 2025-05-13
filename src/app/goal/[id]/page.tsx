
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useGoals } from '@/context/goal-context';
import GoalDetailView from '@/components/goal-detail-view';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getGoalById, isLoading: isContextLoading } = useGoals();
  
  const goalId = typeof params.id === 'string' ? params.id : undefined;
  const goal = goalId ? getGoalById(goalId) : undefined;

  useEffect(() => {
    if (!isContextLoading && goalId && !goal) {
      router.replace('/dashboard'); 
    }
  }, [isContextLoading, goalId, goal, router]);


  if (isContextLoading && !goal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading goal details...</p>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold mb-4">Goal Not Found</h1>
        <p className="text-muted-foreground mb-6">The goal you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard"> {/* Updated link */}
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
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
          <Link href="/dashboard"> {/* Updated link */}
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <GoalDetailView goal={goal} />
    </div>
  );
}
