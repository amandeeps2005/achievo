
"use client";

import type { StepUi } from '@/types';
import { useGoals } from '@/context/goal-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Link as LinkIcon, Info, Bell, Repeat } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StepCardProps {
  step: StepUi;
  goalId: string;
  stepNumber: number;
}

export default function StepCard({ step, goalId, stepNumber }: StepCardProps) {
  const { updateStepCompletion } = useGoals();

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      updateStepCompletion(goalId, step.id, checked);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.warn("Invalid date string for formatting:", dateString, e);
      return dateString;
    }
  };

  return (
    <Card className={`transition-all duration-300 rounded-xl border ${step.completed ? 'bg-green-800/40 border-green-600' : 'bg-card shadow-lg hover:shadow-xl border-border hover:border-primary/20'}`}>
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Checkbox
          id={`step-${step.id}`}
          checked={step.completed}
          onCheckedChange={handleCheckedChange}
          aria-label={`Mark step ${stepNumber} as ${step.completed ? 'incomplete' : 'complete'}`}
          className="mt-1.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="flex-1">
          <Label htmlFor={`step-${step.id}`} className="cursor-pointer">
            <CardTitle className={`text-lg font-medium ${step.completed ? 'line-through text-green-400' : 'text-foreground'}`}>
               {step.description}
            </CardTitle>
          </Label>
          <div className="mt-1.5 space-y-1">
            {step.deadline && (
              <CardDescription className="text-xs flex items-center text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                Deadline: {formatDate(step.deadline)}
                {new Date(step.deadline) < new Date() && !step.completed && (
                  <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0.5">Overdue</Badge>
                )}
              </CardDescription>
            )}
            {step.startDate && (
              <CardDescription className="text-xs flex items-center text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                Start: {formatDate(step.startDate)}
              </CardDescription>
            )}
            {step.endDate && step.repeatInterval && ( 
              <CardDescription className="text-xs flex items-center text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                End: {formatDate(step.endDate)}
              </CardDescription>
            )}
            {step.repeatInterval && (
              <CardDescription className="text-xs flex items-center text-muted-foreground">
                <Repeat className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                Repeat: {step.repeatInterval.charAt(0).toUpperCase() + step.repeatInterval.slice(1)}
              </CardDescription>
            )}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => alert('Reminder functionality coming soon!')}>
                <Bell className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Set Reminder (Coming Soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      {(step.resources && step.resources.length > 0) && (
        <CardContent className="p-4 pt-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="resources" className="border-b-0">
              <AccordionTrigger className="text-sm py-2 hover:no-underline [&[data-state=open]>svg]:text-primary">
                <div className="flex items-center text-muted-foreground">
                  <Info className="w-4 h-4 mr-2" /> Resources ({step.resources.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <ul className="list-none space-y-1.5 pl-0">
                  {step.resources.map((resource, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-center">
                      <LinkIcon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      {resource.startsWith('http') ? (
                        <a href={resource} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline truncate" title={resource}>
                          {resource}
                        </a>
                      ) : (
                        <span className="truncate" title={resource}>{resource}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      )}
    </Card>
  );
}
