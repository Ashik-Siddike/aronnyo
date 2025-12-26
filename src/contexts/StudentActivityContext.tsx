// Static StudentActivityContext - No Supabase dependency
// Uses localStorage for student activities
// Can be easily converted to Django API calls later

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { storage, STORAGE_KEYS, mockDelay, StudentActivity } from '@/data/staticData';

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
  if (!context) {
    throw new Error('useStudentActivity must be used within a StudentActivityProvider');
  }
  return context;
};

interface StudentActivityProviderProps {
  children: ReactNode;
}

export const StudentActivityProvider: React.FC<StudentActivityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load student activities from localStorage
  const loadStudentData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await mockDelay(200);
      
      // Load from localStorage
      const storedActivities = storage.get<Activity[]>(STORAGE_KEYS.STUDENT_ACTIVITIES) || [];
      const userActivities = storedActivities.filter(a => a.student_id === user.id);
      
      setActivities(userActivities);
      await calculateStats(userActivities);

    } catch (err: any) {
      console.error('Error loading student data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate student statistics
  const calculateStats = async (activitiesData: Activity[]) => {
    if (!user || !activitiesData.length) {
      setStats({
        total_stars: 0,
        total_lessons_completed: 0,
        total_time_spent: 0,
        current_streak: 0,
        badges_earned: 0,
        accuracy_percentage: 0,
        level: 'Beginner Explorer',
        rank: 0
      });
      return;
    }

    const totalStars = activitiesData.reduce((sum, activity) => sum + activity.stars_earned, 0);
    const totalTimeSpent = activitiesData.reduce((sum, activity) => sum + activity.time_spent, 0);
    const lessonsCompleted = activitiesData.filter(a => a.activity_type === 'lesson_completed').length;
    const quizzes = activitiesData.filter(a => a.activity_type === 'quiz_completed');
    const averageScore = quizzes.length > 0 
      ? quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / quizzes.length 
      : 0;

    const streak = calculateStreak(activitiesData);
    const level = getLevelFromStars(totalStars);
    const badges = activitiesData.filter(a => a.activity_type === 'achievement_earned').length;

    const subjectCounts: { [key: string]: number } = {};
    activitiesData.forEach(activity => {
      if (activity.subject) {
        subjectCounts[activity.subject] = (subjectCounts[activity.subject] || 0) + 1;
      }
    });
    const favoriteSubject = Object.keys(subjectCounts).reduce((a, b) => 
      subjectCounts[a] > subjectCounts[b] ? a : b, '');

    setStats({
      total_stars: totalStars,
      total_lessons_completed: lessonsCompleted,
      total_time_spent: Math.round(totalTimeSpent),
      current_streak: streak,
      badges_earned: badges,
      accuracy_percentage: Math.round(averageScore),
      favorite_subject: favoriteSubject,
      level: level,
      rank: 0
    });
  };

  const calculateStreak = (activitiesData: Activity[]): number => {
    if (!activitiesData.length) return 0;

    const dates = [...new Set(activitiesData.map(a => 
      new Date(a.created_at).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      let currentDate = new Date(dates[0]);
      
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        
        if (dates[i] === prevDate.toDateString()) {
          streak++;
          currentDate = new Date(dates[i]);
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const getLevelFromStars = (stars: number): string => {
    if (stars >= 2000) return 'Master Scholar';
    if (stars >= 1500) return 'Advanced Explorer';
    if (stars >= 1000) return 'Knowledge Seeker';
    if (stars >= 500) return 'Learning Champion';
    if (stars >= 200) return 'Rising Star';
    if (stars >= 50) return 'Curious Learner';
    return 'Beginner Explorer';
  };

  const addActivity = async (activityData: Omit<Activity, 'id' | 'student_id' | 'created_at'>) => {
    if (!user) return;

    try {
      await mockDelay(200);
      
      const newActivity: Activity = {
        ...activityData,
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        student_id: user.id,
        created_at: new Date().toISOString()
      };

      // Load existing activities
      const storedActivities = storage.get<Activity[]>(STORAGE_KEYS.STUDENT_ACTIVITIES) || [];
      const updatedActivities = [newActivity, ...storedActivities];
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.STUDENT_ACTIVITIES, updatedActivities);
      
      // Update state
      setActivities(prev => [newActivity, ...prev]);
      await calculateStats([newActivity, ...activities]);

    } catch (err: any) {
      console.error('Error adding activity:', err);
      setError(err.message);
    }
  };

  const getWeeklyActivity = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = weekDays[date.getDay()];
      
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at);
        return activityDate.toDateString() === date.toDateString();
      });

      const lessons = dayActivities.filter(a => a.activity_type === 'lesson_completed').length;
      const stars = dayActivities.reduce((sum, a) => sum + a.stars_earned, 0);
      const minutes = dayActivities.reduce((sum, a) => sum + a.time_spent, 0);

      weekData.push({
        day: dayName,
        lessons,
        stars,
        minutes
      });
    }

    return weekData;
  };

  const getSubjectProgress = () => {
    const subjects = ['Math', 'English', 'Bangla', 'Science'];
    const subjectIcons = {
      'Math': '🔢',
      'English': '📖', 
      'Bangla': '🇧🇩',
      'Science': '🔬'
    };

    return subjects.map(subject => {
      const subjectActivities = activities.filter(a => a.subject === subject);
      const lessonsCompleted = subjectActivities.filter(a => a.activity_type === 'lesson_completed').length;
      const quizzes = subjectActivities.filter(a => a.activity_type === 'quiz_completed');
      const averageScore = quizzes.length > 0 
        ? quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / quizzes.length 
        : 0;
      const timeSpent = subjectActivities.reduce((sum, a) => sum + a.time_spent, 0);
      
      const progress = Math.min((lessonsCompleted / 20) * 100, 100);

      return {
        name: subject,
        progress: Math.round(progress),
        icon: subjectIcons[subject as keyof typeof subjectIcons],
        color: getSubjectColor(subject),
        lessonsCompleted,
        totalLessons: 20,
        lastScore: Math.round(averageScore),
        timeSpent: formatTime(timeSpent)
      };
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Math': 'text-eduplay-blue',
      'English': 'text-eduplay-green',
      'Bangla': 'text-eduplay-orange',
      'Science': 'text-eduplay-purple'
    };
    return colors[subject as keyof typeof colors] || 'text-gray-600';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const refreshStats = async () => {
    await loadStudentData();
  };

  useEffect(() => {
    if (user) {
      loadStudentData();
    } else {
      setActivities([]);
      setStats(null);
    }
  }, [user]);

  const value: StudentActivityContextType = {
    activities,
    stats,
    loading,
    error,
    addActivity,
    getWeeklyActivity,
    getSubjectProgress,
    refreshStats
  };

  return (
    <StudentActivityContext.Provider value={value}>
      {children}
    </StudentActivityContext.Provider>
  );
};
