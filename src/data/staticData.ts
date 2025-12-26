// Static Data for Play Learn Grow Kids
// This file contains all static data that will be used instead of Supabase
// Later, this can be easily converted to Django API calls

export interface Grade {
  id: number;
  name: string;
  order_index: number;
  created_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  grade_id: number;
  order_index: number;
  created_at?: string;
}

export interface Content {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  content_type: 'text' | 'pdf' | 'youtube' | 'video' | 'audio' | 'image' | 'interactive';
  youtube_link?: string;
  file_url?: string;
  pages?: any;
  content_data?: any;
  class?: string;
  subject?: string;
  grade_id?: number;
  subject_id?: number;
  chapter_id?: number;
  lesson_order?: number;
  is_published: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin' | 'parent';
  created_at: string;
}

export interface StudentActivity {
  id: string;
  student_id: string;
  activity_type: 'lesson_completed' | 'quiz_completed' | 'game_played' | 'achievement_earned';
  subject: string;
  lesson_name?: string;
  score?: number;
  stars_earned: number;
  time_spent: number;
  metadata?: any;
  created_at: string;
  updated_at?: string;
}

// Static Grades Data
export const staticGrades: Grade[] = [
  { id: 1, name: 'Nursery', order_index: 1 },
  { id: 2, name: 'Kindergarten', order_index: 2 },
  { id: 3, name: 'Grade 1', order_index: 3 },
  { id: 4, name: 'Grade 2', order_index: 4 },
  { id: 5, name: 'Grade 3', order_index: 5 },
  { id: 6, name: 'Grade 4', order_index: 6 },
  { id: 7, name: 'Grade 5', order_index: 7 },
];

// Static Subjects Data
export const staticSubjects: Subject[] = [
  // Nursery
  { id: 1, name: 'Math', grade_id: 1, order_index: 1 },
  { id: 2, name: 'English', grade_id: 1, order_index: 2 },
  { id: 3, name: 'Bangla', grade_id: 1, order_index: 3 },
  { id: 4, name: 'Science', grade_id: 1, order_index: 4 },
  
  // Kindergarten
  { id: 5, name: 'Math', grade_id: 2, order_index: 1 },
  { id: 6, name: 'English', grade_id: 2, order_index: 2 },
  { id: 7, name: 'Bangla', grade_id: 2, order_index: 3 },
  { id: 8, name: 'Science', grade_id: 2, order_index: 4 },
  
  // Grade 1
  { id: 9, name: 'Math', grade_id: 3, order_index: 1 },
  { id: 10, name: 'English', grade_id: 3, order_index: 2 },
  { id: 11, name: 'Bangla', grade_id: 3, order_index: 3 },
  { id: 12, name: 'Science', grade_id: 3, order_index: 4 },
  
  // Grade 2
  { id: 13, name: 'Math', grade_id: 4, order_index: 1 },
  { id: 14, name: 'English', grade_id: 4, order_index: 2 },
  { id: 15, name: 'Bangla', grade_id: 4, order_index: 3 },
  { id: 16, name: 'Science', grade_id: 4, order_index: 4 },
  
  // Grade 3
  { id: 17, name: 'Math', grade_id: 5, order_index: 1 },
  { id: 18, name: 'English', grade_id: 5, order_index: 2 },
];

// Static Contents Data
export const staticContents: Content[] = [
  {
    id: '1',
    title: 'Counting Numbers 1-10',
    description: 'Learn to count from 1 to 10',
    content_type: 'interactive',
    grade_id: 1,
    subject_id: 1,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    pages: [
      { type: 'text', content: 'Let\'s learn to count!' },
      { type: 'interactive', content: 'Count the objects' }
    ]
  },
  {
    id: '2',
    title: 'Alphabet A-Z',
    description: 'Learn the English alphabet',
    content_type: 'text',
    grade_id: 1,
    subject_id: 2,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Basic Addition',
    description: 'Learn simple addition',
    content_type: 'interactive',
    grade_id: 2,
    subject_id: 5,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Reading Stories',
    description: 'Read fun stories',
    content_type: 'text',
    grade_id: 2,
    subject_id: 6,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Subtraction Basics',
    description: 'Learn subtraction',
    content_type: 'interactive',
    grade_id: 3,
    subject_id: 9,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Grammar Basics',
    description: 'Learn basic grammar',
    content_type: 'text',
    grade_id: 3,
    subject_id: 10,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Multiplication Tables',
    description: 'Learn multiplication',
    content_type: 'interactive',
    grade_id: 4,
    subject_id: 13,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Reading Comprehension',
    description: 'Improve reading skills',
    content_type: 'text',
    grade_id: 4,
    subject_id: 14,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Division Basics',
    description: 'Learn division',
    content_type: 'interactive',
    grade_id: 5,
    subject_id: 17,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Advanced Grammar',
    description: 'Learn advanced grammar',
    content_type: 'text',
    grade_id: 5,
    subject_id: 18,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    title: 'Science Experiments',
    description: 'Fun science experiments',
    content_type: 'youtube',
    youtube_link: 'https://www.youtube.com/watch?v=example',
    grade_id: 1,
    subject_id: 4,
    lesson_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

// Static Users Data
export const staticUsers: User[] = [
  {
    id: 'bafaf73a-ab09-4c96-a7f4-362e6c15913f',
    email: 'ashiksiddike@gmail.com',
    full_name: 'Ashik Siddike',
    role: 'admin',
    created_at: '2025-09-27T02:58:35.116Z',
  },
  {
    id: '5bd7c119-8c3e-4605-a589-e1a2f9e1f802',
    email: 'admin@school.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: '2025-06-18T12:51:37.671Z',
  },
  {
    id: '177f6e63-59c4-4236-9dcf-753814befa85',
    email: 'demo@school.com',
    full_name: 'Demo User',
    role: 'student',
    created_at: '2025-06-18T12:51:37.671Z',
  },
  {
    id: 'eeadafcb-9e74-4991-abd4-7978e785e9b4',
    email: 'teacher@school.com',
    full_name: 'Teacher User',
    role: 'teacher',
    created_at: '2025-06-18T12:51:37.671Z',
  },
  {
    id: '78819b39-0d1a-4a0e-9deb-e9ec68348bb7',
    email: 'parent@school.com',
    full_name: 'Parent User',
    role: 'parent',
    created_at: '2025-06-18T12:51:37.671Z',
  },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_USER: 'play_learn_grow_auth_user',
  AUTH_PROFILE: 'play_learn_grow_auth_profile',
  AUTH_SESSION: 'play_learn_grow_auth_session',
  STUDENT_ACTIVITIES: 'play_learn_grow_student_activities',
  STUDENT_STATS: 'play_learn_grow_student_stats',
};

// Helper functions for localStorage
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Mock delay function to simulate API calls
export const mockDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

