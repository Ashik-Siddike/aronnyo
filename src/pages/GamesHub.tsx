import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { motion } from "framer-motion";

export default function GamesHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLang();
  
  const [activeCategory, setActiveCategory] = useState("all");
  const isBn = language === 'bn';

  const games = [
    {
      id: "counting",
      title: isBn ? "সংখ্যা গুনি" : "Counting Game",
      emoji: "🔢",
      route: "/counting-game",
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-[0_0_15px_rgba(99,102,241,0.4)]",
      borderColor: "border-indigo-100",
      textColor: "text-indigo-600",
      category: "math",
      stars: 3
    },
    {
      id: "addition",
      title: isBn ? "যোগের খেলা" : "Addition Game",
      emoji: "➕",
      route: "/addition-game",
      gradient: "from-emerald-400 to-green-600",
      shadow: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
      borderColor: "border-green-100",
      textColor: "text-green-600",
      category: "math",
      stars: 2
    },
    {
      id: "subtraction",
      title: isBn ? "বিয়োগের খেলা" : "Subtraction Game",
      emoji: "➖",
      route: "/subtraction-game",
      gradient: "from-orange-400 to-red-500",
      shadow: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
      borderColor: "border-red-100",
      textColor: "text-red-600",
      category: "math",
      stars: 1
    },
    {
      id: "multiplication",
      title: isBn ? "গুণের খেলা" : "Multiplication Game",
      emoji: "✖️",
      route: "/multiplication-game",
      gradient: "from-pink-500 to-rose-600",
      shadow: "shadow-[0_0_15px_rgba(225,29,72,0.4)]",
      borderColor: "border-rose-100",
      textColor: "text-rose-600",
      category: "math",
      stars: 0
    },
    {
      id: "spelling",
      title: isBn ? "বানান শিখি" : "Spelling Wizard",
      emoji: "🪄",
      route: "/spelling-wizard",
      gradient: "from-purple-400 to-fuchsia-600",
      shadow: "shadow-[0_0_15px_rgba(192,38,211,0.4)]",
      borderColor: "border-fuchsia-100",
      textColor: "text-fuchsia-600",
      category: "language",
      stars: 3
    },
    {
      id: "animal",
      title: isBn ? "পশু-পাখি কুইজ" : "Animal Quiz",
      emoji: "🐾",
      route: "/animal-quiz",
      gradient: "from-blue-400 to-sky-600",
      shadow: "shadow-[0_0_15px_rgba(2,132,199,0.4)]",
      borderColor: "border-sky-100",
      textColor: "text-sky-600",
      category: "science",
      stars: 4
    },
    {
      id: "plant",
      title: isBn ? "উদ্ভিদ জগৎ" : "Plant Explorer",
      emoji: "🌱",
      route: "/plant-explorer",
      gradient: "from-teal-400 to-emerald-600",
      shadow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      borderColor: "border-emerald-100",
      textColor: "text-emerald-600",
      category: "science",
      stars: 2
    },
    {
      id: "memory",
      title: isBn ? "স্মৃতি পরীক্ষা" : "Memory Match",
      emoji: "🧠",
      route: "/memory-match",
      gradient: "from-violet-400 to-purple-600",
      shadow: "shadow-[0_0_15px_rgba(147,51,234,0.4)]",
      borderColor: "border-purple-100",
      textColor: "text-purple-600",
      category: "puzzle",
      stars: 5
    }
  ];

  const filteredGames = activeCategory === "all" ? games : games.filter(g => g.category === activeCategory);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-32">
      {/* Header Section */}
      <section className="px-6 lg:px-10 pt-8 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 left-10 text-yellow-400 text-2xl animate-pulse">✨</div>
          <div className="absolute top-10 right-20 text-blue-400 text-2xl animate-bounce">⭐</div>
          <div className="absolute bottom-5 left-1/2 text-pink-400 text-2xl animate-pulse">✨</div>
        </div>
        <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">🎮 {isBn ? "গেমস জগৎ" : "Games Hub"}</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">{isBn ? "খেলতে খেলতে শেখো!" : "Learn while playing!"}</p>
      </section>

      {/* Featured Game Banner */}
      <section className="px-6 lg:px-10 mb-10 max-w-5xl mx-auto">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-pink-500 to-orange-400 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-end p-6 lg:p-10 group cursor-pointer"
          onClick={() => navigate('/story-mode')}
        >
          <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center translate-y-4">
            <div className="text-8xl lg:text-9xl transform group-hover:scale-110 transition-transform duration-500">🗺️</div>
          </div>
          <div className="relative z-10">
            <span className="bg-white/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
              🌟 {isBn ? "আজকের ফিচার্ড গেম" : "Featured"}
            </span>
            <h2 className="text-white text-3xl lg:text-4xl font-black mb-4 leading-tight drop-shadow-md">
              {isBn ? "স্টোরি মোড" : "Story Mode"}
            </h2>
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-black shadow-lg transition-transform active:scale-95 border-b-4 border-pink-200 flex items-center gap-2 hover:bg-pink-50">
              {isBn ? "খেলো এখনই!" : "Play Now!"}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="mb-10 max-w-5xl mx-auto">
        <div className="flex overflow-x-auto gap-3 px-6 lg:px-10 pb-2 [&::-webkit-scrollbar]:hidden">
          <button 
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap shadow-md active:scale-95 transition-all ${activeCategory === "all" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            {isBn ? "সব গেম" : "All Games"}
          </button>
          <button 
            onClick={() => setActiveCategory("math")}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap shadow-md active:scale-95 transition-all ${activeCategory === "math" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" : "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            {isBn ? "গণিত" : "Math"}
          </button>
          <button 
            onClick={() => setActiveCategory("language")}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap shadow-md active:scale-95 transition-all ${activeCategory === "language" ? "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white" : "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            {isBn ? "ভাষা" : "Language"}
          </button>
          <button 
            onClick={() => setActiveCategory("science")}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap shadow-md active:scale-95 transition-all ${activeCategory === "science" ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white" : "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            {isBn ? "বিজ্ঞান" : "Science"}
          </button>
          <button 
            onClick={() => setActiveCategory("puzzle")}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap shadow-md active:scale-95 transition-all ${activeCategory === "puzzle" ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            {isBn ? "পাজল" : "Puzzle"}
          </button>
        </div>
      </section>

      {/* Games Grid */}
      <section className="px-6 lg:px-10 mb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filteredGames.length > 0 ? filteredGames.map((game) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(game.route)}
              className={`aspect-[1/1.2] rounded-3xl bg-gradient-to-b ${game.gradient} p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden group ${game.shadow}`}
            >
              <div className="relative z-10">
                <span className="text-4xl lg:text-5xl mb-3 block transform group-hover:scale-110 transition-transform">{game.emoji}</span>
                <h3 className="text-white font-black text-lg lg:text-xl leading-tight">{game.title}</h3>
                <p className="text-white/80 text-[11px] font-bold mt-1">⭐ +10 {isBn ? "পয়েন্ট" : "Points"}</p>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3.5 h-3.5 ${s <= game.stars ? 'fill-yellow-300 text-yellow-300' : 'fill-white/20 text-transparent'}`} 
                    />
                  ))}
                </div>
                <button className={`bg-white w-full py-2.5 rounded-xl font-black transition-transform active:scale-95 border-b-4 hover:brightness-95 ${game.borderColor} ${game.textColor}`}>
                  {isBn ? "খেলো" : "Play"}
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-10 text-center">
              <p className="text-slate-500 font-bold">{isBn ? "এই ক্যাটাগরিতে কোনো গেম নেই।" : "No games in this category."}</p>
            </div>
          )}
        </div>
      </section>

      {/* Achievement Strip */}
      <section className="mb-12 max-w-5xl mx-auto">
        <div className="px-6 lg:px-10 flex justify-between items-end mb-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">{isBn ? "তোমার অর্জন" : "Achievements"} 🏅</h2>
          <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">{isBn ? "সব দেখো" : "View All"}</button>
        </div>
        <div className="flex overflow-x-auto gap-6 px-6 lg:px-10 pb-4 [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-3xl shadow-sm border-2 border-yellow-300">🎯</div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isBn ? "শার্পশুটার" : "Sharpshooter"}</span>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-3xl shadow-sm border-2 border-orange-300">🔥</div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isBn ? "স্ট্রিক মাস্টার" : "Streak Master"}</span>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-3xl shadow-sm border-2 border-blue-300">⚡</div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isBn ? "গতি সম্রাট" : "Speed King"}</span>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0 opacity-40 grayscale">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl border-2 border-slate-300 dark:border-slate-700">🛡️</div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isBn ? "রক্ষণশীল" : "Defender"}</span>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0 opacity-40 grayscale">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl border-2 border-slate-300 dark:border-slate-700">💎</div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{isBn ? "মণি সংগ্রাহক" : "Collector"}</span>
          </div>
        </div>
      </section>

      {/* Leaderboard Mini */}
      <section className="px-6 lg:px-10 mb-10 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            {isBn ? "আজকের সেরা খেলোয়াড়" : "Today's Top Players"} 🏆
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-yellow-500 w-4">1</span>
                <div className="text-3xl">🦁</div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">রাহাত</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">পাজল মাস্টার</p>
                </div>
              </div>
              <span className="font-black text-blue-600 dark:text-blue-400">1,240 pts</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 border-slate-300">
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-slate-400 w-4">2</span>
                <div className="text-3xl">🐰</div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">সায়রা</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">গণিত কুইন</p>
                </div>
              </div>
              <span className="font-black text-blue-600 dark:text-blue-400">1,150 pts</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 border-amber-600">
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-amber-600 w-4">3</span>
                <div className="text-3xl">🐼</div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">তামিম</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">বিগিনার</p>
                </div>
              </div>
              <span className="font-black text-blue-600 dark:text-blue-400">980 pts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
