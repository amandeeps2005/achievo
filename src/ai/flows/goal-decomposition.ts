//Goal decomposition flow to break down user goals into actionable steps, timelines, and resources.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalDecompositionInputSchema = z.object({
  goal: z
    .string()
    .describe('The overall goal to be achieved, described in plain text.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format. This should be used as a reference for setting future deadlines.'),
});
export type GoalDecompositionInput = z.infer<typeof GoalDecompositionInputSchema>;

const GoalDecompositionOutputSchema = z.object({
  steps: z
    .array(
      z.object({
        description: z.string().describe('A specific, actionable step towards achieving the goal.'),
        deadline: z
          .string()
          .describe(
            'The deadline for completing this step, in YYYY-MM-DD format. This must be a future date relative to the current date. If there is no specific deadline, leave it blank.'
          ),
        resources: z
          .array(z.string())
          .describe('A list of relevant resources (e.g., tutorials, tools, books) for this step.'),
        startDate: z.string().optional().describe('The suggested start date for this step in YYYY-MM-DD format. This must be a future date relative to the current date.'),
        endDate: z.string().optional().describe('The suggested end date for this step in YYYY-MM-DD format. This must be a future date relative to the current date and after the start date.'),
        repeatInterval: z.enum(['daily', 'weekly']).optional().describe('How often this step should be repeated, if applicable (e.g., for habits).'),
      })
    )
    .describe('A list of steps required to achieve the goal.'),
  category: z.string().describe('The category of the goal (e.g., Fitness, Learning, Career).'),
  timeline: z.string().describe('A timeline with deadlines for each step. All deadlines must be in the future.'),
  tools: z.array(z.string()).describe('The tools required to achieve the goal.'),
});
export type GoalDecompositionOutput = z.infer<typeof GoalDecompositionOutputSchema>;

export async function goalDecomposition(input: GoalDecompositionInput): Promise<GoalDecompositionOutput> {
  return goalDecompositionFlow(input);
}

const goalDecompositionPrompt = ai.definePrompt({
  name: 'goalDecompositionPrompt',
  input: {schema: GoalDecompositionInputSchema},
  output: {schema: GoalDecompositionOutputSchema},
  prompt: `You are an AI assistant designed to help users break down complex goals into actionable steps and build habits.
  The current date is {{{currentDate}}}. All suggested deadlines, start dates, and end dates must be in the future relative to this current date.

  Given the user's goal, your task is to:
  1.  Decompose the goal into a list of specific, actionable steps. For each step:
      - Provide a clear description.
      - Set a realistic deadline (in YYYY-MM-DD format, must be in the future).
      - List relevant resources.
      - For each step, determine if it's a recurring task suitable for habit building (e.g., 'exercise', 'study', 'practice'). 
        If so, provide a 'repeatInterval' ('daily' or 'weekly'). 
      - Also provide a 'startDate' (YYYY-MM-DD, future) and 'endDate' (YYYY-MM-DD, future, after start date) where appropriate, especially for recurring tasks or time-bound activities. Ensure endDate is after startDate.
  2.  Suggest a realistic overall timeline with deadlines for each step. Ensure all dates are in the future.
  3.  Provide a list of relevant tools and resources needed to achieve the goal.
  4.  Categorize the goal into one of the following categories: Fitness, Learning, Career, Finance, Hobby, Other.

  Goal: {{{goal}}}

  Your output should be structured as a JSON object with the following keys:
  - steps: A list of steps, where each step has a description, deadline (YYYY-MM-DD, future), resources, and optional startDate, endDate, repeatInterval.
  - category: The category of the goal.
  - timeline: A short string describing a timeline with deadlines for each step (all future dates).
  - tools: A list of tools that will be needed to achieve the goal.

  Example (assuming current date is 2025-05-10 for a goal like "Learn to play guitar in 3 months"):
  {
    "steps": [
      {
        "description": "Research and buy a suitable beginner acoustic guitar and essential accessories (tuner, picks).",
        "deadline": "2025-05-20",
        "resources": ["https://www.justinguitar.com/guitar-lessons/what-guitar-should-i-buy-bc-102", "Local music stores"],
        "startDate": "2025-05-13",
        "endDate": "2025-05-20"
      },
      {
        "description": "Practice basic chords (A, D, E, G, C) for 30 minutes daily.",
        "deadline": "2025-08-10",
        "resources": ["https://www.justinguitar.com/guitar-lessons/ imprescindible-chords-bc-104"],
        "startDate": "2025-05-21",
        "endDate": "2025-08-10",
        "repeatInterval": "daily"
      },
      {
        "description": "Learn to play a simple song using learned chords.",
        "deadline": "2025-06-30",
        "resources": ["Search for 'easy 3 chord songs guitar tutorial' on YouTube"],
        "startDate": "2025-06-15"
      }
    ],
    "category": "Hobby",
    "timeline": "Acquire guitar by May 20th, 2025, practice chords daily until August 10th, 2025, learn a song by June 30th, 2025.",
    "tools": ["Acoustic Guitar", "Guitar Tuner", "Guitar Picks", "Online tutorials (e.g., JustinGuitar)"]
  }
  `,
});

