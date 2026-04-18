
import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart, Star, Trophy, Clock, Target, TrendingUp, Calendar, BookOpen, Award, Brain, Zap, Heart, Users, ChevronRight, Play, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-eduplay-blue" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {studentData.name}! 👋</h1>
              <p className="text-xl opacity-90">Ready for more learning adventures?</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Award className="w-4 h-4 mr-1" />
                  {studentData.level}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Users className="w-4 h-4 mr-1" />
                  Rank #{studentData.rank} of {studentData.totalStudents}
                </Badge>
              </div>
            </div>
            
            <div className="text-center bg-white/20 rounded-2xl p-6">
              <div className="text-3xl font-bold">{studentData.streak}</div>
              <div className="text-sm opacity-90">Day Streak! 🔥</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 playful-shadow bg-gradient-to-br from-eduplay-blue/10 to-eduplay-purple/10">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-eduplay-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-eduplay-purple">{studentData.totalStars}</div>
              <div className="text-sm text-gray-600">Total Stars</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow bg-gradient-to-br from-eduplay-green/10 to-eduplay-blue/10">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-eduplay-yellow mx-auto mb-2" />
              <div className="text-2xl font-bold text-eduplay-green">{studentData.badges}</div>
              <div className="text-sm text-gray-600">Badges</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow bg-gradient-to-br from-eduplay-orange/10 to-eduplay-pink/10">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-eduplay-pink mx-auto mb-2" />
              <div className="text-2xl font-bold text-eduplay-orange">{studentData.hoursLearned}</div>
              <div className="text-sm text-gray-600">Hours</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow bg-gradient-to-br from-eduplay-purple/10 to-eduplay-pink/10">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-eduplay-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-eduplay-purple">{studentData.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Progress */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-6 h-6 text-eduplay-purple" />
                  <span>Subject Progress</span>
                  <span className="text-2xl">📚</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {studentData.subjects.map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{subject.icon}</span>
                        <span className="font-semibold text-gray-700">{subject.name}</span>
                      </div>
                      <Link to={`/lessons/${subject.name.toLowerCase()}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          Continue
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Progress</div>
                        <div className={`font-bold ${subject.color}`}>{subject.progress}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Lessons</div>
                        <div className="font-bold">{subject.lessonsCompleted}/{subject.totalLessons}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Last Score</div>
                        <div className="font-bold text-green-600">{subject.lastScore}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Time Spent</div>
                        <div className="font-bold">{subject.timeSpent}</div>
                      </div>
                    </div>
                    <Progress value={subject.progress} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-eduplay-blue" />
                  <span>This Week's Activity</span>
                  <span className="text-2xl">📊</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {studentData.weeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                      <div className="bg-eduplay-blue/10 rounded-lg p-3 space-y-1">
                        <div className="text-sm font-bold text-eduplay-blue">{day.lessons}</div>
                        <div className="text-xs text-gray-600">lessons</div>
                        <div className="flex items-center justify-center">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-xs">{day.stars}</span>
                        </div>
                        <div className="text-xs text-gray-500">{day.minutes}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-eduplay-green" />
                  <span>Current Goals</span>
                  <span className="text-2xl">🎯</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData.currentGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{goal.description}</span>
                      <span className="text-sm font-bold">{goal.current}/{goal.target}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-eduplay-yellow" />
                  <span>Recent Achievements</span>
                  <span className="text-2xl">🎉</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentData.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-eduplay-yellow/10 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
                    </div>
                    <div className="text-xs font-bold text-eduplay-orange">+{achievement.points}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Friends */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-eduplay-pink" />
                  <span>Learning Friends</span>
                  <span className="text-2xl">👥</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentData.friends.map((friend, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-eduplay-pink/10 rounded-lg">
                    <div className="text-2xl relative">
                      {friend.avatar}
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{friend.name}</div>
                      <div className="text-xs text-gray-600">{friend.stars} stars</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {friend.isOnline ? '🟢 Online' : '⚫ Offline'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-eduplay-green" />
                  <span>Quick Actions</span>
                  <span className="text-2xl">🚀</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/lessons/math" className="block">
                  <Button className="w-full bg-gradient-to-r from-eduplay-blue to-eduplay-purple">
                    Continue Math
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/lessons/english" className="block">
                  <Button className="w-full bg-gradient-to-r from-eduplay-green to-eduplay-blue">
                    Start English
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/lessons/science" className="block">
                  <Button className="w-full bg-gradient-to-r from-eduplay-purple to-eduplay-pink">
                    Explore Science
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Daily Motivation */}
            <Card className="border-0 playful-shadow bg-gradient-to-br from-eduplay-orange/10 to-eduplay-pink/10">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">💪</div>
                <div className="text-lg font-bold text-eduplay-orange mb-2">তুমি দারুণ করছো!</div>
                <div className="text-sm text-gray-700">এভাবেই চালিয়ে যাও, {studentData.name}!</div>
                <div className="text-xs text-gray-600 mt-2">
                  "শিক্ষাই আলো, শিক্ষাই শক্তি — প্রতিদিন একটু একটু করে শেখো!" ✨
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
