import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Clock, Calendar, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { activityApi } from '@/services/api';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Fallback data
const FALLBACK = [
  { _id: 'a1', title: 'Math Homework: Addition', subject: 'Math', due_date: '2026-05-20', description: 'Complete pages 10–12 in your workbook.', is_global: true, submitted_by: [] },
  { _id: 'a2', title: 'English Essay: My Pet', subject: 'English', due_date: '2026-05-25', description: 'Write 5 sentences about your favourite pet.', is_global: true, submitted_by: [] },
  { _id: 'a3', title: 'Science: Collect Leaves', subject: 'Science', due_date: '2026-04-28', description: 'Collect 3 different types of leaves and label them.', is_global: true, submitted_by: [] },
];

const SUBJECT_COLORS: Record<string, string> = {
  Math: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200',
  English: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200',
  Bangla: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200',
  Science: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200',
  Art: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200',
};

export default function Assignments() {
  const { user } = useAuth();
  const { t }    = useLang();
  const { isDark } = useTheme();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [submitting,  setSubmitting]  = useState<string | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<'all' | 'pending' | 'overdue'>('all');
  const [submitted,   setSubmitted]   = useState<Set<string>>(new Set());

  // Load from DB
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${API}/assignments?studentId=${user?.id || ''}`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(data?.length ? data : FALLBACK);
        } else {
          setAssignments(FALLBACK);
        }
      } catch {
        setAssignments(FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    // Restore local submitted set
    const saved = localStorage.getItem(`submitted_${user?.id || 'guest'}`);
    if (saved) setSubmitted(new Set(JSON.parse(saved)));

    fetchAssignments();
  }, [user]);

  const isSubmitted = (a: any) =>
    submitted.has(a._id) || (a.submitted_by || []).includes(user?.id);

  const handleSubmit = async (assignmentId: string) => {
    if (!user) { toast.error('Please login first'); return; }

    setSubmitting(assignmentId);
    try {
      const res = await fetch(`${API}/assignments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          studentId:   user.id,
          studentName: user.name || 'Student',
          fileUrl:     '',
          notes:       'Submitted via app',
        }),
      });

      if (res.ok) {
        const newSet = new Set(submitted).add(assignmentId);
        setSubmitted(newSet);
        localStorage.setItem(`submitted_${user.id}`, JSON.stringify([...newSet]));

        // Track activity
        const a = assignments.find(x => x._id === assignmentId);
        await activityApi.track({
          student_id:    user.id,
          subject:       a?.subject || 'General',
          activity_type: 'assignment_submitted',
          score:         100,
          stars_earned:  15,
          time_spent:    10,
        }).catch(() => {});

        toast.success(t.submitSuccess);
      } else {
        toast.error(t.submitFailed);
      }
    } catch {
      toast.error(t.submitFailed);
    } finally {
      setSubmitting(null);
    }
  };

  const now = new Date();
  const filtered = assignments.filter(a => {
    if (filter === 'pending') return new Date(a.due_date) >= now;
    if (filter === 'overdue') return new Date(a.due_date) < now;
    return true;
  });

  const pendingCount  = assignments.filter(a => !isSubmitted(a) && new Date(a.due_date) >= now).length;
  const overdueCount  = assignments.filter(a => !isSubmitted(a) && new Date(a.due_date) < now).length;

  return (
    <div className={`min-h-screen pb-24 lg:pb-8 transition-colors ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-eduplay-orange to-amber-500 text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20 p-2 rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <FileText className="w-6 h-6" /> {t.assignmentsTitle}
              </h1>
              <p className="text-orange-100 text-sm mt-1">
                {pendingCount} {t.pendingLabel} · {overdueCount} {t.overdueLabel}
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-2">
            {([
              ['all',     t.allAssignments,  assignments.length],
              ['pending', t.pendingLabel,     assignments.filter(a => new Date(a.due_date) >= now).length],
              ['overdue', t.overdueLabel,     assignments.filter(a => new Date(a.due_date) < now).length],
            ] as const).map(([key, label, count]) => (
              <button key={key} onClick={() => setFilter(key as any)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === key ? 'bg-white text-eduplay-orange shadow' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 animate-spin text-eduplay-orange" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow`}>
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20 text-slate-400" />
            <p className={`text-lg font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.noAssignments}</p>
          </div>
        ) : filtered.map(a => {
          const done      = isSubmitted(a);
          const overdue   = !done && new Date(a.due_date) < now;
          const subjectC  = SUBJECT_COLORS[a.subject] || 'bg-gray-100 text-gray-600 border-gray-200';
          const dueDt     = new Date(a.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          return (
            <Card key={a._id}
              className={`rounded-2xl overflow-hidden shadow-md border-0 transition-all hover:shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'} ${done ? 'opacity-80' : ''}`}>
              <CardContent className="p-0">
                {/* Color top-bar */}
                <div className={`h-1.5 ${done ? 'bg-green-500' : overdue ? 'bg-red-500' : 'bg-eduplay-orange'}`} />
                <div className="p-5">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs border ${subjectC}`}>{a.subject}</Badge>
                        {done
                          ? <Badge className="text-xs bg-green-100 text-green-700 border-0">✅ {t.completed}</Badge>
                          : overdue
                            ? <Badge className="text-xs bg-red-100 text-red-600 border-0">⏰ {t.overdueLabel}</Badge>
                            : <Badge className="text-xs bg-orange-100 text-orange-700 border-0">📋 {t.pendingLabel}</Badge>
                        }
                        {a.is_global && <Badge className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-0">🌍 All</Badge>}
                      </div>
                      <h3 className={`font-black text-base leading-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{a.title}</h3>
                    </div>

                    {done ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                    ) : overdue ? (
                      <AlertCircle className="w-7 h-7 text-red-500 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-eduplay-orange/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-eduplay-orange" />
                      </div>
                    )}
                  </div>

                  {a.description && (
                    <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {a.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {t.dueDate}: {dueDt}
                      </span>
                      {(a.submitted_by?.length || 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          {a.submitted_by.length} submitted
                        </span>
                      )}
                    </div>

                    {!done && (
                      <Button
                        onClick={() => handleSubmit(a._id)}
                        disabled={submitting === a._id}
                        size="sm"
                        className={`rounded-xl font-bold text-white transition-all ${overdue ? 'bg-red-500 hover:bg-red-600' : 'bg-eduplay-orange hover:bg-orange-600'} disabled:opacity-50`}>
                        {submitting === a._id
                          ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Submitting…</>
                          : <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {t.submitAssignment}</>
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
