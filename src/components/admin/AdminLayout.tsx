import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, BookOpen, Settings, BarChart, Home, Shield } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 transition-all duration-200 rounded-full px-4">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-blue-200">Play Learn Grow - Management Console</p>
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1 bg-white/10 rounded-2xl p-1 backdrop-blur-sm">
              <Link to="/admin">
                <Button 
                  variant={isActive('/admin') ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`text-white hover:bg-white/20 transition-all duration-200 rounded-xl px-4 ${
                    isActive('/admin') ? 'bg-white/30 shadow-lg' : ''
                  }`}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button 
                  variant={isActive('/admin/users') ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`text-white hover:bg-white/20 transition-all duration-200 rounded-xl px-4 ${
                    isActive('/admin/users') ? 'bg-white/30 shadow-lg' : ''
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
              </Link>
              <Link to="/admin/content">
                <Button 
                  variant={isActive('/admin/content') ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`text-white hover:bg-white/20 transition-all duration-200 rounded-xl px-4 ${
                    isActive('/admin/content') ? 'bg-white/30 shadow-lg' : ''
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Content
                </Button>
              </Link>
              <Link to="/admin/grades">
                <Button 
                  variant={isActive('/admin/grades') ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`text-white hover:bg-white/20 transition-all duration-200 rounded-xl px-4 ${
                    isActive('/admin/grades') ? 'bg-white/30 shadow-lg' : ''
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Grades & Subjects
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;