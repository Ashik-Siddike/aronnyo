
import { Calculator, BookOpen, Beaker, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { motion } from 'framer-motion';

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
  const { t } = useLang();

  const subjects = [
    { id:'math',    titleKey:'math'    as const, descKey:'mathDesc'    as const, icon:Calculator, color:'bg-gradient-to-br from-blue-100 to-purple-100',   iconColor:'text-blue-600',   buttonColor:'bg-gradient-to-r from-blue-500 to-purple-600',  route:'/lessons/nursery-math',    emoji:'🔢' },
    { id:'english', titleKey:'english' as const, descKey:'englishDesc' as const, icon:BookOpen,   color:'bg-gradient-to-br from-green-100 to-blue-100',   iconColor:'text-green-600',  buttonColor:'bg-gradient-to-r from-green-500 to-blue-600',   route:'/lessons/nursery-english', emoji:'📚' },
    { id:'bangla',  titleKey:'bangla'  as const, descKey:'banglaDesc'  as const, icon:Globe,       color:'bg-gradient-to-br from-orange-100 to-pink-100',  iconColor:'text-orange-600', buttonColor:'bg-gradient-to-r from-orange-500 to-pink-600',  route:'/lessons/nursery-bangla',  emoji:'🇧🇩' },
    { id:'science', titleKey:'science' as const, descKey:'scienceDesc' as const, icon:Beaker,     color:'bg-gradient-to-br from-purple-100 to-pink-100',  iconColor:'text-purple-600', buttonColor:'bg-gradient-to-r from-purple-500 to-pink-600',  route:'/lessons/nursery-science', emoji:'🔬' },
  ];

  const handleSubjectClick = (route: string) => {
    navigate(route);
  };

  return (
    <section id="subjects" className="py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              {t.subjectsTitle}
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
            {t.subjectsSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', bounce: 0.4 }}
              className="h-full"
            >
              <Card
                className={`${subject.color} border-0 playful-shadow subject-card cursor-pointer hover:scale-105 transition-transform duration-300 h-full flex flex-col active:scale-95`}
                onClick={() => handleSubjectClick(subject.route)}
              >
                <CardHeader className="text-center pb-2 pt-5 px-3">
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 animate-bounce-gentle">{subject.emoji}</div>
                  <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1">
                    {t[subject.titleKey]}
                  </CardTitle>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium hidden sm:block">{t[subject.descKey]}</p>
                </CardHeader>

                <CardContent className="pt-0 mt-auto px-3 pb-4">
                  <Button
                    className={`w-full ${subject.buttonColor} text-white text-xs sm:text-base py-4 sm:py-6 font-bold rounded-xl`}
                    onClick={(e) => { e.stopPropagation(); handleSubjectClick(subject.route); }}
                  >
                    {t.startLearning}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>



        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 lg:mt-16"
        >
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="bg-white/80 backdrop-blur-md border-2 border-eduplay-purple text-eduplay-purple hover:bg-eduplay-purple hover:text-white text-lg lg:text-xl px-10 py-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold"
          >
            View Progress Dashboard
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SubjectsSection;
