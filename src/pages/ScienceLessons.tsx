import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Star, Trophy, Clock, Volume2, StopCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AudioService } from '@/services/audioService';

const scienceLessons = [
  {
    id: 1,
    title: "My Five Senses",
    description: "See, Hear, Touch, Taste, and Smell!",
    duration: "14 min",
    difficulty: "Easy",
    completed: true,
    stars: 3,
    emoji: "👁️"
  },
  {
    id: 2,
    title: "Animals Around Us",
    description: "Learn about different animals and pets!",
    duration: "15 min",
    difficulty: "Easy",
    completed: true,
    stars: 2,
    emoji: "🐾"
  },
  {
    id: 3,
    title: "Plants and Trees",
    description: "Discover how plants grow!",
    duration: "12 min",
    difficulty: "Easy",
    completed: false,
    stars: 0,
    emoji: "🌱"
  },
  {
    id: 4,
    title: "Weather Wonders",
    description: "Learn about sun, rain, and clouds!",
    duration: "13 min",
    difficulty: "Easy",
    completed: false,
    stars: 0,
    emoji: "🌤️"
  },
  {
    id: 5,
    title: "Day and Night",
    description: "Why do we have day and night?",
    duration: "16 min",
    difficulty: "Medium",
    completed: false,
    stars: 0,
    emoji: "🌙"
  },
  {
    id: 6,
    title: "Healthy Foods",
    description: "Learn what foods keep us healthy!",
    duration: "14 min",
    difficulty: "Easy",
    completed: false,
    stars: 0,
    emoji: "🥗"
  },
  {
    id: 7,
    title: "Water Cycle",
    description: "Where does rain come from?",
    duration: "15 min",
    difficulty: "Medium",
    completed: false,
    stars: 0,
    emoji: "💧"
  },
  {
    id: 8,
    title: "Living and Non-Living",
    description: "What is alive and what is not?",
    duration: "13 min",
    difficulty: "Medium",
    completed: false,
    stars: 0,
    emoji: "🌍"
  },
  {
    id: 9,
    title: "Our Planet Earth",
    description: "Learn about land, water, and air!",
    duration: "16 min",
    difficulty: "Medium",
    completed: false,
    stars: 0,
    emoji: "🌎"
  },
  {
    id: 10,
    title: "Growing Seeds",
    description: "Watch a seed grow into a plant!",
    duration: "14 min",
    difficulty: "Easy",
    completed: false,
    stars: 0,
    emoji: "🌻"
  },
  {
    id: 11,
    title: "Magnets",
    description: "Discover the magic of magnets!",
    duration: "15 min",
    difficulty: "Medium",
    completed: false,
    stars: 0,
    emoji: "🧲"
  },
  {
    id: 12,
    title: "Recycling",
    description: "Learn how to keep Earth clean!",
    duration: "13 min",
    difficulty: "Easy",
    completed: false,
    stars: 0,
    emoji: "♻️"
  }
];

const ScienceLessons = () => {
  const [narratingLessonId, setNarratingLessonId] = useState<number | null>(null);
  const audioService = AudioService.getInstance();

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, [audioService]);

  const handleNarration = (lesson: typeof scienceLessons[0]) => {
    if (narratingLessonId === lesson.id) {
      audioService.stop();
      setNarratingLessonId(null);
    } else {
      const textToRead = `${lesson.title}. ${lesson.description}`;
      audioService.playText(textToRead).then(() => {
        setNarratingLessonId(null);
      });
      setNarratingLessonId(lesson.id);
    }
  };

  const completedLessons = scienceLessons.filter(lesson => lesson.completed).length;
  const totalStars = scienceLessons.reduce((sum, lesson) => sum + lesson.stars, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-8 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 transition-all hover:scale-105">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-6xl mr-4 animate-bounce-gentle">🔬</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 animate-slide-in-right">Nursery Science Adventures</h1>
                  <p className="text-xl opacity-90 animate-fade-in delay-150">Discover the wonders of our amazing world!</p>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/20 rounded-2xl p-6 animate-scale-in">
              <div className="text-3xl font-bold">{completedLessons}/{scienceLessons.length}</div>
              <div className="text-sm opacity-90">Lessons Complete</div>
              <div className="flex items-center justify-center mt-2">
                <Star className="w-5 h-5 mr-1 text-yellow-300 animate-pulse" />
                <span className="font-bold">{totalStars}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-0 playful-shadow animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Your Progress</h3>
              <Badge className="bg-eduplay-green text-white animate-scale-in">
                {Math.round((completedLessons / scienceLessons.length) * 100)}% Complete
              </Badge>
            </div>
            <Progress value={(completedLessons / scienceLessons.length) * 100} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scienceLessons.map((lesson, index) => (
            <Card
              key={lesson.id}
              className="border-0 playful-shadow hover:shadow-xl transition-all group hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2 group-hover:animate-bounce">{lesson.emoji}</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 transition-all ${i < lesson.stars ? 'text-yellow-400 fill-current animate-pulse' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-teal-600 transition-colors">{lesson.title}</CardTitle>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.duration}
                  </div>
                  <Badge variant={lesson.difficulty === 'Easy' ? 'secondary' : lesson.difficulty === 'Medium' ? 'outline' : 'destructive'}>
                    {lesson.difficulty}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Link to={`/lesson/science/${lesson.id}`} className="flex-grow">
                      <Button
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleNarration(lesson)}
                    >
                      {narratingLessonId === lesson.id ? <StopCircle className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                  </div>

                  {lesson.completed && (
                    <Link to={`/quiz/science/${lesson.id}`}>
                      <Button variant="outline" className="w-full hover:bg-teal-500/10 transition-all">
                        <Trophy className="w-4 h-4 mr-2" />
                        Take Quiz
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScienceLessons;
