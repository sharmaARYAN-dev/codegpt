import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export interface StudentProfile {
  id: string; // Changed from uid to id to be consistent
  displayName: string;
  email: string;
  photoURL?: string;
  skills: string[]; // normalized lowercase
  interests: string[]; // normalized lowercase
  bio?: string;
  links?: { github?: string; linkedin?: string; portfolio?: string };
  reputation?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  college?: string;
  branch?: string;
  year?: string;
  rollNumber?: string;
  address?: string;
  xp?: number;
  level?: number;
  softSkills?: {
    leadership: number;
    innovation: number;
    problemSolving: number;
    teamwork: number;
    productivity: number;
  };
  connections?: string[];
  incomingRequests?: string[];
  sentRequests?: string[];
};

export interface Project {
  id: string;
  name: string; // Changed from title to name
  description:string;
  tags: string[]; // e.g., ["webdev","ai"]
  skillsNeeded: string[]; // normalized
  ownerId: string; // Changed from createdBy to ownerId
  members: { uid: string; role: string; joinedAt: Date }[];
  joinRequests?: { uid: string; message?: string; createdAt: Date }[];
  demoLink?: string;
  repo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  commentCount?: number;
};

export interface ChatMessage {
    id: string;
    senderId: string;
    body: string;
    attachments?: string[]; // storage paths
    createdAt: Timestamp;
}

export interface Event {
  id:string;
  title: string;
  organizerId: string; // Changed from organizerUid
  date: Timestamp;
  type: 'Hackathon' | 'Workshop' | 'Conference'; // Changed from domain
  isOnline: boolean; // changed from mode
  location: string;
  registrationLink?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  description: string;
  tags: string[];
};

export interface ForumPost {
  id: string;
  authorId: string; // Changed from authorUid
  title: string;
  content: string; // Changed from body
  community: string; // Changed from category
  upvotes: string[]; // array of uid
  comments: number; // Changed from bookmarkCount
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export interface Comment {
    id: string;
    content: string; // Changed from body
    authorId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    parentId?: string;
};
