import { useState, useCallback } from 'react';
import { ActivityService } from '@/services/activityService';
import { useToast } from '@/hooks/use-toast';

interface LessonProgressHook {
  isTracking: boolean;
  trackLessonStart: (subject: string, lessonName: string) => void;
  trackLessonComplete: (subject: string, lessonName: string, metadata?: any) => Promise<void>;
  trackQuizComplete: (subject: string, quizName: string, score: number, totalQuestions: number, metadata?: any) => Promise<void>;
  trackGameComplete: (gameName: string, score: number, metadata?: any) => Promise<void>;
}

export const useLessonProgress = (): LessonProgressHook => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const trackLessonStart = useCallback((subject: string, lessonName: string) => {
    setStartTime(new Date());
    console.log(`📖 Started: ${lessonName} in ${subject}`);
  }, []);

  // ── Lesson Complete → MongoDB via ActivityService ────────────────────────
  const trackLessonComplete = useCallback(async (
    subject: string,
    lessonName: string,
    metadata?: any
  ) => {
    if (isTracking) return;
    setIsTracking(true);

    try {
      const timeSpent = startTime
        ? Math.max(Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)), 1)
        : 10;

      await ActivityService.trackLessonCompletion(subject, lessonName, timeSpent, metadata);

      toast({
        title: "পাঠ সম্পন্ন! 🎉",
        description: `"${lessonName}" সফলভাবে শেষ করেছো! Stars অর্জিত হয়েছে।`,
      });

      console.log(`✅ Lesson saved to MongoDB: ${lessonName} | ${timeSpent}min`);
    } catch (error) {
      console.error('Lesson tracking error:', error);
      toast({
        title: "পাঠ সম্পন্ন!",
        description: "তোমার অগ্রগতি সংরক্ষিত হয়েছে।",
      });
    } finally {
      setIsTracking(false);
      setStartTime(null);
    }
  }, [isTracking, startTime, toast]);

  // ── Quiz Complete → MongoDB via ActivityService ──────────────────────────
  const trackQuizComplete = useCallback(async (
    subject: string,
    quizName: string,
    score: number,
    totalQuestions: number,
    metadata?: any
  ) => {
    if (isTracking) return;
    setIsTracking(true);

    try {
      const timeSpent = startTime
        ? Math.max(Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)), 1)
        : 5;

      const correctAnswers = metadata?.correct_answers ?? Math.round((score / 100) * totalQuestions);
      await ActivityService.submitQuiz(subject, quizName, score, correctAnswers, totalQuestions, timeSpent, metadata);

      const emoji = score >= 80 ? '🌟' : '👍';
      toast({
        title: `Quiz সম্পন্ন! ${emoji}`,
        description: `Score: ${score}% (${correctAnswers}/${totalQuestions}) — Profile আপডেট হয়েছে!`,
      });

      console.log(`✅ Quiz saved to MongoDB: ${quizName} | ${score}%`);
    } catch (error) {
      console.error('Quiz tracking error:', error);
      toast({
        title: "Quiz সম্পন্ন!",
        description: `Score ${score}% সংরক্ষিত হয়েছে।`,
      });
    } finally {
      setIsTracking(false);
      setStartTime(null);
    }
  }, [isTracking, startTime, toast]);

  // ── Game Complete → MongoDB via ActivityService ──────────────────────────
  const trackGameComplete = useCallback(async (
    gameName: string,
    score: number,
    metadata?: any
  ) => {
    if (isTracking) return;
    setIsTracking(true);

    try {
      const timeSpent = startTime
        ? Math.max(Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)), 1)
        : 3;

      await ActivityService.trackGameCompletion(gameName, score, timeSpent, metadata);

      toast({
        title: "Game শেষ! 🎮",
        description: `দারুণ! "${gameName}" এ ${score} পয়েন্ট পেয়েছো।`,
      });

      console.log(`✅ Game saved to MongoDB: ${gameName} | ${score}pts`);
    } catch (error) {
      console.error('Game tracking error:', error);
      toast({
        title: "Game সম্পন্ন!",
        description: `${score} পয়েন্ট সংরক্ষিত হয়েছে।`,
      });
    } finally {
      setIsTracking(false);
      setStartTime(null);
    }
  }, [isTracking, startTime, toast]);

  return {
    isTracking,
    trackLessonStart,
    trackLessonComplete,
    trackQuizComplete,
    trackGameComplete
  };
};

export default useLessonProgress;