// StudentActivityContext — Real MongoDB API via ActivityService
// localStorage replaced with real API calls

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ActivityService } from '@/services/activityService';

interface Activity {
  id: string;
  student_id: string;
  activity_type: 'lesson_completed' | 'quiz_completed' | 'game_played' | 'achievement_earned';
  subject: string;
  lesson_name?: string;
  score?: number;
  stars_earned: number;
  time_spent: number;
  created_at: string;
  metadata?: any;
}

interface StudentStats {
  total_stars: number;
  total_lessons_completed: number;
  total_time_spent: number;
  current_streak: number;
  badges_earned: number;
  accuracy_percentage: number;
  favorite_subject?: string;
  level: string;
  rank: number;
}

interface StudentActivityContextType {
  activities: Activity[];
  stats: StudentStats | null;
  loading: boolean;
  error: string | null;
  addActivity: (activity: Omit<Activity, 'id' | 'student_id' | 'created_at'>) => Promise<void>;
  getWeeklyActivity: () => any[];
  getSubjectProgress: () => any[];
  refreshStats: () => Promise<void>;
}

const StudentActivityContext = createContext<StudentActivityContextType | undefined>(undefined);

export const useStudentActivity = () => {
  const context = useContext(StudentActivityContext);
  if (!context) throw new Error('useStudentActivity must be used within a StudentActivityProvider');
  return context;
};

const getLevelFromStars = (stars: number): string => {
  if (stars >= 1000) return 'Master Scholar';
  if (stars >= 500)  return 'Learning Champion';
  if (stars >= 200)  return 'Rising Star';
  if (stars >= 50)   return 'Curious Learner';
  return 'Beginner Explorer';
};

const getSubjectColor = (subject: string) => ({
  'Math': 'text-eduplay-blue', 'English': 'text-eduplay-green',
  'Bangla': 'text-eduplay-orange', 'Science': 'text-eduplay-purple'
}[subject] || 'text-gray-600');

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const StudentActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load from real API ────────────────────────────────────────────────────
  const loadStudentData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [profileStats, recentActivities] = await Promise.all([
        ActivityService.getStudentStats(),
        ActivityService.getRecentActivities(30)
      ]);

      const acts: Activity[] = (recentActivities || []).map((a: any) => ({
        id: a._id || a.id || String(Math.random()),
        student_id: a.student_id || user.id,
        activity_type: a.activity_type,
        subject: a.subject || '',
        lesson_name: a.lesson_name || '',
        score: a.score || 0,
        stars_earned: a.stars_earned || 0,
        time_spent: a.time_spent || 0,
        created_at: a.created_at || new Date().toISOString(),
        metadata: a.metadata
      }));
      setActivities(acts);

      // Build stats from profile data (from DB)
      if (profileStats) {
        setStats({
          total_stars: profileStats.total_stars || 0,
          total_lessons_completed: profileStats.lessons_completed || 0,
          total_time_spent: Math.round((profileStats.hours_learned || 0) * 60),
          current_streak: profileStats.streak || 0,
          badges_earned: profileStats.badges || 0,
          accuracy_percentage: Math.round(profileStats.accuracy || 0),
          favorite_subject: undefined,
          level: profileStats.level || getLevelFromStars(profileStats.total_stars || 0),
          rank: 0
        });
      } else {
        setStats({ total_stars: 0, total_lessons_completed: 0, total_time_spent: 0, current_streak: 0, badges_earned: 0, accuracy_percentage: 0, level: 'Beginner Explorer', rank: 0 });
      }
    } catch (err: any) {
      console.error('Error loading student data from API:', err);
      setError(err.message);
      // Fallback empty state
      setStats({ total_stars: 0, total_lessons_completed: 0, total_time_spent: 0, current_streak: 0, badges_earned: 0, accuracy_percentage: 0, level: 'Beginner Explorer', rank: 0 });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ── addActivity — sends to real API ──────────────────────────────────────
  const addActivity = async (activityData: Omit<Activity, 'id' | 'student_id' | 'created_at'>) => {
    if (!user) return;
    try {
      if (activityData.activity_type === 'lesson_completed') {
        await ActivityService.trackLessonCompletion(
          activityData.subject,
          activityData.lesson_name || 'Lesson',
          activityData.time_spent,
          activityData.metadata
        );
      } else if (activityData.activity_type === 'quiz_completed') {
        const total = activityData.metadata?.total_questions || 10;
        const correct = activityData.metadata?.correct_answers || Math.round(((activityData.score || 0) / 100) * total);
        await ActivityService.submitQuiz(
          activityData.subject,
          activityData.lesson_name || 'Quiz',
          activityData.score || 0,
          correct, total,
          activityData.time_spent,
          activityData.metadata
        );
      } else {
        await ActivityService.trackGameCompletion(
          activityData.lesson_name || activityData.subject,
          activityData.score || 0,
          activityData.time_spent,
          activityData.metadata
        );
      }

      // Optimistically update local state
      const newActivity: Activity = {
        ...activityData,
        id: `activity-${Date.now()}`,
        student_id: user.id,
        created_at: new Date().toISOString()
      };
      setActivities(prev => [newActivity, ...prev]);

      // Refresh stats from DB
      await loadStudentData();
    } catch (err: any) {
      console.error('Error adding activity to API:', err);
    }
  };

  // ── getWeeklyActivity from loaded activities ───────────────────────────
  const getWeeklyActivity = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayActivities = activities.filter(a =>
        new Date(a.created_at).toDateString() === date.toDateString()
      );
      return {
        day: weekDays[date.getDay()],
        lessons: dayActivities.filter(a => a.activity_type === 'lesson_completed').length,
        stars: dayActivities.reduce((s, a) => s + a.stars_earned, 0),
        minutes: dayActivities.reduce((s, a) => s + a.time_spent, 0)
      };
    });
  };

  // ── getSubjectProgress from loaded activities ──────────────────────────
  const getSubjectProgress = () => {
    const subjectDefs = [
      { name: 'Math', icon: '🔢' }, { name: 'English', icon: '📖' },
      { name: 'Bangla', icon: '🇧🇩' }, { name: 'Science', icon: '🔬' }
    ];
    return subjectDefs.map(({ name, icon }) => {
      const subActivities = activities.filter(a => a.subject === name);
      const lessonsCompleted = subActivities.filter(a => a.activity_type === 'lesson_completed').length;
      const quizzes = subActivities.filter(a => a.activity_type === 'quiz_completed');
      const avgScore = quizzes.length > 0 ? Math.round(quizzes.reduce((s, q) => s + (q.score || 0), 0) / quizzes.length) : 0;
      const timeSpent = subActivities.reduce((s, a) => s + a.time_spent, 0);
      return {
        name, icon,
        color: getSubjectColor(name),
        progress: Math.min(Math.round((lessonsCompleted / 20) * 100), 100),
        lessonsCompleted,
        totalLessons: 20,
        lastScore: avgScore,
        timeSpent: formatTime(timeSpent)
      };
    });
  };

  const refreshStats = async () => { await loadStudentData(); };

  useEffect(() => {
    if (user) loadStudentData();
    else { setActivities([]); setStats(null); }
  }, [user, loadStudentData]);

  return (
    <StudentActivityContext.Provider value={{ activities, stats, loading, error, addActivity, getWeeklyActivity, getSubjectProgress, refreshStats }}>
      {children}
    </StudentActivityContext.Provider>
  );
};
