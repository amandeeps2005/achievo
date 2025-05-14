
// src/components/habits/habit-form.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription, FormLabel } from '@/components/ui/form';
import type { Habit } from '@/types';
import { useHabits } from '@/context/habit-context';

const MAX_HABIT_NAME_LENGTH = 100;
const MAX_HABIT_DESC_LENGTH = 200;

const habitFormSchema = z.object({
  name: z.string().min(3, "Habit name must be at least 3 characters.").max(MAX_HABIT_NAME_LENGTH, `Name too long (max ${MAX_HABIT_NAME_LENGTH} chars).`),
  description: z.string().max(MAX_HABIT_DESC_LENGTH, `Description too long (max ${MAX_HABIT_DESC_LENGTH} chars).`).optional(),
  // color: z.string().optional(), // For future color picker
});

type HabitFormData = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  existingHabit?: Habit;
  onSave: () => void; 
}

export default function HabitForm({ existingHabit, onSave }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabits();

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: existingHabit?.name || "",
      description: existingHabit?.description || "",
      // color: existingHabit?.color || undefined,
    },
  });

  const watchedName = form.watch('name');
  const watchedDescription = form.watch('description');

  const onSubmit: SubmitHandler<HabitFormData> = (data) => {
    if (existingHabit) {
      updateHabit(existingHabit.id, data);
    } else {
      // For now, frequency is 'daily' by default and color is not implemented in form
      addHabit({ ...data, frequency: 'daily' });
    }
    form.reset({ name: "", description: "" });
    onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Drink 8 glasses of water" {...field} />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  {watchedName?.length || 0} / {MAX_HABIT_NAME_LENGTH}
                </p>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Why is this habit important to you? Any specific details?" {...field} rows={3} />
              </FormControl>
               <div className="flex justify-between items-center">
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  {watchedDescription?.length || 0} / {MAX_HABIT_DESC_LENGTH}
                </p>
              </div>
            </FormItem>
          )}
        />
        {/* Future color picker
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color (Optional)</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onSave}>
            Cancel
          </Button>
          <Button type="submit">{existingHabit ? 'Save Changes' : 'Add Habit'}</Button>
        </div>
      </form>
    </Form>
  );
}
