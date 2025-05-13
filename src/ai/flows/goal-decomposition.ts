//Goal decomposition flow to break down user goals into actionable steps, timelines, and resources.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalDecompositionInputSchema = z.object({
  goal: z
    .string()
    .describe('The overall goal to be achieved, described in plain text.'),
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
            'The deadline for completing this step, in YYYY-MM-DD format. If there is no specific deadline, leave it blank.'
          ),
        resources: z
          .array(z.string())
          .describe('A list of relevant resources (e.g., tutorials, tools, books) for this step.'),
      })
    )
    .describe('A list of steps required to achieve the goal.'),
  category: z.string().describe('The category of the goal (e.g., Fitness, Learning, Career).'),
  timeline: z.string().describe('A timeline with deadlines for each step.'),
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

  Given the user's goal, your task is to:
  1.  Decompose the goal into a list of specific, actionable steps.
  2.  Suggest a realistic timeline with deadlines for each step.
  3.  Provide a list of relevant tools and resources for each step.
  4.  Categorize the goal into one of the following categories: Fitness, Learning, Career, Finance, Hobby, Other.

  Goal: {{{goal}}}

  Your output should be structured as a JSON object with the following keys:
  - steps: A list of steps, where each step has a description, deadline (YYYY-MM-DD), and resources.
  - category: The category of the goal.
  - timeline: A short string describing a timeline with deadlines for each step.
  - tools: A list of tools that will be needed to achieve the goal.

  Example output:
  {
    "steps": [
      {
        "description": "Learn the basics of Python syntax and data structures.",
        "deadline": "2024-07-15",
        "resources": ["https://www.learnpython.org", "https://www.codecademy.com/learn/learn-python-3"]
      },
      {
        "description": "Practice writing simple Python programs.",
        "deadline": "2024-07-22",
        "resources": ["https://www.practicepython.org", "https://codingbat.com/python"]],
      category: "Learning",
      timeline: "Start with basic syntax by July 15th, complete simple programs by July 22nd",
      tools: ["Python interpreter", "Text editor or IDE"]
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
    return output!;
  }
);
