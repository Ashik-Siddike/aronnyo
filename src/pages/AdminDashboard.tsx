import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, BookOpen, BarChart, Settings, LogOut, GraduationCap, FileText, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { staticUsers, staticContents, staticGrades, staticSubjects, mockDelay } from '@/data/staticData';
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
      console.log('Fetching admin statistics...');
      console.log('Current user profile:', profile);
      
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
      
      // Simulate API delay
      await mockDelay(300);
      
      console.log('Fetching admin statistics from static data...');
      
      // Use static data
      const users = [...staticUsers];
      const contents = [...staticContents];
      const grades = [...staticGrades];
      const subjects = [...staticSubjects];

      console.log('Data fetched:', {
        users: users.length,
        contents: contents.length,
        grades: grades.length,
        subjects: subjects.length
      });

      const stats = {
        totalStudents: users.filter(u => u.role === 'student').length,
        totalTeachers: users.filter(u => u.role === 'teacher').length,
        totalLessons: contents.length,
        totalGrades: grades.length,
        totalSubjects: subjects.length,
        publishedContent: contents.filter(c => c.is_published === true).length,
        draftContent: contents.filter(c => c.is_published === false).length,
        activeUsers: users.length,
      };

      setAdminStats(stats);
      console.log('Admin stats loaded successfully:', stats);
      
      toast({
        title: "Success",
        description: "Statistics loaded successfully",
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
          <BarChart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-2">Welcome to Play Learn Grow Management Console</p>
        {profile && (
          <p className="text-lg text-gray-500">Hello, <span className="font-semibold text-blue-600">{profile.full_name}</span></p>
        )}
      </div>
      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{adminStats.totalStudents}</div>
              <div className="text-sm text-gray-600 font-medium">Students</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">{adminStats.totalTeachers}</div>
              <div className="text-sm text-gray-600 font-medium">Teachers</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">{adminStats.totalLessons}</div>
              <div className="text-sm text-gray-600 font-medium">Total Content</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">{adminStats.activeUsers}</div>
              <div className="text-sm text-gray-600 font-medium">Active Users</div>
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

      {/* Admin Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-800">User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 leading-relaxed">Manage students, teachers, and admin accounts with full control over user permissions and roles.</p>
            <Link to="/admin/users">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-800">Content Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 leading-relaxed">Create and manage lessons, quizzes, and educational content for all grades and subjects.</p>
            <Link to="/admin/content">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Manage Content
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-800">Grade & Subject Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 leading-relaxed">Configure grades, subjects, and curriculum structure to organize your educational content.</p>
            <Link to="/admin/grades">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Manage Grades & Subjects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-4 justify-center pt-8">
        <Button 
          variant="outline" 
          onClick={fetchAdminStats}
          disabled={loading}
          className="px-6 py-3 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
        >
          <BarChart className="w-4 h-4 mr-2" />
          Refresh Statistics
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSignOut} 
          className="px-6 py-3 rounded-xl border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;