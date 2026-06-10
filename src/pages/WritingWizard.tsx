import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, Volume2, Play, Check, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLang } from '@/contexts/LangContext';
import { playNarration, playSound } from '@/services/audioService';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Character sets for practice
const ENGLISH_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ENGLISH_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const BANGLA_VOWELS = 'অআইঈউঊঋএঐওঔ'.split('');
const BANGLA_CONSONANTS = 'কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়'.split('');
const BANGLA_NUMBERS = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০'];

type Category = 'en-letters' | 'en-numbers' | 'bn-vowels' | 'bn-consonants' | 'bn-numbers';

interface BrushColor {
  name: string;
  value: string;
  shadow: string;
}

const BRUSH_COLORS: BrushColor[] = [
  { name: 'Magical White', value: '#FFFFFF', shadow: 'shadow-white/40' },
  { name: 'Sunshine Yellow', value: '#FCD34D', shadow: 'shadow-yellow-400/40' },
  { name: 'Magical Cyan', value: '#22D3EE', shadow: 'shadow-cyan-400/40' },
  { name: 'Bubblegum Pink', value: '#F472B6', shadow: 'shadow-pink-400/40' },
  { name: 'Fresh Green', value: '#4ADE80', shadow: 'shadow-green-400/40' },
];

const MASCOTS = {
  welcome: { emoji: '🦉', name: 'Tutu', textEn: "Hello! I am Tutu. Let's practice writing together! 📝", textBn: "হ্যালো! আমি টুটু। চলো একসাথে হাতের লেখা অনুশীলন করি! 📝" },
  evaluating: { emoji: '🧐', name: 'Tutu', textEn: 'Let me look at your beautiful writing... 🧐', textBn: 'দাঁড়াও, একটু দেখি তোমার লেখাটা কেমন হলো... 🧐' },
  success: {
    emoji: '🥳',
    name: 'Tutu',
    quotesEn: [
      "Darun! That's a perfect letter! You're a writing superstar! 🌟",
      "Spectacular! Your handwriting is so clean! Keep it up! 🏆",
      "Fantastic job! I love how you wrote this letter! Let's do next! 🎈"
    ],
    quotesBn: [
      "দারুণ হয়েছে! একদম নিখুঁত বর্ণ! তুমি তো লেখার জাদুকর! 🌟",
      "অসাধারণ! তোমার হাতের লেখা চমৎকার হয়েছে! 🏆",
      "ফাটাফাটি! তুমি খুব সুন্দরভাবে লিখেছো! চলো পরেরটা লিখি! 🎈"
    ]
  },
  encouragement: {
    emoji: '💪',
    name: 'Tutu',
    quotesEn: [
      "Beautiful try! You are getting very close. Let's erase and try once more! You can do it! 💖",
      "Nice drawing! A little more practice and it will be perfect. Let's try again! 🌟",
      "Wow, good effort! Erase the board and let's try one more time together! 💪"
    ],
    quotesBn: [
      "অনেক সুন্দর চেষ্টা! তুমি খুব কাছাকাছি চলে এসেছো। চলো স্লেটটা মুছে আরেকবার লিখি! 💖",
      "দারুণ ট্রাই! আরেকটু চেষ্টা করলেই একদম নিখুঁত হবে। চলো আবার খেলি! 🌟",
      "বাহ, দারুণ চেষ্টা! স্লেটটি মুছে চলো আমরা দুজনে মিলে আরেকবার ট্রাই করি! তুমি অবশ্যই পারবে! 💪"
    ]
  }
};

const WritingWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useLang();
  const { trackGameComplete } = useLessonProgress();

  const [activeCategory, setActiveCategory] = useState<Category>('en-letters');
  const [selectedChar, setSelectedChar] = useState<string>('A');
  const [brushColor, setBrushColor] = useState<string>('#FFFFFF');
  const [brushSize, setBrushSize] = useState<number>(18);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mascot panel state
  const [mascotState, setMascotState] = useState<'welcome' | 'evaluating' | 'success' | 'encouragement'>('welcome');
  const [mascotBubble, setMascotBubble] = useState<string>('');
  const [successScore, setSuccessScore] = useState<number>(0);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [showEncouragementModal, setShowEncouragementModal] = useState<boolean>(false);

  // Canvas Drawing Coordinate Buffers
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeBuffer = useRef<Array<[number[], number[], number[]]>>([]);
  const currentStroke = useRef<[number[], number[], number[]]>([[], [], []]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startTime = useRef<number>(0);

  // Pre-load parameters from URL if redirecting from a lesson
  useEffect(() => {
    const charParam = searchParams.get('char');
    if (charParam) {
      const char = decodeURIComponent(charParam).trim();
      if (char) {
        setSelectedChar(char);
        // Deduce category from character
        if (BANGLA_VOWELS.includes(char)) {
          setActiveCategory('bn-vowels');
        } else if (BANGLA_CONSONANTS.includes(char)) {
          setActiveCategory('bn-consonants');
        } else if (BANGLA_NUMBERS.includes(char)) {
          setActiveCategory('bn-numbers');
        } else if (ENGLISH_NUMBERS.includes(char)) {
          setActiveCategory('en-numbers');
        } else {
          setActiveCategory('en-letters');
        }
      }
    }
  }, [searchParams]);

  // Set default mascot bubble
  useEffect(() => {
    if (mascotState === 'welcome') {
      setMascotBubble(lang === 'bn' ? MASCOTS.welcome.textBn : MASCOTS.welcome.textEn);
    }
  }, [lang, mascotState]);

  // Handle character changes
  useEffect(() => {
    clearCanvas();
    setMascotState('welcome');
    setMascotBubble(
      lang === 'bn' 
        ? `এসো আমরা '${selectedChar}' বর্ণটি লেখা অনুশীলন করি! 📝` 
        : `Let's practice writing the letter '${selectedChar}'! 📝`
    );
  }, [selectedChar]);

  // Get active list of characters for current category
  const getCharList = (category: Category): string[] => {
    switch (category) {
      case 'en-letters': return ENGLISH_LETTERS;
      case 'en-numbers': return ENGLISH_NUMBERS;
      case 'bn-vowels': return BANGLA_VOWELS;
      case 'bn-consonants': return BANGLA_CONSONANTS;
      case 'bn-numbers': return BANGLA_NUMBERS;
    }
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    const list = getCharList(category);
    setSelectedChar(list[0]);
  };

  const handleNextChar = () => {
    const list = getCharList(activeCategory);
    const index = list.indexOf(selectedChar);
    if (index < list.length - 1) {
      setSelectedChar(list[index + 1]);
    } else {
      setSelectedChar(list[0]); // loop back
    }
  };

  const handlePrevChar = () => {
    const list = getCharList(activeCategory);
    const index = list.indexOf(selectedChar);
    if (index > 0) {
      setSelectedChar(list[index - 1]);
    } else {
      setSelectedChar(list[list.length - 1]); // loop to end
    }
  };

  // Speak target letter
  const speakLetter = async () => {
    playSound('click');
    let promptText = '';
    if (activeCategory === 'bn-vowels' || activeCategory === 'bn-consonants') {
      promptText = `বাংলা বর্ণ ${selectedChar}`;
    } else if (activeCategory === 'bn-numbers') {
      promptText = `বাংলা সংখ্যা ${selectedChar}`;
    } else if (activeCategory === 'en-numbers') {
      promptText = `Number ${selectedChar}`;
    } else {
      promptText = `Letter ${selectedChar}`;
    }
    await playNarration(promptText);
  };

  // Canvas Drawing Implementation (Pointer Events)
  const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw dotted coordinate lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash

    // Draw Transparent Silhouette Guide of Letter
    ctx.font = 'bold 360px "Outfit", "Arial", "Kohinoor Bangla", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedChar, width / 2, height / 2 + 10);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide backdrop
    drawGuide(ctx, canvas.width, canvas.height);

    // Reset stroke buffers
    strokeBuffer.current = [];
    currentStroke.current = [[], [], []];
    lastPos.current = null;
  };

  // Redraw guide letter after clear/init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGuide(ctx, canvas.width, canvas.height);
      }
    }
  }, [selectedChar]);

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading || showRewardModal) return;
    
    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    startTime.current = Date.now();

    const rect = canvas.getBoundingClientRect();
    // Scale coords to canvas logical resolution (800x600)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const t = 0; // Relative start time

    lastPos.current = { x, y };
    currentStroke.current = [[x], [y], [t]];

    // Draw single dot for click
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = brushColor;
      ctx.fill();
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isLoading || showRewardModal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const t = Date.now() - startTime.current;

    currentStroke.current[0].push(x);
    currentStroke.current[1].push(y);
    currentStroke.current[2].push(t);

    const ctx = canvas.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPos.current = { x, y };
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
    setIsDrawing(false);
    
    // Save current stroke to all strokes list if it contains elements
    if (currentStroke.current[0].length > 0) {
      strokeBuffer.current.push([...currentStroke.current]);
    }
    
    currentStroke.current = [[], [], []];
    lastPos.current = null;
  };

  // Check handwriting with API
  const evaluateWriting = async () => {
    if (strokeBuffer.current.length === 0) {
      setMascotBubble(lang === 'bn' ? 'স্লেটে আগে কিছু লিখো তো সোনামণি! ✏️' : 'Please draw on the slate first! ✏️');
      playSound('wrong');
      return;
    }

    playSound('click');
    setIsLoading(true);
    setMascotState('evaluating');
    setMascotBubble(lang === 'bn' ? MASCOTS.evaluating.textBn : MASCOTS.evaluating.textEn);

    // Is it a Bangla target?
    const isBangla = activeCategory === 'bn-vowels' || activeCategory === 'bn-consonants' || activeCategory === 'bn-numbers';
    const langCode = isBangla ? 'bn' : 'en';

    try {
      const res = await fetch(`${API_BASE}/handwriting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ink: strokeBuffer.current,
          language: langCode
        })
      });

      if (!res.ok) {
        throw new Error('Handwriting validation failed');
      }

      const data = await res.json();
      const candidates = data.candidates || [];

      // Normalize candidate strings and target letter for match
      const targetNormalized = selectedChar.trim().toLowerCase();
      
      // Check if target character is in candidates
      const matchIndex = candidates.findIndex((c: string) => {
        const cNorm = c.trim().toLowerCase();
        
        // Exact match
        if (cNorm === targetNormalized) return true;
        
        // Digits mapping
        if (targetNormalized === '10' && cNorm === '10') return true;
        if (targetNormalized === '১০' && cNorm === '১০') return true;

        return false;
      });

      const isMatch = matchIndex !== -1 && matchIndex < 6; // In top candidates

      if (isMatch) {
        // SUCCESS CASE
        setMascotState('success');
        
        const successQuotes = lang === 'bn' ? MASCOTS.success.quotesBn : MASCOTS.success.quotesEn;
        const randomQuote = successQuotes[Math.floor(Math.random() * successQuotes.length)];
        setMascotBubble(randomQuote);

        playSound('correct');
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#9D4EDD']
        });

        // Track completed game
        await trackGameComplete('বর্ণমালা জাদুকর (Writing Wizard)', 700, {
          character: selectedChar,
          category: activeCategory,
          strokes: strokeBuffer.current.length
        });

        setEarnedStars(10);
        setShowRewardModal(true);

      } else {
        // ENCOURAGEMENT CASE
        setMascotState('encouragement');
        
        const encourageQuotes = lang === 'bn' ? MASCOTS.encouragement.quotesBn : MASCOTS.encouragement.quotesEn;
        const randomQuote = encourageQuotes[Math.floor(Math.random() * encourageQuotes.length)];
        setMascotBubble(randomQuote);
        playSound('wrong');

        // Show encouragement modal/popup and auto-dismiss after 2 seconds
        setShowEncouragementModal(true);
        setTimeout(() => {
          setShowEncouragementModal(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Validation error:', err);
      // Fallback in case of server failure: inform the user of connection error and prompt retry
      setMascotState('encouragement');
      const connectionErrorBubble = lang === 'bn' 
        ? 'দুঃখিত সোনামণি, ইন্টারনেট সমস্যার কারণে টুটু বোর্ডটি দেখতে পারছে না। চলো আবার চেষ্টা করি! ✏️' 
        : "Sorry dear, Tutu can't read the board due to connection issue. Let's try again! ✏️";
      setMascotBubble(connectionErrorBubble);
      playSound('wrong');

      // Show encouragement modal/popup and auto-dismiss after 2 seconds
      setShowEncouragementModal(true);
      setTimeout(() => {
        setShowEncouragementModal(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const closeRewardModal = () => {
    setShowRewardModal(false);
    handleNextChar(); // auto transition to next letter
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b-2 border-purple-200/30 dark:border-purple-900/20 py-4 shadow-sm sticky top-0 z-10 transition-all duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/games">
            <Button variant="ghost" size="sm" className="text-eduplay-purple border-2 border-eduplay-purple/20 hover:bg-eduplay-purple/10 font-extrabold rounded-2xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {lang === 'bn' ? 'গেমস হাব' : 'Games Hub'}
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-eduplay-purple to-eduplay-blue bg-clip-text text-transparent flex items-center gap-2 justify-center drop-shadow-sm">
              ✏️ {lang === 'bn' ? 'বর্ণমালা জাদুকর' : 'Writing Wizard'}
            </h1>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 hidden sm:block">
              {lang === 'bn' ? 'আঙুল বা টাচ পেন দিয়ে স্ক্রিনে সুন্দর করে লেখো!' : 'Practice handwriting with your finger or touch pen!'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black px-4 py-2 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-200">
            <Star className="w-5 h-5 fill-current animate-pulse text-white" />
            <span>Practice & Win</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Category Toggles (Top Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-4xl mx-auto mb-6">
          <Button 
            onClick={() => handleCategoryChange('en-letters')}
            className={`font-black rounded-2xl py-6 transition-all duration-300 border-2 ${
              activeCategory === 'en-letters'
                ? 'bg-eduplay-purple text-white border-eduplay-purple shadow-lg scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-purple-200/50 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            A-Z Letters
          </Button>
          <Button 
            onClick={() => handleCategoryChange('en-numbers')}
            className={`font-black rounded-2xl py-6 transition-all duration-300 border-2 ${
              activeCategory === 'en-numbers'
                ? 'bg-eduplay-blue text-white border-eduplay-blue shadow-lg scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-purple-200/50 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            1-10 Numbers
          </Button>
          <Button 
            onClick={() => handleCategoryChange('bn-vowels')}
            className={`font-black rounded-2xl py-6 transition-all duration-300 border-2 ${
              activeCategory === 'bn-vowels'
                ? 'bg-eduplay-orange text-white border-eduplay-orange shadow-lg scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-purple-200/50 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            বাংলা স্বরবর্ণ
          </Button>
          <Button 
            onClick={() => handleCategoryChange('bn-consonants')}
            className={`font-black rounded-2xl py-6 transition-all duration-300 border-2 ${
              activeCategory === 'bn-consonants'
                ? 'bg-eduplay-green text-white border-eduplay-green shadow-lg scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-purple-200/50 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            বাংলা ব্যঞ্জনবর্ণ
          </Button>
          <Button 
            onClick={() => handleCategoryChange('bn-numbers')}
            className={`font-black rounded-2xl py-6 col-span-2 sm:col-span-1 transition-all duration-300 border-2 ${
              activeCategory === 'bn-numbers'
                ? 'bg-eduplay-pink text-white border-eduplay-pink shadow-lg scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-purple-200/50 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            বাংলা সংখ্যা
          </Button>
        </div>

        {/* Dynamic Canvas Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-stretch">
          
          {/* Left panel: Active letter showcase & Mascot dialog (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. Large character card */}
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl overflow-hidden relative border-t-4 border-eduplay-purple flex-1 flex flex-col justify-center items-center p-8">
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">
                {lang === 'bn' ? 'চলতি বর্ণ' : 'Target character'}
              </span>
              
              <div className="text-9xl font-black text-eduplay-purple drop-shadow-md select-none animate-bounce-gentle my-6">
                {selectedChar}
              </div>

              <div className="flex gap-3 w-full">
                <Button 
                  onClick={speakLetter}
                  className="flex-1 bg-gradient-to-r from-eduplay-purple to-eduplay-blue hover:from-eduplay-purple/90 hover:to-eduplay-blue/90 text-white font-extrabold py-6 rounded-2xl shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-transform"
                >
                  <Volume2 className="w-5 h-5 text-white" />
                  {lang === 'bn' ? 'উচ্চারণ শোনো' : 'Listen Sound'}
                </Button>
              </div>
            </Card>

            {/* 2. Interactive Mascot Dialog Box */}
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border-l-4 border-amber-400 flex items-center gap-4 relative overflow-hidden">
              <div className="text-6xl animate-wiggle select-none">
                {isLoading 
                  ? MASCOTS.evaluating.emoji 
                  : mascotState === 'success' 
                    ? MASCOTS.success.emoji 
                    : mascotState === 'encouragement' 
                      ? MASCOTS.encouragement.emoji 
                      : MASCOTS.welcome.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-amber-500 mb-1">
                  {lang === 'bn' ? 'টুটু টিচার' : 'Teacher Tutu'} 🦉
                </h4>
                <p className="text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-300">
                  {mascotBubble}
                </p>
              </div>
            </Card>

          </div>

          {/* Right panel: Main drawing whiteboard slate (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Whiteboard Slate Card */}
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 flex flex-col border-t-4 border-eduplay-blue relative overflow-hidden">
              
              {/* Slate Header Controls */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePrevChar} 
                    className="w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <span className="font-extrabold px-3 text-slate-700 dark:text-slate-200 select-none">
                    {lang === 'bn' ? 'অক্ষর বদল' : 'Prev/Next'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNextChar} 
                    className="w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>

                {/* Chalk Brush Color Selectors */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-slate-400 hidden sm:inline">
                    {lang === 'bn' ? 'চক কালার:' : 'Colors:'}
                  </span>
                  <div className="flex gap-2">
                    {BRUSH_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setBrushColor(c.value)}
                        style={{ backgroundColor: c.value }}
                        className={`w-7 h-7 rounded-full border-2 transition-all duration-200 transform ${c.shadow} ${
                          brushColor === c.value 
                            ? 'scale-120 border-eduplay-purple shadow-md ring-2 ring-purple-300' 
                            : 'border-white hover:scale-110'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* DRAWING BOARD CANVAS CONTAINER */}
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border-4 border-slate-700 dark:border-slate-800 relative shadow-inner touch-none">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full cursor-crosshair block relative"
                  style={{ touchAction: 'none' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
                
                {/* Chalkboard texture background lines overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5 border border-white border-dashed select-none"></div>
              </div>

              {/* Slate Footer Controls */}
              <div className="flex items-center justify-between gap-4 mt-6">
                
                {/* Brush size slider */}
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl flex-1 max-w-[200px] sm:max-w-none">
                  <span className="text-xs font-black text-slate-400 uppercase hidden md:inline">
                    {lang === 'bn' ? 'চক সাইজ:' : 'Size:'}
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-eduplay-purple cursor-pointer bg-gray-300 dark:bg-slate-700 rounded-lg h-2"
                  />
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300 w-6 text-right select-none">
                    {brushSize}px
                  </span>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={clearCanvas}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white font-extrabold px-6 py-6 rounded-2xl shadow-md border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span className="hidden sm:inline">{lang === 'bn' ? 'স্লেট মুছুন' : 'Clear Slate'}</span>
                  </Button>

                  <Button
                    onClick={evaluateWriting}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-eduplay-green to-emerald-500 hover:from-eduplay-green hover:to-emerald-500 text-white font-black px-8 py-6 rounded-2xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{lang === 'bn' ? 'যাচাই হচ্ছে...' : 'Checking...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span>{lang === 'bn' ? 'লেখা যাচাই করো 🔍' : 'Check Writing 🔍'}</span>
                      </>
                    )}
                  </Button>
                </div>

              </div>

            </Card>

          </div>

        </div>

        {/* Complete Selector Grid Drawer */}
        <div className="max-w-6xl mx-auto mt-8">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border-t-4 border-eduplay-orange">
            <h3 className="text-lg font-black mb-4 text-slate-700 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
              🔠 {lang === 'bn' ? 'অনুশীলনের জন্য যেকোনো বর্ণ সিলেক্ট করো:' : 'Select any letter to practice:'}
            </h3>
            
            <div className="flex flex-wrap gap-2.5 justify-center max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {getCharList(activeCategory).map((char) => (
                <button
                  key={char}
                  onClick={() => setSelectedChar(char)}
                  className={`w-12 h-12 rounded-xl font-black text-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                    selectedChar === char
                      ? 'bg-eduplay-orange text-white shadow-md scale-105 ring-2 ring-orange-300'
                      : 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* GAMIFIED REWARD MODAL (POPUP) */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          
          <Card className="max-w-md w-full bg-white dark:bg-slate-900 border-0 shadow-2xl rounded-3xl overflow-hidden transform animate-scale-in relative border-t-8 border-yellow-400">
            
            {/* Confetti decorations */}
            <div className="p-8 text-center space-y-6">
              
              <div className="text-8xl animate-bounce-gentle select-none">🏆</div>
              
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                {lang === 'bn' ? 'চমৎকার লিখেছো!' : 'Beautiful Writing!'}
              </h2>
              
              <p className="text-base font-bold text-gray-500 dark:text-gray-400">
                {lang === 'bn' 
                  ? `তুমি '${selectedChar}' বর্ণটি দারুণভাবে ফুটিয়ে তুলেছ।` 
                  : `You drew the character '${selectedChar}' successfully.`}
              </p>

              {/* Star rewards showcase */}
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-4 border border-yellow-200/50 dark:border-yellow-900/20 max-w-xs mx-auto flex items-center justify-center gap-3 animate-pulse">
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400">+{earnedStars} Stars</div>
                  <div className="text-xs font-black text-amber-500 uppercase tracking-wider">
                    {lang === 'bn' ? 'পুরস্কার' : 'REWARD'}
                  </div>
                </div>
              </div>

              {/* Close Button / Go to Next */}
              <div className="pt-4 space-y-3">
                <Button
                  onClick={closeRewardModal}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-amber-500 text-white font-black text-lg py-7 rounded-2xl shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>{lang === 'bn' ? 'পরবর্তী বর্ণ লিখি ➡️' : 'Write Next Character ➡️'}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setShowRewardModal(false)}
                  className="w-full text-slate-500 dark:text-slate-400 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  {lang === 'bn' ? 'স্লেট বন্ধ করো' : 'Close Slate'}
                </Button>
              </div>

            </div>

          </Card>

        </div>
      )}

      {/* GAMIFIED ENCOURAGEMENT MODAL (POPUP) */}
      {showEncouragementModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-md w-full bg-white dark:bg-slate-900 border-0 shadow-2xl rounded-3xl overflow-hidden transform animate-scale-in relative border-t-8 border-orange-400">
            <div className="p-8 text-center space-y-6">
              <div className="text-8xl animate-wiggle select-none">💪</div>
              
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                {lang === 'bn' ? 'দারুণ চেষ্টা, সোনামণি! 💖' : 'Wonderful Try, Dear! 💖'}
              </h2>
              
              <p className="text-base font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                {mascotBubble}
              </p>

              <div className="text-xs font-black text-orange-400 uppercase tracking-widest animate-pulse">
                {lang === 'bn' ? 'চলো আবার চেষ্টা করি...' : 'Let\'s try again...'}
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default WritingWizard;
