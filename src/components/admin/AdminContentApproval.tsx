import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, FileCheck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const mockPendingContent = [
  { id: 'c1', title: 'Basic Geometry Shapes', type: 'Lesson', author: 'Mr. Ali (Teacher)', date: '2026-05-01', subject: 'Math' },
  { id: 'c2', title: 'Solar System Quiz', type: 'Quiz', author: 'Dr. Khan (Teacher)', date: '2026-04-30', subject: 'Science' },
];

export default function AdminContentApproval() {
  const [pending, setPending] = useState(mockPendingContent);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    // In real app, call API to update status
    setPending(prev => prev.filter(item => item.id !== id));
    toast.success(`Content ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-purple-400" /> Content Approval
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="bg-purple-50/50 border-b rounded-t-2xl">
            <CardTitle className="text-slate-700 flex justify-between items-center">
              Pending Approvals
              <Badge className="bg-purple-500 text-white">{pending.length} Items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pending.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                <p className="text-lg">All caught up! No pending content to review.</p>
              </div>
            ) : (
              <div className="divide-y">
                {pending.map(item => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{item.type}</Badge>
                        <Badge variant="outline" className="bg-gray-100">{item.subject}</Badge>
                        <span className="text-xs text-gray-400 ml-2">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">Submitted by: {item.author}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" title="Preview" className="text-blue-500 border-blue-200 hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleAction(item.id, 'reject')} variant="outline" size="icon" title="Reject" className="text-red-500 border-red-200 hover:bg-red-50">
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleAction(item.id, 'approve')} variant="outline" size="icon" title="Approve" className="text-green-600 border-green-200 hover:bg-green-50">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
