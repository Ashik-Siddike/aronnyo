import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Calendar, CheckCircle2, XCircle, Clock, Users,
  ArrowLeft, Save, Loader2, Search, RefreshCw,
  CheckCheck, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

interface Student {
  id: string;
  _id?: string;
  full_name: string;
  email: string;
  role: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late';

const AdminAttendance = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [savedSummary, setSavedSummary] = useState<any>(null);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/users`);
        if (res.ok) {
          const data = await res.json();
          const list = data.filter((u: any) => u.role === 'student');
          setStudents(list);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Fetch existing attendance when date changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setSavedSummary(null);
        const res = await fetch(`${API_BASE}/attendance?date=${date}`);
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, AttendanceStatus> = {};
          data.forEach((r: any) => { map[r.student_id] = r.status; });
          setAttendance(map);
        }
      } catch (err) {
        console.error('Fetch attendance error:', err);
      }
    };
    if (date) fetchAttendance();
  }, [date]);

  const handleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  // Mark all present/absent
  const markAll = (status: AttendanceStatus) => {
    const map: Record<string, AttendanceStatus> = {};
    students.forEach(s => { map[s.id || s._id!] = status; });
    setAttendance(map);
  };

  const handleSave = async () => {
    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      status
    }));

    if (records.length === 0) {
      toast.error('Please mark at least one student before saving.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          records,
          marked_by: user?.id || 'teacher'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSavedSummary(data.summary);
        toast.success(`✅ Attendance saved! ${data.summary.present} Present, ${data.summary.absent} Absent, ${data.summary.late} Late`);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save attendance. Check server connection.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const markedCount = Object.keys(attendance).length;
  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendance).filter(s => s === 'late').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/admin" className="inline-flex items-center text-indigo-300 hover:text-white transition-colors mb-3">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-400" />
              Teacher Attendance Console
            </h1>
            <p className="text-indigo-200/50 mt-1 text-sm">Mark and save student attendance directly to MongoDB.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/50 p-2 rounded-xl border border-white/10">
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-transparent border-none text-white focus-visible:ring-0 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Students', value: students.length, color: 'text-indigo-300', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { label: 'Present', value: presentCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Absent', value: absentCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            { label: 'Late', value: lateCount, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-4 text-center ${stat.bg}`}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Saved Summary */}
        {savedSummary && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-300 text-sm font-medium">
              ✅ Attendance for <strong>{date}</strong> saved to MongoDB —
              {' '}{savedSummary.present} Present · {savedSummary.absent} Absent · {savedSummary.late} Late
            </p>
          </div>
        )}

        {/* Main Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-800/50 border-b border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Student List
                <Badge variant="outline" className="ml-2 border-indigo-500/30 text-indigo-300 text-xs">
                  {markedCount}/{students.length} marked
                </Badge>
              </CardTitle>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                {/* Quick mark buttons */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAll('present')}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <CheckCheck className="w-3 h-3 mr-1" /> All Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markAll('absent')}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                >
                  <X className="w-3 h-3 mr-1" /> All Absent
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search student..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 w-48 text-sm"
                  />
                </div>

                {/* Save button */}
                <Button
                  onClick={handleSave}
                  disabled={saving || markedCount === 0}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    : <><Save className="w-4 h-4 mr-2" />Save Register</>}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20 text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span>Loading students...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No students found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/80 text-indigo-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-semibold">#</th>
                      <th className="p-4 font-semibold">Student Name</th>
                      <th className="p-4 font-semibold text-center">
                        <span className="text-emerald-400">✓ Present</span>
                      </th>
                      <th className="p-4 font-semibold text-center">
                        <span className="text-red-400">✗ Absent</span>
                      </th>
                      <th className="p-4 font-semibold text-center">
                        <span className="text-orange-400">⏱ Late</span>
                      </th>
                      <th className="p-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((student, idx) => {
                      const sid = student.id || student._id || '';
                      const status = attendance[sid];
                      return (
                        <tr
                          key={sid}
                          className={`hover:bg-white/5 transition-colors ${
                            status === 'present' ? 'border-l-2 border-l-emerald-500' :
                            status === 'absent'  ? 'border-l-2 border-l-red-500' :
                            status === 'late'    ? 'border-l-2 border-l-orange-500' :
                            'border-l-2 border-l-transparent'
                          }`}
                        >
                          <td className="p-4 text-slate-500 text-sm">{idx + 1}</td>
                          <td className="p-4">
                            <div className="font-medium text-white">{student.full_name}</div>
                            <div className="text-xs text-slate-400">{student.email}</div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleStatus(sid, 'present')}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                status === 'present'
                                  ? 'bg-emerald-500/20 text-emerald-400 scale-125 ring-2 ring-emerald-500/40'
                                  : 'text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/10'
                              }`}
                            >
                              <CheckCircle2 className="w-6 h-6" />
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleStatus(sid, 'absent')}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                status === 'absent'
                                  ? 'bg-red-500/20 text-red-400 scale-125 ring-2 ring-red-500/40'
                                  : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'
                              }`}
                            >
                              <XCircle className="w-6 h-6" />
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleStatus(sid, 'late')}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                status === 'late'
                                  ? 'bg-orange-500/20 text-orange-400 scale-125 ring-2 ring-orange-500/40'
                                  : 'text-slate-600 hover:text-orange-400 hover:bg-orange-500/10'
                              }`}
                            >
                              <Clock className="w-6 h-6" />
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            {status ? (
                              <Badge className={
                                status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                status === 'absent'  ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                'bg-orange-500/20 text-orange-400 border-orange-500/30'
                              }>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                            ) : (
                              <span className="text-slate-600 text-xs">Not marked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAttendance;
