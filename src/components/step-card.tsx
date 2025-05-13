"use client";

import type { StepUi } from '@/types';
import { useGoals } from '@/context/goal-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Link as LinkIcon, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

  return (
    <Card className={`transition-all duration-300 ${step.completed ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 opacity-70' : 'bg-card'}`}>
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Checkbox
          id={`step-${step.id}`}
          checked={step.completed}
          onCheckedChange={handleCheckedChange}
          aria-label={`Mark step ${stepNumber} as ${step.completed ? 'incomplete' : 'complete'}`}
          className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="flex-1">
          <Label htmlFor={`step-${step.id}`} className="cursor-pointer">
            <CardTitle className={`text-lg font-medium ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
               {step.description}
            </CardTitle>
          </Label>
          {step.deadline && (
            <CardDescription className="text-xs mt-1 flex items-center">
              <CalendarDays className="w-3 h-3 mr-1.5" />
              Deadline: {step.deadline}
              {new Date(step.deadline) < new Date() && !step.completed && (
                <Badge variant="destructive" className="ml-2">Overdue</Badge>
              )}
            </CardDescription>
          )}
        </div>
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
                <ul className="list-none space-y-1 pl-0">
                  {step.resources.map((resource, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-center">
                      <LinkIcon className="w-3 h-3 mr-1.5 shrink-0" />
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
