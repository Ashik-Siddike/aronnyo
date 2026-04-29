import React, { createContext, useContext, useState } from 'react';

type Lang = 'bn' | 'en';

interface Translations {
  // Navigation
  home: string;
  dashboard: string;
  leaderboard: string;
  profile: string;
  logout: string;
  login: string;
  // Dashboard
  totalStars: string;
  accuracy: string;
  streak: string;
  rank: string;
  lessons: string;
  quizzes: string;
  myProgress: string;
  weeklyActivity: string;
  recentAchievements: string;
  currentGoals: string;
  // Common
  loading: string;
  save: string;
  cancel: string;
  search: string;
  present: string;
  absent: string;
  late: string;
  submit: string;
  next: string;
  back: string;
  completed: string;
  startLearning: string;
  viewAll: string;
  // Navigation Structured
  learn: string;
  games: string;
  progressMenu: string;
  classes: string;
  subjects: string;
  attendance: string;
  reportCard: string;
  teams: string;
  parentPanel: string;
}

const bn: Translations = {
  home: 'হোম', dashboard: 'ড্যাশবোর্ড', leaderboard: 'লিডারবোর্ড',
  profile: 'প্রোফাইল', logout: 'লগআউট', login: 'লগইন',
  totalStars: 'মোট তারা', accuracy: 'নির্ভুলতা', streak: 'ধারাবাহিকতা',
  rank: 'র‍্যাংক', lessons: 'পাঠ', quizzes: 'কুইজ',
  myProgress: 'আমার অগ্রগতি', weeklyActivity: 'সাপ্তাহিক কার্যক্রম',
  recentAchievements: 'সাম্প্রতিক অর্জন', currentGoals: 'বর্তমান লক্ষ্য',
  loading: 'লোড হচ্ছে...', save: 'সংরক্ষণ', cancel: 'বাতিল',
  search: 'খুঁজুন', present: 'উপস্থিত', absent: 'অনুপস্থিত', late: 'দেরি',
  submit: 'জমা দিন', next: 'পরবর্তী', back: 'পেছনে', completed: 'সম্পন্ন',
  startLearning: 'পড়া শুরু করো', viewAll: 'সব দেখো',
  learn: 'শেখো', games: 'গেমস', progressMenu: 'অগ্রগতি',
  classes: 'ক্লাসসমূহ', subjects: 'বিষয়সমূহ', attendance: 'উপস্থিতি',
  reportCard: 'রিপোর্ট কার্ড', teams: 'টিম', parentPanel: 'প্যারেন্ট প্যানেল'
};

const en: Translations = {
  home: 'Home', dashboard: 'Dashboard', leaderboard: 'Leaderboard',
  profile: 'Profile', logout: 'Logout', login: 'Login',
  totalStars: 'Total Stars', accuracy: 'Accuracy', streak: 'Streak',
  rank: 'Rank', lessons: 'Lessons', quizzes: 'Quizzes',
  myProgress: 'My Progress', weeklyActivity: 'Weekly Activity',
  recentAchievements: 'Recent Achievements', currentGoals: 'Current Goals',
  loading: 'Loading...', save: 'Save', cancel: 'Cancel',
  search: 'Search', present: 'Present', absent: 'Absent', late: 'Late',
  submit: 'Submit', next: 'Next', back: 'Back', completed: 'Completed',
  startLearning: 'Start Learning', viewAll: 'View All',
  learn: 'Learn', games: 'Games', progressMenu: 'Progress',
  classes: 'Classes', subjects: 'Subjects', attendance: 'Attendance',
  reportCard: 'Report Card', teams: 'Teams', parentPanel: 'Parent Panel'
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  isBn: boolean;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('247school_lang') as Lang) || 'bn';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('247school_lang', l);
  };

  const t = lang === 'bn' ? bn : en;

  return (
    <LangContext.Provider value={{ lang, setLang, t, isBn: lang === 'bn' }}>
      {children}
    </LangContext.Provider>
  );
};
