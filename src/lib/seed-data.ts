import type { StudentProfile, Project, Event, ForumPost } from '@/lib/types';

export const seedUsers: Omit<StudentProfile, 'id'>[] = [
  {
    displayName: 'Alex Johnson',
    email: 'alex.j@university.edu',
    photoURL: 'https://picsum.photos/seed/101/200/200',
    skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
    interests: ['AI Ethics', 'Indie Gaming', 'Data Visualization'],
    reputation: [
      { label: 'Top Contributor', color: 'text-yellow-400' },
      { label: 'Rising Star', color: 'text-green-400' },
    ],
    socialLinks: {
      github: 'https://github.com/alexj',
      linkedin: 'https://linkedin.com/in/alexj'
    }
  },
  {
    displayName: 'Brenda Smith',
    email: 'brenda.s@university.edu',
    photoURL: 'https://picsum.photos/seed/102/200/200',
    skills: ['UI/UX Design', 'Figma', 'Webflow', 'HTML/CSS'],
    interests: ['Sustainable Design', 'Mobile Interfaces', 'Art History'],
    reputation: [{ label: 'Community Helper', color: 'text-blue-400' }],
    socialLinks: {
      github: 'https://github.com/brendas'
    }
  },
  {
    displayName: 'Charles Lee',
    email: 'charles.l@university.edu',
    photoURL: 'https://picsum.photos/seed/103/200/200',
    skills: ['Next.js', 'Firebase', 'GraphQL', 'TypeScript'],
    interests: ['Serverless Architecture', 'DevOps', 'FinTech'],
    reputation: [
        { label: 'Code Guardian', color: 'text-purple-400' },
        { label: 'Bug Squasher', color: 'text-red-400' }
    ],
    socialLinks: {
      github: 'https://github.com/charlesl',
      linkedin: 'https://linkedin.com/in/charlesl'
    }
  },
   {
    displayName: 'Diana Garcia',
    email: 'diana.g@university.edu',
    photoURL: 'https://picsum.photos/seed/104/200/200',
    skills: ['Project Management', 'Agile', 'Scrum', 'Jira'],
    interests: ['Startup Ecosystems', 'EdTech', 'Product Strategy'],
    reputation: [],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/dianag'
    }
  },
];

export const seedProjects: Omit<Project, 'id' | 'ownerId' | 'createdAt'>[] = [
  {
    name: 'AI-Powered Personal Tutor',
    description:
      'A web application that uses generative AI to create personalized learning paths for students. It adapts to individual learning styles and provides real-time feedback.',
    memberIds: [],
    tags: ['AI/ML', 'React', 'Next.js', 'EdTech'],
    rating: 5,
    forks: 12,
    comments: 8,
  },
  {
    name: 'Campus Sustainability Dashboard',
    description:
      "A data visualization project that tracks and displays the university's energy consumption, waste management, and carbon footprint in real-time.",
    memberIds: [],
    tags: ['Data Viz', 'React', 'Firebase', 'Sustainability'],
    rating: 4,
    forks: 5,
    comments: 4,
  },
  {
    name: 'UniVerse Connect Mobile App',
    description:
      'The official mobile client for the UniVerse platform, built with React Native for a seamless cross-platform experience. Focus on real-time messaging and event notifications.',
    memberIds: [],
    tags: ['Mobile', 'React Native', 'Firebase', 'Social'],
    rating: 4,
    forks: 9,
    comments: 6,
  },
];

export const seedEvents: Omit<Event, 'id' | 'organizerId'>[] = [
  {
    title: 'InnovateAI Hackathon 2024',
    type: 'Hackathon',
    date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    location: 'Online',
    description:
      'A 48-hour virtual hackathon focused on creating innovative solutions using artificial intelligence. All skill levels are welcome. Prizes for best overall project, best use of API, and most creative idea.',
    tags: ['AI/ML', 'Competition', 'Virtual'],
    rating: 5,
  },
  {
    title: 'Intro to UI/UX with Figma',
    type: 'Workshop',
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    location: 'Design Lab, Room 101',
    description:
      'A hands-on workshop covering the fundamentals of user interface and user experience design using Figma. Learn about wireframing, prototyping, and creating design systems.',
    tags: ['Design', 'Figma', 'Beginner-Friendly'],
    rating: 4,
  },
    {
    title: 'Future of Web Dev Conference',
    type: 'Conference',
    date: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    location: 'Main Auditorium',
    description:
      'A full-day conference featuring talks from industry experts on the latest trends in web development, including serverless, WebAssembly, and next-gen frameworks.',
    tags: ['WebDev', 'Conference', 'Networking'],
    rating: 5,
  },
];

export const seedForumPosts: Omit<ForumPost, 'id' | 'authorId' | 'createdAt'>[] = [
  {
    title: 'What are the best resources for learning advanced React hooks?',
    content:
      "I've got the basics of useState and useEffect down, but I want to dive deeper into hooks like useMemo, useCallback, and useReducer. Any recommendations for tutorials, articles, or courses that you found helpful?",
    community: 'WebDev',
    upvotes: 15,
    comments: 4,
  },
  {
    title: 'Brainstorming session: Ideas for a "tech for good" project?',
    content:
      "I'm looking to start a new project that has a positive social impact. Thinking about areas like education, healthcare, or environmental sustainability. Anyone have interesting ideas or want to collaborate?",
    community: 'Startups',
    upvotes: 28,
    comments: 12,
  },
    {
    title: 'Is anyone else experimenting with the new Gemini 2.5 Flash model?',
    content:
      "The new Gemini model seems incredibly fast and powerful for its size. I'm thinking of using it for a real-time chatbot application. Has anyone else started building with it? Would love to share findings and challenges.",
    community: 'AI/ML',
    upvotes: 42,
    comments: 7,
  },
];
