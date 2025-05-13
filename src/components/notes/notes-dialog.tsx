// src/components/notes/notes-dialog.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import NoteForm from './note-form';
import NoteItem from './note-item';
import type { Goal, Note } from '@/types';
import { useGoals } from '@/context/goal-context';
import { useNotes } from '@/context/notes-context';
import { PlusCircle, FileText, NotebookPen } from 'lucide-react';
import LoadingSpinner from '../loading-spinner';

interface NotesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NotesDialog({ isOpen, onOpenChange }: NotesDialogProps) {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { notes, getNotesByGoalId, getGeneralNotes, isLoading: notesLoading } = useNotes();

  const [selectedGoalIdForList, setSelectedGoalIdForList] = useState<string>('');
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [defaultGoalIdForNewNote, setDefaultGoalIdForNewNote] = useState<string | undefined>(undefined);
  
  const [currentTab, setCurrentTab] = useState<'goal' | 'general'>('goal');


  const notesForSelectedGoal = selectedGoalIdForList ? getNotesByGoalId(selectedGoalIdForList) : [];
  const generalNotes = getGeneralNotes();

  const handleOpenNoteForm = (note?: Note, goalId?: string) => {
    setEditingNote(note);
    setDefaultGoalIdForNewNote(note ? note.goalId : goalId);
    setIsNoteFormOpen(true);
  };

  const handleCloseNoteForm = () => {
    setIsNoteFormOpen(false);
    setEditingNote(undefined);
    setDefaultGoalIdForNewNote(undefined);
  };

  // Reset selected goal when dialog closes or tab changes to general
  useEffect(() => {
    if (!isOpen || currentTab === 'general') {
      setSelectedGoalIdForList('');
    }
  }, [isOpen, currentTab]);

  const renderNotesList = (notesToList: Note[], type: 'goal' | 'general') => {
    if (notesLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size={32} /> <span className="ml-2">Loading notes...</span>
        </div>
      );
    }
    if (type === 'goal' && !selectedGoalIdForList && goals.length > 0) {
      return <p className="text-center text-muted-foreground py-8">Please select a goal to view its notes.</p>;
    }
    if (type === 'goal' && goals.length === 0) {
         return <p className="text-center text-muted-foreground py-8">Create a goal first to add goal-specific notes.</p>;
    }
    if (notesToList.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No notes found. {type === 'goal' && selectedGoalIdForList ? 'Add one for this goal!' : 'Add a general note!'}</p>;
    }
    return (
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {notesToList.map(note => (
          <NoteItem key={note.id} note={note} onEdit={() => handleOpenNoteForm(note)} />
        ))}
      </div>
    );
  };

  if (isNoteFormOpen) {
    return (
      <Dialog open={isNoteFormOpen} onOpenChange={setIsNoteFormOpen}>
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
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center">
            <FileText className="w-7 h-7 mr-3" />
            My Notes
          </DialogTitle>
          <DialogDescription>
            Manage your thoughts, ideas, and important information related to your goals or general topics.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto py-4 space-y-4">
          <Button onClick={() => handleOpenNoteForm(undefined, currentTab === 'goal' ? selectedGoalIdForList : undefined)} className="w-full sm:w-auto">
            <PlusCircle className="w-5 h-5 mr-2" /> Add New Note
          </Button>

          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'goal' | 'general')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="goal">Goal-Specific Notes</TabsTrigger>
              <TabsTrigger value="general">General Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="goal" className="mt-4 space-y-4">
              <Select
                onValueChange={setSelectedGoalIdForList}
                value={selectedGoalIdForList}
                disabled={goalsLoading || goals.length === 0}
              >
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder={goals.length > 0 ? "Select a goal to see its notes..." : "No goals available"} />
                </SelectTrigger>
                <SelectContent>
                  {goalsLoading ? (
                    <SelectItem value="loading" disabled>Loading goals...</SelectItem>
                  ) : goals.length > 0 ? (
                    <SelectGroup>
                      <SelectLabel>Your Goals</SelectLabel>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title || goal.originalGoal}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ) : (
                    <SelectItem value="no-goals" disabled>No goals created yet.</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {renderNotesList(notesForSelectedGoal, 'goal')}
            </TabsContent>
            <TabsContent value="general" className="mt-4">
              {renderNotesList(generalNotes, 'general')}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="sm:justify-start pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
