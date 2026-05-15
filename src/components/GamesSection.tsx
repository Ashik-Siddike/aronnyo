
import { Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { motion } from 'framer-motion';

const GamesSection = () => {
  const { t } = useLang();

  const games = [
    { id: 'counting',        titleKey: 'countingGame'       as const, emoji: '🔢', path: '/counting-game',       color: 'from-blue-500 to-purple-600',    difficulty: 'Easy',   category: 'Math'     },
    { id: 'addition',        titleKey: 'additionGame'       as const, emoji: '➕',  path: '/addition-game',       color: 'from-green-500 to-blue-600',     difficulty: 'Easy',   category: 'Math'     },
    { id: 'subtraction',     titleKey: 'subtractionGame'    as const, emoji: '➖',  path: '/subtraction-game',    color: 'from-orange-500 to-red-600',     difficulty: 'Medium', category: 'Math'     },
    { id: 'multiplication',  titleKey: 'multiplicationGame' as const, emoji: '✖️',  path: '/multiplication-game', color: 'from-purple-500 to-pink-600',    difficulty: 'Hard',   category: 'Math'     },
    { id: 'spelling-wizard', titleKey: 'spellingWizard'     as const, emoji: '🪄',  path: '/spelling-wizard',     color: 'from-pink-500 to-purple-500',    difficulty: 'Easy',   category: 'Language' },
    { id: 'animal-quiz',     titleKey: 'animalQuiz'         as const, emoji: '🐾',  path: '/animal-quiz',         color: 'from-green-500 to-teal-600',     difficulty: 'Easy',   category: 'Science', isNew: true },
    { id: 'plant-explorer',  titleKey: 'plantExplorer'      as const, emoji: '🌱',  path: '/plant-explorer',      color: 'from-emerald-500 to-green-600',  difficulty: 'Medium', category: 'Science', isNew: true },
    { id: 'memory-match',    titleKey: 'memoryMatch'        as const, emoji: '🧠',  path: '/memory-match',        color: 'from-blue-500 to-indigo-600',    difficulty: 'Easy',   category: 'Memory',  isNew: true },
  ];

  const diffColor = (d: string) =>
    d === 'Easy' ? 'bg-green-100 text-green-700' :
    d === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
    'bg-red-100 text-red-700';

  return (
    <section id="games-section" className="py-12 lg:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              {t.gamesTitle} 🎮
            </span>
          </h2>
          <p className="text-base lg:text-2xl text-gray-600 max-w-2xl mx-auto mt-3 font-medium">
            {t.gamesSubtitle}
          </p>
        </motion.div>

        {/* ── Games Grid (2-col mobile, 3-col md, 4-col xl) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-10 lg:mb-16">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.07, type: 'spring', bounce: 0.3 }}
            >
              <Link to={game.path} className="block h-full group">
                <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col active:scale-95">
                  {/* NEW badge */}
                  {game.isNew && (
                    <span className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}

                  {/* Coloured top strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${game.color} w-full`} />

                  <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                    {/* Emoji icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <span className="text-2xl sm:text-3xl">{game.emoji}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-800 group-hover:text-purple-600 leading-snug transition-colors">
                      {t[game.titleKey]}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-auto">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${diffColor(game.difficulty)}`}>
                        {t[game.difficulty.toLowerCase() as keyof typeof t] || game.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">{game.category}</span>
                    </div>

                    {/* Play button */}
                    <div className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r ${game.color} text-white text-xs sm:text-sm font-bold shadow group-hover:shadow-lg transition-all`}>
                      <Gamepad2 className="w-3.5 h-3.5" />
                      {t.playNow}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Stats Row (always 3-col) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-3 sm:gap-6"
        >
          {[
            { value: `${games.length}`, label: 'ইন্টারঅ্যাক্টিভ গেম', color: 'from-blue-500 to-purple-600', bg: 'from-blue-50 to-purple-50' },
            { value: '5+',             label: 'শিক্ষামূলক বিষয়',   color: 'from-green-500 to-teal-600',  bg: 'from-green-50 to-teal-50'  },
            { value: '100%',           label: 'মজা গ্যারান্টি',     color: 'from-orange-500 to-pink-600', bg: 'from-orange-50 to-pink-50' },
          ].map(({ value, label, color, bg }) => (
            <motion.div key={label} whileHover={{ y: -4 }} transition={{ type: 'spring', bounce: 0.4 }}>
              <div className={`bg-gradient-to-br ${bg} rounded-2xl p-4 sm:p-6 text-center shadow-md`}>
                <div className={`text-2xl sm:text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  {value}
                </div>
                <div className="text-[11px] sm:text-sm text-gray-600 font-semibold mt-1 leading-tight">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GamesSection;
