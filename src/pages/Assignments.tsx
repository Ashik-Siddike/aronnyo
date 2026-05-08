import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle2, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Sample mock data until we fetch from DB
const mockAssignments = [
  { _id: 'a1', title: 'Math Homework: Addition', subject: 'Math', due_date: '2026-05-02', description: 'Complete pages 10-12 in your workbook.', is_global: true, submitted_by: [] },
  { _id: 'a2', title: 'English Essay: My Pet', subject: 'English', due_date: '2026-05-05', description: 'Write 5 lines about your favorite pet.', is_global: true, submitted_by: [] },
  { _id: 'a3', title: 'Science Project: Leaves', subject: 'Science', due_date: '2026-04-28', description: 'Collect 3 different types of leaves.', is_global: true, submitted_by: ['student-1'] },
];

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>(mockAssignments);
  const [submitting, setSubmitting] = useState<string | null>(null);

  // In a real app we would fetch assignments here
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`/api/assignments?studentId=${user?.id || 'student-1'}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setAssignments(data);
          }
        }
      } catch (err) {
        console.error('Error fetching assignments', err);
      }
    };
    fetchAssignments();
  }, [user]);

  const handleSubmit = async (assignmentId: string) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    
    try {
      setSubmitting(assignmentId);
      
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          studentId: user.id,
          studentName: user.name,
          fileUrl: 'mock-file-url.pdf',
          notes: 'Submitted via portal'
        })
      });
      
      if (res.ok) {
        toast.success('Assignment submitted successfully! 🎉');
        // Update local state
        setAssignments(prev => prev.map(a => 
          a._id === assignmentId ? { ...a, submitted_by: [...(a.submitted_by || []), user.id] } : a
        ));
      } else {
        toast.error('Failed to submit assignment');
      }
    } catch (err) {
      toast.error('Network error during submission');
    } finally {
      setSubmitting(null);
    }
  };

  const pendingAssignments = assignments.filter(a => !(a.submitted_by || []).includes(user?.id || 'student-1'));
  const completedAssignments = assignments.filter(a => (a.submitted_by || []).includes(user?.id || 'student-1'));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12">
      <div className="bg-eduplay-blue text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-2">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" /> Assignments
            </h1>
          </div>
          <p className="opacity-90 ml-14">View and submit your homework tasks here.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Clock className="w-5 h-5 text-eduplay-orange" /> To Do ({pendingAssignments.length})
        </h2>
        
        <div className="space-y-4 mb-10">
          {pendingAssignments.length === 0 ? (
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50">
              <CardContent className="p-8 text-center text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-lg">All Caught Up!</h3>
                <p>You have no pending assignments right now.</p>
              </CardContent>
            </Card>
          ) : (
            pendingAssignments.map(assignment => {
              const isOverdue = new Date(assignment.due_date) < new Date();
              return (
                <Card key={assignment._id} className={`border-l-4 ${isOverdue ? 'border-l-red-500' : 'border-l-eduplay-orange'} shadow-md hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-gray-100 dark:bg-slate-800">{assignment.subject}</Badge>
                          <Badge variant="outline" className={`${isOverdue ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                            <Calendar className="w-3 h-3 mr-1" /> Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{assignment.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{assignment.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-end md:items-start shrink-0">
                        <Button 
                          onClick={() => handleSubmit(assignment._id)}
                          disabled={submitting === assignment._id}
                          className="bg-eduplay-blue hover:bg-blue-700 text-white w-full md:w-auto"
                        >
                          {submitting === assignment._id ? 'Uploading...' : (
                            <><Upload className="w-4 h-4 mr-2" /> Submit Work</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200 mt-12">
          <CheckCircle2 className="w-5 h-5 text-eduplay-green" /> Completed ({completedAssignments.length})
        </h2>
        
        <div className="space-y-4 opacity-70">
          {completedAssignments.map(assignment => (
            <Card key={assignment._id} className="border-l-4 border-l-eduplay-green bg-gray-50 dark:bg-slate-800/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 line-through decoration-gray-400">{assignment.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
                  </div>
                  <Badge className="bg-eduplay-green/20 text-eduplay-green border-0">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Submitted
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
