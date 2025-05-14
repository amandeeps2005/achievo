
// src/app/my-journal/[id]/page.tsx
"use client";

import { useParams, useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useJournal } from '@/context/journal-context';
import { useAuth } from '@/context/auth-context';
import { useGoals } from '@/context/goal-context';
import type { JournalEntry } from '@/types';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, Link as LinkIcon, NotebookPen, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import JournalEntryForm from '@/components/journal/journal-entry-form';

export default function JournalEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { journalEntries, isLoading: journalLoading } = useJournal();
  const { goals, isLoading: goalsLoading } = useGoals(); // For linking goals

  const entryId = typeof params.id === 'string' ? params.id : undefined;
  const [entry, setEntry] = useState<JournalEntry | undefined | null>(null); // null initially, then entry or undefined
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    if (!authLoading && !user) {
      redirect('/'); 
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !journalLoading && entryId) {
      const foundEntry = journalEntries.find(e => e.id === entryId);
      setEntry(foundEntry);
      if (foundEntry && typeof document !== 'undefined') {
        document.title = `${foundEntry.title} - My Journal - Achievo`;
      } else if (!foundEntry && !journalLoading) {
         document.title = "Entry Not Found - Achievo";
      }
    }
  }, [user, journalLoading, entryId, journalEntries]);

  const handleEditSuccess = () => {
    setIsEditing(false);
    // Re-fetch or update entry state if necessary, though context should update it
    if (entryId) {
        const updatedEntry = journalEntries.find(e => e.id === entryId);
        setEntry(updatedEntry); // Refresh local state
    }
  };

  if (authLoading || journalLoading || goalsLoading || entry === null ) {
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

  const linkedGoal = entry.goalId ? goals.find(g => g.id === entry.goalId) : null;

  return (
    <div className="py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/my-journal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Journal
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Entry
        </Button>
      </div>

      <Card className="shadow-xl border-primary/10">
        <CardHeader className="bg-primary/5 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <NotebookPen className="w-8 h-8 mr-3 shrink-0" /> 
            {entry.title}
          </CardTitle>
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
           {linkedGoal && (
            <div className="mt-2">
              <span className="text-xs font-medium text-primary py-0.5 px-2 rounded-full bg-primary/10 flex items-center w-fit">
                <LinkIcon className="w-3 h-3 mr-1.5" />
                Linked to Goal: {linkedGoal.title || linkedGoal.originalGoal}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap break-words text-base leading-relaxed">
            {entry.content}
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/20 border-t">
            <p className="text-xs text-muted-foreground">End of journal entry.</p>
        </CardFooter>
      </Card>

      {isEditing && (
         <Dialog open={isEditing} onOpenChange={(open) => { if(!open) setIsEditing(false);}}>
            <DialogContent className="sm:max-w-lg w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                    <Edit3 className="w-6 h-6 mr-2 text-primary" />
                    Edit Journal Entry
                    </DialogTitle>
                    <DialogDescription>
                     Update the details of your journal entry.
                    </DialogDescription>
                </DialogHeader>
                <JournalEntryForm
                    goals={goals} 
                    existingEntry={entry} // Pass the current entry to the form
                    onSave={handleEditSuccess}
                    defaultGoalId={entry.goalId}
                />
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}
