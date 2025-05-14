
// src/components/journal/journal-entry-form.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // Unused, but often kept for ShadCN consistency
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select";
import type { Goal, JournalEntry } from '@/types';
import { useJournal } from '@/context/journal-context';
import { useEffect } from 'react';

const GENERAL_JOURNAL_ENTRY_VALUE = "__GENERAL_JOURNAL_ENTRY__";

const journalEntryFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100, "Title too long."),
  content: z.string().min(5, "Content must be at least 5 characters.").max(5000, "Content too long."),
  goalId: z.string().optional(), 
});

type JournalEntryFormData = z.infer<typeof journalEntryFormSchema>;

interface JournalEntryFormProps {
  goals: Goal[];
  existingEntry?: JournalEntry;
  onSave: () => void; 
  defaultGoalId?: string;
}

export default function JournalEntryForm({ goals, existingEntry, onSave, defaultGoalId }: JournalEntryFormProps) {
  const { addJournalEntry, updateJournalEntry } = useJournal();

  const form = useForm<JournalEntryFormData>({
    resolver: zodResolver(journalEntryFormSchema),
    defaultValues: {
      title: existingEntry?.title || "",
      content: existingEntry?.content || "",
      goalId: existingEntry?.goalId || defaultGoalId || undefined,
    },
  });

  useEffect(() => {
    if (!existingEntry && defaultGoalId !== form.getValues('goalId')) {
      form.setValue('goalId', defaultGoalId);
    }
    if (existingEntry && existingEntry.goalId !== form.getValues('goalId')) {
      form.setValue('goalId', existingEntry.goalId);
    }
    if (!existingEntry && !defaultGoalId && form.getValues('goalId') !== undefined) {
        form.setValue('goalId', undefined);
    }
  }, [defaultGoalId, existingEntry, form]);

  const onSubmit: SubmitHandler<JournalEntryFormData> = (data) => {
    if (existingEntry) {
      updateJournalEntry(existingEntry.id, data);
    } else {
      addJournalEntry(data);
    }
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
              <FormLabel>Journal Entry Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter journal entry title..." {...field} />
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
              <FormLabel>Journal Entry Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your journal entry here..." {...field} rows={6} />
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
                  field.onChange(value === GENERAL_JOURNAL_ENTRY_VALUE ? undefined : value);
                }}
                value={field.value === undefined ? GENERAL_JOURNAL_ENTRY_VALUE : field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal or leave for general entry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <RadixSelectLabel>Link to Goal</RadixSelectLabel>
                    <SelectItem value={GENERAL_JOURNAL_ENTRY_VALUE}>General Entry (No specific goal)</SelectItem>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title || goal.originalGoal}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                Associate this journal entry with one of your existing goals, or keep it as a general entry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onSave}>
            Cancel
          </Button>
          <Button type="submit">{existingEntry ? 'Save Changes' : 'Add Entry'}</Button>
        </div>
      </form>
    </Form>
  );
}
