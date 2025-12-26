import React from 'react';
import { 
  UserCircle, 
  BarChart3, 
  Settings, 
  LogOut, 
  Trophy, 
  Star, 
  Calendar,
  Award,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentActivity } from '@/contexts/StudentActivityContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProfileButtonProps {
  isMobile?: boolean;
  onMenuClose?: () => void;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({ 
  isMobile = false, 
  onMenuClose 
}) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { stats } = useStudentActivity();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      onMenuClose?.();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0]; // First name only
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Username from email
    }
    return 'User';
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onMenuClose?.();
  };

  // If user is not logged in, show login button
  if (!user) {
    return (
      <Button 
        onClick={() => handleNavigation('/auth')}
        className={`bg-gradient-to-r from-eduplay-blue to-eduplay-purple hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
          isMobile ? 'w-full py-3' : ''
        }`}
      >
        <LogIn className="w-5 h-5 mr-2" />
        {isMobile ? 'Login / Sign Up' : 'Login'}
      </Button>
    );
  }

  // Mobile version
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Stars Display */}
        <div className="flex items-center justify-center bg-eduplay-yellow/20 px-4 py-3 rounded-lg cursor-pointer">
          <Trophy className="w-5 h-5 text-eduplay-orange mr-2 animate-wiggle" />
          <span className="font-bold text-eduplay-orange text-lg">{stats?.total_stars || 0} ⭐</span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 px-4 py-3 bg-eduplay-purple/10 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-eduplay-purple text-white font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{getUserDisplayName()}</div>
            <div className="text-sm text-gray-600">{stats?.level || 'Beginner Explorer'}</div>
          </div>
          {stats?.current_streak && stats.current_streak > 0 && (
            <Badge className="bg-eduplay-orange text-white">
              🔥 {stats.current_streak}
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-eduplay-blue/10 p-2 rounded-lg">
            <div className="text-lg font-bold text-eduplay-blue">{stats?.total_lessons_completed || 0}</div>
            <div className="text-xs text-gray-600">Lessons</div>
          </div>
          <div className="bg-eduplay-green/10 p-2 rounded-lg">
            <div className="text-lg font-bold text-eduplay-green">{stats?.badges_earned || 0}</div>
            <div className="text-xs text-gray-600">Badges</div>
          </div>
          <div className="bg-eduplay-purple/10 p-2 rounded-lg">
            <div className="text-lg font-bold text-eduplay-purple">{Math.floor((stats?.total_time_spent || 0) / 60)}</div>
            <div className="text-xs text-gray-600">Hours</div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button 
          className="w-full bg-gradient-to-r from-eduplay-green to-eduplay-blue hover:scale-105 transition-all duration-300 py-3"
          onClick={() => handleNavigation('/dashboard')}
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          View Dashboard
        </Button>

        {isAdmin && (
          <Button 
            variant="outline"
            className="w-full border-eduplay-purple text-eduplay-purple hover:bg-eduplay-purple/10 py-3"
            onClick={() => handleNavigation('/admin')}
          >
            <Settings className="w-5 h-5 mr-2" />
            Admin Panel
          </Button>
        )}

        <Button 
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 py-3"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  // Desktop version with dropdown
  return (
    <div className="flex items-center space-x-4">
      {/* Stars Display */}
      <div className="flex items-center bg-eduplay-yellow/20 px-3 py-2 rounded-full animate-bounce-gentle cursor-pointer">
        <Trophy className="w-5 h-5 text-eduplay-orange mr-2 animate-pulse" />
        <span className="font-bold text-eduplay-orange">{stats?.total_stars || 0} ⭐</span>
      </div>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-eduplay-green to-eduplay-blue hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="bg-white text-eduplay-blue text-xs font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {getUserDisplayName()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-white border border-gray-200 shadow-lg" align="end">
          {/* User Info Header */}
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-eduplay-purple text-white font-bold text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{profile?.full_name || getUserDisplayName()}</div>
                <div className="text-sm text-gray-600">{stats?.level || 'Beginner Explorer'}</div>
                <div className="flex items-center space-x-2 mt-1">
                  {stats?.current_streak && stats.current_streak > 0 && (
                    <Badge className="bg-eduplay-orange text-white text-xs">
                      🔥 {stats.current_streak} day streak
                    </Badge>
                  )}
                  {profile?.role === 'admin' && (
                    <Badge className="bg-eduplay-purple text-white text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Quick Stats */}
          <div className="p-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-eduplay-blue/10 p-2 rounded-lg">
                <div className="text-lg font-bold text-eduplay-blue">{stats?.total_lessons_completed || 0}</div>
                <div className="text-xs text-gray-600">Lessons</div>
              </div>
              <div className="bg-eduplay-green/10 p-2 rounded-lg">
                <div className="text-lg font-bold text-eduplay-green">{stats?.badges_earned || 0}</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
              <div className="bg-eduplay-purple/10 p-2 rounded-lg">
                <div className="text-lg font-bold text-eduplay-purple">{Math.floor((stats?.total_time_spent || 0) / 60)}</div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Menu Items */}
          <DropdownMenuItem 
            onClick={() => handleNavigation('/dashboard')}
            className="cursor-pointer hover:bg-eduplay-purple/10 p-3"
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            <div>
              <div className="font-medium">Dashboard</div>
              <div className="text-xs text-gray-500">View your learning progress</div>
            </div>
          </DropdownMenuItem>
          
          {isAdmin && (
            <DropdownMenuItem 
              onClick={() => handleNavigation('/admin')}
              className="cursor-pointer hover:bg-eduplay-purple/10 p-3"
            >
              <Settings className="w-4 h-4 mr-3" />
              <div>
                <div className="font-medium">Admin Panel</div>
                <div className="text-xs text-gray-500">Manage the platform</div>
              </div>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer hover:bg-red-50 text-red-600 p-3"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <div>
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-red-400">See you next time!</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileButton;