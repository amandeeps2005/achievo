
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
import { Label } from '@/components/ui/label'; // Not directly used but good to keep for Shadcn consistency
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoadingSpinner from '@/components/loading-spinner';
import { ArrowLeft, Brain, Lightbulb, Save } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { useGoals } from '@/context/goal-context';
import type { Goal } from '@/types';
import type { SmartSuggestionsOutput } from '@/ai/flows/smart-suggestions-flow';
import { getSmartSuggestions, type GenerateSmartSuggestionsResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useJournal } from '@/context/journal-context'; // Import useJournal

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
  const { addJournalEntry } = useJournal(); // Get addJournalEntry function
  const router = useRouter();
  const { toast } = useToast();

  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestionsOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [loadedFromGoalId, setLoadedFromGoalId] = useState<string | undefined>(undefined);
  const [isSavingToJournal, setIsSavingToJournal] = useState(false); // State for saving to journal


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

  const handleFetchSuggestions = async (data: CustomGoalFormData) => {
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    setSmartSuggestions(null);

    const inputForAI = {
      goalTitle: data.customTitle,
      category: data.customCategory,
      timeframe: data.customTimeframe,
    };

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
  
  const onFormSubmit: SubmitHandler<CustomGoalFormData> = (data) => {
    handleFetchSuggestions(data);
  };

  const handleLoadFromExistingGoal = (goalId: string) => {
    if (goalId === "none") {
        form.reset({ customTitle: "", customCategory: "", customTimeframe: "" });
        setLoadedFromGoalId(undefined);
        setSmartSuggestions(null); // Clear previous suggestions if any
        setSuggestionsError(null);
    } else {
        const existingGoal = goals.find(g => g.id === goalId);
        if (existingGoal) {
           form.reset({
             customTitle: existingGoal.title || existingGoal.originalGoal,
             customCategory: existingGoal.category,
             customTimeframe: existingGoal.overallDeadline || existingGoal.timeline,
           });
           setLoadedFromGoalId(goalId);
           setSmartSuggestions(null); // Clear previous suggestions
           setSuggestionsError(null);
        }
    }
  };

  const formatSuggestionsForJournal = (
    suggestions: SmartSuggestionsOutput,
    goalData: CustomGoalFormData
  ): string => {
    let content = `## Smart Suggestions for: ${goalData.customTitle}\n\n`;
    content += `**Goal Category:** ${goalData.customCategory}\n`;
    content += `**Timeframe:** ${goalData.customTimeframe}\n\n`;
    content += "---\n\n";
  
    const formatList = (title: string, items?: string[]): string => {
      const validItems = items?.filter(item => typeof item === 'string' && item.trim() !== "");
      if (!validItems || validItems.length === 0) return "";
      let listContent = `**${title}:**\n`;
      validItems.forEach(item => {
        listContent += `- ${item}\n`;
      });
      return listContent + "\n";
    };
  
    content += formatList("Key Topics to Cover", suggestions.topicsToCover);
    if (suggestions.dailyOrWeeklyTimeSuggestion && suggestions.dailyOrWeeklyTimeSuggestion.trim() !== "") {
      content += `**Suggested Time Commitment:**\n${suggestions.dailyOrWeeklyTimeSuggestion}\n\n`;
    }
    content += formatList("Sample Projects/Activities", suggestions.sampleProjectsOrActivities);
    content += formatList("Diet & Nutrition Tips", suggestions.dietAndNutritionTips);
    content += formatList("Workout Routine Ideas", suggestions.workoutRoutineIdeas);
    content += formatList("General Tips & Advice", suggestions.generalTips);
  
    return content.trim();
  };

  const handleSaveSuggestionsToJournal = async () => {
    if (!smartSuggestions || !user) {
        toast({
            title: "Cannot Save",
            description: "No suggestions to save or user not logged in.",
            variant: "destructive",
        });
        return;
    }
    setIsSavingToJournal(true);
    try {
        const goalData = form.getValues();
        const journalTitle = `Smart Suggestions for: ${goalData.customTitle.substring(0,50)}${goalData.customTitle.length > 50 ? '...' : ''}`;
        const journalContent = formatSuggestionsForJournal(smartSuggestions, goalData);
        
        addJournalEntry({
            title: journalTitle,
            content: journalContent,
            goalId: loadedFromGoalId, // Will be undefined if custom goal, which is correct
        });

        toast({
            title: "Saved to Journal",
            description: `Suggestions for "${goalData.customTitle.substring(0,30)}..." have been saved to your journal.`,
        });

    } catch (error) {
        console.error("Error saving suggestions to journal:", error);
        toast({
            title: "Save Failed",
            description: "Could not save suggestions to journal. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSavingToJournal(false);
    }
  };


  const renderSuggestionsList = (title: string, items?: string[]) => {
    const validItems = items?.filter(item => typeof item === 'string' && item.trim() !== "");
    if (!validItems || validItems.length === 0) {
      return null; 
    }

    return (
      <div className="mt-3">
        <h4 className="font-semibold text-foreground text-sm">{title}:</h4>
        <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1 pl-4">
          {validItems.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    );
  };
  
  const allSuggestionsEmpty = (suggestions: SmartSuggestionsOutput | null): boolean => {
    if (!suggestions) return true;
    return Object.values(suggestions).every(value => {
      if (value === undefined || value === null) return true;
      if (typeof value === 'string') return value.trim() === ""; 
      if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string' && item.trim() !== "").length === 0;
      }
      return false; 
    });
  };


  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  const noSuggestionsAvailable = allSuggestionsEmpty(smartSuggestions);

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
            Get AI-powered tips for your goals. You can load details from an existing goal or enter them manually.
          </ShadcnCardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Define Your Goal</CardTitle>
              <ShadcnCardDescription>Describe your goal to get suggestions. You can load details from an existing goal.</ShadcnCardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                  
                  <FormItem>
                    <FormLabel>Load from Existing Goal (Optional)</FormLabel>
                    <Select
                      onValueChange={handleLoadFromExistingGoal}
                      value={loadedFromGoalId || "none"}
                      disabled={goalsLoading || isLoadingSuggestions || goals.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={goals.length > 0 ? "Select from your goals to pre-fill..." : "No existing goals to load from."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <RadixSelectLabel>Your Goals</RadixSelectLabel>
                          <SelectItem value="none">-- Select a Goal to Pre-fill --</SelectItem>
                          {goals.map((goal: Goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.title || goal.originalGoal}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {goals.length === 0 && !goalsLoading && <p className="text-xs text-muted-foreground mt-2">You don't have any saved goals yet. Please enter goal details manually below.</p>}
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="customTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title / Objective</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Learn Spanish for travel" {...field} disabled={isLoadingSuggestions} />
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingSuggestions}>
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
                          <Input placeholder="e.g., 3 months, By end of year, YYYY-MM-DD" {...field} disabled={isLoadingSuggestions} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto" disabled={isLoadingSuggestions}>
                    {isLoadingSuggestions ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                    Get Suggestions
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
                  Suggestions for: {form.getValues().customTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {renderSuggestionsList("Key Topics to Cover", smartSuggestions.topicsToCover)}
                {smartSuggestions.dailyOrWeeklyTimeSuggestion && smartSuggestions.dailyOrWeeklyTimeSuggestion.trim() !== "" && (
                  <div>
                    <h4 className="font-semibold text-foreground">Suggested Time Commitment:</h4>
                    <p className="text-muted-foreground text-xs">{smartSuggestions.dailyOrWeeklyTimeSuggestion}</p>
                  </div>
                )}
                {renderSuggestionsList("Sample Projects/Activities", smartSuggestions.sampleProjectsOrActivities)}
                {renderSuggestionsList("Diet & Nutrition Tips", smartSuggestions.dietAndNutritionTips)}
                {renderSuggestionsList("Workout Routine Ideas", smartSuggestions.workoutRoutineIdeas)}
                {renderSuggestionsList("General Tips & Advice", smartSuggestions.generalTips)}
                 {noSuggestionsAvailable && (
                    <p className="text-muted-foreground">No specific suggestions were generated for this goal type. Try rephrasing or providing more detail.</p>
                )}
              </CardContent>
              {!noSuggestionsAvailable && (
                <CardFooter className="p-4 border-t border-border">
                    <Button 
                        onClick={handleSaveSuggestionsToJournal} 
                        disabled={isSavingToJournal}
                        className="w-full sm:w-auto"
                        variant="outline"
                    >
                        {isSavingToJournal ? <LoadingSpinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSavingToJournal ? 'Saving to Journal...' : 'Save as Journal Entry'}
                    </Button>
                </CardFooter>
              )}
            </Card>
          )}
           {!isLoadingSuggestions && !smartSuggestions && !suggestionsError && (
                <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                    <p>Fill out the goal form above and click "Get Suggestions" to receive AI-powered advice.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

