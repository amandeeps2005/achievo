// src/context/notes-context.tsx
"use client";

import type { Note } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { toast } from "@/hooks/use-toast";

interface NotesContextType {
  notes: Note[];
  addNote: (noteData: Pick<Note, 'title' | 'content' | 'goalId'>) => void;
  updateNote: (noteId: string, updates: Partial<Pick<Note, 'title' | 'content' | 'goalId'>>) => void;
  deleteNote: (noteId: string) => void;
  getNotesByGoalId: (goalId: string) => Note[];
  getGeneralNotes: () => Note[];
  isLoading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      initialLoadDone.current = false;
      return;
    }

    if (user) {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const savedNotesString = localStorage.getItem('achievoNotes');
        let allNotesInStorage: Note[] = [];
        if (savedNotesString) {
          try {
            allNotesInStorage = JSON.parse(savedNotesString);
          } catch (error) {
            console.error("Failed to parse notes from localStorage on load", error);
          }
        }
        const userNotes = allNotesInStorage.filter(n => n.userId === user.uid);
        setNotes(userNotes);
      }
      setIsLoading(false);
      initialLoadDone.current = true;
    } else {
      setNotes([]);
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (initialLoadDone.current && user && typeof window !== 'undefined') {
      const allNotesString = localStorage.getItem('achievoNotes');
      let allNotesInStorage: Note[] = [];
      if (allNotesString) {
        try {
          allNotesInStorage = JSON.parse(allNotesString);
        } catch (e) {
          console.error("Error parsing allNotes from localStorage for saving:", e);
        }
      }
      const otherUserNotesFromStorage = allNotesInStorage.filter(n => n.userId !== user.uid);
      const notesToSave = [...otherUserNotesFromStorage, ...notes];
      localStorage.setItem('achievoNotes', JSON.stringify(notesToSave));
    }
  }, [notes, user]);

  const addNote = useCallback((noteData: Pick<Note, 'title' | 'content' | 'goalId'>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add a note.", variant: "destructive" });
      return;
    }
    const newNote: Note = {
      id: crypto.randomUUID(),
      userId: user.uid,
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    toast({ title: "Note Added", description: `Note "${newNote.title.substring(0,30)}..." created.` });
  }, [user]);

  const updateNote = useCallback((noteId: string, updates: Partial<Pick<Note, 'title' | 'content' | 'goalId'>>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    toast({ title: "Note Updated", description: "Your note has been saved." });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    toast({ title: "Note Deleted", description: `Note "${(noteToDelete?.title || 'Selected note').substring(0,30)}..." removed.`, variant: "default" });
  }, [notes]);

  const getNotesByGoalId = useCallback((goalId: string): Note[] => {
    return notes.filter(note => note.goalId === goalId).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  const getGeneralNotes = useCallback((): Note[] => {
    return notes.filter(note => !note.goalId).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNotesByGoalId, getGeneralNotes, isLoading }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
