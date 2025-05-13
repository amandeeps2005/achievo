
// src/app/my-notes/page.tsx
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
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as RadixSelectLabel } from "@/components/ui/select";
import NoteForm from '@/components/notes/note-form';
import NoteItem from '@/components/notes/note-item';
import type { Goal, Note } from '@/types';
import { useGoals } from '@/context/goal-context';
import { useNotes } from '@/context/notes-context';
import { useAuth } from '@/context/auth-context';
import { PlusCircle, FileText, NotebookPen, ArrowLeft, Home } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MyNotesPage() {
  const { user, loading: authLoading } = useAuth();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { notes, getNotesByGoalId, getGeneralNotes, isLoading: notesLoading } = useNotes();
  const router = useRouter();

  const [selectedGoalIdForList, setSelectedGoalIdForList] = useState<string>('');
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [defaultGoalIdForNewNote, setDefaultGoalIdForNewNote] = useState<string | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState<'goal' | 'general'>('goal');

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.title = "My Notes - Achievo";
    }
    if (!authLoading && !user) {
      redirect('/');
    }
  }, [user, authLoading]);
  
  useEffect(() => {
    // If user switches to 'general' tab, clear selected goal for list
    if (currentTab === 'general') {
      setSelectedGoalIdForList('');
    }
  }, [currentTab]);


  const notesForSelectedGoal = selectedGoalIdForList ? getNotesByGoalId(selectedGoalIdForList) : [];
  const generalNotes = getGeneralNotes();

  const handleOpenNoteForm = (note?: Note, goalId?: string) => {
    setEditingNote(note);
    // If editing, use note's goalId. If adding new, use provided goalId (could be selectedGoalIdForList or undefined for general)
    setDefaultGoalIdForNewNote(note ? note.goalId : goalId);
    setIsNoteFormOpen(true);
  };

  const handleCloseNoteForm = () => {
    setIsNoteFormOpen(false);
    setEditingNote(undefined);
    // Don't reset defaultGoalIdForNewNote here, so if user cancels, 
    // and clicks "Add New Note" again, it remembers the context (selected goal or general)
  };
  
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-foreground font-semibold">Authenticating...</p>
      </div>
    );
  }

  const renderNotesList = (notesToList: Note[], type: 'goal' | 'general') => {
    if (notesLoading) {
      return (
        <div className="flex flex-col justify-center items-center py-12 min-h-[200px]">
          <LoadingSpinner size={32} /> <p className="ml-2 mt-3 text-muted-foreground">Loading notes...</p>
        </div>
      );
    }
    if (type === 'goal' && !selectedGoalIdForList && goals.length > 0) {
      return <p className="text-center text-muted-foreground py-12 min-h-[200px]">Please select a goal to view its notes.</p>;
    }
     if (type === 'goal' && goals.length === 0 && !goalsLoading) {
         return <p className="text-center text-muted-foreground py-12 min-h-[200px]">Create a goal first to add goal-specific notes.</p>;
    }
    if (notesToList.length === 0) {
      return (
        <div className="text-center py-12 min-h-[200px] flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-primary opacity-30 mb-4" />
            <p className="text-muted-foreground">
            No notes found. {type === 'goal' && selectedGoalIdForList ? 'Add one for this goal!' : type === 'goal' ? '' : 'Add a general note!'}
            </p>
        </div>
        );
    }
    return (
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 pt-2 pb-4 custom-scrollbar">
        {notesToList.map(note => (
          <NoteItem key={note.id} note={note} onEdit={() => handleOpenNoteForm(note)} />
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
                    <NotebookPen className="mr-3 h-7 w-7" />
                    My Notes
                </CardTitle>
                <CardDescription className="text-primary/80">
                    Manage your thoughts, ideas, and important information.
                </CardDescription>
            </div>
            <Button onClick={() => handleOpenNoteForm(undefined, currentTab === 'goal' ? selectedGoalIdForList : undefined)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transform hover:scale-105 transition-transform w-full sm:w-auto">
                <PlusCircle className="w-5 h-5 mr-2" /> Add New Note
            </Button>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'goal' | 'general')} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="goal">Goal-Specific Notes</TabsTrigger>
              <TabsTrigger value="general">General Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="goal" className="mt-6 space-y-4">
              <Select
                onValueChange={setSelectedGoalIdForList}
                value={selectedGoalIdForList}
                disabled={goalsLoading || goals.length === 0}
              >
                <SelectTrigger className="w-full sm:w-[350px] text-sm">
                  <SelectValue placeholder={goals.length > 0 ? "Select a goal to see its notes..." : "No goals available"} />
                </SelectTrigger>
                <SelectContent>
                  {goalsLoading ? (
                    <SelectItem value="loading" disabled>Loading goals...</SelectItem>
                  ) : goals.length > 0 ? (
                    <SelectGroup>
                      <RadixSelectLabel>Your Goals</RadixSelectLabel>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title || goal.originalGoal}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ) : (
                    <SelectItem value="no-goals" disabled>No goals created yet. Add a goal to link notes.</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {renderNotesList(notesForSelectedGoal, 'goal')}
            </TabsContent>
            <TabsContent value="general" className="mt-6">
              {renderNotesList(generalNotes, 'general')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isNoteFormOpen && (
         <Dialog open={isNoteFormOpen} onOpenChange={(open) => { if(!open) handleCloseNoteForm(); else setIsNoteFormOpen(true);}}>
            <DialogContent className="sm:max-w-lg w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                    <NotebookPen className="w-6 h-6 mr-2 text-primary" />
                    {editingNote ? 'Edit Note' : 'Add New Note'}
                    </DialogTitle>
                    <DialogDescription>
                    {editingNote ? 'Update the details of your note.' : 'Create a new note. You can link it to a goal or keep it general.'}
                    </DialogDescription>
                </DialogHeader>
                <NoteForm
                    goals={goals}
                    existingNote={editingNote}
                    onSave={handleCloseNoteForm}
                    defaultGoalId={editingNote?.goalId || defaultGoalIdForNewNote}
                />
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}
