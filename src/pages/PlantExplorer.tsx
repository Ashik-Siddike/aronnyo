import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Star, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { playSound } from '@/services/audioService';

interface Plant {
  name: string;
  emoji: string;
  type: string;
  uses: string;
  growsIn: string;
  fact: string;
  parts: string[];
}

const plants: Plant[] = [
  {
    name: 'গোলাপ',
    emoji: '🌹',
    type: 'ফুল',
    uses: 'সাজসজ্জা',
    growsIn: 'বাগান',
    fact: 'গোলাপের সুগন্ধ খুব মিষ্টি',
    parts: ['পাপড়ি', 'কাঁটা', 'পাতা']
  },
  {
    name: 'আম গাছ',
    emoji: '🥭',
    type: 'ফলের গাছ',
    uses: 'ফল খাওয়া',
    growsIn: 'বাগান',
    fact: 'আম বাংলাদেশের জাতীয় ফল',
    parts: ['পাতা', 'ফল', 'ডাল']
  },
  {
    name: 'ধান',
    emoji: '🌾',
    type: 'শস্য',
    uses: 'খাদ্য',
    growsIn: 'জমি',
    fact: 'ধান থেকে চাল পাওয়া যায়',
    parts: ['শীষ', 'কাণ্ড', 'শিকড়']
  },
  {
    name: 'নারকেল গাছ',
    emoji: '🥥',
    type: 'ফলের গাছ',
    uses: 'ফল ও পানি',
    growsIn: 'উপকূল',
    fact: 'নারকেল গাছ সমুদ্রের কাছে জন্মায়',
    parts: ['ডাব', 'পাতা', 'কাণ্ড']
  },
  {
    name: 'টমেটো',
    emoji: '🍅',
    type: 'সবজি',
    uses: 'রান্না',
    growsIn: 'বাগান',
    fact: 'টমেটোতে ভিটামিন সি আছে',
    parts: ['ফল', 'পাতা', 'কাণ্ড']
  },
  {
    name: 'সূর্যমুখী',
    emoji: '🌻',
    type: 'ফুল',
    uses: 'তেল ও সাজসজ্জা',
    growsIn: 'বাগান',
    fact: 'সূর্যমুখী সূর্যের দিকে ঘুরে',
    parts: ['বীজ', 'পাপড়ি', 'কাণ্ড']
  },
  {
    name: 'বাঁশ',
    emoji: '🎋',
    type: 'গাছ',
    uses: 'নির্মাণ',
    growsIn: 'জঙ্গল',
    fact: 'বাঁশ খুব দ্রুত বাড়ে',
    parts: ['কাণ্ড', 'পাতা', 'গাঁট']
  },
  {
    name: 'গাজর',
    emoji: '🥕',
    type: 'সবজি',
    uses: 'খাদ্য',
    growsIn: 'জমি',
    fact: 'গাজর মাটির নিচে বাড়ে',
    parts: ['মূল', 'পাতা', 'শিকড়']
  },
  {
    name: 'লেবু',
    emoji: '🍋',
    type: 'ফল',
    uses: 'খাবার ও রস',
    growsIn: 'বাগান',
    fact: 'লেবুতে প্রচুর ভিটামিন সি আছে',
    parts: ['ফল', 'পাতা', 'ডাল']
  },
  {
    name: 'তুলসী',
    emoji: '🌿',
    type: 'ঔষধি গাছ',
    uses: 'ঔষধ',
    growsIn: 'বাড়ির উঠান',
    fact: 'তুলসী পাতা রোগ সারায়',
    parts: ['পাতা', 'ফুল', 'কাণ্ড']
  },
  {
    name: 'কলা গাছ',
    emoji: '🍌',
    type: 'ফলের গাছ',
    uses: 'ফল খাওয়া',
    growsIn: 'বাগান',
    fact: 'কলা পুষ্টিকর ফল',
    parts: ['কাঁদি', 'পাতা', 'কাণ্ড']
  },
  {
    name: 'পেঁয়াজ',
    emoji: '🧅',
    type: 'সবজি',
    uses: 'রান্না',
    growsIn: 'জমি',
    fact: 'পেঁয়াজ কাটলে চোখে পানি আসে',
    parts: ['কন্দ', 'পাতা', 'শিকড়']
  }
];

