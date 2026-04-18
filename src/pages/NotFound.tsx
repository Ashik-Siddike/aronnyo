import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(135deg, #667eea11 0%, #764ba211 100%)`,
      }}
    >
      {/* Floating Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute text-2xl animate-float pointer-events-none opacity-30"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          ⭐
        </div>
      ))}

      {/* Floating Background Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-eduplay-purple/10 rounded-full animate-float blur-xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-eduplay-blue/10 rounded-full animate-bounce-gentle blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-eduplay-pink/10 rounded-full animate-wiggle blur-xl" />

      <div className="text-center relative z-10 px-6 max-w-xl mx-auto">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[180px] font-black text-transparent bg-gradient-to-br from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl sm:text-7xl animate-bounce-gentle">🔭</div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            ওহ না! পৃষ্ঠাটি খুঁজে পাওয়া যাচ্ছে না! 😮
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            মনে হচ্ছে তুমি একটু হারিয়ে গেছো! চিন্তা নেই — 
            চলো আবার শেখার অ্যাডভেঞ্চারে ফিরে যাই! 🚀
          </p>
        </div>

        {/* Fun Emoji Row */}
        <div className="flex justify-center gap-4 mb-8 animate-fade-in delay-300">
          <span className="text-3xl animate-wiggle">📚</span>
          <span className="text-3xl animate-float" style={{ animationDelay: '0.2s' }}>🎮</span>
          <span className="text-3xl animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>🧩</span>
          <span className="text-3xl animate-scale-bounce" style={{ animationDelay: '0.6s' }}>🎓</span>
          <span className="text-3xl animate-wiggle" style={{ animationDelay: '0.8s' }}>🌟</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-500">
          <Link to="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-2xl w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              হোমে ফিরে যাও
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="border-2 border-eduplay-purple text-eduplay-purple hover:bg-eduplay-purple hover:text-white text-lg px-8 py-6 rounded-2xl transition-all duration-300 w-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            আগের পৃষ্ঠায় যাও
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
