
"use client";

import type { StepUi } from '@/types';
import { useGoals } from '@/context/goal-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Link as LinkIcon, Info, Bell, Repeat, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

interface StepCardProps {
  step: StepUi;
  goalId: string;
  stepNumber: number;
}

export default function StepCard({ step, goalId, stepNumber }: StepCardProps) {
  const { updateStepCompletion, setStepReminder } = useGoals();
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    step.reminderDateTime ? parseISO(step.reminderDateTime) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    step.reminderDateTime ? format(parseISO(step.reminderDateTime), "HH:mm") : "09:00"
  );

  useEffect(() => {
    if (step.reminderDateTime) {
      const reminderDate = parseISO(step.reminderDateTime);
      setSelectedDate(reminderDate);
      setSelectedTime(format(reminderDate, "HH:mm"));
    } else {
      setSelectedDate(undefined);
      setSelectedTime("09:00"); // Default time if no reminder
    }
  }, [step.reminderDateTime]);


  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      updateStepCompletion(goalId, step.id, checked);
    }
  };

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatReminderDateTime = (isoString?: string) => {
    if (!isoString) return "Not set";
    try {
      return format(parseISO(isoString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };


  const handleSaveReminder = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const reminderDateTime = new Date(selectedDate);
      reminderDateTime.setHours(hours, minutes, 0, 0);
      setStepReminder(goalId, step.id, reminderDateTime.toISOString());
    } else {
      // This case should ideally be prevented by disabling save button if date/time not set
      setStepReminder(goalId, step.id, null); 
    }
    setIsReminderDialogOpen(false);
  };

  const handleClearReminder = () => {
    setStepReminder(goalId, step.id, null);
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setIsReminderDialogOpen(false);
  };

  return (
    <>
      <Card className={`transition-all duration-300 rounded-xl border ${step.completed ? 'bg-green-800/40 dark:bg-green-800/30 border-green-600 dark:border-green-500' : 'bg-card shadow-lg hover:shadow-xl border-border hover:border-primary/20'}`}>
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
              <CardTitle className={`text-lg font-medium ${step.completed ? 'line-through text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                {step.description}
              </CardTitle>
            </Label>
            <div className="mt-1.5 space-y-1">
              {step.deadline && (
                <CardDescription className="text-xs flex items-center text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                  Deadline: {formatDateDisplay(step.deadline)}
                  {new Date(step.deadline) < new Date() && !step.completed && (
                    <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0.5">Overdue</Badge>
                  )}
                </CardDescription>
              )}
              {step.startDate && (
                <CardDescription className="text-xs flex items-center text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                  Start: {formatDateDisplay(step.startDate)}
                </CardDescription>
              )}
              {step.endDate && step.repeatInterval && (
                <CardDescription className="text-xs flex items-center text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                  End: {formatDateDisplay(step.endDate)}
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
                <Button variant="ghost" size="icon" className={`h-8 w-8 text-muted-foreground hover:text-primary ${step.reminderDateTime ? 'text-accent' : ''}`} onClick={() => setIsReminderDialogOpen(true)}>
                  <Bell className={`w-4 h-4 ${step.reminderDateTime ? 'fill-accent' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{step.reminderDateTime ? `Reminder: ${formatReminderDateTime(step.reminderDateTime)}` : "Set Reminder"}</p>
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

      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Set Reminder for Step</DialogTitle>
            <DialogDescription>
              {step.description.length > 70 ? step.description.substring(0,70) + "..." : step.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reminder-date" className="text-sm font-medium">Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mt-1 p-0"
                initialFocus
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
              />
            </div>
            <div>
              <Label htmlFor="reminder-time" className="text-sm font-medium">Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="mt-1"
              />
            </div>
            {step.reminderDateTime && (
                <p className="text-xs text-muted-foreground">
                    Current reminder: {formatReminderDateTime(step.reminderDateTime)}
                </p>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="destructive" onClick={handleClearReminder} disabled={!step.reminderDateTime}>
              Clear Reminder
            </Button>
            <div className="flex space-x-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                    Cancel
                    </Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveReminder} disabled={!selectedDate || !selectedTime}>
                    Save Reminder
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
