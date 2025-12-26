// Static AuthContext - No Supabase dependency
// Uses localStorage for authentication
// Can be easily converted to Django API calls later

import React, { createContext, useContext, useEffect, useState } from 'react';
import { staticUsers, storage, STORAGE_KEYS, mockDelay, User as StaticUser } from '@/data/staticData';

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user database (in real app, this would be Django API)
const mockUsers: { [email: string]: { password: string; user: StaticUser } } = {
  'ashiksiddike@gmail.com': {
    password: 'ashik1234',
    user: staticUsers[0]
  },
  'admin@school.com': {
    password: 'admin123',
    user: staticUsers[1]
  },
  'demo@school.com': {
    password: 'demo123',
    user: staticUsers[2]
  },
  'teacher@school.com': {
    password: 'teacher123',
    user: staticUsers[3]
  },
  'parent@school.com': {
    password: 'parent123',
    user: staticUsers[4]
  },
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
        await mockDelay(200);
        
        const storedUser = storage.get<User>(STORAGE_KEYS.AUTH_USER);
        const storedProfile = storage.get<Profile>(STORAGE_KEYS.AUTH_PROFILE);
        const storedSession = storage.get<Session>(STORAGE_KEYS.AUTH_SESSION);

        if (storedUser && storedProfile && storedSession) {
          console.log('Loading stored auth:', storedUser.email);
          setUser(storedUser);
          setProfile(storedProfile);
          setSession(storedSession);
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await mockDelay(500); // Simulate API call
      
      console.log('Attempting to sign in with:', email);
      
      // Demo admin login
      if (email === 'ashik' && password === 'ashik123') {
        const adminUser = staticUsers.find(u => u.email === 'ashiksiddike@gmail.com');
        if (adminUser) {
          const mockUser: User = {
            id: adminUser.id,
            email: adminUser.email,
            user_metadata: { full_name: adminUser.full_name, role: adminUser.role }
          };
          
          const mockProfile: Profile = {
            id: adminUser.id,
            email: adminUser.email,
            full_name: adminUser.full_name,
            role: adminUser.role,
            created_at: adminUser.created_at
          };
          
          const mockSession: Session = {
            user: mockUser,
            access_token: 'mock-token',
            expires_at: Date.now() + 3600000
          };
          
          setUser(mockUser);
          setProfile(mockProfile);
          setSession(mockSession);
          
          // Save to localStorage
          storage.set(STORAGE_KEYS.AUTH_USER, mockUser);
          storage.set(STORAGE_KEYS.AUTH_PROFILE, mockProfile);
          storage.set(STORAGE_KEYS.AUTH_SESSION, mockSession);
          
          return { error: null };
        }
      }
      
      // Check mock users database
      const userData = mockUsers[email.toLowerCase()];
      
      if (!userData || userData.password !== password) {
        return { error: { message: 'Invalid email or password' } };
      }
      
      const staticUser = userData.user;
      
      const mockUser: User = {
        id: staticUser.id,
        email: staticUser.email,
        user_metadata: { full_name: staticUser.full_name, role: staticUser.role }
      };
      
      const mockProfile: Profile = {
        id: staticUser.id,
        email: staticUser.email,
        full_name: staticUser.full_name,
        role: staticUser.role,
        created_at: staticUser.created_at
      };
      
      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000
      };
      
      console.log('Sign in successful:', mockUser.email);
      
      setUser(mockUser);
      setProfile(mockProfile);
      setSession(mockSession);
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.AUTH_USER, mockUser);
      storage.set(STORAGE_KEYS.AUTH_PROFILE, mockProfile);
      storage.set(STORAGE_KEYS.AUTH_SESSION, mockSession);
      
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'student') => {
    try {
      await mockDelay(500); // Simulate API call
      
      console.log('Attempting to sign up with:', { email, fullName, role });
      
      // Check if user already exists
      if (mockUsers[email.toLowerCase()]) {
        return { error: { message: 'User with this email already exists' } };
      }
      
      // Create new user
      const newUser: StaticUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase(),
        full_name: fullName,
        role: role as any,
        created_at: new Date().toISOString()
      };
      
      // Add to mock database
      mockUsers[email.toLowerCase()] = {
        password,
        user: newUser
      };
      
      // Also add to staticUsers for consistency
      staticUsers.push(newUser);
      
      const mockUser: User = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: { full_name: newUser.full_name, role: newUser.role }
      };
      
      const mockProfile: Profile = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        created_at: newUser.created_at
      };
      
      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000
      };
      
      console.log('Sign up successful:', newUser.email);
      
      setUser(mockUser);
      setProfile(mockProfile);
      setSession(mockSession);
      
      // Save to localStorage
      storage.set(STORAGE_KEYS.AUTH_USER, mockUser);
      storage.set(STORAGE_KEYS.AUTH_PROFILE, mockProfile);
      storage.set(STORAGE_KEYS.AUTH_SESSION, mockSession);
      
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected error during sign up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await mockDelay(200);
      console.log('Signing out user');
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Clear localStorage
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
