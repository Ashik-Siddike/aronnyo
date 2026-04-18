// MongoDB API Client for Play Learn Grow
// Replaces static data with real MongoDB API calls

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new ApiError(errorData.error || 'Request failed', response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error(`API call failed for ${endpoint}:`, error);
    throw new ApiError('Network error - is the API server running?', 0);
  }
}

// ==========================================
// AUTH API
// ==========================================

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    user_metadata: { full_name: string; role: string };
  };
  profile: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
  };
  session: {
    access_token: string;
    expires_at: number;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, fullName: string, role?: string) =>
    fetchApi<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    }),
};

// ==========================================
// USERS API
// ==========================================

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export const usersApi = {
  getAll: () => fetchApi<UserData[]>('/users'),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' }),
  update: (id: string, data: Partial<UserData>) =>
    fetchApi<{ success: boolean }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ==========================================
// GRADES API
// ==========================================

export interface GradeData {
  id: number;
  name: string;
  order_index: number;
}

export const gradesApi = {
  getAll: () => fetchApi<GradeData[]>('/grades'),
  create: (name: string) =>
    fetchApi<GradeData>('/grades', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  delete: (id: number) => fetchApi<{ success: boolean }>(`/grades/${id}`, { method: 'DELETE' }),
};

// ==========================================
// SUBJECTS API
// ==========================================

export interface SubjectData {
  id: number;
  name: string;
  grade_id: number;
  order_index: number;
}

export const subjectsApi = {
  getAll: (gradeId?: number) => {
    const query = gradeId ? `?grade_id=${gradeId}` : '';
    return fetchApi<SubjectData[]>(`/subjects${query}`);
  },
  create: (name: string, gradeId: number) =>
    fetchApi<SubjectData>('/subjects', {
      method: 'POST',
      body: JSON.stringify({ name, grade_id: gradeId }),
    }),
  delete: (id: number) => fetchApi<{ success: boolean }>(`/subjects/${id}`, { method: 'DELETE' }),
};

// ==========================================
// CONTENTS API
// ==========================================

export interface ContentData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  content_type: string;
  youtube_link?: string;
  file_url?: string;
  pages?: any[];
  class?: string;
  subject?: string;
  grade_id?: number;
  subject_id?: number;
  chapter_id?: number;
  lesson_order?: number;
  is_published: boolean;
  created_at: string;
}

export const contentsApi = {
  getAll: (filters?: { grade_id?: number; subject_id?: number; chapter_id?: number }) => {
    const params = new URLSearchParams();
    if (filters?.grade_id) params.set('grade_id', String(filters.grade_id));
    if (filters?.subject_id) params.set('subject_id', String(filters.subject_id));
    if (filters?.chapter_id) params.set('chapter_id', String(filters.chapter_id));
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<ContentData[]>(`/contents${query}`);
  },
  create: (data: Partial<ContentData>) =>
    fetchApi<ContentData>('/contents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ContentData>) =>
    fetchApi<{ success: boolean }>(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/contents/${id}`, { method: 'DELETE' }),
};

// ==========================================
// TEAMS API
// ==========================================

export const teamsApi = {
  getAll: () => fetchApi<any[]>('/teams'),
};

// ==========================================
// ACTIVITY API
// ==========================================

export const activityApi = {
  track: (data: any) =>
    fetchApi<any>('/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getRecent: (userId: string, limit = 10) =>
    fetchApi<any[]>(`/activity/${userId}?limit=${limit}`),
};

// ==========================================
// DASHBOARD API
// ==========================================

export const dashboardApi = {
  getStudentDashboard: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchApi<any>(`/student-dashboard${query}`);
  },
  getParentDashboard: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchApi<any>(`/parent-dashboard${query}`);
  },
  getLeaderboard: () => {
    return fetchApi<any>(`/leaderboard`);
  }
};

// ==========================================
// STATS API (Admin)
// ==========================================

export interface StatsData {
  totalStudents: number;
  totalTeachers: number;
  totalLessons: number;
  totalGrades: number;
  totalSubjects: number;
  publishedContent: number;
  draftContent: number;
  activeUsers: number;
}

export const statsApi = {
  get: () => fetchApi<StatsData>('/stats'),
};

// ==========================================
// HEALTH CHECK
// ==========================================

export const healthApi = {
  check: () => fetchApi<{ status: string; database: string }>('/health'),
};

export default {
  auth: authApi,
  users: usersApi,
  grades: gradesApi,
  subjects: subjectsApi,
  contents: contentsApi,
  teams: teamsApi,
  activity: activityApi,
  dashboard: dashboardApi,
  stats: statsApi,
  health: healthApi,
};
