
// src/components/habits/habit-item.tsx
"use client";

import type { Habit, HabitLog } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Edit3, Trash2, CheckSquare } from 'lucide-react';
import { useHabits } from '@/context/habit-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

interface HabitItemProps {
  habit: Habit;
  date: string; // YYYY-MM-DD for which to log completion
  onEditRequest: (habit: Habit) => void;
}

export default function HabitItem({ habit, date, onEditRequest }: HabitItemProps) {
  const { deleteHabit, logHabitCompletion, getLogForHabitOnDate } = useHabits();
  
  const [isChecked, setIsChecked] = useState(false);
  
  useEffect(() => {
    const log = getLogForHabitOnDate(habit.id, date);
    setIsChecked(log?.completed || false);
  }, [habit.id, date, getLogForHabitOnDate]);

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setIsChecked(checked);
      logHabitCompletion(habit.id, date, checked);
    }
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
  };

  const timeSinceCreation = formatDistanceToNowStrict(new Date(habit.createdAt), { addSuffix: true });

  return (
    <Card className={`transition-all duration-300 ${isChecked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-600 opacity-90' : 'bg-card shadow-sm hover:shadow-md'}`}>
      <CardHeader className="pb-2 pt-3 px-4">
         <div className="flex items-start space-x-3">
            <Checkbox
                id={`habit-${habit.id}-${date}`}
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
                aria-label={`Mark habit "${habit.name}" as ${isChecked ? 'not done' : 'done'} for ${date}`}
                className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
             />
            <div className="flex-1">
                <Label htmlFor={`habit-${habit.id}-${date}`} className="cursor-pointer">
                    <CardTitle className={`text-md font-medium ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {habit.name}
                    </CardTitle>
                </Label>
                {habit.description && (
                    <CardDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {habit.description}
                    </CardDescription>
                )}
            </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center pt-2 pb-3 px-4">
        <p className="text-xs text-muted-foreground">
            <CheckSquare className="w-3 h-3 mr-1 inline-block" />
            Tracking for {timeSinceCreation}
        </p>
        <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEditRequest(habit)} className="h-7 w-7">
                <Edit3 className="w-4 h-4" />
            </Button>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the habit "<span className="font-semibold">{habit.name}</span>" and all its tracking data.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete Habit
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
