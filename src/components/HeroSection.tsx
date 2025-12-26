
import { Play, Sparkles, BookOpen, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  userCount: number;
  lessonCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userCount, lessonCount }) => {
  const navigate = useNavigate();

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
    <section id="hero-section" className="relative py-12 lg:py-24 overflow-hidden">
      {/* Background Elements - Adjusted for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-10 lg:top-20 left-5 lg:left-10 w-12 lg:w-20 h-12 lg:h-20 bg-eduplay-yellow/30 rounded-full animate-float"></div>
        <div className="absolute top-20 lg:top-40 right-10 lg:right-20 w-10 lg:w-16 h-10 lg:h-16 bg-eduplay-pink/30 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 left-1/4 w-8 lg:w-12 h-8 lg:h-12 bg-eduplay-green/30 rounded-full animate-wiggle"></div>
        <div className="absolute top-40 lg:top-60 left-1/2 w-6 lg:w-8 h-6 lg:h-8 bg-eduplay-orange/30 rounded-full animate-float"></div>
        <div className="absolute bottom-32 lg:bottom-40 right-1/3 w-10 lg:w-14 h-10 lg:h-14 bg-eduplay-blue/30 rounded-full animate-scale-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-3 lg:px-4 py-2 rounded-full border border-eduplay-purple/20 animate-scale-in">
                <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 text-eduplay-purple mr-2 animate-pulse" />
                <span className="text-eduplay-purple font-semibold text-sm lg:text-base">Kids Learning Made Fun!</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent animate-slide-in-right">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-eduplay-orange via-eduplay-pink to-eduplay-purple bg-clip-text text-transparent animate-bounce-gentle">
               Kids Learning Website!
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed animate-fade-in delay-300">
                Where learning becomes an amazing adventure! 🚀
                <br />
                <span className="text-base lg:text-lg">Join thousands of kids having fun while learning Math, English, Bangla & Science!</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start animate-fade-in delay-500">
              <Button
                size="lg"
                onClick={handleStartLearning}
                className="bg-gradient-to-r from-eduplay-green to-eduplay-blue hover:shadow-xl transform hover:scale-110 transition-all duration-500 text-lg lg:text-xl py-4 lg:py-6 px-6 lg:px-8 rounded-2xl animate-wiggle hover:animate-scale-bounce w-full sm:w-auto"
              >
                <Play className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 animate-spin" />
                Start Learning
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleExploreSubjects}
                className="border-2 border-eduplay-purple text-eduplay-purple hover:bg-eduplay-purple hover:text-white text-lg lg:text-xl py-4 lg:py-6 px-6 lg:px-8 rounded-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <BookOpen className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 animate-wiggle" />
                Explore Subjects
              </Button>
            </div>



            {/* Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-2 lg:gap-4 pt-6 lg:pt-8 animate-fade-in delay-700">
              <div className="text-center p-3 lg:p-4 bg-white/50 rounded-2xl playful-shadow hover:scale-105 transition-all duration-300 animate-float cursor-pointer">
                <div className="text-lg lg:text-2xl font-bold text-eduplay-purple">{formatCount(userCount)}</div>
                <div className="text-xs lg:text-sm text-gray-600">Happy Students</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-white/50 rounded-2xl playful-shadow hover:scale-105 transition-all duration-300 animate-bounce-gentle cursor-pointer">
                <div className="text-lg lg:text-2xl font-bold text-eduplay-green">{formatCount(lessonCount)}</div>
                <div className="text-xs lg:text-sm text-gray-600">Fun Lessons</div>
              </div>
              <div className="text-center p-3 lg:p-4 bg-white/50 rounded-2xl playful-shadow hover:scale-105 transition-all duration-300 animate-wiggle cursor-pointer">
                <div className="text-lg lg:text-2xl font-bold text-eduplay-orange">99%</div>
                <div className="text-xs lg:text-sm text-gray-600">Love Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration - Mobile Optimized */}
          <div className="relative animate-scale-in delay-300 mt-8 lg:mt-0">
            <div className="bg-gradient-to-br from-eduplay-blue/20 via-eduplay-purple/20 to-eduplay-pink/20 rounded-3xl p-4 lg:p-8 playful-shadow hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 lg:p-8 flex flex-col items-center justify-center space-y-4 lg:space-y-6">
                <div className="text-center space-y-3 lg:space-y-4">
                  <div className="text-5xl lg:text-7xl animate-bounce-gentle">🎓</div>
                  <div className="text-3xl lg:text-5xl animate-wiggle">📚</div>
                  <div className="flex justify-center space-x-2 lg:space-x-3">
                    <span className="text-xl lg:text-3xl animate-float">⭐</span>
                    <span className="text-xl lg:text-3xl animate-scale-bounce">🎯</span>
                    <span className="text-xl lg:text-3xl animate-float delay-300">🏆</span>
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

                <div className="flex items-center justify-center space-x-2 bg-eduplay-yellow/20 px-2 lg:px-3 py-1 lg:py-2 rounded-full animate-pulse">
                  <Heart className="w-3 lg:w-4 h-3 lg:h-4 text-eduplay-red animate-wiggle" />
                  <span className="font-bold text-eduplay-purple text-xs lg:text-sm">Made with Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
