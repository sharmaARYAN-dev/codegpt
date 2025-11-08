import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export interface StudentProfile {
  id: string; // Changed from uid to id to be consistent
  displayName: string;
  email: string;
  photoURL?: string;
  aboutMe?: string;
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
  xp?: number;
  level?: number;
  softSkills?: {
    leadership: number;
    innovation: number;
    problemSolving: number;
    teamwork: number;
    productivity: number;
  };
};

export interface Project {
  id: string;
  name: string; // Changed from title to name
  description: string;
  tags: string[]; // e.g., ["webdev","ai"]
  skillsNeeded: string[]; // normalized
  ownerId: string; // Changed from createdBy to ownerId
  members: { uid: string; role: string; joinedAt: Timestamp }[];
  joinRequests?: { uid: string; message?: string; createdAt: Timestamp }[];
  demoLink?: string;
  repo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Fields to remove/change
  memberIds?: string[];
  rating?: number;
  forks?: number;
  comments?: number;
  links?: {
    repo?: string;
    demo?: string;
  };
};

export interface ChatMessage {
    id: string;
    senderUid: string;
    body: string;
    attachments?: string[]; // storage paths
    createdAt: Timestamp;
}

export interface Event {
  id: string;
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
