
// src/app/my-habits/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import type { Habit } from '@/types';
import { useHabits } from '@/context/habit-context';
import { useAuth } from '@/context/auth-context';
import { PlusCircle, CheckSquare, ArrowLeft, CalendarDays, Eye, X } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription, CardFooter } from '@/components/ui/card';
import HabitForm from '@/components/habits/habit-form';
import HabitItem from '@/components/habits/habit-item';
import { format, startOfMonth, endOfMonth, getDaysInMonth, setDate as setDateOnMonth, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import type { DayProps } from 'react-day-picker';
import * as DayPickerPrimitive from 'react-day-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

// Helper component defined outside MyHabitsPage
interface RenderHabitsListComponentProps {
  habitsLoading: boolean;
  habits: Habit[];
  currentDate: string;
  handleOpenHabitForm: (habit?: Habit) => void;
}

function RenderHabitsListComponent({
  habitsLoading,
  habits,
  currentDate,
  handleOpenHabitForm,
}: RenderHabitsListComponentProps) {
  if (habitsLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 min-h-[200px]">
        <LoadingSpinner size={32} /> <p className="ml-2 mt-3 text-muted-foreground">Loading habits...</p>
      </div>
    );
  }
  
  const activeHabits = habits.filter(h => !h.archived);
  if (activeHabits.length === 0) {
    return (
      <div className="text-center py-12 min-h-[200px] flex flex-col items-center justify-center">
          <CheckSquare className="w-16 h-16 text-primary opacity-30 mb-4" />
          <p className="text-muted-foreground">
          No habits defined yet. Click "Add New Habit" to start building positive routines!
          </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {activeHabits.map(habit => (
        <HabitItem 
          key={habit.id} 
          habit={habit} 
          date={currentDate}
          onEditRequest={() => handleOpenHabitForm(habit)}
        />
      ))}
    </div>
  );
}

interface CustomDayComponentProps extends DayProps {
  heatmapData: Record<string, { completedCount: number; totalTrackedHabits: number }>;
}

// Standalone component for custom day rendering
const CustomDayComponent: React.FC<CustomDayComponentProps> = ({ date, displayMonth, heatmapData, ...props }) => {
    const dayStr = format(date, 'yyyy-MM-dd');
    const dayData = heatmapData[dayStr];
    
    let cellClassName = ""; 
    let tooltipText = format(date, "PPP"); 

    if (date.getMonth() === displayMonth.getMonth()) { 
        if (dayData && dayData.totalTrackedHabits > 0) {
            const completionRatio = dayData.completedCount / dayData.totalTrackedHabits;
            if (completionRatio === 1) {
                cellClassName = "bg-primary text-primary-foreground hover:bg-primary/90";
                tooltipText = `${dayData.completedCount}/${dayData.totalTrackedHabits} habits completed`;
            } else if (completionRatio > 0) {
                cellClassName = "bg-primary/60 text-primary-foreground hover:bg-primary/50";
                tooltipText = `${dayData.completedCount}/${dayData.totalTrackedHabits} habits completed`;
            } else { 
                cellClassName = "bg-muted/50 hover:bg-muted text-muted-foreground";
                tooltipText = `0/${dayData.totalTrackedHabits} habits completed`;
            }
        } else if (dayData && dayData.totalTrackedHabits === 0) {
             tooltipText = "No habits tracked on this day";
        }
    }
    // Days outside current month will use default styling from props.className

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DayPickerPrimitive.Day
                        {...props} // Spreads props like 'className' from DayPicker, 'onClick', 'onKeyDown', etc.
                        date={date}
                        displayMonth={displayMonth}
                        // Merge base props.className with our heatmap styles and explicit rounding/transitions
                        className={cn(props.className, "rounded-md transition-colors relative", cellClassName)} 
                    />
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
const MemoizedCustomDay = React.memo(CustomDayComponent);


export default function MyHabitsPage() {
  const { user, loading: authLoading } = useAuth();
  const { habits, habitLogs, isLoading: habitsLoading } = useHabits();
  const router = useRouter();

  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  // Heatmap will always be shown, manage its display month
  const [heatmapDisplayMonth, setHeatmapDisplayMonth] = useState(new Date());

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "My Habits - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);

  const handleOpenHabitForm = useCallback((habit?: Habit) => {
    setEditingHabit(habit);
    setIsHabitFormOpen(true);
  }, []);

  const handleCloseHabitForm = useCallback(() => {
    setIsHabitFormOpen(false);
    setEditingHabit(undefined);
  }, []);
  
  const heatmapDataForMonth = useMemo(() => {
    const data: Record<string, { completedCount: number; totalTrackedHabits: number }> = {};
    if (!user) return data; // Ensure user is available

    const monthStart = startOfMonth(heatmapDisplayMonth);
    const monthEnd = endOfMonth(heatmapDisplayMonth);
    
    const activeUserHabits = habits.filter(h => !h.archived && h.userId === user.uid);
    if (activeUserHabits.length === 0) return data;

    const userLogsForMonth = habitLogs.filter(log => {
        if (log.userId !== user.uid) return false; // Ensure log belongs to current user
        try {
             const d = parseISO(log.date);
             return d >= monthStart && d <= monthEnd;
        } catch (e) { 
            console.warn("Could not parse log date:", log.date, e);
            return false; 
        }
    });

    for (let dayIndex = 0; dayIndex < getDaysInMonth(heatmapDisplayMonth); dayIndex++) {
        const currentDateIter = setDateOnMonth(heatmapDisplayMonth, dayIndex + 1);
        const currentDateStr = format(currentDateIter, 'yyyy-MM-dd');

        let completedOnDay = 0;
        let trackedOnDay = 0;

        activeUserHabits.forEach(habit => {
            try {
              const habitCreatedAt = parseISO(habit.createdAt);
              // Normalize dates to avoid timezone issues in comparison, comparing only date parts
              const habitCreationDayStart = startOfMonth(habitCreatedAt); // Not ideal, better to compare directly
                                                                        // but ensures we only compare date part roughly
              
              const currentDayStart = startOfMonth(currentDateIter); // Not ideal as above

              // A habit is trackable on currentDateIter if it was created on or before currentDateIter
              if (habitCreatedAt.setHours(0,0,0,0) <= currentDateIter.setHours(0,0,0,0)) { 
                  trackedOnDay++;
                  const log = userLogsForMonth.find(l => l.habitId === habit.id && l.date === currentDateStr);
                  if (log?.completed) {
                      completedOnDay++;
                  }
              }
            } catch (e) {
              console.warn("Could not parse habit createdAt date:", habit.createdAt, e);
            }
        });

        if (trackedOnDay > 0) {
            data[currentDateStr] = { completedCount: completedOnDay, totalTrackedHabits: trackedOnDay };
        }
    }
    return data;
  }, [user, habits, habitLogs, heatmapDisplayMonth]);


  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6 flex justify-start">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-primary/5">
            <div>
                <CardTitle className="text-3xl font-bold text-primary flex items-center">
                    <CheckSquare className="mr-3 h-7 w-7" />
                    My Habits for Today
                </CardTitle>
                <ShadcnCardDescription className="text-primary/80">
                    Track your daily habits and build consistency. Today is {format(new Date(currentDate), "PPP")}.
                </ShadcnCardDescription>
            </div>
            <Button onClick={() => handleOpenHabitForm()} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
                <PlusCircle className="w-5 h-5 mr-2" /> Add New Habit
            </Button>
        </CardHeader>
        <CardContent className="p-6">
          <RenderHabitsListComponent
            habitsLoading={habitsLoading}
            habits={habits}
            currentDate={currentDate}
            handleOpenHabitForm={handleOpenHabitForm}
          />
        </CardContent>
      </Card>

      <Card className="shadow-xl border-primary/20 rounded-xl overflow-hidden mt-8">
          <CardHeader className="p-6 bg-primary/5">
              <CardTitle className="text-2xl font-bold text-primary flex items-center">
                  <CalendarDays className="mr-3 h-6 w-6" />
                  Habit Completion Heatmap
              </CardTitle>
              <ShadcnCardDescription className="text-primary/80">
                  Visualize your habit consistency over the month. Darker means more habits completed.
              </ShadcnCardDescription>
          </CardHeader>
          <CardContent className="p-3 flex flex-col items-center">
              <Calendar
                  mode="single" 
                  month={heatmapDisplayMonth}
                  onMonthChange={setHeatmapDisplayMonth}
                  components={{
                      Day: (dayProps) => <MemoizedCustomDay {...dayProps} heatmapData={heatmapDataForMonth} />,
                  }}
                  className="rounded-md border" 
                  selected={undefined} 
                  onSelect={() => {}} 
                  showOutsideDays
                  fixedWeeks
              />
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-3">
                  <div className="flex items-center"><span className="w-3 h-3 rounded-sm mr-1.5 bg-primary"></span>All Done</div>
                  <div className="flex items-center"><span className="w-3 h-3 rounded-sm mr-1.5 bg-primary/60"></span>Some Done</div>
                  <div className="flex items-center"><span className="w-3 h-3 rounded-sm mr-1.5 bg-muted/50"></span>None Done (Tracked)</div>
              </div>
          </CardContent>
      </Card>
      
      {isHabitFormOpen && (
         <Dialog open={isHabitFormOpen} onOpenChange={(open) => { if(!open) handleCloseHabitForm(); else setIsHabitFormOpen(true);}}>
            <DialogContent className="sm:max-w-lg w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                    <CheckSquare className="w-6 h-6 mr-2 text-primary" />
                    {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                    </DialogTitle>
                    <DialogDescription>
                    {editingHabit ? 'Update the details of your habit.' : 'Define a new daily habit to track.'}
                    </DialogDescription>
                </DialogHeader>
                <HabitForm
                    existingHabit={editingHabit}
                    onSave={handleCloseHabitForm}
                />
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}

