import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Target, Zap, Star } from 'lucide-react';

const games = [
  {
    id: 'counting',
    title: 'গণনা কুইজ',
    description: 'বস্তু গুনে সঠিক উত্তর দিন!',
    emoji: '🔢',
    path: '/counting-game',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50',
    difficulty: 'Easy',
    category: 'Math'
  },
  {
    id: 'addition',
    title: 'যোগের খেলা',
    description: 'সংখ্যা যোগ করে মজা করো!',
    emoji: '➕',
    path: '/addition-game',
    color: 'from-green-500 to-blue-600',
    bgColor: 'bg-green-50',
    difficulty: 'Easy',
    category: 'Math'
  },
  {
    id: 'subtraction',
    title: 'বিয়োগের খেলা',
    description: 'সংখ্যা বিয়োগ করে শিখো!',
    emoji: '➖',
    path: '/subtraction-game',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    difficulty: 'Medium',
    category: 'Math'
  },
  {
    id: 'multiplication',
    title: 'গুণের খেলা',
    description: 'গুণের টেবিল মুখস্থ করো!',
    emoji: '✖️',
    path: '/multiplication-game',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    difficulty: 'Hard',
    category: 'Math'
  },
  {
    id: 'spelling-wizard',
    title: 'স্পেলিং উইজার্ড',
    description: '১-৫০ পর্যন্ত সংখ্যার ইংরেজি বানান প্র্যাকটিস করো!',
    emoji: '🪄',
    path: '/spelling-wizard',
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-50',
    difficulty: 'Easy',
    category: 'Language'
  },
  {
    id: 'animal-quiz',
    title: 'প্রাণী কুইজ',
    description: 'প্রাণী সম্পর্কে জানো!',
    emoji: '🐾',
    path: '/animal-quiz',
    color: 'from-green-500 to-blue-600',
    bgColor: 'bg-green-50',
    difficulty: 'Easy',
    category: 'Science',
    isNew: true
  },
  {
    id: 'plant-explorer',
    title: 'উদ্ভিদ অন্বেষক',
    description: 'উদ্ভিদ সম্পর্কে শিখো!',
    emoji: '🌱',
    path: '/plant-explorer',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    difficulty: 'Medium',
    category: 'Science',
    isNew: true
  },
  {
    id: 'memory-match',
    title: 'স্মৃতি মিলান',
    description: 'কার্ড মিলিয়ে স্মৃতিশক্তি বাড়াও!',
    emoji: '🧠',
    path: '/memory-match',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50',
    difficulty: 'Easy',
    category: 'Memory',
    isNew: true
  }
];

const GamesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent">
              ইন্টারঅ্যাক্টিভ গেমস 🎮
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            মজার গেম খেলে শিখো! প্রতিটি গেম তোমার দক্ষতা বাড়াবে এবং জ্ঞান বৃদ্ধি করবে 🌟
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {games.map((game, index) => (
            <Card 
              key={game.id} 
              className="border-0 playful-shadow bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group relative"
            >
              {game.isNew && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                    নতুন! 🎉
                  </div>
                </div>
              )}
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${game.color} group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{game.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-eduplay-purple transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {game.difficulty}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{game.category}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {game.description}
                </p>

                <Link to={game.path} className="block">
                  <Button 
                    className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold`}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    খেলো!
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 playful-shadow bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">{games.length}</div>
              <div className="text-sm text-gray-600 font-medium">ইন্টারঅ্যাক্টিভ গেম</div>
            </CardContent>
          </Card>

          <Card className="border-0 playful-shadow bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">5+</div>
              <div className="text-sm text-gray-600 font-medium">শিক্ষামূলক বিষয়</div>
            </CardContent>
          </Card>

          <Card className="border-0 playful-shadow bg-gradient-to-br from-orange-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-sm text-gray-600 font-medium">মজা গ্যারান্টি</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
