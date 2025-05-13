// src/components/notes/note-form.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select"; // Renamed SelectLabel to avoid conflict
import type { Goal, Note } from '@/types';
import { useNotes } from '@/context/notes-context';
import { useEffect } from 'react';

const GENERAL_NOTE_VALUE = "__GENERAL_NOTE__";

const noteFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100, "Title too long."),
  content: z.string().min(5, "Content must be at least 5 characters.").max(5000, "Content too long."),
  goalId: z.string().optional(), // This will store actual goal IDs or be undefined
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface NoteFormProps {
  goals: Goal[];
  existingNote?: Note;
  onSave: () => void; // Callback to close form/dialog
  defaultGoalId?: string;
}

export default function NoteForm({ goals, existingNote, onSave, defaultGoalId }: NoteFormProps) {
  const { addNote, updateNote } = useNotes();

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: existingNote?.title || "",
      content: existingNote?.content || "",
      goalId: existingNote?.goalId || defaultGoalId || undefined, // Form state is string | undefined
    },
  });

  useEffect(() => {
    // If defaultGoalId changes and it's a new note form, update the form value
    if (!existingNote && defaultGoalId !== form.getValues('goalId')) {
      form.setValue('goalId', defaultGoalId);
    }
    // if editing existing note and its goalId is different from current form val
    if (existingNote && existingNote.goalId !== form.getValues('goalId')) {
      form.setValue('goalId', existingNote.goalId);
    }
    // if no goalId, ensure it's undefined
    if (!existingNote && !defaultGoalId && form.getValues('goalId') !== undefined) {
        form.setValue('goalId', undefined);
    }

  }, [defaultGoalId, existingNote, form]);


  const onSubmit: SubmitHandler<NoteFormData> = (data) => {
    // data.goalId will be string | undefined as per schema
    if (existingNote) {
      updateNote(existingNote.id, data);
    } else {
      addNote(data);
    }
    // Reset form: keep the current goalId selection for convenience if user wants to add another note for same goal
    form.reset({ title: "", content: "", goalId: data.goalId });
    onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter note title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your note here..." {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Goal (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value === GENERAL_NOTE_VALUE ? undefined : value);
                }}
                // The Select's value needs to map undefined (form state) to GENERAL_NOTE_VALUE (visual selection)
                value={field.value === undefined ? GENERAL_NOTE_VALUE : field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal or leave for general note" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <RadixSelectLabel>Link to Goal</RadixSelectLabel>
                    {/* Use a non-empty string for the "General Note" option's value */}
                    <SelectItem value={GENERAL_NOTE_VALUE}>General Note (No specific goal)</SelectItem>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title || goal.originalGoal}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                Associate this note with one of your existing goals, or keep it as a general note.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onSave}>
            Cancel
          </Button>
          <Button type="submit">{existingNote ? 'Save Changes' : 'Add Note'}</Button>
        </div>
      </form>
    </Form>
  );
}
