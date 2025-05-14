
// src/app/my-habits/page.tsx
"use client";

import { useState, useEffect } from 'react';
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
import { PlusCircle, CheckSquare, ArrowLeft, Edit3, Trash2, CalendarDays } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription, CardFooter } from '@/components/ui/card';
import HabitForm from '@/components/habits/habit-form';
import HabitItem from '@/components/habits/habit-item';
import { format } from 'date-fns';

export default function MyHabitsPage() {
  const { user, loading: authLoading } = useAuth();
  const { habits, isLoading: habitsLoading } = useHabits();
  const router = useRouter();

  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "My Habits - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);

  const handleOpenHabitForm = (habit?: Habit) => {
    setEditingHabit(habit);
    setIsHabitFormOpen(true);
  };

  const handleCloseHabitForm = () => {
    setIsHabitFormOpen(false);
    setEditingHabit(undefined);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  const renderHabitsList = () => {
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
  };

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
                    My Habits
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
          {/* Placeholder for date navigation - Future Feature */}
          {/* <div className="mb-4 flex justify-center items-center">
            <Button variant="outline" size="icon" onClick={() => {/* Decrement date */}}><ChevronLeft /></Button>
            <span className="mx-4 font-semibold text-lg">{format(new Date(currentDate), "PPP")}</span>
            <Button variant="outline" size="icon" onClick={() => {/* Increment date */}}><ChevronRight /></Button>
          </div> */}
          {renderHabitsList()}
        </CardContent>
        <CardFooter className="p-6 bg-muted/20 border-t border-border justify-center">
             <Button variant="outline" className="w-full sm:w-auto">
                <CalendarDays className="mr-2 h-4 w-4" /> View Calendar & Stats (Coming Soon)
            </Button>
        </CardFooter>
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
