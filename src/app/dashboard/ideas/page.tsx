'use client';

import { ProjectIdeaGenerator } from '@/components/project-idea-generator';
import type { Metadata } from 'next';

export default function IdeasPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">AI Project Ideas</h1>
          <p className="mt-1 text-muted-foreground">Let our AI help you find the perfect project based on your skills and interests.</p>
        </div>
      </div>
      <ProjectIdeaGenerator />
    </div>
  );
}
