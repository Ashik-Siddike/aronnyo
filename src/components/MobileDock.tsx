import { Home, BookOpen, Gamepad2, Trophy, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { labelKey: 'dockHome'     as const, path: '/',           icon: Home,       gradient: 'from-orange-400 to-pink-500',   dot: 'bg-orange-400',  emoji: '🏠' },
  { labelKey: 'dockLearn'    as const, path: '/video-lessons', icon: BookOpen, gradient: 'from-green-400 to-emerald-500', dot: 'bg-green-400',   emoji: '📚' },
  { labelKey: 'dockGames'    as const, path: '/games',       icon: Gamepad2,   gradient: 'from-pink-400 to-purple-500',   dot: 'bg-pink-500',    emoji: '🎮', isCenter: true },
  { labelKey: 'dockProgress' as const, path: '/dashboard',   icon: Trophy,     gradient: 'from-yellow-400 to-orange-500', dot: 'bg-yellow-400',  emoji: '🏆' },
  { labelKey: 'dockProfile'  as const, path: '/profile',     icon: UserCircle, gradient: 'from-purple-400 to-blue-500',   dot: 'bg-purple-400',  emoji: '👤' },
];

export default function MobileDock() {
  const location = useLocation();
  const { t } = useLang();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-safe pb-3 pt-0">
      {/* Fade gradient above dock */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white/90 dark:from-slate-950/90 to-transparent pointer-events-none" />

      <div className="flex justify-around items-end bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[28px] shadow-[0_-4px_40px_rgba(0,0,0,0.15)] border border-white/60 dark:border-slate-700/50 px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/' && location.pathname === '/' && !location.hash);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.labelKey}
                to={item.path}
                className="flex flex-col items-center relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl shadow-pink-300/50 dark:shadow-pink-900/50 border-4 border-white dark:border-slate-900`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                </motion.div>
                <span className={`text-[10px] font-bold mt-1.5 ${isActive ? 'text-pink-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {t[item.labelKey]}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.labelKey}
              to={item.path}
              className="flex flex-col items-center justify-end pb-0.5 w-14"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                animate={isActive ? { y: [0, -4, 0] } : { y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                    : 'opacity-60 hover:opacity-90'
                }`}
              >
                {isActive ? (
                  <span className="text-xl drop-shadow">{item.emoji}</span>
                ) : (
                  <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}

                {/* Active dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="dot"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${item.dot}`}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <span
                className={`text-[10px] font-bold mt-1 transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {t[item.labelKey]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
