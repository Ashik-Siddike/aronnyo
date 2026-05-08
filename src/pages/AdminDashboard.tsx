import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, BookOpen, BarChart, Settings, LogOut, GraduationCap, FileText, Eye, EyeOff, Activity, ShieldCheck, Database, Server, Award, RefreshCw, Calendar, TrendingUp, Upload, FileCheck, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { statsApi, activityApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { signOut, profile, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adminStats, setAdminStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalLessons: 0,
    totalGrades: 0,
    totalSubjects: 0,
    publishedContent: 0,
    draftContent: 0,
    activeUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to load, then check admin status
    if (!authLoading) {
      if (!isAdmin || !profile) {
        console.log('Not admin, redirecting...', { isAdmin, profile });
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      fetchAdminStats();
    }
  }, [authLoading, isAdmin, profile]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching admin statistics from MongoDB...');
      
      // Check if user is admin
      if (!profile || profile.role !== 'admin') {
        console.error('User is not admin. Role:', profile?.role);
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      
      // Fetch real stats and global activity from MongoDB API
      const [stats, activities] = await Promise.all([
        statsApi.get(),
        activityApi.getRecent('all', 5)
      ]);

      console.log('✅ Stats loaded from MongoDB:', stats);
      setAdminStats(stats);
      setRecentActivities(activities);
      
      toast({
        title: "Success",
        description: "Statistics loaded from database",
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Error",
        description: `Failed to load statistics: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin || !profile) {
    return null; // Navigation will happen in useEffect
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header Panel with Premium Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 transform rotate-3">
              <ShieldCheck className="w-10 h-10 text-white -rotate-3" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                Command Center
              </h1>
              <p className="text-blue-200 text-lg">
                System Overview & Control Panel
              </p>
            </div>
          </div>

          {profile && (
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                {profile.full_name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium uppercase tracking-wider">Superadmin</p>
                <p className="text-white font-semibold text-lg">{profile.full_name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Primary Metrics */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-4"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-gray-100 rounded mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden group rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <Users className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-4xl font-black text-gray-800 tracking-tight mb-1">{adminStats.totalStudents}</div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Students</div>
            </CardContent>
          </Card>
          
          <Card className="border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden group rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 transition-colors duration-300">
                <GraduationCap className="w-7 h-7 text-emerald-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-4xl font-black text-gray-800 tracking-tight mb-1">{adminStats.totalTeachers}</div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Teachers</div>
            </CardContent>
          </Card>
          
          <Card className="border border-violet-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden group rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-violet-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500 transition-colors duration-300">
                <BookOpen className="w-7 h-7 text-violet-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-4xl font-black text-gray-800 tracking-tight mb-1">{adminStats.totalLessons}</div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total Content</div>
            </CardContent>
          </Card>
          
          <Card className="border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden group rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <Activity className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-4xl font-black text-gray-800 tracking-tight mb-1">{adminStats.activeUsers}</div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Active Users</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Stats Row */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">{adminStats.totalGrades}</div>
              <div className="text-sm text-gray-600 font-medium">Grades</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-pink-600 mb-1">{adminStats.totalSubjects}</div>
              <div className="text-sm text-gray-600 font-medium">Subjects</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">{adminStats.publishedContent}</div>
              <div className="text-sm text-gray-600 font-medium">Published</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <EyeOff className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-1">{adminStats.draftContent}</div>
              <div className="text-sm text-gray-600 font-medium">Drafts</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health and Activity Split */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Core Management Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-800">System Modules</h2>
            <Badge variant="outline" className="bg-white px-3 py-1 text-sm border-blue-200 text-blue-700">8 Active Modules</Badge>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-blue-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 shadow-none">IAM</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Access Control</h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Manage authentication, roles, teachers, and student accounts.</p>
                  <Link to="/admin/users">
                    <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      Manage Users
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-emerald-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 shadow-none">CMS</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Content Hub</h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed">Author lessons, quizzes, and publish dynamic curriculum content.</p>
                  <Link to="/admin/content">
                    <Button className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      Content Library
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-violet-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-0 shadow-none">CONFIG</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Curriculum Architecture</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">Define the structural hierarchy of grades and subjects.</p>
                  <Link to="/admin/grades">
                    <Button className="w-full bg-slate-900 hover:bg-violet-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      Configure
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-orange-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 shadow-none">OPERATIONS</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Class Operations</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">Manage daily student attendance and issue report cards.</p>
                  <div className="flex flex-col gap-3">
                    <Link to="/admin/attendance">
                      <Button className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-xl shadow-md transition-colors duration-300">
                        Manage Attendance
                      </Button>
                    </Link>
                    <Link to="/admin/report-cards">
                      <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl transition-colors duration-300">
                        Report Cards
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-indigo-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 shadow-none">DATA</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Analytics Dashboard</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">Monitor daily active users, subject popularity, and retention rates.</p>
                  <Link to="/admin/analytics">
                    <Button className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-pink-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200 border-0 shadow-none">TOOLS</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Bulk User Import</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">Import students and teachers seamlessly via CSV files.</p>
                  <Link to="/admin/import">
                    <Button className="w-full bg-slate-900 hover:bg-pink-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      Import Data
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-teal-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-0 shadow-none">REVIEW</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Content Approval</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">Review and approve content submitted by teachers before publishing.</p>
                  <Link to="/admin/approvals">
                    <Button className="w-full bg-slate-900 hover:bg-teal-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      Review Pending
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="p-3 bg-amber-500 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Save className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 shadow-none">SYSTEM</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Backup & Export</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">Create database backups and export MongoDB collections.</p>
                  <Link to="/admin/backup">
                    <Button className="w-full bg-slate-900 hover:bg-amber-600 text-white rounded-xl shadow-md transition-colors duration-300">
                      Manage Backups
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Realtime Activity Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-800">System Logs</h2>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-600">Live</span>
            </div>
          </div>
          
          <Card className="border border-slate-200 shadow-lg rounded-2xl overflow-hidden bg-white h-[500px] flex flex-col">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-slate-500" />
                Recent User Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
              {recentActivities.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentActivities.map((act, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-start space-x-4">
                      <div className="mt-1">
                        {act.type === 'lesson_completed' ? (
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full"><BookOpen className="w-4 h-4" /></div>
                        ) : act.type === 'quiz_taken' ? (
                          <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><Award className="w-4 h-4" /></div>
                        ) : (
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Users className="w-4 h-4" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {act.student_id === 'student-1' ? 'ফাতিমা রহমান' : act.student_id}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {act.type === 'lesson_completed' ? 'Completed a lesson' : 'Performed an action'} in {act.subject}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(act.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                  <Database className="w-12 h-12 mb-4 text-slate-300" />
                  <p>No recent activity detected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 justify-between items-center pt-8 border-t border-slate-200 mt-12">
        <div className="text-sm text-slate-500 flex items-center">
          <Server className="w-4 h-4 mr-2" /> Server Status: <strong className="text-emerald-500 ml-1">Online & Stable</strong>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={fetchAdminStats}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync Data
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSignOut} 
            className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 shadow-md transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Terminate Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;