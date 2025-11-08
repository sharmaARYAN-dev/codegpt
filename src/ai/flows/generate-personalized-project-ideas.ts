'use server';

/**
 * @fileOverview Generates personalized project ideas based on student skills, interests, and preferences.
 *
 * - generatePersonalizedProjectIdeas - A function that generates project ideas.
 * - GeneratePersonalizedProjectIdeasInput - The input type for the generatePersonalizedProjectIdeas function.
 * - GeneratePersonalizedProjectIdeasOutput - The return type for the generatePersonalizedProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedProjectIdeasInputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('List of the student\u2019s technical skills.'),
  interests:
    z.array(z.string()).describe('List of the student\u2019s interests.'),
  projectPreferences:
    z.string().describe('Student\u2019s preferences for project type.'),
});
export type GeneratePersonalizedProjectIdeasInput =
  z.infer<typeof GeneratePersonalizedProjectIdeasInputSchema>;

const GeneratePersonalizedProjectIdeasOutputSchema = z.object({
  projectIdeas: z.array(z.object({
    title: z.string().describe('The title of the project idea.'),
    description: z.string().describe('A detailed description of the project.'),
    relevantResources: z.array(z.string()).describe('List of resources relevant to the project.'),
  })).describe('A list of personalized project ideas.'),
});
export type GeneratePersonalizedProjectIdeasOutput =
  z.infer<typeof GeneratePersonalizedProjectIdeasOutputSchema>;

export async function generatePersonalizedProjectIdeas(
  input: GeneratePersonalizedProjectIdeasInput
): Promise<GeneratePersonalizedProjectIdeasOutput> {
  return generatePersonalizedProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedProjectIdeasPrompt',
  input: {schema: GeneratePersonalizedProjectIdeasInputSchema},
  output: {schema: GeneratePersonalizedProjectIdeasOutputSchema},
  prompt: `You are an AI assistant that generates personalized project ideas for students based on their skills, interests, and project preferences.

Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Project Preferences: {{{projectPreferences}}}

Generate a list of project ideas that align with the student's profile. Each project idea should include a title, a detailed description, and a list of relevant resources.
`,
});

const generatePersonalizedProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedProjectIdeasFlow',
    inputSchema: GeneratePersonalizedProjectIdeasInputSchema,
    outputSchema: GeneratePersonalizedProjectIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
