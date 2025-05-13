
"use client";

import { useEffect, useState } from 'react';
import GoalList from '@/components/goal-list';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, BarChartBig, Lightbulb, Brain } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSmartSuggestions, type GenerateSmartSuggestionsResult } from '@/app/actions';
import type { SmartSuggestionsOutput } from '@/ai/flows/smart-suggestions-flow';
import type { Goal } from '@/types';
import { useToast } from '@/hooks/use-toast';


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
  const { toast } = useToast();

  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
  const [selectedGoalForSuggestions, setSelectedGoalForSuggestions] = useState<Goal | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestionsOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);


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

  const handleFetchSuggestions = async (goal: Goal | null) => {
    if (!goal) {
      setSmartSuggestions(null);
      setSuggestionsError(null);
      setSelectedGoalForSuggestions(null);
      return;
    }
    setSelectedGoalForSuggestions(goal);
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    setSmartSuggestions(null);

    const result: GenerateSmartSuggestionsResult = await getSmartSuggestions({
      goalTitle: goal.title || goal.originalGoal,
      category: goal.category,
      timeframe: goal.timeline,
    });

    if (result.error || !result.data) {
      setSuggestionsError(result.error || "Failed to load suggestions.");
      toast({
        title: "Error",
        description: result.error || "Could not fetch smart suggestions.",
        variant: "destructive",
      });
    } else {
      setSmartSuggestions(result.data);
    }
    setIsLoadingSuggestions(false);
  };

  const renderSuggestionsList = (title: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mt-3">
        <h4 className="font-semibold text-foreground text-sm">{title}:</h4>
        <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1 pl-4">
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    );
  };


  if (authLoading || (!user && !authLoading) ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  // Use goalsLoading (from useGoals context) for the primary loading state of goals
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
                Progress Overview
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

          <Dialog open={isSuggestionsModalOpen} onOpenChange={(isOpen) => {
            setIsSuggestionsModalOpen(isOpen);
            if (!isOpen) { // Reset when closing
              setSelectedGoalForSuggestions(null);
              setSmartSuggestions(null);
              setSuggestionsError(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto border-accent text-accent hover:bg-accent/10">
                <Brain className="mr-2 h-5 w-5" />
                Get Smart Tips
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[90vw] max-h-[90vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-accent flex items-center">
                   <Brain className="mr-3 w-7 h-7" />
                   Smart Goal Suggestions
                </DialogTitle>
                <DialogDescription>
                  Select one of your goals to get AI-powered tips and ideas to boost your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <Select
                  onValueChange={(goalId) => {
                    const goal = goals.find(g => g.id === goalId);
                    handleFetchSuggestions(goal || null);
                  }}
                  value={selectedGoalForSuggestions?.id || ""}
                  disabled={goals.length === 0 || isLoadingSuggestions}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={goals.length > 0 ? "Select a goal..." : "No goals available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.length > 0 ? (
                      <SelectGroup>
                        <SelectLabel>Your Goals</SelectLabel>
                        {goals.map((goal) => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {goal.title || goal.originalGoal}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ) : (
                      <SelectItem value="no-goals" disabled>No goals created yet.</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {isLoadingSuggestions && (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner size={32} />
                    <p className="ml-3 text-muted-foreground">Generating suggestions...</p>
                  </div>
                )}
                {suggestionsError && !isLoadingSuggestions && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {suggestionsError}
                    </AlertDescription>
                  </Alert>
                )}
                {smartSuggestions && !isLoadingSuggestions && selectedGoalForSuggestions && (
                  <Card className="mt-4 bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">Suggestions for: {selectedGoalForSuggestions.title || selectedGoalForSuggestions.originalGoal}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {renderSuggestionsList("Topics to Cover", smartSuggestions.topicsToCover)}
                        {smartSuggestions.dailyOrWeeklyTimeSuggestion && (
                            <div>
                            <h4 className="font-semibold text-foreground">Time Commitment:</h4>
                            <p className="text-muted-foreground text-xs">{smartSuggestions.dailyOrWeeklyTimeSuggestion}</p>
                            </div>
                        )}
                        {renderSuggestionsList("Sample Projects/Activities", smartSuggestions.sampleProjectsOrActivities)}
                        {renderSuggestionsList("Diet & Nutrition Tips", smartSuggestions.dietAndNutritionTips)}
                        {renderSuggestionsList("Workout Routine Ideas", smartSuggestions.workoutRoutineIdeas)}
                        {renderSuggestionsList("General Tips", smartSuggestions.generalTips)}
                    </CardContent>
                  </Card>
                )}
                 {!selectedGoalForSuggestions && !isLoadingSuggestions && !suggestionsError && goals.length > 0 && (
                    <p className="text-sm text-center text-muted-foreground pt-4">Please select a goal from the dropdown to see suggestions.</p>
                )}
              </div>
              <DialogFooter className="sm:justify-start pt-4">
                 <Button type="button" variant="outline" onClick={() => setIsSuggestionsModalOpen(false)} className="w-full sm:w-auto">
                    Close
                  </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
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
            <Lightbulb className="w-10 h-10 text-accent animate-pulse" /> {/* Increased size and added pulse */}
            <div>
                <CardTitle className="text-2xl font-bold text-primary">Motivational Corner</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">A spark to ignite your ambition.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="text-xl italic text-foreground pl-6 border-l-4 border-accent relative">
              <span className="absolute -left-3 top-0 text-4xl text-accent opacity-50">&ldquo;</span>
              {currentQuote.split(" - ")[0]}
              {currentQuote.includes(" - ") && (
                 <footer className="text-base text-muted-foreground mt-3 not-italic tracking-wide">- {currentQuote.split(" - ")[1]}</footer>
              )}
            </blockquote>
          </CardContent>
        </Card>
      )}
      
      <GoalList goals={goals} />

    </div>
  );
}
