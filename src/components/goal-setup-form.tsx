
"use client";

import { useState, useEffect } from 'react';
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
import { Info, ListChecks, CalendarDays, Wrench, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  goalDescription: z.string().min(10, "Goal description must be at least 10 characters.").max(500, "Goal description must be at most 500 characters."),
});
type FormData = z.infer<typeof formSchema>;

export default function GoalSetupForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GoalDecompositionOutput | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const { addGoal } = useGoals();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalDescription: '',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/'); // Redirect to landing page if not authenticated
    }
  }, [user, authLoading]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsGeneratingPlan(true);
    setApiError(null);
    setGeneratedPlan(null);

    const result: GenerateGoalPlanResult = await generateGoalPlan({ goal: data.goalDescription });
    
    if (result.error || !result.data) {
      setApiError(result.error || 'An unknown error occurred.');
    } else {
      setGeneratedPlan(result.data);
    }
    setIsGeneratingPlan(false);
  };

  const handleSaveGoal = () => {
    if (!generatedPlan || !form.getValues().goalDescription || !user) {
      console.error("Cannot save goal: plan not generated, description missing, or user not authenticated.");
      setApiError("Could not save goal. Please ensure you are logged in and a plan is generated.");
      return;
    }
    setIsSavingGoal(true);
    
    const goalDescription = form.getValues().goalDescription;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      originalGoal: goalDescription,
      title: goalDescription.substring(0, 70) + (goalDescription.length > 70 ? '...' : ''), // Title generation updated here
      category: generatedPlan.category,
      timeline: generatedPlan.timeline,
      overallDeadline: generatedPlan.overallDeadline, 
      tools: generatedPlan.tools,
      steps: generatedPlan.steps.map((step): StepUi => ({
        ...step,
        id: crypto.randomUUID(),
        completed: false,
      })),
      userId: user.uid, 
      createdAt: new Date().toISOString(),
      progress: 0,
    };
    
    addGoal(newGoal);
    setIsSavingGoal(false);
    router.push(`/goal/${newGoal.id}`);
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
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-primary/20">
      <CardHeader className="bg-primary/5 p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Craft Your Next Big Achievement</CardTitle>
            <CardDescription className="text-primary/80">Tell us your aspiration, and our AI will help you chart the course.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="goalDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="goalDescription" className="text-lg font-semibold text-foreground">What's Your Goal?</FormLabel>
                  <FormControl>
                    <Textarea
                      id="goalDescription"
                      placeholder="e.g., 'Launch a new SaaS product by end of year' or 'Complete a full-stack web development bootcamp'"
                      {...field}
                      rows={5}
                      className="text-base border-muted-foreground/50 focus:border-primary focus:ring-primary/50 transition-all duration-300"
                      disabled={isGeneratingPlan || !!generatedPlan || isSavingGoal}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
                <Info className="h-5 w-5" />
                <AlertTitle>Oops! Something went wrong.</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {!generatedPlan && (
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300" 
                disabled={isGeneratingPlan || isSavingGoal}
              >
                {isGeneratingPlan ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-5 w-5" />}
                {isGeneratingPlan ? 'Generating Your Roadmap...' : 'Generate Smart Plan'}
              </Button>
            )}
          </form>
        </Form>

        {isGeneratingPlan && (
          <div className="mt-6 text-center py-10">
            <LoadingSpinner size={48} />
            <p className="mt-4 text-lg text-muted-foreground animate-pulse">Our AI is crafting your personalized plan...</p>
            <p className="text-sm text-muted-foreground/70">This might take a moment.</p>
          </div>
        )}

        {generatedPlan && !isGeneratingPlan && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-700">
            <Alert variant="default" className="bg-teal-500/10 border-teal-500/30 text-teal-700 dark:bg-teal-600/20 dark:border-teal-500/50 dark:text-teal-300 rounded-lg">
              <CheckCircle className="h-6 w-6" />
              <AlertTitle className="font-semibold text-lg">Your AI-Generated Plan is Ready!</AlertTitle>
              <AlertDescription>
                Review the detailed roadmap below. If it aligns with your vision, save it to begin your journey.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 p-6 border border-border rounded-lg bg-card shadow-sm">
              <h3 className="text-xl font-semibold text-primary flex items-center"><Info className="w-5 h-5 mr-2" />Plan Overview</h3>
              <p><strong className="text-foreground">Category:</strong> <span className="text-muted-foreground">{generatedPlan.category}</span></p>
              <div className="flex items-start">
                <CalendarDays className="inline mr-2 h-4 w-4 text-primary mt-1 flex-shrink-0" /> 
                <p><strong className="text-foreground">Timeline:</strong> <span className="text-muted-foreground">{generatedPlan.timeline}</span></p>
              </div>
               {generatedPlan.overallDeadline && (
                <div className="flex items-start">
                  <CalendarDays className="inline mr-2 h-4 w-4 text-accent mt-1 flex-shrink-0" />
                  <p><strong className="text-foreground">Overall Deadline:</strong> <span className="text-muted-foreground">{generatedPlan.overallDeadline}</span></p>
                </div>
              )}
              {generatedPlan.tools.length > 0 && (
                <div>
                  <p className="flex items-center"><Wrench className="inline mr-2 h-4 w-4 text-primary flex-shrink-0" /> <strong className="text-foreground">Tools &amp; Resources:</strong></p>
                  <ul className="list-disc list-inside ml-6 text-sm text-muted-foreground space-y-1 mt-1">
                    {generatedPlan.tools.map((tool, idx) => <li key={idx}>{tool}</li>)}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-4 p-6 border border-border rounded-lg bg-card shadow-sm">
              <h3 className="text-xl font-semibold text-primary flex items-center"><ListChecks className="inline mr-2 h-5 w-5" />Actionable Steps</h3>
              <ul className="space-y-3 divide-y divide-border">
                {generatedPlan.steps.map((step, idx) => (
                  <li key={idx} className="p-4 first:pt-0 last:pb-0">
                    <p className="font-semibold text-foreground text-base">{idx + 1}. {step.description}</p>
                    {step.deadline && <p className="text-xs text-muted-foreground mt-1"><CalendarDays className="inline mr-1 h-3 w-3" /> Deadline: {step.deadline}</p>}
                     {step.startDate && <p className="text-xs text-muted-foreground"><CalendarDays className="inline mr-1 h-3 w-3" /> Start: {step.startDate}</p>}
                     {step.endDate && <p className="text-xs text-muted-foreground"><CalendarDays className="inline mr-1 h-3 w-3" /> End: {step.endDate}</p>}
                     {step.repeatInterval && <p className="text-xs text-muted-foreground">Repeat: {step.repeatInterval.charAt(0).toUpperCase() + step.repeatInterval.slice(1)}</p>}
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground font-medium">Helpful Resources:</p>
                        <ul className="list-disc list-inside ml-4 text-xs text-muted-foreground/80 space-y-0.5">
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
      {generatedPlan && !isGeneratingPlan && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 bg-primary/5 rounded-b-lg border-t border-primary/10">
            <Button 
              variant="outline" 
              onClick={() => { setGeneratedPlan(null); form.reset(); setApiError(null); }} 
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/20 py-3 text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-300" 
              disabled={isSavingGoal}
            >
              Edit Goal & Regenerate
            </Button>
            <Button 
              onClick={handleSaveGoal} 
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300" 
              disabled={isSavingGoal}
            >
             {isSavingGoal ? <LoadingSpinner className="mr-2" /> :  <CheckCircle className="mr-2 h-5 w-5" />}
              {isSavingGoal ? 'Saving Your Goal...' : 'Save & Start Achieving'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}

