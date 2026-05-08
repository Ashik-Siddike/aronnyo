import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Target, Clock, Zap, BookOpen, BarChart2, RefreshCw, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityService } from '@/services/activityService';

const BADGE_RULES = [
  { id: 'first_quiz',    icon: '🎯', title: 'First Quiz',      desc: 'Complete your first quiz',        req: (s: any) => (s.quizzes_completed || 0) >= 1 },
  { id: 'quiz_5',        icon: '📝', title: 'Quiz Veteran',    desc: 'Complete 5 quizzes',              req: (s: any) => (s.quizzes_completed || 0) >= 5 },
  { id: 'accuracy_80',   icon: '🎯', title: 'Sharp Shooter',   desc: 'Reach 80% accuracy',              req: (s: any) => (s.accuracy || 0) >= 80 },
  { id: 'stars_50',      icon: '⭐', title: 'Star Collector',  desc: 'Earn 50 stars',                   req: (s: any) => (s.total_stars || 0) >= 50 },
  { id: 'stars_200',     icon: '🌟', title: 'Star Champion',   desc: 'Earn 200 stars',                  req: (s: any) => (s.total_stars || 0) >= 200 },
  { id: 'streak_3',      icon: '🔥', title: 'On Fire',         desc: '3-day learning streak',           req: (s: any) => (s.streak || 0) >= 3 },
  { id: 'streak_7',      icon: '🔥', title: 'Week Warrior',    desc: '7-day learning streak',           req: (s: any) => (s.streak || 0) >= 7 },
  { id: 'lesson_10',     icon: '📚', title: 'Bookworm',        desc: 'Complete 10 lessons',             req: (s: any) => (s.lessons_completed || 0) >= 10 },
  { id: 'hours_5',       icon: '⏱️', title: 'Dedicated',       desc: '5 hours of learning',             req: (s: any) => (s.hours_learned || 0) >= 5 },
];

const LEVELS = [
  { name: 'নতুন শিক্ষার্থী', min: 0,   max: 50,  color: 'from-gray-400 to-gray-500' },
  { name: 'জ্ঞানী শিক্ষার্থী', min: 50,  max: 150, color: 'from-blue-400 to-blue-500' },
  { name: 'দক্ষ শিক্ষার্থী',  min: 150, max: 300, color: 'from-green-400 to-green-500' },
  { name: 'বিশেষজ্ঞ',        min: 300, max: 500, color: 'from-purple-400 to-purple-500' },
  { name: 'মাস্টার',          min: 500, max: 1000, color: 'from-yellow-400 to-orange-500' },
  { name: 'চ্যাম্পিয়ন',       min: 1000, max: Infinity, color: 'from-pink-400 to-red-500' },
];

const getLevel = (stars: number) => {
  return LEVELS.find(l => stars >= l.min && stars < l.max) || LEVELS[0];
};

const getLevelProgress = (stars: number) => {
  const level = getLevel(stars);
  if (level.max === Infinity) return 100;
  return Math.round(((stars - level.min) / (level.max - level.min)) * 100);
};

const StudentProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState('🧒');

  const avatars = ['🧒', '👧', '👨‍🚀', '👩‍🚀', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧚‍♀️', '🦁', '🐯', '🐻', '🐼', '🦊', '🦄'];

  useEffect(() => {
    // Load saved avatar
    const savedAvatar = localStorage.getItem(`avatar_${user?.id}`);
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user]);

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar);
    localStorage.setItem(`avatar_${user?.id}`, newAvatar);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, activities] = await Promise.all([
          ActivityService.getStudentStats(),
          ActivityService.getRecentActivities(8)
        ]);
        setStats(statsData);
        setRecentActivities(activities);
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-10 h-10 animate-spin text-eduplay-purple mx-auto" />
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const stars = stats?.total_stars || 0;
  const level = getLevel(stars);
  const levelPct = getLevelProgress(stars);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const earnedBadges = BADGE_RULES.filter(b => b.req(stats || {}));
  const lockedBadges = BADGE_RULES.filter(b => !b.req(stats || {}));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${level.color} text-white py-10`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl border-4 border-white/40 shadow-xl cursor-pointer hover:bg-white/30 transition-all relative group">
                  {avatar}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white uppercase tracking-wider text-center">Edit<br/>Avatar</span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Your Avatar</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 py-4">
                  {avatars.map(a => (
                    <button
                      key={a}
                      onClick={() => handleAvatarChange(a)}
                      className={`text-4xl p-2 rounded-xl transition-transform hover:scale-110 ${avatar === a ? 'bg-eduplay-purple/20 border-2 border-eduplay-purple shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{stats?.full_name || user?.email || 'শিক্ষার্থী'}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-white/20 text-white border-white/30 text-sm">
                  <Award className="w-3 h-3 mr-1" />{level.name}
                </Badge>
                <Badge className={`border-white/30 text-sm ${stats?.streak >= 7 ? 'bg-gradient-to-r from-orange-400 to-red-500 shadow-lg border-none text-white' : 'bg-white/20 text-white'}`}>
                  🔥 {stats?.streak || 0} day streak {stats?.streak >= 7 && '🏆'}
                </Badge>
              </div>
              {/* Level progress */}
              <div className="mt-3 max-w-xs">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{stars} stars</span>
                  {nextLevel && <span>Next: {level.max} stars</span>}
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${levelPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Star className="w-6 h-6 text-yellow-500" />, value: stars.toLocaleString(), label: 'Total Stars', bg: 'from-yellow-50 to-orange-50' },
            { icon: <Target className="w-6 h-6 text-blue-500" />,  value: `${stats?.accuracy || 0}%`,           label: 'Accuracy', bg: 'from-blue-50 to-indigo-50' },
            { icon: <BookOpen className="w-6 h-6 text-green-500" />, value: stats?.lessons_completed || 0,      label: 'Lessons Done', bg: 'from-green-50 to-emerald-50' },
            { icon: <Clock className="w-6 h-6 text-purple-500" />, value: `${stats?.hours_learned || 0}h`,     label: 'Hours Learned', bg: 'from-purple-50 to-pink-50' },
          ].map((stat, i) => (
            <Card key={i} className={`border-0 shadow-md bg-gradient-to-br ${stat.bg}`}>
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Earned Badges */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Earned Badges ({earnedBadges.length}/{BADGE_RULES.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {earnedBadges.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Complete activities to earn badges!</p>
                </div>
              ) : (
                earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{badge.title}</p>
                      <p className="text-xs text-gray-500">{badge.desc}</p>
                    </div>
                    <Badge className="ml-auto bg-yellow-100 text-yellow-700 border-yellow-200">Earned ✓</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Locked Badges */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Award className="w-5 h-5 text-gray-400" />
                Upcoming Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lockedBadges.slice(0, 5).map(badge => (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
                  <span className="text-2xl grayscale">{badge.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">{badge.title}</p>
                    <p className="text-xs text-gray-400">{badge.desc}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-xs">🔒 Locked</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart2 className="w-5 h-5 text-eduplay-purple" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No activities yet. Start learning! 🚀</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl">
                      {activity.activity_type === 'quiz_completed' ? '📝' :
                       activity.activity_type === 'lesson_completed' ? '📚' : '🎮'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{activity.lesson_name || activity.subject}</p>
                      <p className="text-xs text-gray-500">{activity.subject} • {activity.activity_type?.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-yellow-600">+{activity.stars_earned || 0} ⭐</div>
                      {activity.score > 0 && <div className="text-xs text-gray-500">{activity.score}%</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-3 justify-center flex-wrap pb-4">
          <Link to="/leaderboard">
            <Button className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue">
              <Trophy className="w-4 h-4 mr-2" /> Leaderboard
            </Button>
          </Link>
          <Link to="/lessons/math">
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" /> Continue Learning
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">
              <BarChart2 className="w-4 h-4 mr-2" /> Full Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
