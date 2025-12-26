
import { Calculator, BookOpen, Beaker, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const subjects = [
  {
    id: 'math',
    title: 'Mathematics',
    description: 'Numbers, shapes, and problem-solving adventures!',
    icon: Calculator,
    color: 'bg-gradient-to-br from-blue-100 to-purple-100',
    iconColor: 'text-blue-600',
    buttonColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
    route: '/lessons/nursery-math',
    emoji: '🔢'
  },
  {
    id: 'english',
    title: 'English',
    description: 'Stories, grammar, and vocabulary building!',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-green-100 to-blue-100',
    iconColor: 'text-green-600',
    buttonColor: 'bg-gradient-to-r from-green-500 to-blue-600',
    route: '/lessons/nursery-english',
    emoji: '📚'
  },
  {
    id: 'bangla',
    title: 'বাংলা (Bangla)',
    description: 'আমাদের সুন্দর ভাষা এবং সাহিত্য!',
    icon: Globe,
    color: 'bg-gradient-to-br from-orange-100 to-pink-100',
    iconColor: 'text-orange-600',
    buttonColor: 'bg-gradient-to-r from-orange-500 to-pink-600',
    route: '/lessons/nursery-bangla',
    emoji: '🇧🇩'
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Discover the wonders of our amazing world!',
    icon: Beaker,
    color: 'bg-gradient-to-br from-purple-100 to-pink-100',
    iconColor: 'text-purple-600',
    buttonColor: 'bg-gradient-to-r from-purple-500 to-pink-600',
    route: '/lessons/nursery-science',
    emoji: '🔬'
  }
];

const SubjectsSection = () => {
  const navigate = useNavigate();

  const handleSubjectClick = (route: string) => {
    navigate(route);
  };

  return (
    <section id="subjects" className="py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            Choose Your <span className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue bg-clip-text text-transparent">Learning Adventure</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-150">
            Pick a subject and start your journey of discovery! Each subject is packed with fun lessons and interactive activities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {subjects.map((subject, index) => (
            <Card
              key={subject.id}
              className={`${subject.color} border-0 playful-shadow subject-card cursor-pointer animate-fade-in hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleSubjectClick(subject.route)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 animate-bounce-gentle">{subject.emoji}</div>
                <CardTitle className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                  {subject.title}
                </CardTitle>
                <p className="text-gray-600 text-sm lg:text-base">{subject.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full ${subject.buttonColor} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-base lg:text-lg py-3`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectClick(subject.route);
                  }}
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                </Button>
                
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Interactive
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    Fun
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



        <div className="text-center mt-12 lg:mt-16">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="border-2 border-eduplay-purple text-eduplay-purple hover:bg-eduplay-purple hover:text-white text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 animate-fade-in delay-700"
          >
            View Progress Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
