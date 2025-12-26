import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { playSound } from '@/services/audioService';

// Fun objects for counting
const gameObjects = [
  { emoji: '🌸', name: 'flowers' },
  { emoji: '🍃', name: 'leaves' },
  { emoji: '🌳', name: 'trees' },
  { emoji: '🐦', name: 'birds' },
  { emoji: '⚽', name: 'balls' },
  { emoji: '🏏', name: 'bats' },
  { emoji: '🦋', name: 'butterflies' },
  { emoji: '🍎', name: 'apples' },
  { emoji: '🍌', name: 'bananas' },
  { emoji: '🌟', name: 'stars' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🐱', name: 'cats' },
  { emoji: '🐶', name: 'dogs' },
  { emoji: '🚗', name: 'cars' },
  { emoji: '🎯', name: 'targets' },
  { emoji: '🍓', name: 'strawberries' },
  { emoji: '🌺', name: 'hibiscus' },
  { emoji: '🐝', name: 'bees' }
];

const CountingGame = () => {
  const [currentObject, setCurrentObject] = useState(gameObjects[0]);
  const [objectCount, setObjectCount] = useState(5);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [startTime] = useState(new Date());
  const maxQuestions = 10;
  const { trackGameComplete } = useLessonProgress();
  const { user } = useAuth();

  // Generate random options including the correct answer
  const generateOptions = (correctAnswer: number) => {
    const optionsSet = new Set([correctAnswer]);
    
    while (optionsSet.size < 4) {
      let randomOption;
      if (correctAnswer <= 3) {
        randomOption = Math.floor(Math.random() * 6) + 1; // 1-6 for small numbers
      } else if (correctAnswer >= 8) {
        randomOption = Math.floor(Math.random() * 6) + 5; // 5-10 for large numbers
      } else {
        randomOption = Math.floor(Math.random() * 10) + 1; // 1-10 for middle numbers
      }
      optionsSet.add(randomOption);
    }
    
    return Array.from(optionsSet).sort(() => Math.random() - 0.5); // Shuffle
  };

  const handleGameCompletion = async () => {
    if (!user) return;

    const finalScore = score * 100; // Convert to points
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));

    await trackGameComplete(
      'Counting Game',
      finalScore,
      {
        correct_answers: score,
        total_questions: maxQuestions,
        accuracy: (score / maxQuestions) * 100,
        objects_counted: totalQuestions * objectCount
      }
    );
  };

  // Generate a new random round
  const generateNewRound = () => {
    if (totalQuestions >= maxQuestions) {
      setGameCompleted(true);
      handleGameCompletion();
      return;
    }

    const randomObject = gameObjects[Math.floor(Math.random() * gameObjects.length)];
    const randomCount = Math.floor(Math.random() * 10) + 1; // 1-10 objects
    const newOptions = generateOptions(randomCount);
    
    setCurrentObject(randomObject);
    setObjectCount(randomCount);
    setOptions(newOptions);
    setSelectedAnswer(null);
    setWrongAnswers([]);
    setFeedback('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  // Check the user's answer
  const checkAnswer = (answer: number) => {
    if (wrongAnswers.includes(answer)) return;

    setSelectedAnswer(answer);

    if (answer === objectCount) {
      playSound('correct');
      setFeedback('🎉 অসাধারণ! সঠিক উত্তর!');
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setTotalQuestions(prev => prev + 1);
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(true);

      setTimeout(() => {
        generateNewRound();
      }, 1500);
    } else {
      playSound('wrong');
      setWrongAnswers(prev => [...prev, answer]);
      setFeedback('❌ আবার চেষ্টা করো! সঠিক উত্তরটি বেছে নাও');
      setIsCorrect(false);
      setShowFeedback(true);
    }
  };

  // Reset game
  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setCurrentQuestion(1);
    setGameCompleted(false);
    generateNewRound();
  };

  // Initialize first round
  useEffect(() => {
    generateNewRound();
  }, []);

  // Create array of objects to display
  const objectsToDisplay = Array(objectCount).fill(currentObject.emoji);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-eduplay-purple to-eduplay-pink text-white py-6 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 animate-scale-in">
                <ArrowLeft className="w-4 h-4 mr-2" />
                হোমে ফিরুন
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-bounce-gentle">🔢 গণনা কুইজ</h1>
              <p className="text-lg opacity-90">বস্তু গুনে সঠিক উত্তর দিন!</p>
            </div>

            <div className="text-center bg-white/20 rounded-2xl p-4 animate-scale-in">
              <div className="text-2xl font-bold">স্কোর: {score}/{totalQuestions}</div>
              <div className="text-sm opacity-90">প্রশ্ন: {currentQuestion}/{maxQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        {!gameCompleted ? (
          <Card className="max-w-4xl mx-auto border-0 playful-shadow animate-fade-in">
            <CardContent className="p-8">
              <div className="text-center space-y-8">
                {/* Question */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 animate-slide-in-right">
                    কতগুলো {currentObject.name} দেখতে পাচ্ছো?
                  </h2>
                  
                  {/* Objects Display Area */}
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 min-h-[300px] flex flex-wrap items-center justify-center gap-4 animate-scale-in">
                    {objectsToDisplay.map((emoji, index) => (
                      <span 
                        key={index} 
                        className="text-6xl animate-bounce-gentle hover:scale-110 transition-transform duration-300"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animationDuration: '2s'
                        }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-700">সঠিক উত্তরটি বেছে নিন:</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {options.map((option) => {
                      const isWrong = wrongAnswers.includes(option);
                      const isCorrectAnswer = option === objectCount;
                      const showCorrect = isCorrect && isCorrectAnswer;

                      return (
                        <Button
                          key={option}
                          onClick={() => checkAnswer(option)}
                          disabled={isWrong || (isCorrect && showFeedback)}
                          className={`h-16 text-2xl font-bold rounded-xl transition-colors duration-200 ${
                            showCorrect
                              ? 'bg-green-500 text-white border-2 border-green-600'
                              : isWrong
                              ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {option}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="space-y-6 animate-fade-in">
                      <div className={`text-2xl font-bold p-6 rounded-2xl ${
                        isCorrect
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                      }`}>
                        {feedback}
                      </div>
                    </div>
                  )}
                </div>

                {/* Encouragement */}
                <div className="text-center space-y-2 animate-fade-in delay-500">
                  <div className="text-4xl animate-wiggle">🌟</div>
                  <p className="text-lg text-gray-600 font-medium">
                    তুমি দারুণ করছো! গণনা করতে থাকো আর শিখতে থাকো!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Game Completed Screen */
          <Card className="max-w-2xl mx-auto border-0 playful-shadow animate-fade-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-8xl animate-bounce-gentle">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800">খেলা শেষ!</h2>
              <p className="text-xl text-gray-600">
                অসাধারণ! তুমি সব প্রশ্নের উত্তর দিয়েছো।
              </p>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-2xl font-bold text-orange-800">তোমার ফলাফল:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600">{score}</div>
                    <div className="text-sm text-gray-600">সঠিক উত্তর</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-blue-600">{Math.round((score / maxQuestions) * 100)}%</div>
                    <div className="text-sm text-gray-600">নির্ভুলতা</div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-1">
                  {[...Array(Math.min(5, Math.ceil((score / maxQuestions) * 5)))].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-current animate-pulse" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 rounded-xl transition-colors duration-200"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  আবার খেলো! 🎮
                </Button>
                
                <div>
                  <Link to="/">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3 rounded-xl transition-colors duration-200">
                      হোমে ফিরুন
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Stats - Only show during game */}
        {totalQuestions > 0 && !gameCompleted && (
          <Card className="max-w-2xl mx-auto mt-8 border-0 playful-shadow animate-fade-in">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">তোমার অগ্রগতি 📊</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                  <div className="text-sm text-blue-800">প্রশ্ন</div>
                </div>
                <div className="bg-green-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-green-800">সঠিক</div>
                </div>
                <div className="bg-purple-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                  </div>
                  <div className="text-sm text-purple-800">নির্ভুলতা</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CountingGame;