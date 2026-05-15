import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { playSound } from '@/services/audioService';
import confetti from 'canvas-confetti';

interface Animal {
  name: string;
  emoji: string;
  sound: string;
  habitat: string;
  food: string;
  fact: string;
}

const animals: Animal[] = [
  { name: 'গরু', emoji: '🐄', sound: 'হাম্বা হাম্বা', habitat: 'খামার', food: 'ঘাস', fact: 'গরু আমাদের দুধ দেয়' },
  { name: 'বিড়াল', emoji: '🐱', sound: 'মিউ মিউ', habitat: 'বাড়ি', food: 'মাছ', fact: 'বিড়াল রাতে দেখতে পায়' },
  { name: 'কুকুর', emoji: '🐶', sound: 'ঘেউ ঘেউ', habitat: 'বাড়ি', food: 'মাংস', fact: 'কুকুর খুব বিশ্বস্ত প্রাণী' },
  { name: 'হাতি', emoji: '🐘', sound: 'পটপট', habitat: 'জঙ্গল', food: 'পাতা', fact: 'হাতি সবচেয়ে বড় স্থলজ প্রাণী' },
  { name: 'বাঘ', emoji: '🐯', sound: 'গর্জন', habitat: 'জঙ্গল', food: 'মাংস', fact: 'বাঘ বাংলাদেশের জাতীয় পশু' },
  { name: 'পাখি', emoji: '🐦', sound: 'কিচিরমিচির', habitat: 'গাছ', food: 'শস্য', fact: 'পাখি উড়তে পারে' },
  { name: 'মাছ', emoji: '🐟', sound: 'নীরব', habitat: 'পানি', food: 'পোকা', fact: 'মাছ পানিতে বাস করে' },
  { name: 'ব্যাঙ', emoji: '🐸', sound: 'ব্যাং ব্যাং', habitat: 'পুকুর', food: 'পোকা', fact: 'ব্যাঙ লাফাতে পারে' },
  { name: 'মুরগি', emoji: '🐔', sound: 'কুক কুক', habitat: 'খামার', food: 'শস্য', fact: 'মুরগি থেকে আমরা ডিম পাই' },
  { name: 'ভেড়া', emoji: '🐑', sound: 'ভ্যাঁ ভ্যাঁ', habitat: 'খামার', food: 'ঘাস', fact: 'ভেড়া থেকে পশম পাওয়া যায়' },
  { name: 'কচ্ছপ', emoji: '🐢', sound: 'নীরব', habitat: 'পানি', food: 'পাতা', fact: 'কচ্ছপ খুব ধীর চলে' },
  { name: 'খরগোশ', emoji: '🐰', sound: 'চিক চিক', habitat: 'মাটির গর্ত', food: 'গাজর', fact: 'খরগোশ খুব দ্রুত দৌড়ায়' },
];

interface Question {
  type: 'sound' | 'habitat' | 'food';
  animal: Animal;
  question: string;
  correctAnswer: string;
  options: string[];
}

const AnimalQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime] = useState(new Date());
  const maxQuestions = 10;
  const { trackGameComplete } = useLessonProgress();
  const { user } = useAuth();

  const generateQuestion = (): Question => {
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const questionTypes: ('sound' | 'habitat' | 'food')[] = ['sound', 'habitat', 'food'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let question = '';
    let correctAnswer = '';
    let wrongAnswers: string[] = [];

    switch (randomType) {
      case 'sound':
        question = `${randomAnimal.emoji} ${randomAnimal.name} কি শব্দ করে?`;
        correctAnswer = randomAnimal.sound;
        wrongAnswers = animals
          .filter(a => a.name !== randomAnimal.name)
          .map(a => a.sound)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
      case 'habitat':
        question = `${randomAnimal.emoji} ${randomAnimal.name} কোথায় বাস করে?`;
        correctAnswer = randomAnimal.habitat;
        wrongAnswers = animals
          .filter(a => a.name !== randomAnimal.name)
          .map(a => a.habitat)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
      case 'food':
        question = `${randomAnimal.emoji} ${randomAnimal.name} কি খায়?`;
        correctAnswer = randomAnimal.food;
        wrongAnswers = animals
          .filter(a => a.name !== randomAnimal.name)
          .map(a => a.food)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
    }

    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      type: randomType,
      animal: randomAnimal,
      question,
      correctAnswer,
      options
    };
  };

  const handleGameCompletion = async () => {
    if (!user) return;

    const finalScore = score * 100;
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));

    await trackGameComplete(
      'Animal Quiz',
      finalScore,
      {
        correct_answers: score,
        total_questions: maxQuestions,
        accuracy: (score / maxQuestions) * 100,
        time_spent: timeSpent
      }
    );

    if (score === maxQuestions) {
      playSound('levelUp');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const generateNewQuestion = () => {
    if (questionCount >= maxQuestions) {
      setGameCompleted(true);
      handleGameCompletion();
      return;
    }

    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
    setSelectedAnswer(null);
    setWrongAnswers([]);
    setFeedback('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const checkAnswer = (answer: string) => {
    if (!currentQuestion || wrongAnswers.includes(answer)) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      playSound('correct');
      setFeedback(`🎉 অসাধারণ! সঠিক উত্তর! ${currentQuestion.animal.fact}`);
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setQuestionCount(prev => prev + 1);
      setShowFeedback(true);

      setTimeout(() => {
        generateNewQuestion();
      }, 2000);
    } else {
      playSound('wrong');
      setWrongAnswers(prev => [...prev, answer]);
      setFeedback('❌ আবার চেষ্টা করো! সঠিক উত্তরটি বেছে নাও');
      setIsCorrect(false);
      setShowFeedback(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameCompleted(false);
    generateNewQuestion();
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-6 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 animate-scale-in">
                <ArrowLeft className="w-4 h-4 mr-2" />
                হোমে ফিরুন
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-bounce-gentle">🐾 প্রাণী কুইজ</h1>
              <p className="text-lg opacity-90">প্রাণী সম্পর্কে জানো!</p>
            </div>

            <div className="text-center bg-white/20 rounded-2xl p-4 animate-scale-in">
              <div className="text-2xl font-bold">স্কোর: {score}/{questionCount}</div>
              <div className="text-sm opacity-90">প্রশ্ন: {questionCount + 1}/{maxQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!gameCompleted && currentQuestion ? (
          <Card className="max-w-4xl mx-auto border-0 playful-shadow animate-fade-in">
            <CardContent className="p-8">
              <div className="text-center space-y-8">
                <div className="text-8xl animate-bounce-gentle">{currentQuestion.animal.emoji}</div>

                <h2 className="text-2xl font-bold text-gray-800 animate-slide-in-right">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const isWrong = wrongAnswers.includes(option);
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = option === currentQuestion.correctAnswer;
                    const showCorrect = isCorrect && isCorrectAnswer;

                    return (
                      <Button
                        key={index}
                        onClick={() => checkAnswer(option)}
                        disabled={isWrong || (isCorrect && showFeedback)}
                        className={`h-16 text-xl font-bold rounded-xl transition-colors duration-200 ${
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

                {showFeedback && (
                  <div className="space-y-6 animate-fade-in">
                    <div className={`text-xl font-bold p-6 rounded-2xl ${
                      isCorrect
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    }`}>
                      {feedback}
                    </div>
                  </div>
                )}

                <div className="text-center space-y-2 animate-fade-in delay-500">
                  <div className="text-4xl animate-wiggle">🌟</div>
                  <p className="text-lg text-gray-600 font-medium">
                    প্রাণী সম্পর্কে শিখতে থাকো!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : gameCompleted ? (
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
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 rounded-xl transition-colors duration-200"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  আবার খেলো! 🎮
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg" className="w-full text-base px-4 py-3 rounded-xl border-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                      📊 ড্যাশবোর্ড
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg" className="w-full text-base px-4 py-3 rounded-xl border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                      🎮 আরও গেম
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default AnimalQuiz;
