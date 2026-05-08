
import { useState, useEffect } from 'react';
import { ArrowLeft, User, BarChart, Calendar, Trophy, Clock, AlertCircle, TrendingUp, Star, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const ParentPanel = () => {
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [period, setPeriod] = useState('week'); // 'today', 'week', 'month', 'session'

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getParentDashboard(user?.id, period);
        setChildData(data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, period]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-eduplay-blue" />
      </div>
    );
  }

  if (error || !childData) {
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
      <div className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/30">
                <User className="w-4 h-4 mr-2" />
                Chat with Teacher
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
              <p className="text-xl opacity-90">Monitor {childData.name}'s learning journey</p>
            </div>
            
            <div className="text-center bg-white/20 rounded-2xl p-6">
              <User className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">{childData.name}</div>
              <div className="text-sm opacity-90">{childData.grade} • Age {childData.age}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Time Period Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Performance Summary</h2>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="session">This Session</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weekly Overview */}
        <Card className="mb-8 border-0 playful-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-eduplay-blue" />
              <span className="capitalize">Summary ({period})</span>
              <Badge className="bg-eduplay-green text-white">{childData.periodStats.improvement} improvement</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-eduplay-blue">{childData.periodStats.lessonsCompleted}</div>
                <div className="text-sm text-gray-600">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eduplay-orange">{childData.periodStats.starsEarned}</div>
                <div className="text-sm text-gray-600">Stars Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eduplay-green">{childData.periodStats.timeSpent}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eduplay-purple">{childData.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Performance Graph */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-eduplay-blue" />
                  <span className="capitalize">Activity Chart ({period})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={childData.timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
                      <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" name="Score/Stars" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-6 h-6 text-eduplay-purple" />
                  <span>Subject Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {childData.subjects.map((subject, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{subject.name}</h4>
                        <Badge variant="outline">{subject.lastActivity}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-eduplay-blue">{subject.progress}%</div>
                          <div className="text-xs text-gray-600">Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-eduplay-green">{subject.accuracy}%</div>
                          <div className="text-xs text-gray-600">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-eduplay-orange">{subject.timeSpent}</div>
                          <div className="text-xs text-gray-600">Time Spent</div>
                        </div>
                      </div>
                      
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-eduplay-green" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {childData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{activity.subject}: {activity.lesson}</div>
                        <div className="text-sm text-gray-600">{activity.time}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="font-bold text-eduplay-blue">{activity.score}</div>
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < parseInt(activity.score.split('/')[0]) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Stats */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-eduplay-yellow" />
                  <span>Overall Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Learning Time:</span>
                  <span className="font-bold">{childData.totalLearningTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lessons Completed:</span>
                  <span className="font-bold">{childData.lessonsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Accuracy:</span>
                  <span className="font-bold text-eduplay-green">{childData.averageAccuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Streak:</span>
                  <span className="font-bold text-eduplay-orange">{childData.currentStreak} days 🔥</span>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-eduplay-blue" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {childData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-eduplay-blue mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-eduplay-purple" />
                  <span>This Month's Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Complete 50 lessons</span>
                    <span className="font-bold">42/50</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Maintain 85% accuracy</span>
                    <span className="font-bold text-green-600">89% ✓</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>7-day learning streak</span>
                    <span className="font-bold text-green-600">7/7 ✓</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPanel;
