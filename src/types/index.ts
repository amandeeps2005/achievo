import type { GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';

export interface StepUi extends GoalDecompositionOutput['steps'][0] {
  id: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  repeatInterval?: 'daily' | 'weekly';
  completed: boolean;
}

export interface Goal {
  id: string;
  originalGoal: string;
  title?: string; // Potentially a shorter title derived from originalGoal or user input
  category: GoalDecompositionOutput['category'];
  timeline: GoalDecompositionOutput['timeline'];
  tools: GoalDecompositionOutput['tools'];
  steps: StepUi[];
  userId: string; // To associate the goal with a specific user
  createdAt: string; // ISO date string
  progress: number; // Calculated: (completed steps / total steps) * 100
}

// Note type
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  goalId?: string; // Optional: if the note is linked to a specific goal
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Represents an item that can have notes (either a Goal or a "General" category)
export type Noteable = Goal | { id: 'general'; title: string; originalGoal: string };
