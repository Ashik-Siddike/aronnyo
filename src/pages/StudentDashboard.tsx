
import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart, Star, Trophy, Clock, Target, TrendingUp, Calendar, BookOpen, Award, Brain, Zap, Heart, Users, ChevronRight, Play, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import DailyChallenge from '@/components/DailyChallenge';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Pass user ID if logged in, otherwise default student
        const data = await dashboardApi.getStudentDashboard(user?.id);
        setStudentData(data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-8 pb-16 px-6 lg:px-10 overflow-hidden shadow-lg rounded-b-[40px]">
          <div className="container mx-auto max-w-6xl">
             <Skeleton className="h-8 w-24 mb-8 bg-white/20" />
             <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32 bg-white/20 rounded-full" />
                  <Skeleton className="h-12 w-64 bg-white/20" />
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-24 bg-white/20 rounded-2xl" />
                    <Skeleton className="h-12 w-24 bg-white/20 rounded-2xl" />
                    <Skeleton className="h-12 w-24 bg-white/20 rounded-2xl" />
                  </div>
                </div>
             </div>
          </div>
        </section>
        <div className="container mx-auto px-6 lg:px-10 -mt-10 max-w-6xl relative z-20 space-y-8">
           <Skeleton className="h-40 w-full rounded-2xl" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Skeleton className="h-48 rounded-2xl" />
             <Skeleton className="h-48 rounded-2xl" />
             <Skeleton className="h-48 rounded-2xl" />
           </div>
           <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center flex-col">
        <p className="text-red-500 mb-4">{error || 'Data not found'}</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header Banner - Arcade Style */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-8 pb-16 px-6 lg:px-10 overflow-hidden shadow-lg rounded-b-[40px]">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          <div className="absolute top-4 left-10 text-yellow-300 text-3xl animate-pulse">✨</div>
          <div className="absolute top-10 right-20 text-blue-200 text-4xl animate-bounce">⭐</div>
          <div className="absolute bottom-5 left-1/3 text-pink-300 text-2xl animate-pulse">✨</div>
          <div className="absolute top-8 right-1/3 text-white text-opacity-50 text-6xl rotate-12">🎮</div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-full font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {studentData.name ? 'Home' : 'Back'}
              </Button>
            </Link>
            <Link to="/certificate">
              <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-b-4 border-yellow-600 rounded-full font-black shadow-lg">
                <Award className="w-4 h-4 mr-2" />
                Certificate
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block border border-white/30">
                🚀 Player Profile
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">
                Hi, {studentData.name}! 👋
              </h1>
              <p className="text-blue-100 font-medium text-lg">Ready for your next quest?</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center text-white">
                  <span className="text-xl mr-2">🌟</span>
                  <div>
                    <div className="text-xs text-blue-200 font-bold uppercase">Level</div>
                    <div className="font-black leading-none">{studentData.level}</div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center text-white">
                  <span className="text-xl mr-2">👑</span>
                  <div>
                    <div className="text-xs text-blue-200 font-bold uppercase">Rank</div>
                    <div className="font-black leading-none">#{studentData.rank}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-gradient-to-b from-orange-400 to-red-500 p-1 rounded-3xl shadow-xl shadow-orange-500/30"
            >
              <div className="bg-white dark:bg-slate-800 rounded-[22px] p-6 text-center border-4 border-transparent flex flex-col items-center justify-center min-w-[140px]">
                <div className="text-4xl mb-1">🔥</div>
                <div className="text-4xl font-black text-orange-500 leading-none mb-1">{studentData.streak}</div>
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Day Streak!</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "⭐", label: "Total Stars", value: studentData.totalStars, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", shadow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]", border: "border-yellow-200 dark:border-yellow-700/50" },
            { icon: "🏆", label: "Badges", value: studentData.badges, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]", border: "border-emerald-200 dark:border-emerald-700/50" },
            { icon: "⏱️", label: "Hours", value: studentData.hoursLearned, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20", shadow: "shadow-[0_0_15px_rgba(236,72,153,0.3)]", border: "border-pink-200 dark:border-pink-700/50" },
            { icon: "🎯", label: "Accuracy", value: `${studentData.accuracy}%`, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", border: "border-blue-200 dark:border-blue-700/50" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className={`rounded-3xl p-5 border-2 ${stat.border} ${stat.bg} ${stat.shadow} bg-white dark:bg-slate-800 flex flex-col items-center justify-center text-center transition-all`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color} leading-none mb-1`}>{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Daily Challenge */}
        <div className="mb-10">
          <DailyChallenge />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Progress / Quests */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  🗺️ Your Quests
                </h2>
                <Badge variant="outline" className="font-bold border-indigo-200 text-indigo-600 bg-indigo-50">Active</Badge>
              </div>
              
              <div className="space-y-6">
                {studentData.subjects.map((subject: any, index: number) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white shadow-sm border-2 ${subject.color === 'text-blue-500' ? 'border-blue-200' : subject.color === 'text-emerald-500' ? 'border-emerald-200' : 'border-indigo-200'}`}>
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-white">{subject.name}</h3>
                          <p className="text-xs font-bold text-slate-500">Level {Math.floor(subject.progress / 10) + 1}</p>
                        </div>
                      </div>
                      <Link to={`/lessons/${subject.name.toLowerCase()}`}>
                        <button className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white px-5 py-2 rounded-xl font-bold shadow-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2 active:scale-95">
                          <Play className="w-4 h-4" /> Play
                        </button>
                      </Link>
                    </div>
                    
                    <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                      <span>Progress</span>
                      <span className={subject.color}>{subject.progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                      <div className={`h-full rounded-full ${subject.color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${subject.progress}%` }}></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/50 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Missions</div>
                        <div className="font-black text-slate-700 dark:text-slate-200 text-sm">{subject.lessonsCompleted}/{subject.totalLessons}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Best Score</div>
                        <div className="font-black text-emerald-500 text-sm">{subject.lastScore}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Time</div>
                        <div className="font-black text-slate-700 dark:text-slate-200 text-sm">{subject.timeSpent}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity Chart Mockup */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  📈 Weekly XP
                </h2>
              </div>
              <div className="flex items-end justify-between h-40 gap-2">
                {studentData.weeklyActivity.map((day: any, index: number) => {
                  const heightPercentage = Math.max((day.minutes / 60) * 100, 10);
                  const isToday = index === studentData.weeklyActivity.length - 1;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">{day.minutes}m</div>
                      <div className="w-full relative h-32 flex items-end justify-center bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`w-full rounded-xl ${isToday ? 'bg-gradient-to-t from-orange-400 to-pink-500' : 'bg-gradient-to-t from-blue-400 to-indigo-500'} shadow-sm`}
                        ></motion.div>
                      </div>
                      <div className={`text-xs font-bold ${isToday ? 'text-pink-500' : 'text-slate-500'}`}>{day.day}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/games" className="block">
                <button className="w-full bg-gradient-to-b from-purple-400 to-purple-600 border-b-4 border-purple-700 text-white rounded-2xl p-4 font-black shadow-sm active:scale-95 transition-transform flex flex-col items-center gap-2">
                  <span className="text-3xl">🎮</span>
                  Games
                </button>
              </Link>
              <Link to="/story-mode" className="block">
                <button className="w-full bg-gradient-to-b from-emerald-400 to-emerald-600 border-b-4 border-emerald-700 text-white rounded-2xl p-4 font-black shadow-sm active:scale-95 transition-transform flex flex-col items-center gap-2">
                  <span className="text-3xl">🗺️</span>
                  Story
                </button>
              </Link>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                🏅 Unlocked Badges
              </h2>
              <div className="space-y-3">
                {studentData.recentAchievements.map((achievement: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-yellow-300 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-2xl border border-yellow-200">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-slate-800 dark:text-white">{achievement.title}</div>
                      <div className="text-[10px] font-bold text-slate-500">{achievement.description}</div>
                    </div>
                    <div className="text-xs font-black text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                      +{achievement.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friends / Party */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                👥 My Party
              </h2>
              <div className="space-y-3">
                {studentData.friends.map((friend: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl shadow-sm">
                        {friend.avatar}
                      </div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{friend.name}</div>
                      <div className="text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                        ⭐ {friend.stars}
                      </div>
                    </div>
                    {friend.isOnline ? (
                      <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-100 px-2 py-1 rounded-md">Online</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-slate-400">Offline</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Motivation */}
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-[32px] p-6 text-center text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20 text-6xl transform translate-x-4 -translate-y-4">🌟</div>
              <div className="text-4xl mb-3 relative z-10">💪</div>
              <div className="text-xl font-black mb-1 relative z-10">Great Job!</div>
              <div className="text-sm font-medium text-pink-100 mb-3 relative z-10">Keep it up, {studentData.name}!</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-xs font-bold italic relative z-10 border border-white/30">
                "Learning is a superpower!"
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
