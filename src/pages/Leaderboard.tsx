import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trophy, Medal, Star, Crown, TrendingUp, Flame, ArrowLeft, Sparkles, RefreshCw, Target, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LangContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  id?: string;
  name: string;
  avatar: string;
  stars: number;
  badges: number;
  streak: number;
  level: string;
  accuracy?: number;
  quizzes?: number;
  isCurrentUser?: boolean;
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.8)] border-2 border-yellow-200 animate-pulse">
          <Crown className="w-6 h-6 text-white drop-shadow-md" />
        </div>
      );
    case 2:
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(148,163,184,0.6)] border-2 border-slate-200">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    case 3:
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.6)] border-2 border-orange-200">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
          <span className="text-sm font-bold text-slate-400">#{rank}</span>
        </div>
      );
  }
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'allTime'>('weekly');
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardEntry[]>([]);
  const [allTimeLeaders, setAllTimeLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { user } = useAuth();
  const { t } = useLang();

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getLeaderboard(undefined, selectedClass === 'all' ? undefined : selectedClass);

      // Mark the current user
      const markCurrentUser = (list: LeaderboardEntry[]) =>
        list.map(entry => ({
          ...entry,
          isCurrentUser: entry.id === user?.id
        }));

      setAllTimeLeaders(markCurrentUser(data.allTimeLeaders || []));
      setWeeklyLeaders(markCurrentUser(data.weeklyLeaders || []));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const leaders = activeTab === 'weekly' ? weeklyLeaders : allTimeLeaders;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="text-center space-y-4 relative z-10">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-500 mx-auto drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
          <p className="text-indigo-300 font-bold tracking-widest uppercase animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">

        {/* Back + Refresh */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Link>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline-block">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeaderboard}
              className="gap-2 bg-slate-800 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20 rounded-full"
            >
              <RefreshCw className="w-4 h-4" />
              {t.search}
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/30 mb-4"
          >
            <Trophy className="w-5 h-5 text-yellow-400 mr-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            <span className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Live Rankings</span>
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 drop-shadow-md tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent uppercase font-serif">
              HALL OF FAME
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">{t.leaderboardSubtitle}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            onClick={() => setActiveTab('weekly')}
            className={`rounded-full px-8 py-6 text-base font-black uppercase tracking-wider transition-all duration-300 border-2 ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-105'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Flame className={`w-5 h-5 mr-2 ${activeTab === 'weekly' ? 'animate-pulse text-yellow-300' : ''}`} />
            {t.thisWeek}
          </Button>
          <Button
            onClick={() => setActiveTab('allTime')}
            className={`rounded-full px-8 py-6 text-base font-black uppercase tracking-wider transition-all duration-300 border-2 ${
              activeTab === 'allTime'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-105'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Star className={`w-5 h-5 mr-2 ${activeTab === 'allTime' ? 'animate-spin-slow text-yellow-300' : ''}`} />
            {t.allTime}
          </Button>
        </div>

        {/* Class Filter */}
        <div className="flex justify-center mb-12">
          <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); }}>
            <SelectTrigger className="w-[240px] bg-slate-800/80 border-2 border-indigo-500/30 text-indigo-300 font-bold rounded-full py-6">
              <SelectValue placeholder={t.allGrades} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all" className="focus:bg-slate-700 font-bold">{t.allGrades}</SelectItem>
              <SelectItem value="play" className="focus:bg-slate-700">Play Group</SelectItem>
              <SelectItem value="nursery" className="focus:bg-slate-700">{t.nursery}</SelectItem>
              <SelectItem value="kg" className="focus:bg-slate-700">Kindergarten</SelectItem>
              <SelectItem value="1" className="focus:bg-slate-700">{t.class1}</SelectItem>
              <SelectItem value="2" className="focus:bg-slate-700">{t.class2}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="flex justify-center items-end gap-2 md:gap-6 mb-16 relative">
            {/* 2nd Place */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center w-28 md:w-36 z-10"
            >
              <div className="text-5xl md:text-6xl mb-3 relative drop-shadow-[0_0_15px_rgba(148,163,184,0.5)]">
                {leaders[1]?.avatar}
              </div>
              <div className="bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl h-24 md:h-32 flex flex-col items-center justify-start pt-4 relative shadow-[0_-5px_20px_rgba(148,163,184,0.2)] border-t-4 border-slate-400">
                <span className="text-4xl font-black text-slate-300/50">2</span>
              </div>
              <div className="bg-slate-800 p-3 rounded-b-2xl border-t border-slate-700 shadow-xl">
                <p className="text-sm font-black text-white truncate">{leaders[1]?.name.split(' ')[0]}</p>
                <p className="text-xs text-yellow-400 font-bold mt-1">⭐ {leaders[1]?.stars}</p>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-32 md:w-44 z-20 relative"
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-500/20 rounded-full blur-2xl"></div>
              <div className="text-6xl md:text-7xl mb-4 relative z-10 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-bounce-slow">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <Crown className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]" fill="currentColor" />
                </div>
                {leaders[0]?.avatar}
              </div>
              <div className="bg-gradient-to-t from-yellow-700 via-yellow-600 to-yellow-500 rounded-t-2xl h-32 md:h-44 flex flex-col items-center justify-start pt-4 relative shadow-[0_-10px_30px_rgba(234,179,8,0.4)] border-t-4 border-yellow-300">
                <span className="text-5xl font-black text-yellow-200/50">1</span>
              </div>
              <div className="bg-yellow-600 p-4 rounded-b-2xl shadow-[0_10px_20px_rgba(234,179,8,0.3)]">
                <p className="text-base font-black text-white truncate drop-shadow-md">{leaders[0]?.name.split(' ')[0]}</p>
                <p className="text-sm text-yellow-100 font-bold mt-1">⭐ {leaders[0]?.stars}</p>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center w-28 md:w-36 z-10"
            >
              <div className="text-5xl md:text-6xl mb-3 relative drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                {leaders[2]?.avatar}
              </div>
              <div className="bg-gradient-to-t from-orange-900 to-orange-800 rounded-t-2xl h-20 md:h-24 flex flex-col items-center justify-start pt-4 relative shadow-[0_-5px_20px_rgba(249,115,22,0.2)] border-t-4 border-orange-500">
                <span className="text-4xl font-black text-orange-300/50">3</span>
              </div>
              <div className="bg-orange-800 p-3 rounded-b-2xl border-t border-orange-700 shadow-xl">
                <p className="text-sm font-black text-white truncate">{leaders[2]?.name.split(' ')[0]}</p>
                <p className="text-xs text-yellow-300 font-bold mt-1">⭐ {leaders[2]?.stars}</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden">
          <div className="bg-slate-900/80 py-4 px-6 md:px-8 border-b border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-16">Rank</span>
              <span className="flex-1">Player</span>
              <span className="w-24 text-center">Score</span>
              <span className="w-20 text-center hidden sm:block">Streak</span>
              <span className="w-24 text-center hidden md:block">Precision</span>
            </div>
          </div>
          <div className="p-2">
            {leaders.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg">No players found. Start a quest to enter the arena! 🚀</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {leaders.map((entry, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={entry.id || i}
                      className={`flex items-center px-4 md:px-6 py-4 rounded-2xl transition-all duration-300 ${
                        entry.isCurrentUser
                          ? 'bg-indigo-600/20 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                          : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-16">{getRankBadge(entry.rank)}</div>

                      <div className="flex-1 flex items-center gap-4">
                        <div className="relative">
                          <span className="text-3xl drop-shadow-md">{entry.avatar}</span>
                          {entry.isCurrentUser && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-slate-900"></span>
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={`font-black text-base md:text-lg tracking-tight ${entry.isCurrentUser ? 'text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.8)]' : 'text-white'}`}>
                            {entry.name}
                            {entry.isCurrentUser && (
                              <Badge className="ml-3 text-xs bg-indigo-500 text-white font-bold uppercase tracking-wider py-0.5">
                                YOU
                              </Badge>
                            )}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-900/50 px-2 py-0.5 rounded-md">Lvl {entry.level}</span>
                            {(entry.quizzes ?? 0) > 0 && (
                              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {entry.quizzes} Quests
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-24 text-center">
                        <span className="font-black text-lg text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
                          {entry.stars.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-20 text-center hidden sm:block">
                        <span className="text-base font-bold text-orange-400 flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" /> {entry.streak}
                        </span>
                      </div>

                      <div className="w-24 text-center hidden md:block">
                        {entry.accuracy ? (
                          <div className="flex items-center justify-center gap-1">
                            <Target className="w-4 h-4 text-emerald-400" />
                            <span className="text-base text-emerald-400 font-bold">{entry.accuracy}%</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-slate-600">—</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Current user's position if not in top list */}
        {user && !leaders.some(l => l.isCurrentUser) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 bg-indigo-900/30 border border-indigo-500/30 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-indigo-300 font-bold uppercase tracking-wider mb-1">
                  You're almost there!
                </p>
                <p className="text-xs text-indigo-200/70">
                  Keep completing quests to enter the Hall of Fame.
                </p>
              </div>
            </div>
            <Link to="/games">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full">
                Play Now
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Motivational CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border border-indigo-500/30 p-10 rounded-[40px] shadow-[0_0_50px_rgba(79,70,229,0.2)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10"></div>
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-pulse relative z-10" />
          <h3 className="text-3xl md:text-4xl font-black text-white mb-3 relative z-10 tracking-tight">Rise to the Top! 🏆</h3>
          <p className="text-indigo-200 text-lg mb-8 relative z-10 font-medium">Every quest brings you closer to ultimate glory.</p>
          <Link to="/" className="relative z-10">
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-yellow-950 hover:text-white hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all duration-300 text-xl px-12 py-6 rounded-full font-black uppercase tracking-wider">
              Start Quest! 🚀
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
