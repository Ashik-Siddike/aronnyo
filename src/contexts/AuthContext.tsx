// MongoDB-connected AuthContext
// Uses Express API for authentication with MongoDB backend

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, LoginResponse } from '@/services/api';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}

interface Session {
  user: User;
  access_token?: string;
  expires_at?: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH_USER: 'play_learn_grow_auth_user',
  AUTH_PROFILE: 'play_learn_grow_auth_profile',
  AUTH_SESSION: 'play_learn_grow_auth_session',
};

const storage = {
  get: <T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T,>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = storage.get<User>(STORAGE_KEYS.AUTH_USER);
        const storedProfile = storage.get<Profile>(STORAGE_KEYS.AUTH_PROFILE);
        const storedSession = storage.get<Session>(STORAGE_KEYS.AUTH_SESSION);

        if (storedUser && storedProfile && storedSession) {
          // Check if session is still valid
          if (storedSession.expires_at && storedSession.expires_at > Date.now()) {
            console.log('🔐 Restoring session for:', storedUser.email);
            setUser(storedUser);
            setProfile(storedProfile);
            setSession(storedSession);
          } else {
            console.log('⏰ Session expired, clearing auth');
            storage.remove(STORAGE_KEYS.AUTH_USER);
            storage.remove(STORAGE_KEYS.AUTH_PROFILE);
            storage.remove(STORAGE_KEYS.AUTH_SESSION);
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const handleAuthResponse = (data: LoginResponse) => {
    const authUser: User = data.user;
    const authProfile: Profile = data.profile;
    const authSession: Session = {
      user: authUser,
      access_token: data.session.access_token,
      expires_at: data.session.expires_at
    };

    setUser(authUser);
    setProfile(authProfile);
    setSession(authSession);

    // Save to localStorage
    storage.set(STORAGE_KEYS.AUTH_USER, authUser);
    storage.set(STORAGE_KEYS.AUTH_PROFILE, authProfile);
    storage.set(STORAGE_KEYS.AUTH_SESSION, authSession);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Signing in via MongoDB API:', email);
      const data = await authApi.login(email, password);
      handleAuthResponse(data);
      console.log('✅ Sign in successful:', data.user.email);
      return { error: null };
    } catch (error: any) {
      console.error('❌ Sign in failed:', error.message);
      return { error: { message: error.message || 'Invalid email or password' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'student') => {
    try {
      console.log('📝 Registering via MongoDB API:', { email, fullName, role });
      const data = await authApi.register(email, password, fullName, role);
      handleAuthResponse(data);
      console.log('✅ Registration successful:', data.user.email);
      return { error: null };
    } catch (error: any) {
      console.error('❌ Registration failed:', error.message);
      return { error: { message: error.message || 'Registration failed' } };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out');
      setUser(null);
      setProfile(null);
      setSession(null);

      storage.remove(STORAGE_KEYS.AUTH_USER);
      storage.remove(STORAGE_KEYS.AUTH_PROFILE);
      storage.remove(STORAGE_KEYS.AUTH_SESSION);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isTeacher = profile?.role === 'teacher';
  const isStudent = profile?.role === 'student';

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isTeacher,
    isStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
