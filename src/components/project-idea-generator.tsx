'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generatePersonalizedProjectIdeas,
  type GeneratePersonalizedProjectIdeasOutput,
} from '@/ai/flows/generate-personalized-project-ideas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Bot, Loader2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const formSchema = z.object({
  skills: z.string().min(2, {
    message: 'Please list at least one skill.',
  }),
  interests: z.string().min(2, {
    message: 'Please list at least one interest.',
  }),
  projectPreferences: z.string().optional(),
});

export function ProjectIdeaGenerator() {
  const [ideas, setIdeas] = useState<GeneratePersonalizedProjectIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: '',
      interests: '',
      projectPreferences: 'A web application with a social component.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIdeas(null);
    try {
      const skillsArray = values.skills.split(',').map(s => s.trim());
      const interestsArray = values.interests.split(',').map(s => s.trim());

      const result = await generatePersonalizedProjectIdeas({
        skills: skillsArray,
        interests: interestsArray,
        projectPreferences: values.projectPreferences || 'Any type of project is fine.',
      });
      setIdeas(result);
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating project ideas. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Your Idea Co-pilot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Python, Figma" {...field} />
                      </FormControl>
                      <FormDescription>
                        List your technical skills, separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Interests</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI, Music, Gaming" {...field} />
                      </FormControl>
                      <FormDescription>
                        What topics are you passionate about?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="projectPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I want to build a mobile app, or a data-heavy backend."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any specific kind of project you'd like to work on?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">The AI is thinking...</p>
        </div>
      )}

      {ideas && ideas.projectIdeas.length > 0 && (
        <div>
            <h2 className="font-headline text-3xl font-bold mb-4">Your Personalized Project Ideas</h2>
            <Accordion type="single" collapsible className="w-full">
                {ideas.projectIdeas.map((idea, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className='text-lg font-semibold'>{idea.title}</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <p className="text-muted-foreground">{idea.description}</p>
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    Relevant Resources
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {idea.relevantResources.map((resource, i) => (
                                        <li key={i}>{resource}</li>
                                    ))}
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      )}
    </div>
  );
}
