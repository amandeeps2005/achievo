'use server';
import { goalDecomposition, type GoalDecompositionInput, type GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';

export interface GenerateGoalPlanResult {
  data?: GoalDecompositionOutput;
  error?: string;
}

export async function generateGoalPlan(input: GoalDecompositionInput): Promise<GenerateGoalPlanResult> {
  try {
    const result = await goalDecomposition(input);
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
