import { useEffect, useState } from 'react';
import { useStudentActivity } from '@/contexts/StudentActivityContext';
import { useAuth } from '@/contexts/AuthContext';

export const useRealTimeProgress = () => {
  const { user } = useAuth();
  const { stats, activities, refreshStats } = useStudentActivity();
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto-refresh stats every 30 seconds when user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, refreshStats]);

  // Listen for activity updates and refresh stats
  const handleActivityUpdate = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await refreshStats();
    } finally {
      setIsUpdating(false);
    }
  };

  // Get progress for a specific subject
  const getSubjectProgress = (subject: string) => {
    if (!activities) return { completed: 0, total: 20, percentage: 0 };

    const subjectActivities = activities.filter(
      activity => activity.subject.toLowerCase() === subject.toLowerCase()
    );

    const lessonsCompleted = subjectActivities.filter(
      activity => activity.activity_type === 'lesson_completed'
    ).length;

    const totalLessons = 20; // This could be dynamic based on curriculum
    const percentage = Math.min((lessonsCompleted / totalLessons) * 100, 100);

    return {
      completed: lessonsCompleted,
      total: totalLessons,
      percentage: Math.round(percentage)
    };
  };

  // Get recent achievements
  const getRecentAchievements = (limit: number = 5) => {
    if (!activities) return [];

    return activities
      .filter(activity => activity.activity_type === 'achievement_earned')
      .slice(0, limit)
      .map(activity => ({
        title: activity.lesson_name || 'Achievement',
        description: activity.metadata?.description || 'Great job!',
        icon: activity.metadata?.icon || '🏆',
        stars: activity.stars_earned,
        date: activity.created_at
      }));
  };

  // Get learning streak
  const getLearningStreak = () => {
    return stats?.current_streak || 0;
  };

  // Get total stats
  const getTotalStats = () => {
    return {
      totalStars: stats?.total_stars || 0,
      totalLessons: stats?.total_lessons_completed || 0,
      totalTime: stats?.total_time_spent || 0,
      badges: stats?.badges_earned || 0,
      accuracy: stats?.accuracy_percentage || 0,
      level: stats?.level || 'Beginner Explorer'
    };
  };

  return {
    stats,
    activities,
    isUpdating,
    handleActivityUpdate,
    getSubjectProgress,
    getRecentAchievements,
    getLearningStreak,
    getTotalStats,
    refreshStats
  };
};

export default useRealTimeProgress;