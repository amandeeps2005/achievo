"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateGoalPlan, type GenerateGoalPlanResult } from '@/app/actions';
import type { GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';
import { useGoals } from '@/context/goal-context';
import type { Goal, StepUi } from '@/types';
import { Info, ListChecks, CalendarDays, Wrench, CheckCircle, Lightbulb } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  goalDescription: z.string().min(10, "Goal description must be at least 10 characters.").max(500, "Goal description must be at most 500 characters."),
});
type FormData = z.infer<typeof formSchema>;

export default function GoalSetupForm() {
  const router = useRouter();
  const { user } = useAuth(); // Get the authenticated user from context
  const [apiError, setApiError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GoalDecompositionOutput | null>(null);
  const [isGlobalLoading, setGlobalLoading] = useState(false); // Define isGlobalLoading state
  const { addGoal } = useGoals();


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setGlobalLoading(true);
    setApiError(null);
    setGeneratedPlan(null);

    const result: GenerateGoalPlanResult = await generateGoalPlan({ goal: data.goalDescription });
    
    if (result.error || !result.data) {
      setApiError(result.error || 'An unknown error occurred.');
    } else {
      setGeneratedPlan(result.data);
    }
    setGlobalLoading(false);
  };

  const handleSaveGoal = () => {
    if (!generatedPlan || !form.getValues().goalDescription || !user) {
      // Optionally show an error if user is not logged in, though the page should be protected
      console.error("Cannot save goal: plan not generated, description missing, or user not authenticated.");
      return;
    }
    setGlobalLoading(true); // Add loading state for saving
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      originalGoal: form.getValues().goalDescription,
      category: generatedPlan.category,
      timeline: generatedPlan.timeline,
      tools: generatedPlan.tools,
      steps: generatedPlan.steps.map((step, index): StepUi => ({
        ...step,
        id: crypto.randomUUID(),
        completed: false,
      })),
      userId: user.uid, // Associate goal with the user
      createdAt: new Date().toISOString(),
      progress: 0, // Will be calculated in context
    };
     newGoal.title = newGoal.originalGoal.substring(0, 50) + (newGoal.originalGoal.length > 50 ? '...' : ''); // Simple title based on original goal
    addGoal(newGoal);
    setGlobalLoading(false); // Reset loading state
    router.push(`/goal/${newGoal.id}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Create New Goal</CardTitle>
        <CardDescription>Let's break down your ambition into actionable steps. What do you want to achieve?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="goalDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="goalDescription" className="text-lg">Your Goal</FormLabel>
                  <FormControl>
                    <Textarea
                      id="goalDescription"
                      placeholder="e.g., 'Learn Python for data analysis in 3 months' or 'Run a 5K marathon'"
                      {...field}
                      rows={4}
                      className="text-base"
                      disabled={isGlobalLoading || !!generatedPlan}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {!generatedPlan && (
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isGlobalLoading}>
                {isGlobalLoading ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Generate Plan
              </Button>
            )}
          </form>
        </Form>

        {isGlobalLoading && !generatedPlan && (
          <div className="mt-6 text-center">
            <LoadingSpinner size={32} />
            <p className="mt-2 text-muted-foreground">Our AI is crafting your plan...</p>
          </div>
        )}

        {generatedPlan && !isGlobalLoading && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-500">
            <Alert variant="default" className="bg-teal-50 border-teal-200 dark:bg-teal-900 dark:border-teal-700">
              <CheckCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary font-semibold">Your Plan is Ready!</AlertTitle>
              <AlertDescription>
                Review the generated plan below. If it looks good, save your goal to start tracking.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 p-4 border rounded-lg bg-background/50">
              <h3 className="text-xl font-semibold text-foreground">Plan Overview</h3>
              <p><strong className="text-primary">Category:</strong> {generatedPlan.category}</p>
              <p><CalendarDays className="inline mr-2 h-4 w-4 text-primary" /> <strong className="text-primary">Timeline:</strong> {generatedPlan.timeline}</p>
              <div>
                <p><Wrench className="inline mr-2 h-4 w-4 text-primary" /> <strong className="text-primary">Tools Needed:</strong></p>
                <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground">
                  {generatedPlan.tools.map((tool, idx) => <li key={idx}>{tool}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4 p-4 border rounded-lg bg-background/50">
              <h3 className="text-xl font-semibold text-foreground">Actionable Steps <ListChecks className="inline ml-2 h-5 w-5 text-primary" /></h3>
              <ul className="space-y-3">
                {generatedPlan.steps.map((step, idx) => (
                  <li key={idx} className="p-3 border rounded-md bg-card shadow-sm">
                    <p className="font-medium text-foreground">{idx + 1}. {step.description}</p>
                    {step.deadline && <p className="text-xs text-muted-foreground"><CalendarDays className="inline mr-1 h-3 w-3" /> Deadline: {step.deadline}</p>}
                    {step.resources && step.resources.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mt-1">Resources:</p>
                        <ul className="list-disc list-inside ml-4 text-xs text-muted-foreground">
                          {step.resources.map((res, rIdx) => <li key={rIdx} className="truncate" title={res}>{res}</li>)}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      {generatedPlan && ( // Show footer buttons if plan is generated, irrespective of loading state for the buttons themselves.
        <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setGeneratedPlan(null); form.reset(); setApiError(null); }} className="w-full sm:w-auto" disabled={isGlobalLoading}>
              Reset & Edit Goal
            </Button>
            <Button onClick={handleSaveGoal} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isGlobalLoading}>
             {isGlobalLoading ? <LoadingSpinner className="mr-2" /> :  <CheckCircle className="mr-2 h-4 w-4" />}
              Save Goal & Start Tracking
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
