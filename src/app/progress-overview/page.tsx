
// This page is deprecated as its content (GoalProgressChart) is now directly integrated into the dashboard.
// You can delete this file.

"use client";

import { useEffect } from 'react';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { ArrowLeft, BarChartBig } from 'lucide-react';
import { redirect } from 'next/navigation';
import GoalProgressChart from '@/components/goal-progress-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressOverviewPage_DEPRECATED() {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Progress Overview - Achievo";
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
        <p className="mt-4 text-muted-foreground">Loading progress data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
        <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            </Button>
        </div>

        <Card className="shadow-xl border-primary/20 rounded-xl overflow-hidden">
            <CardHeader className="p-6 bg-primary/5">
                <CardTitle className="text-3xl font-bold text-primary flex items-center">
                    <BarChartBig className="mr-3 h-7 w-7" />
                    All Goals Progress Overview (DEPRECATED PAGE)
                </CardTitle>
                <CardDescription className="text-primary/80">
                    This page is no longer in use. Progress charts are now on the main dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <GoalProgressChart goals={goals} />
            </CardContent>
        </Card>
    </div>
  );
}
