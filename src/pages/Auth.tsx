
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Shield, User } from 'lucide-react';
import StudentLoginForm from '@/components/StudentLoginForm';
import AdminLoginForm from '@/components/AdminLoginForm';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');

  useEffect(() => {
    if (user && profile && !loading) {
      console.log('User is authenticated, checking role for navigation', {
        email: user.email,
        role: profile.role,
        isAdmin,
        profileId: profile.id
      });
      
      // Wait a bit more to ensure profile is fully loaded and state is updated
      const timer = setTimeout(() => {
        // Double check admin status
        const userRole = profile.role;
        const isUserAdmin = userRole === 'admin';
        
        console.log('Navigation check:', {
          userRole,
          isUserAdmin,
          isAdmin,
          shouldRedirectToAdmin: isUserAdmin || isAdmin
        });
        
        if (isUserAdmin || isAdmin) {
          console.log('Admin user detected, redirecting to admin panel');
          navigate('/admin', { replace: true });
        } else {
          console.log('Student user, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, profile, isAdmin, loading, navigate]);

  const handleLoginSuccess = () => {
    // Navigation will be handled by useEffect
    console.log('Login successful, navigation will happen automatically');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-eduplay-blue hover:text-eduplay-purple mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-eduplay-blue mr-2" />
            <h1 className="text-3xl font-bold text-eduplay-purple">24/7 School</h1>
          </div>
          <p className="text-gray-600">Access your learning dashboard</p>
        </div>

        {/* Login Mode Toggle */}
        <div className="mb-6 flex gap-2 bg-white p-1 rounded-lg shadow-md">
          <Button
            type="button"
            variant={loginMode === 'student' ? 'default' : 'ghost'}
            onClick={() => setLoginMode('student')}
            className={`flex-1 ${loginMode === 'student' ? 'bg-gradient-to-r from-eduplay-blue to-eduplay-purple text-white' : ''}`}
          >
            <User className="w-4 h-4 mr-2" />
            Student Login
          </Button>
          <Button
            type="button"
            variant={loginMode === 'admin' ? 'default' : 'ghost'}
            onClick={() => setLoginMode('admin')}
            className={`flex-1 ${loginMode === 'admin' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </div>

        {/* Show appropriate login form */}
        {loginMode === 'admin' ? (
          <AdminLoginForm onSuccess={handleLoginSuccess} />
        ) : (
          <StudentLoginForm onSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
};

export default Auth;
