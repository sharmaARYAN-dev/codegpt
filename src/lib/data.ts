import type { LucideIcon } from 'lucide-react';
import { Award, ShieldCheck, Star, Trophy } from 'lucide-react';

export type Student = {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  interests: string[];
  reputation: {
    icon: LucideIcon;
    label: string;
    color: string;
  }[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  team: Pick<Student, 'id' | 'avatar' | 'name'>[];
  tags?: string[];
};

export type Event = {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Conference';
  date: string;
  location: string;
  image: string;
  description: string;
};

export type ForumPost = {
  id: string;
  title: string;
  author: string;
  community: string;
  upvotes: number;
  comments: number;
  createdAt: string;
};

export const students: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'avatar-1',
    skills: ['React', 'Node.js', 'TypeScript', 'Figma'],
    interests: ['AI/ML', 'Web Dev', 'Mobile Apps'],
    reputation: [
      { icon: Award, label: 'Top Contributor', color: 'text-yellow-400' },
      { icon: ShieldCheck, label: 'Bug Squasher', color: 'text-green-400' },
    ],
  },
  {
    id: '2',
    name: 'Samantha Lee',
    avatar: 'avatar-2',
    skills: ['Python', 'TensorFlow', 'Data Analysis'],
    interests: ['Data Science', 'AI Ethics', 'Quantum Computing'],
    reputation: [{ icon: Star, label: 'Rising Star', color: 'text-purple-400' }],
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: 'avatar-3',
    skills: ['Swift', 'Kotlin', 'Firebase', 'UI/UX'],
    interests: ['Mobile Dev', 'AR/VR', 'Game Development'],
    reputation: [
      { icon: Trophy, label: 'Hackathon Winner', color: 'text-blue-400' },
    ],
  },
  {
    id: '4',
    name: 'Maria Garcia',
    avatar: 'avatar-4',
    skills: ['Go', 'Docker', 'Kubernetes', 'AWS'],
    interests: ['DevOps', 'Cloud Computing', 'Cybersecurity'],
    reputation: [],
  },
    {
    id: '5',
    name: 'Ken Adams',
    avatar: 'avatar-5',
    skills: ['Angular', 'Java', 'Spring Boot'],
    interests: ['Enterprise Software', 'FinTech'],
    reputation: [
      { icon: ShieldCheck, label: 'Code Guardian', color: 'text-green-400' },
    ],
  },
    {
    id: '6',
    name: 'Priya Sharma',
    avatar: 'avatar-6',
    skills: ['C++', 'Unreal Engine', 'Blender'],
    interests: ['Game Development', '3D Modeling', 'VFX'],
    reputation: [
        { icon: Star, label: 'Community Helper', color: 'text-pink-400' }
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'AI-Driven Flashcards',
    description: 'An app that generates flashcards from lecture notes.',
    icon: 'project-icon-1',
    progress: 75,
    team: [
      { id: '2', avatar: 'avatar-2', name: 'Samantha Lee' },
      { id: '1', avatar: 'avatar-1', name: 'Alex Johnson' },
    ],
    tags: ['AI/ML', 'React', 'Python'],
  },
  {
    id: 'p2',
    name: 'Flashcards',
    description: 'Tind leccoms sraay fis modt ait thais amd the terisignd trausley or buid it tordeent of the future.',
    icon: 'project-icon-2',
    progress: 40,
    team: [
        { id: '3', avatar: 'avatar-3', name: 'David Chen' },
    ],
    tags: ['AI/ML', 'Python'],
  },
  {
    id: 'p3',
    name: 'AI-Driven Study Buddy',
    description: 'The tbs fiho dit ograithes the it yor the a desst gib unt the future.',
    icon: 'project-icon-3',
    progress: 15,
    team: [{ id: '4', avatar: 'avatar-4', name: 'Maria Garcia' }],
    tags: ['AI/ML', 'Python'],
  },
  {
    id: 'p4',
    name: 'AI-Driven Study Buddy with Solsa 2024',
    description: 'Reast ang thd 2e',
    icon: 'project-icon-1',
    progress: 85,
    team: [
        { id: '5', avatar: 'avatar-5', name: 'Ken Adams' }
    ],
    tags: ['Anlact', 'Python'],
  },
  {
    id: 'p5',
    name: 'AI-Driven Study Buddy',
    description: 'Sue the yoy ta rolliderte rot the tne sour wiettis at touf he future.',
    icon: 'project-icon-2',
    progress: 25,
    team: [
        { id: '6', avatar: 'avatar-6', name: 'Priya Sharma' }
    ],
    tags: ['Anlact', 'Python'],
  },
  {
    id: 'p6',
    name: 'Designten Thinking Basics',
    description: 'Spolis sth et of eurjed ed tnogles at fircte.',
    icon: 'project-icon-3',
    progress: 50,
    team: [
        { id: '1', avatar: 'avatar-1', name: 'Alex Johnson' }
    ],
    tags: ['Anlaco', 'React'],
  }
];

export const events: Event[] = [
  {
    id: 'e1',
    title: 'InnovateAI Hackathon 2024',
    type: 'Hackathon',
    date: 'October 26-27, 2024',
    location: 'Online',
    image: 'event-hackathon',
    description: 'Join the brightest minds to build the next generation of AI applications. Prizes, workshops, and more!',
  },
  {
    id: 'e2',
    title: 'Advanced React Patterns Workshop',
    type: 'Workshop',
    date: 'November 5, 2024',
    location: 'Tech Hub, Building C',
    image: 'event-workshop',
    description: 'Deep dive into advanced React concepts like hooks, context, and performance optimization with industry experts.',
  },
  {
    id: 'e3',
    title: 'Future of Tech Conference',
    type: 'Conference',
    date: 'November 15-16, 2024',
    location: 'Grand Convention Center',
    image: 'event-conference',
    description: 'A two-day conference featuring talks from leaders in AI, blockchain, and quantum computing.',
  },
];

export const forumPosts: ForumPost[] = [
  {
    id: 'f1',
    title: 'Is serverless the future for student projects?',
    author: 'dev_guru',
    community: 'c/webdev',
    upvotes: 128,
    comments: 34,
    createdAt: '4h ago',
  },
  {
    id: 'f2',
    title: 'Show-off: My new portfolio built with Next.js 14 and Three.js',
    author: 'creative_coder',
    community: 'c/design',
    upvotes: 256,
    comments: 52,
    createdAt: '1d ago',
  },
  {
    id: 'f3',
    title: 'Struggling with Imposter Syndrome as a junior dev',
    author: 'anxious_dev',
    community: 'c/career',
    upvotes: 512,
    comments: 150,
    createdAt: '2d ago',
  },
];
