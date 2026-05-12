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
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-900/20 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/20 sticky top-0">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-5 gap-4">
            <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-start">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="hidden sm:inline">Exit Console</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 shadow-inner">
                  <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-2xl"></div>
                  <Shield className="w-6 h-6 text-blue-400 relative z-10" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                    Nexus Admin
                  </h1>
                  <div className="flex items-center mt-0.5">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">Systems Online</p>
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1.5 bg-slate-950/40 rounded-2xl p-1.5 border border-white/5 backdrop-blur-md overflow-x-auto w-full md:w-auto custom-scrollbar pb-1.5 md:pb-1.5">
              <Link to="/admin">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin') ? 'bg-blue-600/20 text-blue-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-blue-500/20 font-medium' : ''
                  }`}
                >
                  <BarChart className={`w-4 h-4 mr-2 ${isActive('/admin') ? 'text-blue-400' : ''}`} />
                  Overview
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin/users') ? 'bg-indigo-600/20 text-indigo-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-indigo-500/20 font-medium' : ''
                  }`}
                >
                  <Users className={`w-4 h-4 mr-2 ${isActive('/admin/users') ? 'text-indigo-400' : ''}`} />
                  Identities
                </Button>
              </Link>
              <Link to="/admin/content">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin/content') ? 'bg-emerald-600/20 text-emerald-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-emerald-500/20 font-medium' : ''
                  }`}
                >
                  <BookOpen className={`w-4 h-4 mr-2 ${isActive('/admin/content') ? 'text-emerald-400' : ''}`} />
                  Content Matrix
                </Button>
              </Link>
              <Link to="/admin/grades">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin/grades') ? 'bg-purple-600/20 text-purple-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-purple-500/20 font-medium' : ''
                  }`}
                >
                  <Settings className={`w-4 h-4 mr-2 ${isActive('/admin/grades') ? 'text-purple-400' : ''}`} />
                  Architecture
                </Button>
              </Link>
              <Link to="/admin/assignments">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin/assignments') ? 'bg-orange-600/20 text-orange-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-orange-500/20 font-medium' : ''
                  }`}
                >
                  <Home className={`w-4 h-4 mr-2 ${isActive('/admin/assignments') ? 'text-orange-400' : ''}`} />
                  Tasks
                </Button>
              </Link>
              <Link to="/admin/timetable">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin/timetable') ? 'bg-violet-600/20 text-violet-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-violet-500/20 font-medium' : ''
                  }`}
                >
                  <BarChart className={`w-4 h-4 mr-2 ${isActive('/admin/timetable') ? 'text-violet-400' : ''}`} />
                  Schedule
                </Button>
              </Link>
              <Link to="/admin/messages">
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 h-auto ${
                    isActive('/admin/messages') ? 'bg-emerald-600/20 text-emerald-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-emerald-500/20 font-medium' : ''
                  }`}
                >
                  <Users className={`w-4 h-4 mr-2 ${isActive('/admin/messages') ? 'text-emerald-400' : ''}`} />
                  Messages
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;