import { ProjectIdeaGenerator } from '@/components/project-idea-generator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Project Ideas | UniVerse',
};

export default function IdeasPage() {
  return (
    <div className="container mx-auto max-w-4xl py-2">
      <div className='mb-8'>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Generate Project Ideas</h1>
        <p className="mt-1 text-muted-foreground">Let our AI help you find the perfect project based on your skills and interests.</p>
      </div>
      <ProjectIdeaGenerator />
    </div>
  );
}
