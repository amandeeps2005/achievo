
"use client";

import type { Habit, HabitLog } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface HabitContextType {
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (habitData: Pick<Habit, 'name' | 'description' | 'color'>) => void;
  updateHabit: (habitId: string, updates: Partial<Pick<Habit, 'name' | 'description' | 'color' | 'archived'>>) => void;
  deleteHabit: (habitId: string) => void; // Could be archive initially
  logHabitCompletion: (habitId: string, date: string, completed: boolean, notes?: string) => void;
  getHabitById: (habitId: string) => Habit | undefined;
  getLogForHabitOnDate: (habitId: string, date: string) => HabitLog | undefined;
  isLoading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = 'achievoHabits';
const HABIT_LOGS_STORAGE_KEY = 'achievoHabitLogs';

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const initialLoadDone = useRef(false);

  // Load habits and logs from localStorage
  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      initialLoadDone.current = false;
      return;
    }

    if (user) {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        // Load Habits
        const savedHabitsString = localStorage.getItem(HABITS_STORAGE_KEY);
        let allHabitsInStorage: Habit[] = [];
        if (savedHabitsString) {
          try {
            allHabitsInStorage = JSON.parse(savedHabitsString);
          } catch (error) {
            console.error("Failed to parse habits from localStorage", error);
          }
        }
        const userHabits = allHabitsInStorage.filter(habit => habit.userId === user.uid);
        setHabits(userHabits);

        // Load Habit Logs
        const savedHabitLogsString = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
        let allHabitLogsInStorage: HabitLog[] = [];
        if (savedHabitLogsString) {
          try {
            allHabitLogsInStorage = JSON.parse(savedHabitLogsString);
          } catch (error) {
            console.error("Failed to parse habit logs from localStorage", error);
          }
        }
        const userHabitLogs = allHabitLogsInStorage.filter(log => log.userId === user.uid);
        setHabitLogs(userHabitLogs);
      }
      setIsLoading(false);
      initialLoadDone.current = true;
    } else {
      setHabits([]);
      setHabitLogs([]);
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  }, [user, authLoading]);

  // Save habits to localStorage
  useEffect(() => {
    if (initialLoadDone.current && user && typeof window !== 'undefined') {
      const allHabitsString = localStorage.getItem(HABITS_STORAGE_KEY);
      let allHabitsInStorage: Habit[] = [];
      if (allHabitsString) {
        try { allHabitsInStorage = JSON.parse(allHabitsString); } catch (e) { console.error("Error parsing habits for saving:", e); }
      }
      const otherUserHabits = allHabitsInStorage.filter(h => h.userId !== user.uid);
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify([...otherUserHabits, ...habits]));
    }
  }, [habits, user]);

  // Save habit logs to localStorage
  useEffect(() => {
    if (initialLoadDone.current && user && typeof window !== 'undefined') {
      const allLogsString = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
      let allLogsInStorage: HabitLog[] = [];
      if (allLogsString) {
        try { allLogsInStorage = JSON.parse(allLogsString); } catch (e) { console.error("Error parsing habit logs for saving:", e); }
      }
      const otherUserLogs = allLogsInStorage.filter(log => log.userId !== user.uid);
      localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify([...otherUserLogs, ...habitLogs]));
    }
  }, [habitLogs, user]);


  const addHabit = useCallback((habitData: Pick<Habit, 'name' | 'description' | 'color'>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add a habit.", variant: "destructive" });
      return;
    }
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: user.uid,
      name: habitData.name,
      description: habitData.description,
      color: habitData.color,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setHabits(prev => [...prev, newHabit].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    toast({ title: "Habit Added!", description: `Habit "${newHabit.name.substring(0,30)}..." created.` });
  }, [user]);

  const updateHabit = useCallback((habitId: string, updates: Partial<Pick<Habit, 'name' | 'description' | 'color' | 'archived'>>) => {
    setHabits(prev =>
      prev.map(h => h.id === habitId ? { ...h, ...updates } : h)
        .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    );
    toast({ title: "Habit Updated", description: "Your habit has been saved." });
  }, []);
  
  const deleteHabit = useCallback((habitId: string) => {
    // For now, actual delete. Could change to archive later.
    const habitToDelete = habits.find(h => h.id === habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
    // Also delete associated logs
    setHabitLogs(prevLogs => prevLogs.filter(log => log.habitId !== habitId));
    toast({ title: "Habit Deleted", description: `Habit "${(habitToDelete?.name || 'Selected habit').substring(0,30)}..." removed.`, variant: "default" });
  }, [habits]);


  const logHabitCompletion = useCallback((habitId: string, date: string, completed: boolean, notes?: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to log habit completion.", variant: "destructive" });
      return;
    }
    setHabitLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.habitId === habitId && log.date === date);
      if (existingLogIndex > -1) {
        // Update existing log
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], completed, notes: notes || updatedLogs[existingLogIndex].notes };
        return updatedLogs;
      } else {
        // Add new log
        const newLog: HabitLog = {
          id: `${habitId}_${date}`, // Simple compound key for now
          habitId,
          userId: user.uid,
          date,
          completed,
          notes,
        };
        return [...prevLogs, newLog];
      }
    });
    // No toast here, checkbox interaction should be immediate. Consider toast for errors if API involved later.
  }, [user]);

  const getHabitById = useCallback((habitId: string) => {
    return habits.find(h => h.id === habitId);
  }, [habits]);

  const getLogForHabitOnDate = useCallback((habitId: string, date: string) => {
    return habitLogs.find(log => log.habitId === habitId && log.date === date);
  }, [habitLogs]);


  return (
    <HabitContext.Provider value={{ habits, habitLogs, addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitById, getLogForHabitOnDate, isLoading }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
