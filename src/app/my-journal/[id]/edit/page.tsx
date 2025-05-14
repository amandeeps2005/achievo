
// src/app/my-journal/[id]/edit/page.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Edit3 } from 'lucide-react';
import JournalEntryForm from '@/components/journal/journal-entry-form';

export default function EditJournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { journalEntries, isLoading: journalLoading, updateJournalEntry } = useJournal();
  const { goals, isLoading: goalsLoading } = useGoals();

  const entryId = typeof params.id === 'string' ? params.id : undefined;
  const [entry, setEntry] = useState<JournalEntry | undefined | null>(null); // null initially

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
        document.title = `Edit: ${foundEntry.title} - Achievo`;
      } else if (!foundEntry && !journalLoading) {
        document.title = "Edit Entry - Not Found - Achievo";
      }
    }
  }, [user, journalLoading, entryId, journalEntries]);

  const handleSaveSuccess = () => {
    if (entryId) {
      router.push(`/my-journal/${entryId}`); // Redirect to view page after saving
    } else {
      router.push('/my-journal'); // Fallback redirect
    }
  };

  if (authLoading || journalLoading || goalsLoading || entry === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">
          {authLoading ? 'Authenticating...' : 'Loading Entry for Editing...'}
        </p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <Edit3 className="w-16 h-16 mx-auto mb-6 text-primary opacity-30" />
        <h1 className="text-2xl font-semibold mb-4 text-destructive">Journal Entry Not Found</h1>
        <p className="text-muted-foreground mb-6">The journal entry you are trying to edit does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/my-journal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Journal
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div className="flex justify-start items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href={entryId ? `/my-journal/${entryId}` : "/my-journal"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel Edit
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl border-primary/10">
        <CardHeader className="bg-primary/5 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Edit3 className="w-8 h-8 mr-3 shrink-0" />
            Edit Journal Entry
          </CardTitle>
          <CardDescription className="text-primary/80">
            Update the details for your entry: "{entry.title}"
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <JournalEntryForm
            goals={goals}
            existingEntry={entry}
            onSave={handleSaveSuccess}
            defaultGoalId={entry.goalId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
