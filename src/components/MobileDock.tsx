import { Home, BookOpen, Gamepad2, Trophy, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';

const navItems = [
  { labelKey: 'dockHome' as const, path: '/', icon: Home, gradient: 'from-orange-400 to-pink-500', bg: 'bg-orange-50 dark:bg-orange-900/20', dot: 'bg-orange-400', emoji: '🏠' },
  { labelKey: 'dockLearn' as const, path: '/video-lessons', icon: BookOpen, gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-green-400', emoji: '📚' },
  { labelKey: 'dockGames' as const, path: '/story-mode', icon: Gamepad2, gradient: 'from-pink-400 to-purple-500', bg: 'bg-pink-50 dark:bg-pink-900/20', dot: 'bg-pink-500', emoji: '🎮', isCenter: true },
  { labelKey: 'dockProgress' as const, path: '/dashboard', icon: Trophy, gradient: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', dot: 'bg-yellow-400', emoji: '🏆' },
  { labelKey: 'dockProfile' as const, path: '/profile', icon: UserCircle, gradient: 'from-purple-400 to-blue-500', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-400', emoji: '👤' },
];

export default function MobileDock() {
  const location = useLocation();
  const { t } = useLang();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-0">
      {/* Blur overlay gradient above dock */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white/80 dark:from-slate-950/80 to-transparent pointer-events-none" />

      <div
        className="flex justify-around items-end bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[28px] shadow-[0_-2px_30px_rgba(0,0,0,0.12)] border border-white/60 dark:border-slate-700/50 px-2 py-2"
      >
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
                className="flex flex-col items-center relative -mt-5"
              >
                {/* Big center button */}
                <div
                  className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-pink-300/40 dark:shadow-pink-900/40 transition-all duration-200 ${isActive ? 'scale-95 shadow-md' : 'hover:scale-105 active:scale-95'}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                </div>
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
              className="flex flex-col items-center justify-end pb-0.5 w-14 transition-all duration-200"
            >
              <div
                className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `${item.bg} scale-105`
                    : 'scale-95 opacity-70 hover:opacity-100 hover:scale-100'
                }`}
              >
                {isActive ? (
                  <span className="text-xl">{item.emoji}</span>
                ) : (
                  <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}

                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${item.dot}`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-bold mt-1 transition-all ${
                  isActive ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent` : 'text-gray-400 dark:text-gray-500'
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
