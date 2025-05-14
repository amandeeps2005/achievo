
// src/app/my-journal/[id]/page.tsx
"use client";

import { useParams, useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useJournal } from '@/context/journal-context';
import { useAuth } from '@/context/auth-context';
import { useGoals } from '@/context/goal-context';
import type { Goal, JournalEntry } from '@/types';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, CalendarDays, Link as LinkIcon, NotebookPen, Edit3, Save, Trash2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const GENERAL_JOURNAL_ENTRY_VALUE = "__GENERAL_JOURNAL_ENTRY__";
const MAX_CONTENT_LENGTH = 5000;

const journalEntryFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100, "Title too long."),
  content: z.string().min(5, "Content must be at least 5 characters.").max(MAX_CONTENT_LENGTH, `Content cannot exceed ${MAX_CONTENT_LENGTH} characters.`),
  goalId: z.string().optional(),
});
type JournalEntryFormData = z.infer<typeof journalEntryFormSchema>;


export default function JournalEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { journalEntries, updateJournalEntry, deleteJournalEntry, isLoading: journalLoading } = useJournal();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { toast } = useToast();

  const entryId = typeof params.id === 'string' ? params.id : undefined;
  const [entry, setEntry] = useState<JournalEntry | undefined | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // For delete dialog

  const form = useForm<JournalEntryFormData>({
    resolver: zodResolver(journalEntryFormSchema),
    defaultValues: {
      title: "",
      content: "",
      goalId: undefined,
    },
  });
  const watchedContent = form.watch('content');


  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !journalLoading && entryId) {
      const foundEntry = journalEntries.find(e => e.id === entryId);
      setEntry(foundEntry);
      if (foundEntry) {
        form.reset({
          title: foundEntry.title,
          content: foundEntry.content,
          goalId: foundEntry.goalId,
        });
        if (typeof document !== 'undefined') {
          document.title = `${foundEntry.title} - My Journal - Achievo`;
        }
      } else if (!journalLoading) {
         if (typeof document !== 'undefined') document.title = "Entry Not Found - Achievo";
      }
    }
  }, [user, journalLoading, entryId, journalEntries, form]);

  const handleEditToggle = () => {
    if (isEditing && entry) {
      // If canceling edit, reset form to original entry data
      form.reset({
        title: entry.title,
        content: entry.content,
        goalId: entry.goalId,
      });
    }
    setIsEditing(!isEditing);
  };

  const onSubmit: SubmitHandler<JournalEntryFormData> = (data) => {
    if (entry) {
      updateJournalEntry(entry.id, data);
      setIsEditing(false);
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been saved.",
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (entry) {
      deleteJournalEntry(entry.id);
      toast({
        title: "Entry Deleted",
        description: `"${entry.title}" has been removed.`,
      });
      router.push('/my-journal');
    }
    setIsDeleting(false);
  };


  if (authLoading || journalLoading || goalsLoading || entry === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">
          {authLoading ? 'Authenticating...' : 'Loading Journal Entry...'}
        </p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <NotebookPen className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
        <h1 className="text-2xl font-semibold mb-4 text-destructive">Journal Entry Not Found</h1>
        <p className="text-muted-foreground mb-6">The journal entry you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/my-journal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Journal
          </Link>
        </Button>
      </div>
    );
  }

  const linkedGoalDetails = entry.goalId ? goals.find(g => g.id === entry.goalId) : null;

  return (
    <div className="py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/my-journal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Journal
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <LoadingSpinner size={16} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEditToggle}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Entry
            </Button>
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-xl border-primary/10">
            <CardHeader className="bg-primary/5 p-6 rounded-t-lg">
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="entryTitle" className="sr-only">Title</FormLabel>
                      <FormControl>
                        <Input
                          id="entryTitle"
                          placeholder="Enter journal entry title..."
                          {...field}
                          className="text-3xl font-bold text-primary border-2 border-primary/30 focus:border-primary p-2 h-auto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <CardTitle className="text-3xl font-bold text-primary flex items-center">
                  <NotebookPen className="w-8 h-8 mr-3 shrink-0" />
                  {entry.title}
                </CardTitle>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1.5" />
                  Created: {format(new Date(entry.createdAt), "PPP p")}
                </div>
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1.5" />
                  Last Updated: {format(new Date(entry.updatedAt), "PPP p")}
                </div>
              </div>
                {isEditing ? (
                    <FormField
                        control={form.control}
                        name="goalId"
                        render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel className="text-xs text-muted-foreground">Link to Goal</FormLabel>
                            <Select
                            onValueChange={(value) => {
                                field.onChange(value === GENERAL_JOURNAL_ENTRY_VALUE ? undefined : value);
                            }}
                            value={field.value === undefined ? GENERAL_JOURNAL_ENTRY_VALUE : field.value}
                            >
                            <FormControl>
                                <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select a goal or leave for general entry" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                <RadixSelectLabel>Link to Goal</RadixSelectLabel>
                                <SelectItem value={GENERAL_JOURNAL_ENTRY_VALUE}>General Entry (No specific goal)</SelectItem>
                                {goals.map((g) => (
                                    <SelectItem key={g.id} value={g.id}>
                                    {g.title || g.originalGoal}
                                    </SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                ) : (
                    linkedGoalDetails && (
                        <div className="mt-2">
                        <span className="text-xs font-medium text-primary py-0.5 px-2 rounded-full bg-primary/10 flex items-center w-fit">
                            <LinkIcon className="w-3 h-3 mr-1.5" />
                            Linked to Goal: {linkedGoalDetails.title || linkedGoalDetails.originalGoal}
                        </span>
                        </div>
                    )
                )}
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="entryContent" className="sr-only">Content</FormLabel>
                      <FormControl>
                        <Textarea
                          id="entryContent"
                          placeholder="Type your journal entry here..."
                          {...field}
                          rows={15}
                          className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap break-words text-base leading-relaxed border-2 border-primary/30 focus:border-primary"
                        />
                      </FormControl>
                        <div className="flex justify-end items-center mt-1">
                            <p className="text-xs text-muted-foreground">
                            {watchedContent?.length || 0} / {MAX_CONTENT_LENGTH} characters
                            </p>
                        </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap break-words text-base leading-relaxed">
                  {entry.content}
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 bg-muted/20 border-t flex justify-end">
              {!isEditing && (
                 <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Entry
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the journal entry titled "<span className="font-semibold">{entry.title}</span>".
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                            Yes, Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

