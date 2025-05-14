
'use server';
/**
 * @fileOverview A chatbot AI agent for the Achievo application.
 *
 * - achivoChatbot - A function that handles chatbot responses.
 * - AchievoChatbotInput - The input type for the chatbot.
 * - AchievoChatbotOutput - The return type for the chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AchievoChatbotInputSchema = z.object({
  question: z.string().describe("The user's question about the Achievo application."),
});
export type AchievoChatbotInput = z.infer<typeof AchievoChatbotInputSchema>;

const AchievoChatbotOutputSchema = z.object({
  answer: z.string().describe("The chatbot's answer to the user's question."),
});
export type AchievoChatbotOutput = z.infer<typeof AchievoChatbotOutputSchema>;

export async function achievoChatbot(input: AchievoChatbotInput): Promise<AchievoChatbotOutput> {
  return achievoChatbotFlow(input);
}

const chatbotPrompt = ai.definePrompt({
  name: 'achievoChatbotPrompt',
  input: {schema: AchievoChatbotInputSchema},
  output: {schema: AchievoChatbotOutputSchema},
  prompt: `You are a friendly and helpful chatbot assistant for Achievo, a personal goal achievement system.
Your purpose is to answer user questions specifically about Achievo's features, how to use the site, its purpose, and information that might be found on its About, FAQ, Privacy, and Terms pages.

Achievo's Key Features:
- Smart Goal Decomposition: AI breaks down user goals into actionable steps, timelines, and resources.
- Personalized Action Roadmap: Visual tracking of goal steps with checklists.
- Daily Planner & Habit Sync: Integration of goals into daily routines, with habit tracking and a calendar heatmap for consistency.
- Progress Dashboard: Overview of goal progress with charts and motivational quotes.
- Smart Suggestions Engine: AI-powered tips for goals based on category, timeframe, and commitment.
- My Journal: A feature for users to record thoughts and reflections, which can be linked to goals.
- User Profiles: Users can manage their display name, title, and profile picture.

General Information:
- Achievo is built with Next.js and uses a dark theme.
- It uses Firebase for user authentication and Genkit for its AI capabilities.
- Informational pages available on the site include: About Us, Contact Us, Privacy Policy, Terms of Service, and FAQ.

Your Task:
- Answer the user's question: {{{question}}}
- Base your answer ONLY on the information provided above about Achievo.
- If the question is off-topic, or asks for information not related to Achievo, politely state that you can only help with Achievo-related queries. For example, say "I can only answer questions about the Achievo application."
- Do not invent information or answer general knowledge questions.
- Keep your answers concise and directly address the user's question.
- Do not use markdown formatting in your answer. Respond in plain text.
`,
});

const achievoChatbotFlow = ai.defineFlow(
  {
    name: 'achievoChatbotFlow',
    inputSchema: AchievoChatbotInputSchema,
    outputSchema: AchievoChatbotOutputSchema,
  },
  async (input: AchievoChatbotInput) => {
    const {output} = await chatbotPrompt(input);
    return output!;
  }
);

