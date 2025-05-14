
// src/context/journal-context.tsx
"use client";

import type { JournalEntry } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { toast } from "@/hooks/use-toast";

interface JournalContextType {
  journalEntries: JournalEntry[];
  addJournalEntry: (entryData: Pick<JournalEntry, 'title' | 'content' | 'goalId'>) => void;
  updateJournalEntry: (entryId: string, updates: Partial<Pick<JournalEntry, 'title' | 'content' | 'goalId'>>) => void;
  deleteJournalEntry: (entryId: string) => void;
  getJournalEntriesByGoalId: (goalId: string) => JournalEntry[];
  getGeneralJournalEntries: () => JournalEntry[];
  isLoading: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
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
        const savedEntriesString = localStorage.getItem('achievoJournalEntries');
        let allEntriesInStorage: JournalEntry[] = [];
        if (savedEntriesString) {
          try {
            allEntriesInStorage = JSON.parse(savedEntriesString);
          } catch (error) {
            console.error("Failed to parse journal entries from localStorage on load", error);
          }
        }
        const userEntries = allEntriesInStorage.filter(entry => entry.userId === user.uid);
        setJournalEntries(userEntries);
      }
      setIsLoading(false);
      initialLoadDone.current = true;
    } else {
      setJournalEntries([]);
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (initialLoadDone.current && user && typeof window !== 'undefined') {
      const allEntriesString = localStorage.getItem('achievoJournalEntries');
      let allEntriesInStorage: JournalEntry[] = [];
      if (allEntriesString) {
        try {
          allEntriesInStorage = JSON.parse(allEntriesString);
        } catch (e) {
          console.error("Error parsing allJournalEntries from localStorage for saving:", e);
        }
      }
      const otherUserEntriesFromStorage = allEntriesInStorage.filter(entry => entry.userId !== user.uid);
      const entriesToSave = [...otherUserEntriesFromStorage, ...journalEntries];
      localStorage.setItem('achievoJournalEntries', JSON.stringify(entriesToSave));
    }
  }, [journalEntries, user]);

  const addJournalEntry = useCallback((entryData: Pick<JournalEntry, 'title' | 'content' | 'goalId'>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add a journal entry.", variant: "destructive" });
      return;
    }
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      userId: user.uid,
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJournalEntries(prevEntries => [newEntry, ...prevEntries].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    toast({ title: "Journal Entry Added", description: `Entry "${newEntry.title.substring(0,30)}..." created.` });
  }, [user]);

  const updateJournalEntry = useCallback((entryId: string, updates: Partial<Pick<JournalEntry, 'title' | 'content' | 'goalId'>>) => {
    setJournalEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
      ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    toast({ title: "Journal Entry Updated", description: "Your journal entry has been saved." });
  }, []);

  const deleteJournalEntry = useCallback((entryId: string) => {
    const entryToDelete = journalEntries.find(entry => entry.id === entryId);
    setJournalEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
    toast({ title: "Journal Entry Deleted", description: `Entry "${(entryToDelete?.title || 'Selected entry').substring(0,30)}..." removed.`, variant: "default" });
  }, [journalEntries]);

  const getJournalEntriesByGoalId = useCallback((goalId: string): JournalEntry[] => {
    return journalEntries.filter(entry => entry.goalId === goalId).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [journalEntries]);

  const getGeneralJournalEntries = useCallback((): JournalEntry[] => {
    return journalEntries.filter(entry => !entry.goalId).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [journalEntries]);

  return (
    <JournalContext.Provider value={{ journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, getJournalEntriesByGoalId, getGeneralJournalEntries, isLoading }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
