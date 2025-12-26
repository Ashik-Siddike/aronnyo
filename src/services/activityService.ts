// Static ActivityService - No Supabase dependency
// Uses localStorage for activity tracking
// Can be easily converted to Django API calls later

import { storage, STORAGE_KEYS, mockDelay, StudentActivity } from '@/data/staticData';

export interface ActivityData {
  activity_type: 'lesson_completed' | 'quiz_completed' | 'game_played' | 'achievement_earned';
  subject: string;
  lesson_name?: string;
  score?: number;
  stars_earned: number;
  time_spent: number;
  metadata?: any;
}

interface Activity extends ActivityData {
  id: string;
  student_id: string;
  created_at: string;
}

export class ActivityService {
  // Track a new activity
  static async trackActivity(activityData: ActivityData): Promise<void> {
    try {
      await mockDelay(200);
      
      // Get current user from localStorage
      const user = storage.get<any>(STORAGE_KEYS.AUTH_USER);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

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

      console.log('Activity tracked successfully:', activityData);
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  }

  // Track lesson completion
  static async trackLessonCompletion(
    subject: string, 
    lessonName: string, 
    timeSpent: number,
    metadata?: any
  ): Promise<void> {
    const stars = this.calculateStarsForLesson(timeSpent, metadata?.difficulty);
    
    await this.trackActivity({
      activity_type: 'lesson_completed',
      subject,
      lesson_name: lessonName,
      stars_earned: stars,
      time_spent: timeSpent,
      metadata
    });

    await this.checkAndAwardAchievements(subject, 'lesson_completed');
  }

  // Track quiz completion
  static async trackQuizCompletion(
    subject: string,
    quizName: string,
    score: number,
    totalQuestions: number,
    timeSpent: number,
    metadata?: any
  ): Promise<void> {
    const stars = this.calculateStarsForQuiz(score, totalQuestions);
    
    await this.trackActivity({
      activity_type: 'quiz_completed',
      subject,
      lesson_name: quizName,
      score,
      stars_earned: stars,
      time_spent: timeSpent,
      metadata: {
        ...metadata,
        total_questions: totalQuestions,
        correct_answers: Math.round((score / 100) * totalQuestions)
      }
    });

    await this.checkAndAwardAchievements(subject, 'quiz_completed');
  }

  // Track game completion
  static async trackGameCompletion(
    gameName: string,
    score: number,
    timeSpent: number,
    metadata?: any
  ): Promise<void> {
    const stars = this.calculateStarsForGame(score, timeSpent);
    
    await this.trackActivity({
      activity_type: 'game_played',
      subject: 'Math',
      lesson_name: gameName,
      score,
      stars_earned: stars,
      time_spent: timeSpent,
      metadata
    });

    await this.checkAndAwardAchievements('Math', 'game_played');
  }

  // Award achievement
  static async awardAchievement(
    subject: string,
    achievementName: string,
    description: string,
    icon: string = '🏆',
    stars: number = 50
  ): Promise<void> {
    await this.trackActivity({
      activity_type: 'achievement_earned',
      subject,
      lesson_name: achievementName,
      stars_earned: stars,
      time_spent: 0,
      metadata: {
        description,
        icon
      }
    });
  }

  // Calculate stars for lesson completion
  private static calculateStarsForLesson(timeSpent: number, difficulty?: string): number {
    let baseStars = 10;
    
    if (difficulty === 'hard') baseStars += 5;
    else if (difficulty === 'medium') baseStars += 3;
    
    if (timeSpent <= 10) baseStars += 5;
    else if (timeSpent <= 20) baseStars += 2;
    
    return Math.min(baseStars, 20);
  }

  // Calculate stars for quiz completion
  private static calculateStarsForQuiz(score: number, totalQuestions: number): number {
    const baseStars = Math.floor((score / 100) * 20);
    
    if (score === 100) return baseStars + 5;
    if (score >= 90) return baseStars + 3;
    else if (score >= 80) return baseStars + 1;
    
    return Math.max(baseStars, 1);
  }

  // Calculate stars for game completion
  private static calculateStarsForGame(score: number, timeSpent: number): number {
    let stars = Math.floor(score / 100);
    
    if (timeSpent <= 5) stars += 3;
    else if (timeSpent <= 10) stars += 1;
    
    return Math.max(Math.min(stars, 15), 1);
  }

  // Check and award achievements
  private static async checkAndAwardAchievements(subject: string, activityType: string): Promise<void> {
    try {
      const user = storage.get<any>(STORAGE_KEYS.AUTH_USER);
      if (!user) return;

      const storedActivities = storage.get<Activity[]>(STORAGE_KEYS.STUDENT_ACTIVITIES) || [];
      const userActivities = storedActivities.filter(a => a.student_id === user.id && a.subject === subject);

      const lessonsCompleted = userActivities.filter(a => a.activity_type === 'lesson_completed').length;
      const quizzesCompleted = userActivities.filter(a => a.activity_type === 'quiz_completed').length;
      const gamesPlayed = userActivities.filter(a => a.activity_type === 'game_played').length;
      const totalStars = userActivities.reduce((sum, a) => sum + a.stars_earned, 0);

      const existingAchievements = userActivities
        .filter(a => a.activity_type === 'achievement_earned')
        .map(a => a.lesson_name);

      if (lessonsCompleted === 1 && !existingAchievements.includes(`${subject} Beginner`)) {
        await this.awardAchievement(subject, `${subject} Beginner`, `Completed your first ${subject} lesson!`, '🌟', 25);
      }

      if (lessonsCompleted === 5 && !existingAchievements.includes(`${subject} Explorer`)) {
        await this.awardAchievement(subject, `${subject} Explorer`, `Completed 5 ${subject} lessons!`, '🚀', 50);
      }

      if (lessonsCompleted === 10 && !existingAchievements.includes(`${subject} Scholar`)) {
        await this.awardAchievement(subject, `${subject} Scholar`, `Completed 10 ${subject} lessons!`, '📚', 75);
      }

      if (quizzesCompleted === 5 && !existingAchievements.includes(`${subject} Quiz Master`)) {
        await this.awardAchievement(subject, `${subject} Quiz Master`, `Completed 5 ${subject} quizzes!`, '🧠', 60);
      }

      if (totalStars >= 100 && !existingAchievements.includes('Star Collector')) {
        await this.awardAchievement(subject, 'Star Collector', 'Earned 100 stars!', '⭐', 100);
      }

      if (totalStars >= 500 && !existingAchievements.includes('Star Master')) {
        await this.awardAchievement(subject, 'Star Master', 'Earned 500 stars!', '🌟', 150);
      }

      if (gamesPlayed === 3 && !existingAchievements.includes('Game Player')) {
        await this.awardAchievement(subject, 'Game Player', 'Played 3 educational games!', '🎮', 40);
      }

    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Get student's recent activities
  static async getRecentActivities(limit: number = 10): Promise<any[]> {
    try {
      await mockDelay(200);
      
      const user = storage.get<any>(STORAGE_KEYS.AUTH_USER);
      if (!user) return [];

      const storedActivities = storage.get<Activity[]>(STORAGE_KEYS.STUDENT_ACTIVITIES) || [];
      const userActivities = storedActivities
        .filter(a => a.student_id === user.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);

      return userActivities;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  // Get student statistics
  static async getStudentStats(): Promise<any> {
    try {
      await mockDelay(200);
      
      const user = storage.get<any>(STORAGE_KEYS.AUTH_USER);
      if (!user) return null;

      const storedStats = storage.get<any>(STORAGE_KEYS.STUDENT_STATS);
      return storedStats;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      return null;
    }
  }
}

export default ActivityService;
