
import { Play, Sparkles, BookOpen, Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';

interface HeroSectionProps {
  userCount: number;
  lessonCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userCount, lessonCount }) => {
  const navigate = useNavigate();
  const { t } = useLang();

  const handleStartLearning = () => {
    const subjectsSection = document.getElementById('subjects');
    if (subjectsSection) {
      subjectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSubjects = () => {
    const subjectsSection = document.getElementById('subjects');
    if (subjectsSection) {
      subjectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatCount = (count: number) => {
    if (count === 0) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return count;
  };

  return (
    <section id="hero-section" className="relative py-8 sm:py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-white via-purple-50/50 to-blue-50/30 w-full max-w-full">
      {/* Background Elements - Adjusted for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 lg:top-20 left-5 lg:left-10 w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-30 blur-xl" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-20 lg:top-40 right-10 lg:right-20 w-16 lg:w-24 h-16 lg:h-24 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-30 blur-xl" 
        />
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-20 left-1/4 w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-green-300 to-teal-400 rounded-full opacity-30 blur-xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 lg:top-60 left-1/2 w-8 lg:w-12 h-8 lg:h-12 bg-gradient-to-br from-orange-300 to-red-400 rounded-full opacity-30 blur-xl" 
        />
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 lg:bottom-40 right-1/3 w-14 lg:w-20 h-14 lg:h-20 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full opacity-30 blur-xl" 
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left space-y-5 lg:space-y-8"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-3 lg:px-4 py-2 rounded-full border border-eduplay-purple/20 shadow-sm"
              >
                <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 text-eduplay-purple mr-2 animate-pulse" />
                <span className="text-eduplay-purple font-semibold text-sm lg:text-base">{t.heroTag}</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent block pb-2">
                  {t.heroWelcome}
                </span>
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform duration-300">
                  247School!
                </span>
              </h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-medium"
              >
                {t.heroSubtitle} 🚀
                <br />
                <span className="text-base lg:text-lg font-normal text-gray-500">{t.heroDesc}</span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-row gap-3 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handleStartLearning}
                className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-8 rounded-2xl flex-1 sm:flex-none font-bold"
              >
                <Play className="w-4 sm:w-6 h-4 sm:h-6 mr-1.5 sm:mr-3" />
                {t.heroStart}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleExploreSubjects}
                className="bg-white/80 backdrop-blur-md border-2 border-eduplay-purple text-eduplay-purple hover:bg-eduplay-purple hover:text-white text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-8 rounded-2xl transition-all duration-300 hover:scale-105 flex-1 sm:flex-none font-bold"
              >
                <BookOpen className="w-4 sm:w-6 h-4 sm:h-6 mr-1.5 sm:mr-3" />
                {t.heroExplore}
              </Button>
            </motion.div>



            {/* Stats - Mobile Optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-3 gap-3 lg:gap-6 pt-6 lg:pt-10"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4 lg:p-6 bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl shadow-xl shadow-purple-200/20 cursor-pointer group">
                <div className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">{formatCount(userCount)}</div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1 font-medium">{t.heroStudents}</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4 lg:p-6 bg-white/80 backdrop-blur-md border border-green-100 rounded-3xl shadow-xl shadow-green-200/20 cursor-pointer group">
                <div className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">{formatCount(lessonCount)}</div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1 font-medium">{t.heroLessons}</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4 lg:p-6 bg-white/80 backdrop-blur-md border border-orange-100 rounded-3xl shadow-xl shadow-orange-200/20 cursor-pointer group">
                <div className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">99%</div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1 font-medium">{t.heroFree}</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column — hidden on mobile to reduce scroll */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="relative mt-0 perspective-1000 hidden lg:block"
          >
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[3rem] p-4 lg:p-8 shadow-2xl shadow-purple-500/20 backdrop-blur-xl border border-white/40 group relative transform-style-3d hover:rotate-y-[-5deg] hover:rotate-x-[5deg] transition-transform duration-700">
              {/* Decorative corner shapes */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-400 rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="aspect-square bg-white/60 backdrop-blur-sm rounded-[2rem] p-4 lg:p-8 flex flex-col items-center justify-center space-y-4 lg:space-y-6 border border-white/60 shadow-inner">
                <div className="text-center space-y-3 lg:space-y-4 relative z-10">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl lg:text-8xl drop-shadow-lg">🎓</motion.div>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl lg:text-6xl drop-shadow-md">📚</motion.div>
                  <div className="flex justify-center space-x-2 lg:space-x-4">
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl lg:text-4xl drop-shadow-md">⭐</motion.span>
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="text-2xl lg:text-4xl drop-shadow-md">🎯</motion.span>
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} className="text-2xl lg:text-4xl drop-shadow-md">🏆</motion.span>
                  </div>
                </div>

                {/* Fun Games Buttons */}
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate('/counting-game')}
                      className="w-full bg-gradient-to-r from-eduplay-green to-eduplay-blue hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">🔢</span>
                      Counting
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate('/addition-game')}
                      className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">➕</span>
                      Addition
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate('/subtraction-game')}
                      className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">➖</span>
                      Subtraction
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate('/multiplication-game')}
                      className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">✖️</span>
                      Multiplication
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate('/memory-match')}
                      className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">🎴</span>
                      Memory Match
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate('/plant-explorer')}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">🌱</span>
                      Plant Explorer
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate('/animal-quiz')}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">🦁</span>
                      Animal Quiz
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate('/spelling-wizard')}
                      className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs py-2 px-2 rounded-lg"
                    >
                      <span className="text-sm mr-1">✨</span>
                      Spelling Wizard
                    </Button>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 px-4 lg:px-6 py-2 lg:py-3 rounded-full shadow-sm border border-pink-200"
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    <Heart className="w-4 lg:w-5 h-4 lg:h-5 text-red-500 fill-red-500" />
                  </motion.div>
                  <span className="font-bold text-gray-800 text-xs lg:text-sm">Made with Love</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
