
"use client";

import { useEffect, useState } from 'react';
import { useGoals } from '@/context/goal-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { PlusCircle, BarChartBig, Lightbulb, Brain, LayoutGrid, ArrowRight, FileText } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription, CardFooter } from '@/components/ui/card'; // Aliased CardDescription
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSmartSuggestions, type GenerateSmartSuggestionsResult } from '@/app/actions';
import type { SmartSuggestionsOutput } from '@/ai/flows/smart-suggestions-flow';
import type { Goal } from '@/types';
import { useToast } from '@/hooks/use-toast';
import NotesDialog from '@/components/notes/notes-dialog'; // Import NotesDialog


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
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false); // State for NotesDialog
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

  if (goalsLoading && typeof window !== 'undefined' && !localStorage.getItem('achievoGoals')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  

  return (
    <div className="space-y-8">
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Goals Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Your central hub for goal management, progress tracking, and smart insights.
        </p>
      </div>

      {currentQuote && (
        <Card className="bg-gradient-to-r from-primary/10 via-card to-card/50 shadow-lg rounded-xl border-primary/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <Lightbulb className="w-10 h-10 text-accent animate-pulse" />
            <div>
                <CardTitle className="text-2xl font-bold text-primary">Motivational Corner</CardTitle>
                <ShadcnCardDescription className="text-sm text-muted-foreground">A spark to ignite your ambition.</ShadcnCardDescription>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-0">
        {/* Card for My Goals */}
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">My Goals</CardTitle>
            </div>
            <ShadcnCardDescription>View, manage, and track all your active and completed goals.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className="text-sm text-muted-foreground">You have {goals.length} goal(s) currently.</p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/my-goals">
                Go to My Goals <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Card for Progress Overview */}
        <Dialog open={isOverviewModalOpen} onOpenChange={setIsOverviewModalOpen}>
          <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <BarChartBig className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Progress Overview</CardTitle>
              </div>
              <ShadcnCardDescription>A visual summary of your current goal progress.</ShadcnCardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">See charts and summaries of how you're doing.</p>
            </CardContent>
            <CardFooter>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                  View Overview <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </CardFooter>
          </Card>
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

        {/* Card for Get Smart Tips */}
        <Dialog open={isSuggestionsModalOpen} onOpenChange={(isOpen) => {
            setIsSuggestionsModalOpen(isOpen);
            if (!isOpen) { 
              setSelectedGoalForSuggestions(null);
              setSmartSuggestions(null);
              setSuggestionsError(null);
            }
          }}>
          <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8 text-accent" />
                <CardTitle className="text-2xl text-accent">Smart Goal Suggestions</CardTitle>
              </div>
              <ShadcnCardDescription>Get AI-powered tips and ideas to boost your progress.</ShadcnCardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">Select a goal to receive tailored advice.</p>
            </CardContent>
            <CardFooter>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg">
                  Get Tips <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </CardFooter>
          </Card>
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
                  <SelectValue placeholder={goals.length > 0 ? "Select a goal..." : "No goals available to get tips for."} />
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
                  <AlertDescription>{suggestionsError}</AlertDescription>
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

        {/* Card for Add New Goal */}
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <PlusCircle className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Add New Goal</CardTitle>
            </div>
            <ShadcnCardDescription>Define a new ambition and let Achievo help you get started.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Describe what you want to achieve, and we'll break it down.</p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
              <Link href="/new-goal">
                Create Goal <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Card for My Notes */}
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">My Notes</CardTitle>
            </div>
            <ShadcnCardDescription>Jot down thoughts, ideas, and reminders related to your goals or general topics.</ShadcnCardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Organize your notes and link them to specific goals if needed.</p>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg" onClick={() => setIsNotesModalOpen(true)}>
              Manage Notes <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
        <NotesDialog isOpen={isNotesModalOpen} onOpenChange={setIsNotesModalOpen} />

      </div>
      
      {goals.length === 0 && !goalsLoading && (
        <Card className="mt-8 text-center py-12 bg-card shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Ready to Start Achieving?</CardTitle>
          </CardHeader>
          <CardContent>
            <LayoutGrid className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't set any goals yet. Click the "Create Goal" button above to begin your journey.
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

