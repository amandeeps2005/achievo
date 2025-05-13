// @/app/actions.ts
'use server';
import { goalDecomposition, type GoalDecompositionInput, type GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';

export interface GenerateGoalPlanResult {
  data?: GoalDecompositionOutput;
  error?: string;
}

export async function generateGoalPlan(input: Pick<GoalDecompositionInput, 'goal'>): Promise<GenerateGoalPlanResult> {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const result = await goalDecomposition({ ...input, currentDate });
    if (!result || !result.steps) { // Basic validation of AI output
        return { error: 'AI failed to generate a valid plan. Please try a different goal description.' };
    }
    return { data: result };
  } catch (e: unknown) {
    console.error("Error in generateGoalPlan:", e);
    let errorMessage = 'Failed to generate goal plan. Please try again.';
    if (e instanceof Error) {
        errorMessage = e.message;
    }
    return { error: errorMessage };
  }
}
