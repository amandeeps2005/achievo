
"use client";

import type { Goal } from '@/types';
import ActionRoadmap from './action-roadmap';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tag, CalendarDays, Wrench, Target, Lightbulb, Trash2, CalendarPlus, BarChartHorizontalBig, CalendarClock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useGoals } from '@/context/goal-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GoalDetailViewProps {
  goal: Goal;
}

export default function GoalDetailView({ goal }: GoalDetailViewProps) {
  const { deleteGoal } = useGoals();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    deleteGoal(goal.id);
    setIsDeleteDialogOpen(false);
    toast({
        title: "Goal Deleted",
        description: `Goal "${(goal.title || goal.originalGoal).substring(0,30)}..." removed.`,
        variant: "default",
      });
    router.push('/dashboard');
  };

  const handleConnectToCalendar = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "Connecting to your calendar will be available in a future update. This will allow you to sync goal steps and deadlines directly to your preferred calendar application.",
      variant: "default",
      duration: 7000,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.warn("Invalid date string for formatting:", dateString, e);
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-border rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <Target className="w-8 h-8 mr-3 shrink-0" /> {goal.title || goal.originalGoal}
            </CardTitle>
            {goal.progress === 100 && <Badge className="bg-green-500 text-white py-1 px-3 text-sm">Completed!</Badge>}
          </div>
          <CardDescription className="flex items-center text-base text-muted-foreground pt-1">
            <Tag className="w-4 h-4 mr-2" />
            {goal.category}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm font-semibold text-primary">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} aria-label={`${goal.progress}% completed`} className="h-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start p-3 bg-muted/50 rounded-md">
              <CalendarDays className="w-5 h-5 mr-3 mt-1 text-primary shrink-0" />
              <div>
                <strong className="text-foreground">Timeline Summary:</strong>
                <p className="text-muted-foreground">{goal.timeline}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-muted/50 rounded-md">
              <CalendarClock className="w-5 h-5 mr-3 mt-1 text-accent shrink-0" />
              <div>
                <strong className="text-foreground">Overall Deadline:</strong>
                <p className="text-muted-foreground">{goal.overallDeadline ? formatDate(goal.overallDeadline) : 'Not Set'}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-muted/50 rounded-md md:col-span-2">
              <Wrench className="w-5 h-5 mr-3 mt-1 text-primary shrink-0" />
              <div>
                <strong className="text-foreground">Tools & Resources:</strong>
                {goal.tools.length > 0 ? (
                  <ul className="list-disc list-inside text-muted-foreground">
                    {goal.tools.map((tool, idx) => <li key={idx}>{tool}</li>)}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No specific tools listed.</p>
                )}
              </div>
            </div>
          </div>
          {goal.originalGoal && goal.title !== goal.originalGoal && (
             <div className="flex items-start p-3 bg-muted/50 rounded-md">
              <Lightbulb className="w-5 h-5 mr-3 mt-1 text-primary shrink-0" />
              <div>
                <strong className="text-foreground">Original Goal Statement:</strong>
                <p className="text-muted-foreground italic">"{goal.originalGoal}"</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete This Goal
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the goal 
                      "<span className="font-semibold">{goal.title || goal.originalGoal}</span>" 
                      and all its associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Yes, Delete Goal
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
               <Button variant="outline" className="w-full sm:w-auto" onClick={handleConnectToCalendar}>
                <CalendarPlus className="mr-2 h-4 w-4" /> Connect to Calendar
              </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-xl border-border rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/20">
          <CardTitle className="text-2xl font-semibold text-foreground flex items-center">
            <BarChartHorizontalBig className="w-6 h-6 mr-3 text-primary" />
            Action Roadmap
          </CardTitle>
          <CardDescription>Your personalized steps to achieve this goal.</CardDescription>
        </CardHeader>
        <CardContent>
           <ActionRoadmap goal={goal} />
        </CardContent>
      </Card>

      {goal.progress === 100 && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-700 mt-8 shadow-lg">
          <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-700 dark:text-green-300 font-semibold text-lg">Congratulations!</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            You've successfully completed this goal. Amazing work! Time to celebrate and set a new challenge?
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
