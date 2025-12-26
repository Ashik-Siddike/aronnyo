import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { playSound } from '@/services/audioService';

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardEmojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍒', '🥝', '🍑', '🥭', '🍍', '🥥'];

const MemoryMatch = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime] = useState(new Date());
  const { trackGameComplete } = useLessonProgress();
  const { user } = useAuth();

  const totalPairs = 8;

  const initializeGame = () => {
    const selectedEmojis = cardEmojis.slice(0, totalPairs);
    const duplicatedEmojis = [...selectedEmojis, ...selectedEmojis];
    const shuffled = duplicatedEmojis
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameCompleted(false);
    setTimer(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameCompleted]);

  const handleGameCompletion = async () => {
    if (!user) return;

    const efficiency = Math.round((totalPairs / moves) * 100);
    const finalScore = Math.max(1000 - (moves * 10) - (timer * 2), 100);

    await trackGameComplete(
      'Memory Match',
      finalScore,
      {
        moves: moves,
        time_seconds: timer,
        matches: matches,
        efficiency: efficiency
      }
    );
  };

  useEffect(() => {
    if (matches === totalPairs && matches > 0) {
      setGameCompleted(true);
      setIsTimerRunning(false);
      handleGameCompletion();
    }
  }, [matches]);

  const handleCardClick = (clickedCard: CardType) => {
    if (
      flippedCards.length === 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return;
    }

    playSound('click');

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        playSound('correct');
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        playSound('wrong');
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 animate-scale-in">
                <ArrowLeft className="w-4 h-4 mr-2" />
                হোমে ফিরুন
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-bounce-gentle">🧠 স্মৃতি মিলান</h1>
              <p className="text-lg opacity-90">জোড়া খুঁজে বের করো!</p>
            </div>

            <div className="text-center bg-white/20 rounded-2xl p-4 animate-scale-in">
              <div className="text-2xl font-bold flex items-center gap-2 justify-center">
                <Clock className="w-5 h-5" />
                {formatTime(timer)}
              </div>
              <div className="text-sm opacity-90">চাল: {moves}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!gameCompleted ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`aspect-square cursor-pointer border-0 playful-shadow transition-all duration-300 ${
                    card.isMatched
                      ? 'bg-green-200 opacity-60 scale-95'
                      : card.isFlipped
                      ? 'bg-white scale-105'
                      : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:scale-105'
                  }`}
                >
                  <CardContent className="p-0 h-full flex items-center justify-center">
                    {card.isFlipped || card.isMatched ? (
                      <span className="text-5xl animate-scale-in">{card.emoji}</span>
                    ) : (
                      <span className="text-5xl text-white">❓</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 playful-shadow bg-white/90">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-100 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600">{moves}</div>
                    <div className="text-sm text-blue-800">চাল</div>
                  </div>
                  <div className="bg-green-100 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-600">{matches}/{totalPairs}</div>
                    <div className="text-sm text-green-800">জোড়া</div>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {moves > 0 ? Math.round((matches / moves) * 100) : 0}%
                    </div>
                    <div className="text-sm text-purple-800">নির্ভুলতা</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <div className="text-4xl animate-wiggle">💡</div>
              <p className="text-lg text-gray-700 font-medium">
                কার্ড ফ্লিপ করে একই জোড়া খুঁজে বের করো!
              </p>
            </div>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto border-0 playful-shadow animate-fade-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-8xl animate-bounce-gentle">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800">অভিনন্দন!</h2>
              <p className="text-xl text-gray-600">
                তুমি সব জোড়া খুঁজে পেয়েছো!
              </p>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-2xl font-bold text-blue-800">তোমার ফলাফল:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-blue-600">{moves}</div>
                    <div className="text-sm text-gray-600">মোট চাল</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600">{formatTime(timer)}</div>
                    <div className="text-sm text-gray-600">সময়</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round((totalPairs / moves) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">দক্ষতা</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-1">
                  {[...Array(Math.min(5, Math.ceil((totalPairs * 2 / moves) * 5)))].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-current animate-pulse" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3 rounded-xl transition-colors duration-200"
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
      </div>
    </div>
  );
};

export default MemoryMatch;
