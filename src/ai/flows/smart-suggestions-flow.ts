'use server';
/**
 * @fileOverview A smart suggestions AI agent for goals.
 *
 * - generateSmartSuggestions - A function that handles the smart suggestion generation process.
 * - SmartSuggestionsInput - The input type for the generateSmartSuggestions function.
 * - SmartSuggestionsOutput - The return type for the generateSmartSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSuggestionsInputSchema = z.object({
  goalTitle: z.string().describe("The title or main objective of the goal."),
  category: z.string().describe("The category of the goal (e.g., Learning, Fitness, Career, Hobby)."),
  timeframe: z.string().describe("The total time allocated for the goal or a description of the timeline (e.g., '1 month', 'Complete project by EOY', 'Ongoing')."),
  commitmentLevel: z.enum(['low', 'medium', 'high']).describe("The user's commitment level to this goal (low, medium, high).")
});
export type SmartSuggestionsInput = z.infer<typeof SmartSuggestionsInputSchema>;

const SmartSuggestionsOutputSchema = z.object({
  topicsToCover: z.array(z.string()).optional().describe("Key topics or areas to focus on, especially for learning or skill-based goals."),
  dailyOrWeeklyTimeSuggestion: z.string().optional().describe("Suggested time to dedicate daily or weekly (e.g., '1-2 hours daily', '3 sessions per week of 1 hour')."),
  sampleProjectsOrActivities: z.array(z.string()).optional().describe("Ideas for practical projects, activities, or exercises related to the goal."),
  dietAndNutritionTips: z.array(z.string()).optional().describe("Specific diet or nutrition advice, primarily for fitness or health goals."),
  workoutRoutineIdeas: z.array(z.string()).optional().describe("Suggestions for workout types or a basic schedule, for fitness goals."),
  generalTips: z.array(z.string()).optional().describe("General actionable tips or advice to help achieve the goal based on its nature (e.g., 'Track progress weekly', 'Find a mentor').")
});
export type SmartSuggestionsOutput = z.infer<typeof SmartSuggestionsOutputSchema>;

export async function generateSmartSuggestions(input: SmartSuggestionsInput): Promise<SmartSuggestionsOutput> {
  return smartSuggestionsFlow(input);
}

const smartSuggestionsPrompt = ai.definePrompt({
  name: 'smartSuggestionsPrompt',
  input: {schema: SmartSuggestionsInputSchema},
  output: {schema: SmartSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide smart, actionable suggestions to help users achieve their goals.
  Based on the user's goal title, category, timeframe, and commitment level, generate relevant suggestions.

  Goal Details:
  - Title: {{{goalTitle}}}
  - Category: {{{category}}}
  - Timeframe: {{{timeframe}}}
  - Commitment Level: {{{commitmentLevel}}}

  Instructions:
  1.  For 'Learning' or skill-based 'Hobby' goals (e.g., "Learn Python", "Learn to play Guitar"):
      - Suggest 'topicsToCover': A list of key concepts, modules, or skills to learn.
      - Suggest 'sampleProjectsOrActivities': Practical project ideas or activities to apply the learning.
  2.  For 'Fitness' or health-related goals (e.g., "Lose 5kg", "Run a marathon"):
      - Provide 'dietAndNutritionTips': Actionable advice on eating habits or nutrition.
      - Suggest 'workoutRoutineIdeas': Types of exercises, frequency, or a basic workout schedule.
  3.  For all goal types:
      - Provide a 'dailyOrWeeklyTimeSuggestion': A realistic estimation of time commitment (e.g., "Dedicate 1 hour daily", "Allocate 3-4 sessions of 45 minutes per week").
      - Offer 'generalTips': Other useful advice, such as tracking methods, motivation strategies, or resource types. For example, for a fitness goal, 'Weekly weigh-in to track progress' is a good general tip.

  Be specific and actionable. Ensure the suggestions are appropriate for the given timeframe and commitment level.
  VERY IMPORTANT: If a suggestion category (e.g., 'dietAndNutritionTips' for a 'Learning' goal, or 'topicsToCover' for a 'Fitness' goal) is NOT RELEVANT to the goal's category and nature, you MUST either COMPLETELY OMIT the field from the JSON output, OR provide an EMPTY ARRAY for that field (e.g., "workoutRoutineIdeas": []).
  ABSOLUTELY DO NOT include placeholder text like "No workout routines are necessary", "Not applicable", or any similar explanatory text within the arrays for these irrelevant fields. Only provide content for fields that directly apply to the given goal.
  For example, if the goal is 'Learn Python', the 'workoutRoutineIdeas' field should either be absent from the JSON or be \`[]\`. It MUST NOT be \`["No workout routines are necessary."]\`.

  Example for "Learn Python in 1 month" (Category: Learning, Timeframe: 1 month, Commitment: high):
  {
    "topicsToCover": ["Basic syntax and data types", "Control flow (loops, conditionals)", "Functions and modules", "Object-Oriented Programming basics", "Working with libraries like NumPy/Pandas (if relevant to further goals)"],
    "dailyOrWeeklyTimeSuggestion": "Dedicate 2-3 hours daily",
    "sampleProjectsOrActivities": ["Build a simple calculator", "Create a to-do list application", "Scrape data from a website"],
    "generalTips": ["Follow a structured online course", "Practice coding challenges daily on platforms like HackerRank or LeetCode", "Join a Python community for support"]
  }

  Example for "Lose 5 kg in 2 months" (Category: Fitness, Timeframe: 2 months, Commitment: medium):
  {
    "dietAndNutritionTips": ["Focus on whole foods and reduce processed sugar intake", "Ensure adequate protein intake (e.g., 1.2-1.6g per kg of body weight)", "Drink at least 2-3 liters of water daily"],
    "workoutRoutineIdeas": ["3-4 strength training sessions per week", "2-3 cardio sessions (e.g., jogging, cycling) of 30-45 minutes", "Incorporate daily walks (e.g., 10,000 steps)"],
    "dailyOrWeeklyTimeSuggestion": "Allocate 45-60 minutes for workouts, 4-5 times a week",
    "generalTips": ["Track your calorie intake using an app", "Get 7-8 hours of sleep per night", "Perform weekly weigh-ins to monitor progress"]
  }
  `,
});

const smartSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSuggestionsFlow',
    inputSchema: SmartSuggestionsInputSchema,
    outputSchema: SmartSuggestionsOutputSchema,
  },
  async (input: SmartSuggestionsInput) => {
    const {output} = await smartSuggestionsPrompt(input);
    return output!;
  }
);
