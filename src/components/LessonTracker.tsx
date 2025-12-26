import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLessonProgress } from '@/hooks/useLessonProgress';

interface LessonTrackerProps {
  subject: string;
  lessonName: string;
  lessonType: 'lesson' | 'quiz' | 'game';
  onStart?: () => void;
  onComplete?: (data: any) => void;
}

const LessonTracker: React.FC<LessonTrackerProps> = ({
  subject,
  lessonName,
  lessonType,
  onStart,
  onComplete
}) => {
  const { user } = useAuth();
  const { trackLessonStart } = useLessonProgress();

  useEffect(() => {
    // Track lesson start when component mounts
    if (user && subject && lessonName) {
      trackLessonStart(subject, lessonName);
      onStart?.();
    }
  }, [user, subject, lessonName, trackLessonStart, onStart]);

  // This component doesn't render anything, it's just for tracking
  return null;
};

export default LessonTracker;