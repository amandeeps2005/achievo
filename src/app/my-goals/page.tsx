
"use client";

import { useEffect, useState, useMemo } from 'react';
import GoalList from '@/components/goal-list';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, LayoutGrid, ArrowLeft, Search, X } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MyGoalsPage() {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "My Goals - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);

  const filteredGoals = useMemo(() => {
    if (!searchTerm.trim()) {
      return goals;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return goals.filter(goal =>
      (goal.title?.toLowerCase().includes(lowercasedSearchTerm)) ||
      (goal.originalGoal.toLowerCase().includes(lowercasedSearchTerm)) ||
      (goal.category.toLowerCase().includes(lowercasedSearchTerm)) ||
      (goal.steps.some(step => step.description.toLowerCase().includes(lowercasedSearchTerm)))
    );
  }, [goals, searchTerm]);

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

      <Card className="shadow-xl border-border rounded-xl overflow-hidden">
        <CardHeader className="p-6 bg-muted/20 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search goals by title, category, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredGoals.length > 0 ? (
            <GoalList goals={filteredGoals} />
          ) : goals.length > 0 && searchTerm ? (
             <div className="text-center py-12">
                 <Search className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Goals Found</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  No goals match your search term "{searchTerm}". Try a different search or clear the filter.
                </p>
            </div>
          ) : (
            <div className="text-center py-12">
                 <LayoutGrid className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Goals Here Yet!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                It looks like you haven't added any goals. Click the "Add New Goal" button above to start your journey to achievement.
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
        {filteredGoals.length > 0 && (
            <CardFooter className="p-6 bg-muted/20 border-t border-border justify-center">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredGoals.length} goal{filteredGoals.length === 1 ? '' : 's'}. Keep up the great work!
                </p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
