// @/app/actions.ts
'use server';
import { goalDecomposition, type GoalDecompositionInput, type GoalDecompositionOutput } from '@/ai/flows/goal-decomposition';
import { generateSmartSuggestions as generateSmartSuggestionsFlow, type SmartSuggestionsInput, type SmartSuggestionsOutput } from '@/ai/flows/smart-suggestions-flow';

export interface GenerateGoalPlanResult {
  data?: GoalDecompositionOutput;
  error?: string;
}

export async function generateGoalPlan(input: Pick<GoalDecompositionInput, 'goal'>): Promise<GenerateGoalPlanResult> {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const result = await goalDecomposition({ ...input, currentDate });
    if (!result || !result.steps) { 
        return { error: 'AI failed to generate a valid plan. Please try a different goal description.' };
    }
    return { data: result };
  } catch (e: unknown) {
    console.error("Error in generateGoalPlan:", e); // Server-side log
    let errorMessage = 'Failed to generate goal plan. An unexpected error occurred. Please try again later.';
    if (e instanceof Error) {
        // Check for common keywords in error messages that might indicate a timeout or service issue
        const lowerCaseMessage = e.message.toLowerCase();
        if (lowerCaseMessage.includes('timeout') || lowerCaseMessage.includes('deadline') || lowerCaseMessage.includes('timed out')) {
            errorMessage = "The request to generate the plan timed out. This can happen with complex goals. Please try simplifying your goal or try again later.";
        } else if (lowerCaseMessage.includes('service unavailable') || lowerCaseMessage.includes('ai service error')) {
            errorMessage = "The AI service is temporarily unavailable. Please try again in a few moments.";
        } else if (lowerCaseMessage.includes('quota') || lowerCaseMessage.includes('limit exceeded')) {
            errorMessage = "We're experiencing high demand. Please try again later.";
        }
        // For other errors, a generic message is often safer than exposing e.message directly to the client.
    }
    return { error: errorMessage };
  }
}

export interface GenerateSmartSuggestionsResult {
  data?: SmartSuggestionsOutput;
  error?: string;
}

export async function getSmartSuggestions(
  input: Pick<SmartSuggestionsInput, 'goalTitle' | 'category' | 'timeframe'>
): Promise<GenerateSmartSuggestionsResult> {
  try {
    // For now, defaulting commitment level to 'medium'. This could be made dynamic later.
    const fullInput: SmartSuggestionsInput = { ...input, commitmentLevel: 'medium' };
    const result = await generateSmartSuggestionsFlow(fullInput);
    if (!result) {
      return { error: 'AI failed to generate smart suggestions. Please try again.' };
    }
    return { data: result };
  } catch (e: unknown) {
    console.error("Error in getSmartSuggestions:", e); // Server-side log
    let errorMessage = 'Failed to generate smart suggestions. An unexpected error occurred. Please try again later.';
    if (e instanceof Error) {
        const lowerCaseMessage = e.message.toLowerCase();
        if (lowerCaseMessage.includes('timeout') || lowerCaseMessage.includes('deadline') || lowerCaseMessage.includes('timed out')) {
             errorMessage = "The request for smart suggestions timed out. Please try again later.";
        } else if (lowerCaseMessage.includes('service unavailable') || lowerCaseMessage.includes('ai service error')) {
            errorMessage = "The AI service for suggestions is temporarily unavailable. Please try again in a few moments.";
        } else if (lowerCaseMessage.includes('quota') || lowerCaseMessage.includes('limit exceeded')) {
            errorMessage = "We're experiencing high demand for suggestions. Please try again later.";
        }
    }
    return { error: errorMessage };
  }
}

