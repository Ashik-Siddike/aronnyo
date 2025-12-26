import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
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
      console.log('Admin login attempt:', formData.email);
      
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        console.error('Admin login error:', error);
        throw error;
      }

      // Wait for profile to be fetched by AuthContext
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify admin status from AuthContext (already loaded)
      // The AuthContext will handle the profile loading
      // Just wait a bit for state to update
      
      console.log('Admin login successful!');
      
      toast({
        title: "Admin Login Successful! 🔐",
        description: "Welcome to Admin Panel",
      });
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Admin authentication error:', error);
      
      let errorMessage = 'Invalid admin credentials. Please check your email and password.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('admin privileges')) {
        errorMessage = 'This account does not have admin privileges.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Admin Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Login
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Access the admin management panel
        </p>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Admin Email</span>
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="admin@school.com"
              disabled={loading}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="admin-password" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Login as Admin
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Admin credentials info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-semibold mb-2">Admin Credentials:</p>
          <p className="text-xs text-blue-700">Email: <span className="font-mono font-semibold">admin@school.com</span></p>
          <p className="text-xs text-blue-700 mt-1">Password: <span className="font-mono font-semibold">[Your Admin Password]</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;

