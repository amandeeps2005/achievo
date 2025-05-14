
// src/app/smart-suggestions/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/loading-spinner';
import { ArrowLeft, Brain, Lightbulb } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { useGoals } from '@/context/goal-context';
import type { Goal } from '@/types';
import type { SmartSuggestionsOutput } from '@/ai/flows/smart-suggestions-flow';
import { getSmartSuggestions, type GenerateSmartSuggestionsResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const GOAL_CATEGORIES = ["Fitness", "Learning", "Career", "Finance", "Hobby", "Other"];

const customGoalSchema = z.object({
  customTitle: z.string().min(5, "Goal title must be at least 5 characters.").max(150, "Title too long (max 150 chars)."),
  customCategory: z.string().min(1, "Please select a category."),
  customTimeframe: z.string().min(3, "Timeframe description must be at least 3 characters.").max(100, "Timeframe too long (max 100 chars).")
});
type CustomGoalFormData = z.infer<typeof customGoalSchema>;

export default function SmartSuggestionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { goals, isLoading: goalsLoading } = useGoals();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedExistingGoalId, setSelectedExistingGoalId] = useState<string | undefined>(undefined);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestionsOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const form = useForm<CustomGoalFormData>({
    resolver: zodResolver(customGoalSchema),
    defaultValues: {
      customTitle: "",
      customCategory: "",
      customTimeframe: "",
    },
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "Smart Suggestions - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);

  const handleFetchSuggestions = async (data?: CustomGoalFormData) => {
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    setSmartSuggestions(null);

    let inputForAI;

    if (selectedExistingGoalId && !data) { // Fetching for existing goal
      const existingGoal = goals.find(g => g.id === selectedExistingGoalId);
      if (!existingGoal) {
        setSuggestionsError("Selected existing goal not found.");
        setIsLoadingSuggestions(false);
        return;
      }
      inputForAI = {
        goalTitle: existingGoal.title || existingGoal.originalGoal,
        category: existingGoal.category,
        timeframe: existingGoal.timeline,
      };
    } else if (data) { // Fetching for custom goal
      inputForAI = {
        goalTitle: data.customTitle,
        category: data.customCategory,
        timeframe: data.customTimeframe,
      };
      setSelectedExistingGoalId(undefined); // Clear existing goal selection
    } else {
      setSuggestionsError("Please select an existing goal or provide custom goal details.");
      setIsLoadingSuggestions(false);
      return;
    }

    const result: GenerateSmartSuggestionsResult = await getSmartSuggestions(inputForAI);

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
  
  const onCustomGoalSubmit: SubmitHandler<CustomGoalFormData> = (data) => {
    handleFetchSuggestions(data);
  };

  const handleExistingGoalSelect = (goalId: string) => {
    if (goalId === "none") {
        setSelectedExistingGoalId(undefined);
        form.reset(); // Clear custom form if "none" is selected
    } else {
        setSelectedExistingGoalId(goalId);
        form.reset(); // Clear custom form if an existing goal is selected
        // Trigger suggestion fetch for the selected existing goal
        const existingGoal = goals.find(g => g.id === goalId);
        if (existingGoal) {
           handleFetchSuggestions(); // No data means use selectedExistingGoalId
        }
    }
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

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="mb-6 flex justify-start">
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
            <Brain className="mr-3 h-7 w-7 text-accent" />
            Smart Goal Suggestions
          </CardTitle>
          <ShadcnCardDescription className="text-primary/80">
            Get AI-powered tips for your existing goals or define a new one below.
          </ShadcnCardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Section for Existing Goals */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">For an Existing Goal</CardTitle>
              <ShadcnCardDescription>Select one of your saved goals to get suggestions.</ShadcnCardDescription>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={handleExistingGoalSelect}
                value={selectedExistingGoalId || "none"}
                disabled={goalsLoading || isLoadingSuggestions || goals.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={goals.length > 0 ? "Select from your goals..." : "No existing goals found."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <RadixSelectLabel>Your Goals</RadixSelectLabel>
                    <SelectItem value="none">-- Select a Goal --</SelectItem>
                    {goals.map((goal: Goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title || goal.originalGoal}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
               {goals.length === 0 && !goalsLoading && <p className="text-xs text-muted-foreground mt-2">You don't have any saved goals yet. Try adding a custom goal below or create one from "My Goals".</p>}
            </CardContent>
          </Card>

          {/* Section for Custom Goal */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">For a Custom Goal</CardTitle>
              <ShadcnCardDescription>Describe a new goal to get suggestions.</ShadcnCardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCustomGoalSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title / Objective</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Learn Spanish for travel" {...field} disabled={isLoadingSuggestions || !!selectedExistingGoalId} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingSuggestions || !!selectedExistingGoalId}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GOAL_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customTimeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeframe / Deadline</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3 months, By end of year" {...field} disabled={isLoadingSuggestions || !!selectedExistingGoalId} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto" disabled={isLoadingSuggestions || !!selectedExistingGoalId}>
                    {isLoadingSuggestions && form.formState.isSubmitting ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                    Get Suggestions for Custom Goal
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Suggestions Display Area */}
          {isLoadingSuggestions && (
            <div className="flex flex-col items-center justify-center py-10">
              <LoadingSpinner size={40} />
              <p className="mt-3 text-muted-foreground">Generating smart suggestions...</p>
            </div>
          )}
          {suggestionsError && !isLoadingSuggestions && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error Fetching Suggestions</AlertTitle>
              <AlertDescription>{suggestionsError}</AlertDescription>
            </Alert>
          )}
          {smartSuggestions && !isLoadingSuggestions && (
            <Card className="mt-6 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  Suggestions for: {
                    selectedExistingGoalId 
                    ? (goals.find(g=>g.id === selectedExistingGoalId)?.title || goals.find(g=>g.id === selectedExistingGoalId)?.originalGoal)
                    : form.getValues().customTitle
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {renderSuggestionsList("Key Topics to Cover", smartSuggestions.topicsToCover)}
                {smartSuggestions.dailyOrWeeklyTimeSuggestion && (
                  <div>
                    <h4 className="font-semibold text-foreground">Suggested Time Commitment:</h4>
                    <p className="text-muted-foreground text-xs">{smartSuggestions.dailyOrWeeklyTimeSuggestion}</p>
                  </div>
                )}
                {renderSuggestionsList("Sample Projects/Activities", smartSuggestions.sampleProjectsOrActivities)}
                {renderSuggestionsList("Diet & Nutrition Tips", smartSuggestions.dietAndNutritionTips)}
                {renderSuggestionsList("Workout Routine Ideas", smartSuggestions.workoutRoutineIdeas)}
                {renderSuggestionsList("General Tips & Advice", smartSuggestions.generalTips)}
                 {Object.values(smartSuggestions).every(val => val === undefined || (Array.isArray(val) && val.length === 0)) && (
                    <p className="text-muted-foreground">No specific suggestions were generated for this goal type. Try rephrasing or providing more detail.</p>
                )}
              </CardContent>
            </Card>
          )}
           {!isLoadingSuggestions && !smartSuggestions && !suggestionsError && (
                <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                    <p>Select an existing goal or fill out the custom goal form above to get AI-powered suggestions.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

