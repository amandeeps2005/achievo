
// src/app/my-journal/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
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
import JournalEntryForm from '@/components/journal/journal-entry-form';
import JournalEntryItem from '@/components/journal/journal-entry-item';
import type { Goal, JournalEntry } from '@/types';
import { useGoals } from '@/context/goal-context';
import { useJournal } from '@/context/journal-context';
import { useAuth } from '@/context/auth-context';
import { PlusCircle, FileText, NotebookPen, ArrowLeft, Search, X } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MyJournalPage() {
  const { user, loading: authLoading } = useAuth();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { journalEntries, isLoading: journalLoading } = useJournal();
  const router = useRouter();

  const [isJournalFormOpen, setIsJournalFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "My Journal - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) {
      return journalEntries;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return journalEntries.filter(entry =>
      entry.title.toLowerCase().includes(lowercasedSearchTerm) ||
      entry.content.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [journalEntries, searchTerm]);

  const handleOpenJournalEntryFormForNew = () => {
    setIsJournalFormOpen(true);
  };

  const handleCloseJournalEntryForm = () => {
    setIsJournalFormOpen(false);
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  const renderJournalEntriesList = (entriesToList: JournalEntry[]) => {
    if (journalLoading) {
      return (
        <div className="flex flex-col justify-center items-center py-12 min-h-[200px]">
          <LoadingSpinner size={32} /> <p className="ml-2 mt-3 text-muted-foreground">Loading journal entries...</p>
        </div>
      );
    }

    if (entriesToList.length === 0) {
      if (journalEntries.length > 0 && searchTerm) { // Had entries, but search found none
         return (
          <div className="text-center py-12 min-h-[200px] flex flex-col items-center justify-center">
            <Search className="w-16 h-16 text-primary opacity-30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Entries Found</h2>
            <p className="text-muted-foreground">
              No journal entries match your search for "{searchTerm}".
            </p>
          </div>
        );
      }
      return (
        <div className="text-center py-12 min-h-[200px] flex flex-col items-center justify-center">
          <FileText className="w-16 h-16 text-primary opacity-30 mb-4" />
          <p className="text-muted-foreground">
            No journal entries found. Click "Add New Entry" to create your first one!
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pt-2 pb-4 custom-scrollbar">
        {entriesToList.map(entry => (
          <JournalEntryItem
            key={entry.id}
            entry={entry}
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
        <CardHeader className="p-6 bg-primary/5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-primary flex items-center">
                <NotebookPen className="mr-3 h-7 w-7" />
                My Journal
              </CardTitle>
              <ShadcnCardDescription className="text-primary/80">
                Record your thoughts, ideas, and reflections. Link them to goals or keep them general.
              </ShadcnCardDescription>
            </div>
            <Button onClick={handleOpenJournalEntryFormForNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
              <PlusCircle className="w-5 h-5 mr-2" /> Add New Entry
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search journal entries by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {renderJournalEntriesList(filteredEntries)}
        </CardContent>
      </Card>

      {isJournalFormOpen && (
        <Dialog open={isJournalFormOpen} onOpenChange={(open) => { if (!open) handleCloseJournalEntryForm(); else setIsJournalFormOpen(true); }}>
          <DialogContent className="sm:max-w-lg w-[90vw]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <NotebookPen className="w-6 h-6 mr-2 text-primary" />
                Add New Journal Entry
              </DialogTitle>
              <DialogDescription>
                Create a new journal entry. You can link it to a goal or keep it general.
              </DialogDescription>
            </DialogHeader>
            <JournalEntryForm
              goals={goals}
              onSave={handleCloseJournalEntryForm}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
