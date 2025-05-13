"use client";

import Link from 'next/link';
import type { Goal } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, CheckCircle2, ListChecks, Tag } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const completedSteps = goal.steps.filter(step => step.completed).length;
  const totalSteps = goal.steps.length;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary truncate">
          {goal.title || goal.originalGoal}
        </CardTitle>
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
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full group">
          <Link href={`/goal/${goal.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