const goalDecompositionFlow = ai.defineFlow(
  {
    name: 'goalDecompositionFlow',
    inputSchema: GoalDecompositionInputSchema,
    outputSchema: GoalDecompositionOutputSchema,
  },
  async input => {
    const {output} = await goalDecompositionPrompt(input);
    // Ensure all step deadlines are in the future relative to input.currentDate
    if (output && output.steps) {
        const currentDateObj = new Date(input.currentDate);
        currentDateObj.setHours(0, 0, 0, 0); // Normalize current date to start of day

        output.steps = output.steps.map(step => {
            if (step.deadline) {
                const deadlineDateObj = new Date(step.deadline);
                if (deadlineDateObj <= currentDateObj) {
                    const futureDate = new Date(currentDateObj);
                    futureDate.setMonth(futureDate.getMonth() + 1);
                    step.deadline = futureDate.toISOString().split('T')[0];
                }
            }
            if (step.startDate) {
                let startDateObj = new Date(step.startDate);
                if (startDateObj <= currentDateObj) {
                     const futureStartDate = new Date(currentDateObj);
                     futureStartDate.setDate(futureStartDate.getDate() + 1); 
                     step.startDate = futureStartDate.toISOString().split('T')[0];
                     startDateObj = futureStartDate; // Update for end date comparison
                }
                 // Ensure startDate is not after deadline if deadline exists
                if (step.deadline) {
                    const deadlineDateObj = new Date(step.deadline);
                    if (startDateObj > deadlineDateObj) {
                        const newStartDate = new Date(deadlineDateObj);
                        newStartDate.setDate(deadlineDateObj.getDate() - 7); // e.g. start 1 week before deadline
                        if (newStartDate <= currentDateObj) { // if new start is still in past, set to tomorrow
                            newStartDate.setTime(currentDateObj.getTime());
                            newStartDate.setDate(currentDateObj.getDate() + 1);
                        }
                        step.startDate = newStartDate.toISOString().split('T')[0];
                        startDateObj = newStartDate; // Update for end date comparison
                    }
                }

            }
            if (step.endDate) {
                 let endDateObj = new Date(step.endDate);
                 const effectiveStartDate = step.startDate ? new Date(step.startDate) : new Date(currentDateObj.getTime() + 86400000); // use start date or tomorrow

                 if (endDateObj <= effectiveStartDate) {
                     const futureEndDate = new Date(effectiveStartDate);
                     futureEndDate.setDate(futureEndDate.getDate() + 7); 
                     step.endDate = futureEndDate.toISOString().split('T')[0];
                     endDateObj = futureEndDate;
                 }
                 // Ensure endDate is not after deadline if deadline exists
                 if (step.deadline) {
                    const deadlineDateObj = new Date(step.deadline);
                    if (endDateObj > deadlineDateObj) {
                        step.endDate = step.deadline; // Cap end date at deadline
                    }
                 }
            } else if (step.startDate && step.repeatInterval) { // If it's a repeating task with a start date but no end date, set end date to deadline or 1 month from start
                const startDateObj = new Date(step.startDate);
                if (step.deadline) {
                    step.endDate = step.deadline;
                } else {
                    const futureEndDate = new Date(startDateObj);
                    futureEndDate.setMonth(futureEndDate.getMonth() + 1);
                    step.endDate = futureEndDate.toISOString().split('T')[0];
                }
            }


            return step;
        });
    }
    return output!;
  }
);
