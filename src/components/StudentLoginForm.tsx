import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Loader2, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentLoginFormProps {
  onSuccess?: () => void;
}

const StudentLoginForm: React.FC<StudentLoginFormProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    grade: '',
    parentEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (isSignUp) {
      if (!formData.fullName || formData.fullName.trim().length < 2) {
        setError('Please enter your full name');
        return false;
      }
      if (!formData.grade) {
        setError('Please select your grade');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up new student
        const { error } = await signUp(
          formData.email, 
          formData.password, 
          formData.fullName.trim(), 
          'student',
          {
            grade: formData.grade,
            parent_email: formData.parentEmail || null
          }
        );

        if (error) {
          throw error;
        }

        toast({
          title: "Account Created! 🎉",
          description: "Welcome to 24/7 School! You can now start learning.",
        });

        // Switch to sign in mode
        setIsSignUp(false);
        setFormData(prev => ({ ...prev, password: '', fullName: '', grade: '', parentEmail: '' }));
        
      } else {
        // Sign in existing student
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          throw error;
        }

        toast({
          title: "Welcome back! 👋",
          description: "Ready to continue your learning journey?",
        });

        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
        setIsSignUp(false);
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link.';
      } else if (error.message.includes('weak password')) {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setError(errorMessage);
      toast({
        title: isSignUp ? "Sign Up Failed" : "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const grades = [
    { value: 'kg', label: 'Kindergarten' },
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' }
  ];

  return (
    <Card className="w-full max-w-md mx-auto border-0 playful-shadow">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-eduplay-blue mr-2" />
          <CardTitle className="text-2xl text-eduplay-purple">
            {isSignUp ? 'Join 24/7 School' : 'Welcome Back'}
          </CardTitle>
        </div>
        <p className="text-gray-600">
          {isSignUp 
            ? 'Create your student account and start learning!' 
            : 'Sign in to continue your learning journey'
          }
        </p>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="fullName" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
              disabled={loading}
              required
              minLength={isSignUp ? 6 : undefined}
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <Label htmlFor="grade">Grade/Class</Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => handleInputChange('grade', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parentEmail">Parent's Email (Optional)</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  placeholder="Parent's email for progress updates"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className={`w-full ${
              isSignUp 
                ? 'bg-gradient-to-r from-eduplay-green to-eduplay-blue' 
                : 'bg-gradient-to-r from-eduplay-blue to-eduplay-purple'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                {isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFormData({
                email: formData.email, // Keep email
                password: '',
                fullName: '',
                grade: '',
                parentEmail: ''
              });
            }}
            disabled={loading}
            className="text-eduplay-blue hover:text-eduplay-purple"
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
          </Button>
        </div>

        {/* Demo credentials info */}
        {!isSignUp && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">Demo Student Access:</p>
            <p className="text-xs text-blue-600">Email: <span className="font-mono">student@demo.com</span></p>
            <p className="text-xs text-blue-600">Password: <span className="font-mono">student123</span></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentLoginForm;