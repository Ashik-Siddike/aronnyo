import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star, Crown, TrendingUp, Flame, Award, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/services/api';

interface LeaderboardEntry {
  rank: number;
  id?: string;
  name: string;
  avatar: string;
  stars: number;
  badges: number;
  streak: number;
  level: string;
  isCurrentUser?: boolean;
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"><Crown className="w-5 h-5 text-white" /></div>;
    case 2:
      return <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg"><Medal className="w-5 h-5 text-white" /></div>;
    case 3:
      return <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center shadow-lg"><Medal className="w-5 h-5 text-white" /></div>;
    default:
      return <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"><span className="text-sm font-bold text-gray-600">#{rank}</span></div>;
  }
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'allTime'>('weekly');
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardEntry[]>([]);
  const [allTimeLeaders, setAllTimeLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getLeaderboard();
        setAllTimeLeaders(data.allTimeLeaders || []);
        setWeeklyLeaders(data.weeklyLeaders || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const leaders = activeTab === 'weekly' ? weeklyLeaders : allTimeLeaders;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-eduplay-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-eduplay-purple transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-4">
            <Trophy className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">Student Leaderboard</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent">
              🏆 Top Learners
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            দেখো কে সবচেয়ে বেশি শিখেছে! তুমিও পারবে! 💪
          </p>
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
            এই সপ্তাহ
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
            সর্বকালের সেরা
          </Button>
        </div>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end gap-4 mb-10">
          {/* 2nd Place */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
          <div className="text-center animate-fade-in">
            <div className="text-5xl mb-2 animate-bounce-gentle">{leaders[0]?.avatar}</div>
            <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-xl w-28 h-28 flex items-center justify-center relative shadow-lg">
              <span className="text-3xl font-black text-white">1</span>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-yellow-500 animate-wiggle" />
              </div>
            </div>
            <p className="text-sm font-bold mt-2 text-gray-800">{leaders[0]?.name.split(' ')[0]}</p>
            <p className="text-xs text-yellow-600 font-bold">⭐ {leaders[0]?.stars}</p>
          </div>
          
          {/* 3rd Place */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

        {/* Full Leaderboard */}
        <Card className="border-0 playful-shadow overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-eduplay-purple/5 to-eduplay-blue/5 py-4">
            <div className="flex items-center justify-between text-sm text-gray-500 font-medium px-2">
              <span className="w-16">Rank</span>
              <span className="flex-1">Student</span>
              <span className="w-20 text-center">Stars</span>
              <span className="w-20 text-center hidden sm:block">Streak</span>
              <span className="w-20 text-center hidden sm:block">Level</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {leaders.map((entry, i) => (
              <div
                key={entry.rank}
                className={`flex items-center px-6 py-4 border-b border-gray-50 hover:bg-eduplay-purple/5 transition-all duration-200 animate-fade-in ${
                  entry.isCurrentUser ? 'bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 border-l-4 border-l-eduplay-purple' : ''
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16">{getRankBadge(entry.rank)}</div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-2xl">{entry.avatar}</span>
                  <div>
                    <p className={`font-bold text-sm ${entry.isCurrentUser ? 'text-eduplay-purple' : 'text-gray-800'}`}>
                      {entry.name} {entry.isCurrentUser && <span className="text-xs bg-eduplay-purple/20 text-eduplay-purple px-2 py-0.5 rounded-full ml-1">তুমি!</span>}
                    </p>
                    <p className="text-xs text-gray-500">{entry.level}</p>
                  </div>
                </div>
                <div className="w-20 text-center">
                  <span className="font-bold text-yellow-600">⭐ {entry.stars}</span>
                </div>
                <div className="w-20 text-center hidden sm:block">
                  <span className="text-sm text-orange-500">🔥 {entry.streak}</span>
                </div>
                <div className="w-20 text-center hidden sm:block">
                  <span className="text-xs bg-eduplay-green/10 text-eduplay-green px-2 py-1 rounded-full">{entry.badges} 🏅</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Motivational CTA */}
        <div className="mt-10 text-center bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-8 rounded-3xl playful-shadow">
          <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-3 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">তুমিও পারবে Champion হতে! 🏆</h3>
          <p className="text-white/80 mb-4">প্রতিদিন কিছু নতুন শেখো, গেম খেলো, আর Star জমাও!</p>
          <Link to="/">
            <Button className="bg-white text-eduplay-purple hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-5 rounded-2xl">
              এখনই শেখা শুরু করো! 🚀
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
