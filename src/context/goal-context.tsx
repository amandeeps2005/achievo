"use client";

import type { Goal, StepUi } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateStepCompletion: (goalId: string, stepId: string, completed: boolean) => void;
  getGoalById: (goalId: string) => Goal | undefined;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      const savedGoals = localStorage.getItem('achievoGoals');
      return savedGoals ? JSON.parse(savedGoals) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('achievoGoals', JSON.stringify(goals));
    }
  }, [goals]);

  const calculateProgress = useCallback((steps: StepUi[]): number => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    const goalWithProgress = { ...goal, progress: calculateProgress(goal.steps) };
    setGoals(prevGoals => [...prevGoals, goalWithProgress]);
    toast({
      title: "Goal Added!",
      description: `Your goal "${goal.originalGoal.substring(0,30)}..." is set up.`,
    });
  }, [calculateProgress]);

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
