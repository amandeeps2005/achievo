"use client";

import type { Goal, StepUi } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context'; 
import { toast } from "@/hooks/use-toast";

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateStepCompletion: (goalId: string, stepId: string, completed: boolean) => void;
  getGoalById: (goalId: string) => Goal | undefined;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void; // Exposed for potential external control if ever needed
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]); // Holds goals for the current user
  const [isLoading, setIsLoading] = useState(true); // True initially, and during auth/goal loading
  const { user, loading: authLoading } = useAuth();
  const initialLoadDone = useRef(false); // Tracks if initial goal load for the user session is done

  // Effect for LOADING goals when user changes or on initial auth load
  useEffect(() => {
    if (authLoading) {
      setIsLoading(true); // If auth is in progress, goal loading is also pending
      initialLoadDone.current = false; // Reset initial load flag if auth state is changing
      return;
    }

    if (user) {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const savedGoalsString = localStorage.getItem('achievoGoals');
        let allGoalsInStorage: Goal[] = [];
        if (savedGoalsString) {
          try {
            allGoalsInStorage = JSON.parse(savedGoalsString);
          } catch (error) {
            console.error("Failed to parse goals from localStorage on load", error);
          }
        }
        // Filter goals from storage that belong to the current user
        const userGoals = allGoalsInStorage.filter(g => g.userId === user.uid);
        setGoals(userGoals);
      } else {
        setGoals([]); // Should not happen in browser, but as a fallback
      }
      setIsLoading(false);
      initialLoadDone.current = true;
    } else {
      // No user logged in
      setGoals([]); // Clear goals
      setIsLoading(false); // No data to load
      initialLoadDone.current = true; // Consider "load" done for non-user state
    }
  }, [user, authLoading]);

  // Effect for SAVING goals to localStorage
  useEffect(() => {
    // Only save if:
    // 1. Initial load for the current user session is complete (to avoid overwriting with empty/stale data on mount).
    // 2. A user is logged in.
    // 3. We are in a browser environment.
    if (initialLoadDone.current && user && typeof window !== 'undefined') {
      const allGoalsString = localStorage.getItem('achievoGoals');
      let allGoalsInStorage: Goal[] = [];
      if (allGoalsString) {
        try {
          allGoalsInStorage = JSON.parse(allGoalsString);
        } catch (e) {
          console.error("Error parsing allGoals from localStorage for saving:", e);
          // Potentially corrupted storage, might be safer to start fresh for this user
          // or try to recover other users' data if critical. For now, log and proceed.
        }
      }

      // Filter out any existing goals of the current user from what was read from storage
      const otherUserGoalsFromStorage = allGoalsInStorage.filter(g => g.userId !== user.uid);
      
      // Combine the goals of other users (from storage) with the current user's goals (from context state)
      // The 'goals' state variable here contains ONLY the current user's goals.
      const goalsToSave = [...otherUserGoalsFromStorage, ...goals];
      
      localStorage.setItem('achievoGoals', JSON.stringify(goalsToSave));
    }
  }, [goals, user]); // Re-run when current user's goals change or user identity changes (after initial load)


  const calculateProgress = useCallback((steps: StepUi[]): number => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to add a goal.", variant: "destructive"});
        return;
    }
    // Ensure the goal has the current userId, even if it was somehow missed
    const goalWithUser = { ...goal, userId: user.uid, progress: calculateProgress(goal.steps) };
    setGoals(prevGoals => [...prevGoals, goalWithUser]);
    toast({
      title: "Goal Added!",
      description: `Your goal "${goal.originalGoal.substring(0,30)}..." is set up.`,
    });
  }, [calculateProgress, user]);

  const updateStepCompletion = useCallback((goalId: string, stepId: string, completed: boolean) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedSteps = goal.steps.map(step =>
            step.id === stepId ? { ...step, completed } : step
          );
          const newProgress = calculateProgress(updatedSteps);
          if (newProgress === 100 && goal.progress < 100) {
            toast({
              title: "Goal Completed!",
              description: `Congratulations on completing "${goal.originalGoal.substring(0,30)}..."!`,
              variant: "default",
              duration: 5000,
            });
          }
          return { ...goal, steps: updatedSteps, progress: newProgress };
        }
        return goal;
      })
    );
  }, [calculateProgress]);

  const getGoalById = useCallback((goalId: string): Goal | undefined => {
    return goals.find(goal => goal.id === goalId);
  }, [goals]);

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateStepCompletion, getGoalById, isLoading, setIsLoading }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

