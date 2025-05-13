import type { GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';

export interface StepUi extends GoalDecompositionOutput['steps'][0] {
  id: string;
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
  createdAt: string; // ISO date string
  progress: number; // Calculated: (completed steps / total steps) * 100
}
