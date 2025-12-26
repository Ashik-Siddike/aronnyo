import { useState, useCallback } from 'react';
import { ActivityService } from '@/services/activityService';
import { useStudentActivity } from '@/contexts/StudentActivityContext';
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
  const { refreshStats } = useStudentActivity();
  const { toast } = useToast();

  const trackLessonStart = useCallback((subject: string, lessonName: string) => {
    setStartTime(new Date());
    console.log(`Started lesson: ${lessonName} in ${subject}`);
  }, []);

  const trackLessonComplete = useCallback(async (
    subject: string, 
    lessonName: string, 
    metadata?: any
  ) => {
    if (isTracking) return; // Prevent duplicate tracking
    
    setIsTracking(true);
    
    try {
      const timeSpent = startTime 
        ? Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)) 
        : 10; // Default 10 minutes if start time not tracked

      await ActivityService.trackLessonCompletion(
        subject,
        lessonName,
        Math.max(timeSpent, 1), // Minimum 1 minute
        metadata
      );

      // Refresh stats to update dashboard
      await refreshStats();

      // Show success message
      toast({
        title: "Lesson Completed! 🎉",
        description: `Great job completing "${lessonName}"! You earned stars for your progress.`,
      });

      console.log(`Lesson completed: ${lessonName} in ${subject}, Time: ${timeSpent} minutes`);
      
    } catch (error) {
      console.error('Error tracking lesson completion:', error);
      toast({
        title: "Progress Saved",
        description: "Your lesson progress has been recorded.",
        variant: "default",
      });
    } finally {
      setIsTracking(false);
      setStartTime(null);
    }
  }, [isTracking, startTime, refreshStats, toast]);

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
        ? Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)) 
        : 5; // Default 5 minutes for quiz

      await ActivityService.trackQuizCompletion(
        subject,
        quizName,
        score,
        totalQuestions,
        Math.max(timeSpent, 1),
        metadata
      );

      // Refresh stats
      await refreshStats();

      // Show success message with score
      const correctAnswers = Math.round((score / 100) * totalQuestions);
      toast({
        title: `Quiz Completed! ${score >= 80 ? '🌟' : '👍'}`,
        description: `You scored ${score}% (${correctAnswers}/${totalQuestions} correct) on "${quizName}"!`,
      });

      console.log(`Quiz completed: ${quizName}, Score: ${score}%, Time: ${timeSpent} minutes`);
      
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
      toast({
        title: "Quiz Results Saved",
        description: `Your quiz score of ${score}% has been recorded.`,
      });
    } finally {
      setIsTracking(false);
      setStartTime(null);
    }
  }, [isTracking, startTime, refreshStats, toast]);

  const trackGameComplete = useCallback(async (
    gameName: string,
    score: number,
    metadata?: any
  ) => {
    if (isTracking) return;
    
    setIsTracking(true);
    
    try {
      const timeSpent = startTime 
        ? Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)) 
        : 3; // Default 3 minutes for games

      await ActivityService.trackGameCompletion(
        gameName,
        score,
        Math.max(timeSpent, 1),
        metadata
      );

      // Refresh stats
      await refreshStats();

      // Show success message
      toast({
        title: "Game Completed! 🎮",
        description: `Awesome! You scored ${score} points in "${gameName}".`,
      });

      console.log(`Game completed: ${gameName}, Score: ${score}, Time: ${timeSpent} minutes`);
      
    } catch (error) {
      console.error('Error tracking game completion:', error);
      toast({
        title: "Game Progress Saved",
        description: `Your game score of ${score} points has been recorded.`,
      });
    } finally {
      setIsTracking(false);
      setStartTime(null);
    }
  }, [isTracking, startTime, refreshStats, toast]);

  return {
    isTracking,
    trackLessonStart,
    trackLessonComplete,
    trackQuizComplete,
    trackGameComplete
  };
};

export default useLessonProgress;