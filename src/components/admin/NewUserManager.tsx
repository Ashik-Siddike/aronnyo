import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { staticUsers, storage, STORAGE_KEYS, mockDelay, User as StaticUser } from '@/data/staticData';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { 
  Users, 
  Edit, 
  Trash2, 
  UserPlus,
  Search,
  Filter,
  Shield,
  Mail,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

const NewUserManager = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading users from static data...');
      
      await mockDelay(300);

      // Load from static data
      const usersData = [...staticUsers].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setUsers(usersData);
      console.log('Users loaded:', usersData.length);
      
      toast({
        title: "Users Loaded",
        description: `Loaded ${usersData.length} users`,
      });

    } catch (error: any) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: `Failed to load users: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    if (user.role === newRole) {
      toast({
        title: "Info",
        description: "User already has this role",
      });
      return;
    }

    try {
      await mockDelay(300);
      console.log('Updating user role:', userId, 'from', user.role, 'to', newRole);
      
      // Update in static data
      const userIndex = staticUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        staticUsers[userIndex].role = newRole as any;
      }

      toast({
        title: "Success",
        description: `${user.full_name || user.email}'s role updated to ${newRole}`,
      });

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: `Failed to update user role: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${user.full_name || user.email}"?\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await mockDelay(300);
      console.log('Deleting user:', userId, user.email);
      
      // Remove from static data
      const userIndex = staticUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        staticUsers.splice(userIndex, 1);
      }

      toast({
        title: "Success",
        description: `User "${user.full_name || user.email}" deleted successfully`,
      });

      // Remove from local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <Card className="border-0 playful-shadow">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h3>
            <p className="text-gray-500">You need admin privileges to manage users.</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eduplay-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-gray-600 mt-1">
              Manage platform users and their roles
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={loadUsers}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-blue-100 text-blue-800">
              Total Users: {users.length}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-600">Admins</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">
                {users.filter(u => u.role === 'teacher').length}
              </div>
              <div className="text-sm text-gray-600">Teachers</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">
                {users.filter(u => u.role === 'student').length}
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-600">
                {users.filter(u => {
                  const createdDate = new Date(u.created_at);
                  const today = new Date();
                  const diffTime = Math.abs(today.getTime() - createdDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </div>
              <div className="text-sm text-gray-600">New This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 playful-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role-filter">Filter by Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-0 playful-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Users ({filteredUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {users.length === 0 ? 'No users found.' : 'No users match your filters.'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-eduplay-blue to-eduplay-purple rounded-full flex items-center justify-center text-white font-semibold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user.full_name || 'No Name'}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Joined {formatDate(user.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Role Change */}
                        <Select 
                          value={user.role} 
                          onValueChange={(newRole: 'student' | 'teacher' | 'admin') => 
                            updateUserRole(user.id, newRole)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Delete */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default NewUserManager;