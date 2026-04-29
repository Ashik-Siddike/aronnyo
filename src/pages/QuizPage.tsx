
import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Star, Trophy, BarChart2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ActivityService } from '@/services/activityService';
import { useToast } from '@/hooks/use-toast';

const QuizPage = () => {
  const { subject, id } = useParams();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime] = useState(new Date());

  const quizData = {
    title: "Counting Numbers Quiz",
    questions: [
      {
        id: 1,
        question: "How many apples are there?",
        image: "🍎🍎🍎",
        options: ["2", "3", "4", "5"],
        correct: "3"
      },
      {
        id: 2,
        question: "What comes after 7?",
        image: "7️⃣",
        options: ["6", "8", "9", "10"],
        correct: "8"
      },
      {
        id: 3,
        question: "Count the stars!",
        image: "⭐⭐⭐⭐⭐",
        options: ["4", "5", "6", "7"],
        correct: "5"
      }
    ]
  };

  const calculateCorrect = (submittedAnswers: string[]) => {
    return submittedAnswers.reduce((count, answer, index) => {
      return answer === quizData.questions[index].correct ? count + 1 : count;
    }, 0);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setShowResult(true);

    setTimeout(async () => {
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        // ✅ Quiz complete → Save to MongoDB
        setIsSaving(true);
        const correctCount = calculateCorrect(newAnswers);
        const percentage = Math.round((correctCount / quizData.questions.length) * 100);
        const timeSpent = Math.max(
          Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)),
          1
        );
        const subjectName = subject
          ? subject.charAt(0).toUpperCase() + subject.slice(1)
          : 'General';

        try {
          await ActivityService.submitQuiz(
            subjectName,
            quizData.title,
            percentage,
            correctCount,
            quizData.questions.length,
            timeSpent,
            { quiz_id: id }
          );
          toast({
            title: `Quiz Completed! ${percentage >= 80 ? '🌟' : '👍'}`,
            description: `Score: ${percentage}% (${correctCount}/${quizData.questions.length}) — Saved to your profile!`,
          });
        } catch (err) {
          console.error('Quiz save error:', err);
          toast({
            title: "Quiz Completed!",
            description: `Score: ${percentage}% — Could not sync to server right now.`,
            variant: "destructive",
          });
        } finally {
          setIsSaving(false);
          setQuizCompleted(true);
        }
      }
    }, 1800);
  };

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const currentQ = quizData.questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ?.correct;

  // ── Results Screen ────────────────────────────────────────────────────────
  if (quizCompleted) {
    const correctCount = calculateCorrect(answers);
    const percentage = Math.round((correctCount / quizData.questions.length) * 100);
    const starsEarned = ActivityService.calculateStarsForQuiz(percentage, quizData.questions.length);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className={`h-3 w-full ${
              percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
              percentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
              'bg-gradient-to-r from-red-400 to-pink-400'
            }`} />
            <CardContent className="p-10 text-center space-y-8">
              <div className="text-8xl animate-bounce">
                {percentage >= 90 ? '🎉' : percentage >= 70 ? '👍' : percentage >= 50 ? '🤔' : '💪'}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {percentage >= 90 ? 'Outstanding!' :
                   percentage >= 70 ? 'Great Job!' :
                   percentage >= 50 ? 'Keep Going!' : 'Practice More!'}
                </h2>
                <p className="text-gray-500">Your quiz results have been saved to your profile ✅</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 space-y-4">
                <div className="text-5xl font-black text-eduplay-purple">{percentage}%</div>
                <div className="text-gray-600">
                  <span className="font-bold text-eduplay-blue">{correctCount}</span> out of{' '}
                  <span className="font-bold">{quizData.questions.length}</span> correct
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-700">+{starsEarned} Stars Earned</span>
                  <div className="flex space-x-1 ml-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.min(starsEarned, 3) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  📊 Accuracy Updated • Leaderboard Refreshed
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={`/lessons/${subject}`}>
                  <Button size="lg" className="bg-gradient-to-r from-eduplay-green to-eduplay-blue w-full sm:w-auto">
                    Back to Lessons
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                    My Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-eduplay-purple to-eduplay-pink text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to={`/lessons/${subject}`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lessons
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm">Question {currentQuestion + 1} of {quizData.questions.length}</div>
              <div className="w-32">
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto border-0 playful-shadow">
          <CardContent className="p-8">
            {!showResult ? (
              <div className="space-y-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl">{currentQ.image}</div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentQ.question}</h2>
                </div>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="grid grid-cols-2 gap-4">
                    {currentQ.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAnswer === option
                              ? 'border-eduplay-blue bg-blue-50'
                              : 'border-gray-200 hover:border-eduplay-blue'
                          }`}
                        >
                          <div className="text-center text-xl font-semibold">{option}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="text-center">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedAnswer || isSaving}
                    size="lg"
                    className="bg-gradient-to-r from-eduplay-blue to-eduplay-purple"
                  >
                    {isSaving ? 'Saving...' :
                     currentQuestion === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div>
                  {isCorrect
                    ? <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                    : <XCircle className="w-20 h-20 text-red-500 mx-auto" />}
                </div>
                <h2 className="text-3xl font-bold">
                  {isCorrect ? 'Correct! 🎉' : 'Not quite right 🤔'}
                </h2>
                <p className="text-xl text-gray-600">
                  {isCorrect ? 'Great job! Keep it up!' : `The correct answer is: ${currentQ.correct}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
