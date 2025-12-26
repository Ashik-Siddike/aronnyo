
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Sparkles, Star, Trophy } from 'lucide-react';

const ClassSelector = () => {
  const navigate = useNavigate();

  const standards = [
    { value: '1st', label: '1st', age: '6-7 years', color: 'bg-gradient-to-br from-red-200 via-red-300 to-pink-300', border: 'border-red-300', hover: 'hover:from-red-300 hover:to-pink-400', emoji: '🌟' },
    { value: '2nd', label: '2nd', age: '7-8 years', color: 'bg-gradient-to-br from-orange-200 via-orange-300 to-yellow-300', border: 'border-orange-300', hover: 'hover:from-orange-300 hover:to-yellow-400', emoji: '🎨' },
    { value: '3rd', label: '3rd', age: '8-9 years', color: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-300', border: 'border-yellow-300', hover: 'hover:from-yellow-300 hover:to-amber-400', emoji: '🚀' },
    { value: '4th', label: '4th', age: '9-10 years', color: 'bg-gradient-to-br from-green-200 via-green-300 to-emerald-300', border: 'border-green-300', hover: 'hover:from-green-300 hover:to-emerald-400', emoji: '📚' },
    { value: '5th', label: '5th', age: '10-11 years', color: 'bg-gradient-to-br from-blue-200 via-blue-300 to-sky-300', border: 'border-blue-300', hover: 'hover:from-blue-300 hover:to-sky-400', emoji: '🔬' },
  ];

  const handleGradeSelect = (gradeValue: string) => {
    navigate(`/class/${gradeValue}`);
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-purple-50/40 to-blue-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">✨</div>
        <div className="absolute top-40 right-20 text-5xl animate-bounce-gentle opacity-30">🌟</div>
        <div className="absolute bottom-32 left-20 text-4xl animate-wiggle opacity-25">🎨</div>
        <div className="absolute bottom-20 right-16 text-5xl animate-pulse opacity-20">🚀</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-purple-700 font-semibold">Start Your Learning Adventure</span>
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fade-in leading-tight">
            Choose Your 
            <span className="block bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent animate-scale-bounce">
              Learning Level
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto animate-fade-in delay-150 leading-relaxed">
            Select your current grade to access curriculum designed specifically for your level. 
            <span className="block mt-2 text-purple-600 font-medium">Every journey begins with a single step! 🌟</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 max-w-6xl mx-auto mb-16">
          {standards.map((standard, index) => (
            <div 
              key={standard.value} 
              className={`grade-${standard.value.replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')}`}
            >
              <Card
                className={`${standard.color} ${standard.border} ${standard.hover} border-3 cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-200/50 animate-fade-in transform hover:-translate-y-2 group relative overflow-hidden`}
                style={{ animationDelay: `${index * 120}ms` }}
                onClick={() => handleGradeSelect(standard.value)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${standard.label} Grade for students aged ${standard.age}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGradeSelect(standard.value);
                  }
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <CardContent className="p-5 text-center relative z-10">
                  <div className="text-4xl mb-3 animate-bounce-gentle group-hover:animate-wiggle">
                    {standard.emoji}
                  </div>
                  
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <GraduationCap className="w-8 h-8 text-gray-700 group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                    Grade {standard.label}
                  </h3>
                  <p className="text-base text-gray-600 font-medium mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {standard.age}
                  </p>
                  
                  <div className="flex justify-center items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <Star className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <Star className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm bg-white/80 px-4 py-2 rounded-full text-purple-700 font-semibold shadow-md">
                      Click to Explore!
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-white via-purple-50/80 to-white rounded-3xl p-10 shadow-2xl max-w-3xl mx-auto border border-purple-100 backdrop-blur-sm relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 text-2xl">📚</div>
              <div className="absolute top-8 right-8 text-2xl">🎓</div>
              <div className="absolute bottom-6 left-8 text-2xl">✨</div>
              <div className="absolute bottom-4 right-6 text-2xl">🌟</div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <Trophy className="w-12 h-12 text-yellow-500 animate-bounce-gentle" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                Ready to Start Your 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Learning Journey?</span>
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Choose any grade above to explore subjects and lessons designed just for that level! 
                <span className="block mt-2 font-medium text-purple-600">
                  Each grade is carefully crafted to match your learning needs. 🎯
                </span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm font-semibold text-gray-700">Interactive Lessons</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm font-semibold text-gray-700">Fun Activities</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-sm font-semibold text-gray-700">Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassSelector;