interface Question {
  type: 'uses' | 'growsIn' | 'type' | 'parts';
  plant: Plant;
  question: string;
  correctAnswer: string;
  options: string[];
}

const PlantExplorer = () => {
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
  const maxQuestions = 12;
  const { trackGameComplete } = useLessonProgress();
  const { user } = useAuth();

  const generateQuestion = (): Question => {
    const randomPlant = plants[Math.floor(Math.random() * plants.length)];
    const questionTypes: ('uses' | 'growsIn' | 'type' | 'parts')[] = ['uses', 'growsIn', 'type', 'parts'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let question = '';
    let correctAnswer = '';
    let wrongAnswers: string[] = [];

    switch (randomType) {
      case 'uses':
        question = `${randomPlant.emoji} ${randomPlant.name} এর কি ব্যবহার?`;
        correctAnswer = randomPlant.uses;
        wrongAnswers = plants
          .filter(p => p.name !== randomPlant.name)
          .map(p => p.uses)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
      case 'growsIn':
        question = `${randomPlant.emoji} ${randomPlant.name} কোথায় জন্মায়?`;
        correctAnswer = randomPlant.growsIn;
        wrongAnswers = plants
          .filter(p => p.name !== randomPlant.name)
          .map(p => p.growsIn)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
      case 'type':
        question = `${randomPlant.emoji} ${randomPlant.name} কি ধরনের উদ্ভিদ?`;
        correctAnswer = randomPlant.type;
        wrongAnswers = plants
          .filter(p => p.name !== randomPlant.name)
          .map(p => p.type)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
      case 'parts':
        question = `${randomPlant.emoji} ${randomPlant.name} এর কোন অংশটি আছে?`;
        correctAnswer = randomPlant.parts[0];
        wrongAnswers = plants
          .filter(p => p.name !== randomPlant.name)
          .flatMap(p => p.parts)
          .filter((v, i, a) => a.indexOf(v) === i && !randomPlant.parts.includes(v))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
    }

    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      type: randomType,
      plant: randomPlant,
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
      'Plant Explorer',
      finalScore,
      {
        correct_answers: score,
        total_questions: maxQuestions,
        accuracy: (score / maxQuestions) * 100,
        time_spent: timeSpent
      }
    );
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
      setFeedback(`🎉 চমৎকার! সঠিক উত্তর! ${currentQuestion.plant.fact}`);
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 animate-scale-in">
                <ArrowLeft className="w-4 h-4 mr-2" />
                হোমে ফিরুন
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-bounce-gentle">🌱 উদ্ভিদ অন্বেষক</h1>
              <p className="text-lg opacity-90">উদ্ভিদ সম্পর্কে জানো!</p>
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
                <div className="text-8xl animate-bounce-gentle">{currentQuestion.plant.emoji}</div>

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
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
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
                  <div className="text-4xl animate-wiggle">
                    <Leaf className="w-12 h-12 mx-auto text-green-600" />
                  </div>
                  <p className="text-lg text-gray-600 font-medium">
                    উদ্ভিদ সম্পর্কে শিখতে থাকো!
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
                দুর্দান্ত! তুমি উদ্ভিদ সম্পর্কে অনেক শিখলে।
              </p>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-2xl font-bold text-green-800">তোমার ফলাফল:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600">{score}</div>
                    <div className="text-sm text-gray-600">সঠিক উত্তর</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-emerald-600">{Math.round((score / maxQuestions) * 100)}%</div>
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
                  আবার খেলো! ��
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
        ) : null}
      </div>
    </div>
  );
};

export default PlantExplorer;
