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
      linkedin: 'https://linkedin.com/in/alexj',
      instagram: 'https://instagram.com/alexj.codes',
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
      github: 'https://github.com/brendas',
      linkedin: 'https://linkedin.com/in/brendas',
      whatsapp: '15551234567',
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
      linkedin: 'https://linkedin.com/in/charlesl',
      reddit: 'https://reddit.com/user/charlesdev'
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
  {
    displayName: 'Ethan Wong',
    email: 'ethan.w@university.edu',
    photoURL: 'https://picsum.photos/seed/105/200/200',
    skills: ['Java', 'Spring Boot', 'Kafka', 'Microservices'],
    interests: ['Distributed Systems', 'Cloud Computing', 'Chess'],
    reputation: [
      { label: 'Hackathon Winner', color: 'text-blue-500' }
    ],
    socialLinks: {
      github: 'https://github.com/ethanw',
      linkedin: 'https://linkedin.com/in/ethanw'
    }
  },
  {
    displayName: 'Fiona Chen',
    email: 'fiona.c@university.edu',
    photoURL: 'https://picsum.photos/seed/106/200/200',
    skills: ['Data Science', 'Pandas', 'Scikit-learn', 'TensorFlow'],
    interests: ['Natural Language Processing', 'Bioinformatics', 'Photography'],
    reputation: [],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/fionac'
    }
  },
  {
    displayName: 'George Kim',
    email: 'george.k@university.edu',
    photoURL: 'https://picsum.photos/seed/107/200/200',
    skills: ['C++', 'Unreal Engine', 'Blender', 'Game Design'],
    interests: ['Game Development', 'Virtual Reality', '3D Modeling'],
    reputation: [
      { label: 'Community Helper', color: 'text-blue-400' }
    ],
    socialLinks: {
      github: 'https://github.com/georgek',
      instagram: 'https://instagram.com/george.creates'
    }
  },
  {
    displayName: 'Hannah Davis',
    email: 'hannah.d@university.edu',
    photoURL: 'https://picsum.photos/seed/108/200/200',
    skills: ['Swift', 'iOS Development', 'CoreML', 'ARKit'],
    interests: ['Mobile Apps', 'Augmented Reality', 'Creative Coding'],
    reputation: [],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/hannahd'
    }
  }
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
  {
    name: 'Project Nebula: VR Game',
    description: 'An immersive VR exploration game set in a procedurally generated galaxy. Built with Unreal Engine and focused on player-driven narrative.',
    memberIds: [],
    tags: ['Game Dev', 'Unreal Engine', 'VR', 'C++'],
    rating: 5,
    forks: 25,
    comments: 15,
  },
  {
    name: 'FinTech Stock Analyzer',
    description: 'A web app that uses machine learning to analyze market trends and provide stock recommendations. Includes a paper trading feature.',
    memberIds: [],
    tags: ['FinTech', 'Python', 'Flask', 'AI/ML'],
    rating: 4,
    forks: 18,
    comments: 9,
  }
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
    tags: ['Web Dev', 'Conference', 'Networking'],
    rating: 5,
  },
  {
    title: 'Game Jam: 72-Hour Challenge',
    type: 'Hackathon',
    date: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    location: 'Campus Green',
    description: 'Join teams to create a video game from scratch in just 72 hours. Theme will be announced at the start of the event. All platforms welcome.',
    tags: ['Game Dev', 'Competition', 'In-Person'],
    rating: 5,
  },
  {
    title: 'Building Your First Mobile App',
    type: 'Workshop',
    date: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
    location: 'Online',
    description: 'A beginner-friendly workshop on building a simple mobile app for iOS and Android using React Native. No prior experience required.',
    tags: ['Mobile', 'React Native', 'Workshop'],
    rating: 4,
  }
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
  {
    title: 'Looking for a 3D artist for a VR game project',
    content: 'We have the core mechanics of our VR game built in Unreal Engine, but we desperately need a talented 3D artist to bring our world to life. Anyone with Blender/Maya experience interested in joining?',
    community: 'Gaming',
    upvotes: 18,
    comments: 5,
  },
  {
    title: 'Showcase: My new portfolio website built with Next.js and Framer Motion',
    content: 'Just deployed my new personal portfolio! Would love to get some feedback from the design and web dev communities on the UI/UX and animations. Link in the comments.',
    community: 'Design',
    upvotes: 33,
    comments: 9,
  }
];
