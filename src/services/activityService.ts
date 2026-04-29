// ActivityService - Real MongoDB API Integration
// All activity tracking goes directly to MongoDB via the API server

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthUser(): { id: string } | null {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export interface ActivityData {
  activity_type: 'lesson_completed' | 'quiz_completed' | 'game_played' | 'achievement_earned';
  subject: string;
  lesson_name?: string;
  score?: number;
  stars_earned: number;
  time_spent: number;
  metadata?: any;
}

export class ActivityService {
  // ── Core: POST to real API ────────────────────────────────────────────────
  static async trackActivity(activityData: ActivityData): Promise<void> {
    const user = getAuthUser();
    if (!user) {
      console.warn('ActivityService: No authenticated user found, skipping track.');
      return;
    }

    const payload = {
      ...activityData,
      student_id: user.id,
    };

    const res = await fetch(`${API_BASE}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to track activity: ${err}`);
    }
    console.log('✅ Activity tracked in MongoDB:', activityData.activity_type, activityData.subject);
  }

  // ── Quiz submit: dedicated endpoint that also updates profile ─────────────
  static async submitQuiz(
    subject: string,
    quizName: string,
    score: number,         // percentage 0-100
    correctAnswers: number,
    totalQuestions: number,
    timeSpent: number,     // minutes
    metadata?: any
  ): Promise<void> {
    const user = getAuthUser();
    if (!user) {
      console.warn('ActivityService: No authenticated user, quiz result not saved.');
      return;
    }

    const stars = this.calculateStarsForQuiz(score, totalQuestions);

    const payload = {
      student_id: user.id,
      subject,
      quiz_name: quizName,
      score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      stars_earned: stars,
      time_spent: timeSpent,
      metadata,
    };

    const res = await fetch(`${API_BASE}/quiz-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Quiz submit failed: ${err}`);
    }

    console.log(`✅ Quiz saved to MongoDB — ${subject} | Score: ${score}% | Stars: ${stars}`);
  }

  // ── Track lesson completion ───────────────────────────────────────────────
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
      metadata,
    });
  }

  // ── Track quiz completion (legacy wrapper → now uses submitQuiz) ──────────
  static async trackQuizCompletion(
    subject: string,
    quizName: string,
    score: number,
    totalQuestions: number,
    timeSpent: number,
    metadata?: any
  ): Promise<void> {
    const correctAnswers = metadata?.correct_answers ?? Math.round((score / 100) * totalQuestions);
    await this.submitQuiz(subject, quizName, score, correctAnswers, totalQuestions, timeSpent, metadata);
  }

  // ── Track game completion ─────────────────────────────────────────────────
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
      metadata,
    });
  }

  // ── Star calculators ──────────────────────────────────────────────────────
  private static calculateStarsForLesson(timeSpent: number, difficulty?: string): number {
    let base = 10;
    if (difficulty === 'hard') base += 5;
    else if (difficulty === 'medium') base += 3;
    if (timeSpent <= 10) base += 5;
    else if (timeSpent <= 20) base += 2;
    return Math.min(base, 20);
  }

  static calculateStarsForQuiz(score: number, totalQuestions: number): number {
    const base = Math.floor((score / 100) * 20);
    if (score === 100) return Math.min(base + 5, 25);
    if (score >= 90) return Math.min(base + 3, 25);
    if (score >= 80) return Math.min(base + 1, 25);
    return Math.max(base, 1);
  }

  private static calculateStarsForGame(score: number, timeSpent: number): number {
    let stars = Math.floor(score / 100);
    if (timeSpent <= 5) stars += 3;
    else if (timeSpent <= 10) stars += 1;
    return Math.max(Math.min(stars, 15), 1);
  }

  // ── Get recent activities from API ────────────────────────────────────────
  static async getRecentActivities(limit: number = 10): Promise<any[]> {
    const user = getAuthUser();
    if (!user) return [];
    try {
      const res = await fetch(`${API_BASE}/activity/${user.id}?limit=${limit}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  // ── Get student stats from profile API ───────────────────────────────────
  static async getStudentStats(): Promise<any> {
    const user = getAuthUser();
    if (!user) return null;
    try {
      const res = await fetch(`${API_BASE}/profiles/${user.id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export default ActivityService;
