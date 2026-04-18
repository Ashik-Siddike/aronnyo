
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { statsApi } from '@/services/api';
import HeroSection from '@/components/HeroSection';
import ClassSelector from '@/components/ClassSelector';
import SubjectsSection from '@/components/SubjectsSection';
import FeaturesSection from '@/components/FeaturesSection';
import GamesSection from '@/components/GamesSection';
import DashboardPreview from '@/components/DashboardPreview';

const Index = () => {
  const location = useLocation();
  const [userCount, setUserCount] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const stats = await statsApi.get();
        setUserCount(stats.activeUsers || 0);
        setLessonCount(stats.totalLessons || 0);
      } catch {
        // Fallback values if API is not available
        setUserCount(150);
        setLessonCount(40);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <HeroSection userCount={userCount} lessonCount={lessonCount} />
      <ClassSelector />
      <SubjectsSection />
      <GamesSection />
      <FeaturesSection />
      <DashboardPreview />
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green py-12 animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white space-y-4">
            <h3 className="text-3xl font-bold animate-bounce-gentle">247School</h3>
            <p className="text-lg opacity-90 animate-slide-in-right">Learning 24/7, One Lesson at a Time! 🌟</p>
            <div className="flex justify-center space-x-6 text-4xl">
              <span className="animate-bounce-gentle">🎓</span>
              <span className="animate-wiggle">📚</span>
              <span className="animate-float">⭐</span>
              <span className="animate-scale-bounce">🏆</span>
              <span className="animate-pulse">🚀</span>
            </div>
            <p className="text-sm opacity-75 mt-8 animate-fade-in delay-500">
              © 2026 247School. Designed with ❤️ for young learners everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
