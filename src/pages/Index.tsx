
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { statsApi } from '@/services/api';
import HeroSection from '@/components/HeroSection';
import ClassSelector from '@/components/ClassSelector';
import SubjectsSection from '@/components/SubjectsSection';
import FeaturesSection from '@/components/FeaturesSection';
import GamesSection from '@/components/GamesSection';
import DashboardPreview from '@/components/DashboardPreview';
import { useLang } from '@/contexts/LangContext';
import { motion } from 'framer-motion';

const Index = () => {
  const location = useLocation();
  const { t } = useLang();
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
      <div id="hero-section"><HeroSection userCount={userCount} lessonCount={lessonCount} /></div>
      <div id="class-selector"><ClassSelector /></div>
      <SubjectsSection />
      <div id="games-section"><GamesSection /></div>
      <FeaturesSection />
      <DashboardPreview />
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-purple-700 via-blue-600 to-green-500 py-10 lg:py-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="text-white space-y-6">
            <motion.h3 
              whileHover={{ scale: 1.05 }}
              className="text-4xl md:text-5xl font-extrabold drop-shadow-md cursor-pointer"
            >
              247School
            </motion.h3>
            <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mx-auto">{t.footerTagline}</p>
            <div className="flex justify-center space-x-6 md:space-x-8 text-5xl py-6">
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>🎓</motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>📚</motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>⭐</motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🏆</motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}>🚀</motion.span>
            </div>
            <div className="w-24 h-1 bg-white/20 mx-auto rounded-full my-8"></div>
            <p className="text-base font-medium opacity-75">
              {t.footerCopy}
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
