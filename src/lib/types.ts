import type { LucideIcon } from 'lucide-react';

export type StudentProfile = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  skills: string[];
  interests: string[];
  reputation: {
    label: string;
    color: string;
  }[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  tags: string[];
  rating: number;
  forks: number;
  comments: number;
};

export type Event = {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Conference';
  date: string; // ISO 8601 format
  location: string;
  description: string;
  organizerId: string;
  tags: string[];
  rating: number;
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  community: string;
  upvotes: number;
  comments: number;
  createdAt: string; // ISO 8601 format
};
