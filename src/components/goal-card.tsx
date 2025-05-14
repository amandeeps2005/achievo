
"use client";

import Link from 'next/link';
import type { Goal } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarDays, ListChecks, Tag, Trash2 } from 'lucide-react';
import { useGoals } from '@/context/goal-context';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const { deleteGoal } = useGoals();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const completedSteps = goal.steps.filter(step => step.completed).length;
  const totalSteps = goal.steps.length;

  const handleDelete = () => {
    deleteGoal(goal.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl border border-border hover:border-primary/30">
      <CardHeader className="bg-muted/20">
        <Link href={`/goal/${goal.id}`} passHref legacyBehavior>
          <a className="cursor-pointer hover:underline" aria-label={`View goal: ${goal.title || goal.originalGoal}`}>
            <CardTitle className="text-xl font-semibold text-primary truncate">
              {goal.title || goal.originalGoal}
            </CardTitle>
          </a>
        </Link>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <Tag className="w-4 h-4 mr-2" />
          {goal.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm font-semibold text-primary">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} aria-label={`${goal.progress}% completed`} className="h-3" />
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <ListChecks className="w-4 h-4 mr-2 text-primary" />
            <span>{completedSteps} / {totalSteps} steps completed</span>
          </div>
          {goal.timeline && (
             <div className="text-sm text-muted-foreground flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                <span className="truncate" title={goal.timeline}>{goal.timeline}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center pt-4">
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the goal titled "<span className="font-semibold">{goal.title || goal.originalGoal}</span>" and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
