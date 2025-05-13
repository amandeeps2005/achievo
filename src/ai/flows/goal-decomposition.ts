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
        repeatInterval: z.enum(['daily', 'weekly']).optional().describe('How often this step should be repeated, if applicable.'),
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
  prompt: `You are an AI assistant designed to help users break down complex goals into actionable steps.
  The current date is {{{currentDate}}}. All suggested deadlines, start dates, and end dates must be in the future relative to this current date.

  Given the user's goal, your task is to:
  1.  Decompose the goal into a list of specific, actionable steps. For each step, provide:
      - A clear description.
      - A realistic deadline (in YYYY-MM-DD format, must be in the future).
      - A list of relevant resources.
      - Optionally, a suggested start date (YYYY-MM-DD, future), end date (YYYY-MM-DD, future, after start date), and a repeat interval ('daily' or 'weekly') if the step is a recurring task.
  2.  Suggest a realistic overall timeline with deadlines for each step. Ensure all dates are in the future.
  3.  Provide a list of relevant tools and resources needed to achieve the goal.
  4.  Categorize the goal into one of the following categories: Fitness, Learning, Career, Finance, Hobby, Other.

  Goal: {{{goal}}}

  Your output should be structured as a JSON object with the following keys:
  - steps: A list of steps, where each step has a description, deadline (YYYY-MM-DD, future), resources, and optional startDate, endDate, repeatInterval.
  - category: The category of the goal.
  - timeline: A short string describing a timeline with deadlines for each step (all future dates).
  - tools: A list of tools that will be needed to achieve the goal.

  Example (assuming current date is 2025-05-10):
  {
    "steps": [
      {
        "description": "Learn the basics of Python syntax and data structures.",
        "deadline": "2025-07-15",
        "resources": ["https://www.learnpython.org", "https://www.codecademy.com/learn/learn-python-3"],
        "startDate": "2025-06-01",
        "endDate": "2025-07-15"
      },
      {
        "description": "Practice writing simple Python programs daily.",
        "deadline": "2025-07-22",
        "resources": ["https://www.practicepython.org", "https://codingbat.com/python"],
        "startDate": "2025-07-16",
        "endDate": "2025-07-22",
        "repeatInterval": "daily"
      }
    ],
    "category": "Learning",
    "timeline": "Start with basic syntax by July 15th, 2025, complete simple programs by July 22nd, 2025",
    "tools": ["Python interpreter", "Text editor or IDE"]
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
        output.steps = output.steps.map(step => {
            if (step.deadline) {
                const deadlineDateObj = new Date(step.deadline);
                if (deadlineDateObj <= currentDateObj) {
                    // Attempt to fix deadline by setting it to one month from current date
                    const futureDate = new Date(currentDateObj);
                    futureDate.setMonth(futureDate.getMonth() + 1);
                    step.deadline = futureDate.toISOString().split('T')[0];
                }
            }
            if (step.startDate) {
                const startDateObj = new Date(step.startDate);
                if (startDateObj <= currentDateObj) {
                     const futureStartDate = new Date(currentDateObj);
                     futureStartDate.setDate(futureStartDate.getDate() + 1); // Start tomorrow
                     step.startDate = futureStartDate.toISOString().split('T')[0];
                }
            }
            if (step.endDate && step.startDate) {
                 const endDateObj = new Date(step.endDate);
                 const startDateObj = new Date(step.startDate);
                 if (endDateObj <= startDateObj) {
                     const futureEndDate = new Date(startDateObj);
                     futureEndDate.setDate(futureEndDate.getDate() + 7); // End one week after start
                     step.endDate = futureEndDate.toISOString().split('T')[0];
                 }
            }
            return step;
        });
    }
    return output!;
  }
);
