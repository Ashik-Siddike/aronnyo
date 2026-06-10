import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();

  // Track scroll position for sticky visual upgrade
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const standards = [
    { value: 'Nursery', label: t.nurseryStandard },
    { value: '1st',     label: t.class1Standard },
    { value: '2nd',     label: t.class2Standard },
    { value: '3rd',     label: t.class3Standard },
    { value: '4th',     label: t.class4Standard },
    { value: '5th',     label: t.class5Standard },
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



  const handleStandardSelect = (val: string) => {
    if (val === 'Nursery') handleSubjectsClick();
    else navigate(`/class/${val}`);
  };

  const NavItemStyles = (active: boolean) =>
    `text-xs lg:text-[13px] xl:text-[15px] 2xl:text-base font-extrabold transition-all duration-200 hover:scale-102 flex items-center space-x-1.5 px-2 py-1.5 xl:px-3 2xl:px-3.5 rounded-xl whitespace-nowrap ${
      active
        ? 'text-eduplay-purple bg-eduplay-purple/10 shadow-sm'
        : 'text-gray-600 dark:text-gray-300 hover:text-eduplay-purple hover:bg-eduplay-purple/5'
    }`;

  return (
    <header className={`
      sticky top-0 z-50 border-b-2 border-eduplay-purple/20
      transition-all duration-300 ease-in-out
      ${
        scrolled
          ? 'bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl shadow-lg shadow-purple-500/10 py-0'
          : 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm'
      }
    `}>
      <div className="container mx-auto px-2 sm:px-4 py-2 lg:py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. Logo (Left) */}
          <Link to="/#hero-section" onClick={handleHomeClick} className="flex items-center space-x-1.5 xl:space-x-2 animate-scale-in">
            <img
              src="/assets/logo-2.png"
              alt="247School Logo"
              className="h-8 lg:h-9 xl:h-10 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-200"
            />
            <span className="text-lg xl:text-xl 2xl:text-2xl font-black bg-gradient-to-r from-eduplay-purple to-eduplay-blue bg-clip-text text-transparent hidden sm:block">
              247School
            </span>
          </Link>

          {/* 2. Main Navigation (Center) - Desktop */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2">
            
            {/* Home */}
            <Link to="/#hero-section" onClick={handleHomeClick} className={NavItemStyles(isActive("/#hero-section"))}>
              <Home className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-eduplay-orange" />
              <span>{t.home}</span>
            </Link>

            {/* Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={NavItemStyles(isActive("/subjects") || location.pathname.includes('/class/'))}>
                  <BookOpen className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-eduplay-green" />
                  <span>{t.learn}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-2 border-eduplay-green/20 rounded-xl p-2 shadow-xl">
                <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t.subjects}</div>
                <DropdownMenuItem onClick={() => handleSubjectsClick()} className="cursor-pointer rounded-lg hover:bg-eduplay-green/10 text-base font-semibold py-2">
                  <BookOpen className="w-5 h-5 mr-3 text-eduplay-green" /> {t.allSubjects}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/video-lessons')} className="cursor-pointer rounded-lg hover:bg-eduplay-red/10 text-base font-semibold py-2">
                  <Play className="w-5 h-5 mr-3 text-red-500" /> {t.videoLessons}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/assignments')} className="cursor-pointer rounded-lg hover:bg-eduplay-orange/10 text-base font-semibold py-2">
                  <FileText className="w-5 h-5 mr-3 text-orange-500" /> {t.assignments}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/writing-wizard')} className="cursor-pointer rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-base font-semibold py-2">
                  <span className="text-base mr-3">✏️</span> {lang === 'bn' ? 'বর্ণমালা জাদুকর' : 'Writing Wizard'}
                </DropdownMenuItem>
                <div className="my-1 border-t border-gray-100 dark:border-slate-800"></div>
                <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t.classes}</div>
                {standards.map((s) => (
                  <DropdownMenuItem key={s.value} onClick={() => handleStandardSelect(s.value)} className="cursor-pointer rounded-lg hover:bg-eduplay-purple/10 text-base font-medium py-2">
                    <GraduationCap className="w-4 h-4 mr-3 text-eduplay-purple opacity-70" /> {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Games */}
            <Link to="/games" className={NavItemStyles(isActive("/games"))}>
              <Gamepad2 className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-pink-500" />
              <span>{t.games}</span>
            </Link>

            {/* Story Mode */}
            <Link to="/story-mode" className={NavItemStyles(isActive("/story-mode"))}>
              <Map className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-emerald-500" />
              <span>{t.storyMode}</span>
            </Link>

            {/* Progress Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={NavItemStyles(location.pathname === "/dashboard" || location.pathname === "/profile" || location.pathname === "/leaderboard")}>
                  <Trophy className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-yellow-500" />
                  <span>{t.progressMenu}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
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
                  <Clock className="w-5 h-5 mr-3 text-eduplay-blue" /> {t.timetable}
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
              <Users className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-eduplay-blue" />
              <span>{t.parentPanel}</span>
            </Link>

            {/* Teams */}
            <Link to="/teams" className={NavItemStyles(isActive("/teams"))}>
              <Users className="w-4 h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 text-eduplay-purple" />
              <span>{t.teams}</span>
            </Link>
          </nav>

          {/* 3. Right Actions */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 animate-fade-in delay-700">
            {/* Interactive Bell */}
            <div className="bg-gray-100 dark:bg-slate-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-slate-700 transition">
              <NotificationBell />
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-purple-200/50 dark:border-purple-800/30 text-xs xl:text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-eduplay-purple hover:text-white dark:hover:bg-eduplay-purple dark:hover:text-white transition-all duration-300 shadow-sm"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-eduplay-purple dark:text-purple-400" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-purple-200/50 dark:border-purple-800/30 text-slate-700 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 xl:w-5 xl:h-5 text-yellow-500 animate-pulse" /> : <Moon className="w-4 h-4 xl:w-5 xl:h-5 text-indigo-500" />}
            </button>

            <div className="pl-1.5 border-l border-gray-200 dark:border-slate-700">
              <UserProfileButton />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-eduplay-purple" /> : <Menu className="w-6 h-6 text-eduplay-purple" />}
          </button>
        </div>

        {/* 4. Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-eduplay-purple/10 animate-scale-in">
              <div className="pt-2">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.schoolTools}</p>
                <div className="grid grid-cols-2 gap-2 px-2">
                  <Link to="/timetable" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-eduplay-blue">
                    <Clock className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">{t.timetable}</span>
                  </Link>
                  <Link to="/assignments" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-orange-500">
                    <FileText className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">{t.assignments}</span>
                  </Link>
                  <Link to="/video-lessons" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-500">
                    <Play className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">{t.lessons}</span>
                  </Link>
                  <Link to="/leaderboard" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 text-yellow-600">
                    <Trophy className="w-6 h-6 mb-1" /> <span className="text-xs font-bold">{t.leaderboard}</span>
                  </Link>
                  <Link to="/writing-wizard" onClick={() => setIsMenuOpen(false)} className="col-span-2 flex items-center justify-center p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-600 font-bold active:scale-98 transition-transform">
                    <span className="text-lg mr-2">✏️</span> <span className="text-sm">{lang === 'bn' ? 'বর্ণমালা জাদুকর' : 'Writing Wizard'}</span>
                  </Link>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.myClasses}</p>
                <div className="px-2 space-y-1">
                  {standards.slice(0, 4).map(s => (
                    <button key={s.value} onClick={() => { handleStandardSelect(s.value); setIsMenuOpen(false); }} className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                      <GraduationCap className="w-5 h-5 mr-3 text-eduplay-purple opacity-70" /> {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-slate-800">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Links</p>
                <div className="px-2 space-y-1">
                  <Link to="/parent" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 mr-3 text-eduplay-blue opacity-70" /> {t.parentPanel}
                  </Link>
                  <Link to="/teams" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 mr-3 text-eduplay-purple opacity-70" /> {t.teams}
                  </Link>
                </div>
              </div>

              {/* Mobile Quick Toggles */}
              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between px-2">
                <NotificationBell />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} 
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 font-bold text-sm text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
                  >
                    <Languages className="w-4 h-4 text-eduplay-purple dark:text-purple-400" /> 
                    <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
                  </button>
                  <button 
                    onClick={toggleTheme} 
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-800 text-yellow-500 active:scale-95 transition-all"
                  >
                    {isDark ? <Sun className="w-5 h-5 text-yellow-500 animate-pulse" /> : <Moon className="w-5 h-5 text-indigo-400" />}
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
