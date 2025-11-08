import type { StudentProfile, Project, Event, ForumPost } from '@/lib/types';

export const users: StudentProfile[] = [
  {
    id: 'user-1',
    displayName: 'Alex Johnson',
    email: 'alex.j@university.edu',
    photoURL: 'https://picsum.photos/seed/101/200/200',
    skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
    interests: ['AI Ethics', 'Indie Gaming', 'Data Visualization'],
    reputation: [
      { label: 'Top Contributor', color: 'text-yellow-400' },
      { label: 'Rising Star', color: 'text-green-400' },
    ],
  },
  {
    id: 'user-2',
    displayName: 'Brenda Smith',
    email: 'brenda.s@university.edu',
    photoURL: 'https://picsum.photos/seed/102/200/200',
    skills: ['UI/UX Design', 'Figma', 'Webflow', 'HTML/CSS'],
    interests: ['Sustainable Design', 'Mobile Interfaces', 'Art History'],
    reputation: [{ label: 'Community Helper', color: 'text-blue-400' }],
  },
  {
    id: 'user-3',
    displayName: 'Charles Lee',
    email: 'charles.l@university.edu',
    photoURL: 'https://picsum.photos/seed/103/200/200',
    skills: ['Next.js', 'Firebase', 'GraphQL', 'TypeScript'],
    interests: ['Serverless Architecture', 'DevOps', 'FinTech'],
    reputation: [
        { label: 'Code Guardian', color: 'text-purple-400' },
        { label: 'Bug Squasher', color: 'text-red-400' }
    ],
  },
   {
    id: 'user-4',
    displayName: 'Diana Garcia',
    email: 'diana.g@university.edu',
    photoURL: 'https://picsum.photos/seed/104/200/200',
    skills: ['Project Management', 'Agile', 'Scrum', 'Jira'],
    interests: ['Startup Ecosystems', 'EdTech', 'Product Strategy'],
    reputation: [],
  },
];

export const allProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'AI-Powered Personal Tutor',
    description:
      'A web application that uses generative AI to create personalized learning paths for students. It adapts to individual learning styles and provides real-time feedback.',
    ownerId: 'user-1',
    memberIds: ['user-2'],
    tags: ['AI/ML', 'React', 'Next.js', 'EdTech'],
    rating: 5,
    forks: 12,
    comments: 8,
  },
  {
    id: 'proj-2',
    name: 'Campus Sustainability Dashboard',
    description:
      'A data visualization project that tracks and displays the university\'s energy consumption, waste management, and carbon footprint in real-time.',
    ownerId: 'user-3',
    memberIds: ['user-4'],
    tags: ['Data Viz', 'React', 'Firebase', 'Sustainability'],
    rating: 4,
    forks: 5,
    comments: 4,
  },
  {
    id: 'proj-3',
    name: 'UniVerse Connect Mobile App',
    description:
      'The official mobile client for the UniVerse platform, built with React Native for a seamless cross-platform experience. Focus on real-time messaging and event notifications.',
    ownerId: 'user-2',
    memberIds: ['user-1', 'user-3'],
    tags: ['Mobile', 'React Native', 'Firebase', 'Social'],
    rating: 4,
    forks: 9,
    comments: 6,
  },
];

export const allEvents: Event[] = [
  {
    id: 'event-1',
    title: 'InnovateAI Hackathon 2024',
    type: 'Hackathon',
    date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    location: 'Online',
    description:
      'A 48-hour virtual hackathon focused on creating innovative solutions using artificial intelligence. All skill levels are welcome. Prizes for best overall project, best use of API, and most creative idea.',
    organizerId: 'user-1',
    tags: ['AI/ML', 'Competition', 'Virtual'],
    rating: 5,
  },
  {
    id: 'event-2',
    title: 'Intro to UI/UX with Figma',
    type: 'Workshop',
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    location: 'Design Lab, Room 101',
    description:
      'A hands-on workshop covering the fundamentals of user interface and user experience design using Figma. Learn about wireframing, prototyping, and creating design systems.',
    organizerId: 'user-2',
    tags: ['Design', 'Figma', 'Beginner-Friendly'],
    rating: 4,
  },
    {
    id: 'event-3',
    title: 'Future of Web Dev Conference',
    type: 'Conference',
    date: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    location: 'Main Auditorium',
    description:
      'A full-day conference featuring talks from industry experts on the latest trends in web development, including serverless, WebAssembly, and next-gen frameworks.',
    organizerId: 'user-4',
    tags: ['WebDev', 'Conference', 'Networking'],
    rating: 5,
  },
];

export const forumPosts: ForumPost[] = [
  {
    id: 'post-1',
    title: 'What are the best resources for learning advanced React hooks?',
    content:
      'I\'ve got the basics of useState and useEffect down, but I want to dive deeper into hooks like useMemo, useCallback, and useReducer. Any recommendations for tutorials, articles, or courses that you found helpful?',
    authorId: 'user-3',
    community: 'WebDev',
    upvotes: 15,
    comments: 4,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'post-2',
    title: 'Brainstorming session: Ideas for a "tech for good" project?',
    content:
      'I\'m looking to start a new project that has a positive social impact. Thinking about areas like education, healthcare, or environmental sustainability. Anyone have interesting ideas or want to collaborate?',
    authorId: 'user-4',
    community: 'Startups',
    upvotes: 28,
    comments: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
    {
    id: 'post-3',
    title: 'Is anyone else experimenting with the new Gemini 2.5 Flash model?',
    content:
      'The new Gemini model seems incredibly fast and powerful for its size. I\'m thinking of using it for a real-time chatbot application. Has anyone else started building with it? Would love to share findings and challenges.',
    authorId: 'user-1',
    community: 'AI/ML',
    upvotes: 42,
    comments: 7,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];


// Data for the main dashboard feed
export const feedProjects = allProjects.slice(0, 3);
export const recommendedEvents = allEvents.slice(0, 2);
export const suggestedTeammates = users.slice(0, 2);

// Data for community page
export const suggestedProjects = allProjects.slice(1, 3);
