import { useState } from 'react';
import { Menu, X, Home, BookOpen, BarChart3, GraduationCap, Trophy, Users, Calendar, Award, ChevronDown, Moon, Sun, Languages, Gamepad2, UserCircle, Play, FileText, Map, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserProfileButton from '@/components/UserProfileButton';
import NotificationBell from '@/components/NotificationBell';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();

  const standards = [
    'Nursery', '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard'
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/" && !location.hash;
    if (href === "/#hero-section") return location.pathname === "/" && (!location.hash || location.hash === "#hero-section");
    return location.pathname.includes(href.replace("#", ""));
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#hero-section');
    }
  };

  const handleSubjectsClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#subjects');
    }
  };

  const handleGamesClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#games');
    }
  };

  const handleStandardSelect = (standard: string) => {
    if (standard === 'Nursery') handleSubjectsClick();
    else navigate(`/class/${standard.split(' ')[0]}`);
  };

  const NavItemStyles = (active: boolean) =>
    `text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2 rounded-xl ${
      active
        ? 'text-eduplay-purple bg-eduplay-purple/10 shadow-sm'
        : 'text-gray-600 dark:text-gray-300 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
    }`;

  return (
    <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b-2 border-eduplay-purple/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-2 lg:py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. Logo (Left) */}
          <Link to="/#hero-section" onClick={handleHomeClick} className="flex items-center space-x-2 animate-scale-in">
            <img
              src="/assets/logo-2.png"
              alt="247School Logo"
              className="h-10 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-200"
            />
            <span className="text-2xl font-black bg-gradient-to-r from-eduplay-purple to-eduplay-blue bg-clip-text text-transparent hidden sm:block">
              247School
            </span>
          </Link>

          {/* 2. Main Navigation (Center) - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2">
            
            {/* Home */}
            <Link to="/#hero-section" onClick={handleHomeClick} className={NavItemStyles(isActive("/#hero-section"))}>
              <Home className="w-5 h-5 text-eduplay-orange" />
              <span>{t.home}</span>
            </Link>

            {/* Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={NavItemStyles(isActive("/subjects") || location.pathname.includes('/class/'))}>
                  <BookOpen className="w-5 h-5 text-eduplay-green" />
                  <span>{t.learn}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-2 border-eduplay-green/20 rounded-xl p-2 shadow-xl">
                <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t.subjects}</div>
                <DropdownMenuItem onClick={() => handleSubjectsClick()} className="cursor-pointer rounded-lg hover:bg-eduplay-green/10 text-base font-semibold py-2">
                  <BookOpen className="w-5 h-5 mr-3 text-eduplay-green" /> All Subjects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/video-lessons')} className="cursor-pointer rounded-lg hover:bg-eduplay-red/10 text-base font-semibold py-2">
                  <Play className="w-5 h-5 mr-3 text-red-500" /> Video Lessons
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/assignments')} className="cursor-pointer rounded-lg hover:bg-eduplay-orange/10 text-base font-semibold py-2">
                  <FileText className="w-5 h-5 mr-3 text-orange-500" /> Assignments
                </DropdownMenuItem>
                <div className="my-1 border-t border-gray-100 dark:border-slate-800"></div>
                <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t.classes}</div>
                {standards.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => handleStandardSelect(s)} className="cursor-pointer rounded-lg hover:bg-eduplay-purple/10 text-base font-medium py-2">
                    <GraduationCap className="w-4 h-4 mr-3 text-eduplay-purple opacity-70" /> {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Games */}
            <Link to="/#games" onClick={handleGamesClick} className={NavItemStyles(isActive("/#games"))}>
              <Gamepad2 className="w-5 h-5 text-pink-500" />
              <span>{t.games}</span>
            </Link>

            {/* Story Mode */}
            <Link to="/story-mode" className={NavItemStyles(isActive("/story-mode"))}>
              <Map className="w-5 h-5 text-emerald-500" />
              <span>Story Mode</span>
            </Link>

            {/* Progress Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={NavItemStyles(location.pathname === "/dashboard" || location.pathname === "/profile" || location.pathname === "/leaderboard")}>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>{t.progressMenu}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 bg-white dark:bg-slate-900 border-2 border-yellow-500/20 rounded-xl p-2 shadow-xl">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer rounded-lg hover:bg-yellow-500/10 text-base font-semibold py-2">
                  <BarChart3 className="w-5 h-5 mr-3 text-eduplay-blue" /> {t.dashboard}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer rounded-lg hover:bg-yellow-500/10 text-base font-semibold py-2">
                  <UserCircle className="w-5 h-5 mr-3 text-eduplay-purple" /> {t.profile}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/leaderboard')} className="cursor-pointer rounded-lg hover:bg-yellow-500/10 text-base font-semibold py-2">
                  <Trophy className="w-5 h-5 mr-3 text-yellow-500" /> {t.leaderboard}
                </DropdownMenuItem>
                <div className="my-1 border-t border-gray-100 dark:border-slate-800"></div>
                <DropdownMenuItem onClick={() => navigate('/timetable')} className="cursor-pointer rounded-lg hover:bg-yellow-500/10 text-base font-semibold py-2">
                  <Clock className="w-5 h-5 mr-3 text-eduplay-blue" /> Timetable
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/attendance')} className="cursor-pointer rounded-lg hover:bg-yellow-500/10 text-base font-semibold py-2">
                  <Calendar className="w-5 h-5 mr-3 text-eduplay-orange" /> {t.attendance}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/report-card')} className="cursor-pointer rounded-lg hover:bg-yellow-500/10 text-base font-semibold py-2">
                  <Award className="w-5 h-5 mr-3 text-emerald-500" /> {t.reportCard}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Parent */}
            <Link to="/parent" className={NavItemStyles(isActive("/parent"))}>
              <Users className="w-5 h-5 text-eduplay-blue" />
              <span>{t.parentPanel}</span>
            </Link>
          </nav>

          {/* 3. Right Actions */}
          <div className="hidden lg:flex items-center gap-3 animate-fade-in delay-700">
            {/* Interactive Bell */}
            <div className="bg-gray-100 dark:bg-slate-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-slate-700 transition">
              <NotificationBell />
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 dark:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-inner"
              title="Change Language"
            >
              <Languages className="w-4 h-4 text-eduplay-purple" />
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-inner"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="pl-2 border-l border-gray-200 dark:border-slate-700">
              <UserProfileButton />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-eduplay-purple" /> : <Menu className="w-6 h-6 text-eduplay-purple" />}
          </button>
        </div>

        {/* 4. Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-eduplay-purple/10 animate-scale-in">
              <div className="pt-2">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">School Tools</p>
                <div className="grid grid-cols-2 gap-2 px-2">
                  <Link to="/timetable" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-eduplay-blue">
                    <Clock className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">Timetable</span>
                  </Link>
                  <Link to="/assignments" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-orange-500">
                    <FileText className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">Assignments</span>
                  </Link>
                  <Link to="/video-lessons" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-500">
                    <Play className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">Lessons</span>
                  </Link>
                  <Link to="/leaderboard" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 text-yellow-600">
                    <Trophy className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">Leaderboard</span>
                  </Link>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Classes</p>
                <div className="px-2 space-y-1">
                  {standards.slice(0, 4).map(s => (
                    <button key={s} onClick={() => { handleStandardSelect(s); setIsMenuOpen(false); }} className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                      <GraduationCap className="w-5 h-5 mr-3 text-eduplay-purple opacity-70" /> {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Quick Toggles */}
              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between px-2">
                <NotificationBell />
                <div className="flex gap-2">
                  <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 font-bold text-sm">
                    <Languages className="w-4 h-4 text-eduplay-purple" /> {lang === 'bn' ? 'EN' : 'বাং'}
                  </button>
                  <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-yellow-500">
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-slate-800">
                <UserProfileButton isMobile={true} onMenuClose={() => setIsMenuOpen(false)} />
              </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
