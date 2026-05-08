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
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Crown className="w-5 h-5 text-white" />
        </div>
      );
    case 2:
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center shadow-md">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    case 3:
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
          <span className="text-sm font-bold text-gray-500">#{rank}</span>
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
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 animate-spin text-eduplay-purple mx-auto" />
          <p className="text-gray-500">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Back + Refresh */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-eduplay-purple transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Link>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeaderboard}
              className="gap-2 text-eduplay-purple border-eduplay-purple/30 hover:bg-eduplay-purple/10"
            >
              <RefreshCw className="w-3 h-3" />
              {t.search}
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-4">
            <Trophy className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">Live Student Leaderboard</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent">
              🏆 {t.topLearners}
            </span>
          </h1>
          <p className="text-gray-600 text-lg">{t.leaderboardSubtitle}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            onClick={() => setActiveTab('weekly')}
            className={`rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-eduplay-purple to-eduplay-blue text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            <Flame className="w-4 h-4 mr-2" />
            {t.thisWeek}
          </Button>
          <Button
            onClick={() => setActiveTab('allTime')}
            className={`rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ${
              activeTab === 'allTime'
                ? 'bg-gradient-to-r from-eduplay-purple to-eduplay-blue text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            <Star className="w-4 h-4 mr-2" />
            {t.allTime}
          </Button>
        </div>

        {/* Class Filter */}
        <div className="flex justify-center mb-8">
          <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); }}>
            <SelectTrigger className="w-[200px] bg-white border-2 border-eduplay-purple/20 text-eduplay-purple font-semibold rounded-full">
              <SelectValue placeholder={t.allGrades} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allGrades}</SelectItem>
              <SelectItem value="play">Play Group</SelectItem>
              <SelectItem value="nursery">{t.nursery}</SelectItem>
              <SelectItem value="kg">Kindergarten</SelectItem>
              <SelectItem value="1">{t.class1}</SelectItem>
              <SelectItem value="2">{t.class2}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-10">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="text-4xl mb-2">{leaders[1]?.avatar}</div>
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-xl w-24 h-20 flex items-center justify-center relative">
                <span className="text-2xl font-black text-gray-500">2</span>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Medal className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <p className="text-sm font-bold mt-2 text-gray-700">{leaders[1]?.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">⭐ {leaders[1]?.stars}</p>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="text-5xl mb-2 animate-bounce">{leaders[0]?.avatar}</div>
              <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-xl w-28 h-28 flex items-center justify-center relative shadow-xl">
                <span className="text-3xl font-black text-white">1</span>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm font-bold mt-2 text-gray-800">{leaders[0]?.name.split(' ')[0]}</p>
              <p className="text-xs text-yellow-600 font-bold">⭐ {leaders[0]?.stars}</p>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="text-4xl mb-2">{leaders[2]?.avatar}</div>
              <div className="bg-gradient-to-b from-orange-200 to-orange-400 rounded-t-xl w-24 h-16 flex items-center justify-center relative">
                <span className="text-2xl font-black text-orange-700">3</span>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Medal className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <p className="text-sm font-bold mt-2 text-gray-700">{leaders[2]?.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">⭐ {leaders[2]?.stars}</p>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-eduplay-purple/5 to-eduplay-blue/5 py-3 px-6">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <span className="w-16">Rank</span>
              <span className="flex-1">Student</span>
              <span className="w-20 text-center">⭐ Stars</span>
              <span className="w-20 text-center hidden sm:block">🔥 Streak</span>
              <span className="w-24 text-center hidden md:block">🎯 Accuracy</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {leaders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>কোনো ডাটা পাওয়া যায়নি। Quiz দাও এবং Leaderboard-এ নাম তোলো! 🚀</p>
              </div>
            ) : (
              leaders.map((entry, i) => (
                <div
                  key={entry.id || i}
                  className={`flex items-center px-6 py-4 border-b border-gray-50 transition-all duration-200 ${
                    entry.isCurrentUser
                      ? 'bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 border-l-4 border-l-eduplay-purple'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-16">{getRankBadge(entry.rank)}</div>

                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <p className={`font-bold text-sm ${entry.isCurrentUser ? 'text-eduplay-purple' : 'text-gray-800'}`}>
                        {entry.name}
                        {entry.isCurrentUser && (
                          <Badge className="ml-2 text-xs bg-eduplay-purple/20 text-eduplay-purple hover:bg-eduplay-purple/20">
                            তুমি!
                          </Badge>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{entry.level}</span>
                        {(entry.quizzes ?? 0) > 0 && (
                          <span className="text-xs text-blue-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {entry.quizzes} quizzes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-20 text-center">
                    <span className="font-bold text-yellow-600">⭐ {entry.stars.toLocaleString()}</span>
                  </div>

                  <div className="w-20 text-center hidden sm:block">
                    <span className="text-sm text-orange-500">🔥 {entry.streak}</span>
                  </div>

                  <div className="w-24 text-center hidden md:block">
                    {entry.accuracy ? (
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-3 h-3 text-green-500" />
                        <span className="text-sm text-green-600 font-semibold">{entry.accuracy}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Current user's position if not in top 10 */}
        {user && !leaders.some(l => l.isCurrentUser) && (
          <div className="mt-4 p-4 bg-eduplay-purple/10 border border-eduplay-purple/20 rounded-xl flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-eduplay-purple flex-shrink-0" />
            <p className="text-sm text-eduplay-purple font-medium">
              তুমি এখনো Top 10-এ নেই। আরও Quiz দাও এবং Stars অর্জন করো! 🌟
            </p>
          </div>
        )}

        {/* Motivational CTA */}
        <div className="mt-10 text-center bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-8 rounded-3xl shadow-xl">
          <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-3 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">তুমিও পারবে Champion হতে! 🏆</h3>
          <p className="text-white/80 mb-4">প্রতিদিন কিছু নতুন শেখো, Quiz দাও, আর Star জমাও!</p>
          <Link to="/">
            <Button className="bg-white text-eduplay-purple hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-5 rounded-2xl font-bold">
              এখনই শেখা শুরু করো! 🚀
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
