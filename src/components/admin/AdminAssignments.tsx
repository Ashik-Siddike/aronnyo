import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Check, X, FileText, Calendar, Clock, RefreshCw, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

const SUBJECTS = ['Math', 'English', 'Bangla', 'Science', 'Art', 'Games/PE', 'ICT', 'Social Studies'];

const EMPTY_FORM = {
  title:       '',
  description: '',
  subject:     'Math',
  due_date:    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  is_global:   true,
  student_id:  '',
};

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [editId,      setEditId]      = useState<string | null>(null);
  const [form,        setForm]        = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [filter,      setFilter]      = useState<'all' | 'pending' | 'done'>('all');

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/assignments`);
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const startAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setShowForm(true);
  };

  const startEdit = (a: any) => {
    setForm({
      title:       a.title,
      description: a.description || '',
      subject:     a.subject,
      due_date:    a.due_date ? a.due_date.split('T')[0] : EMPTY_FORM.due_date,
      is_global:   a.is_global ?? true,
      student_id:  a.student_id || '',
    });
    setEditId(a._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, submitted_by: [] };
      let res;
      if (editId) {
        res = await fetch(`${API}/assignments/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        toast.success(editId ? 'Assignment updated!' : 'Assignment created!');
        setShowForm(false);
        setEditId(null);
        await fetchAssignments();
      } else {
        toast.error('Failed to save assignment');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      const res = await fetch(`${API}/assignments/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Assignment deleted!'); await fetchAssignments(); }
      else toast.error('Failed to delete');
    } catch {
      toast.error('Network error');
    }
  };

  const now = new Date();
  const filtered = assignments.filter(a => {
    if (filter === 'pending') return new Date(a.due_date) >= now;
    if (filter === 'done')    return new Date(a.due_date) < now;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eduplay-orange rounded-xl text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Assignments Manager</h2>
              <p className="text-sm text-slate-400">{assignments.length} total • {assignments.filter(a => new Date(a.due_date) >= now).length} active</p>
            </div>
          </div>
          <Button onClick={startAdd} className="bg-eduplay-orange hover:bg-orange-600 text-white gap-2">
            <Plus className="w-4 h-4" /> New Assignment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'pending', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold capitalize transition-all ${filter === f ? 'bg-eduplay-orange text-white shadow-md' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-orange-400'}`}>
              {f === 'all' ? `All (${assignments.length})` : f === 'pending' ? `Active (${assignments.filter(a => new Date(a.due_date) >= now).length})` : `Overdue (${assignments.filter(a => new Date(a.due_date) < now).length})`}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-2 border-orange-500/30 shadow-xl rounded-2xl bg-slate-800/80 border-slate-700">
            <CardHeader className="bg-slate-700/50 rounded-t-2xl border-b border-slate-700">
              <CardTitle className="text-lg font-bold text-orange-400">
                {editId ? '✏️ Edit Assignment' : '📋 New Assignment'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Title *</label>
                  <Input placeholder="e.g. Math Homework: Chapter 3" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="bg-slate-900 border-slate-600 text-slate-100 focus-visible:ring-orange-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Description</label>
                  <textarea rows={3} placeholder="Describe what students need to do..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Subject</label>
                  <select value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Due Date</label>
                  <Input type="date" value={form.due_date}
                    onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                    className="bg-slate-900 border-slate-600 text-slate-100 focus-visible:ring-orange-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Assign To</label>
                  <div className="flex gap-3">
                    <button onClick={() => setForm(f => ({ ...f, is_global: true }))}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${form.is_global ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-slate-600 text-slate-400 hover:border-orange-400'}`}>
                      🌍 All Students
                    </button>
                    <button onClick={() => setForm(f => ({ ...f, is_global: false }))}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${!form.is_global ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-slate-600 text-slate-400 hover:border-orange-400'}`}>
                      👤 Specific Student
                    </button>
                  </div>
                  {!form.is_global && (
                    <Input className="mt-3 bg-slate-900 border-slate-600 text-slate-100 focus-visible:ring-orange-500" placeholder="Enter student ID"
                      value={form.student_id}
                      onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} />
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment List */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-slate-800/60 border border-slate-700">
          <CardHeader className="bg-slate-800/80 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-100">
                Assignments ({filtered.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchAssignments} className="gap-2 text-slate-400 hover:text-white">
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No assignments found</p>
                <Button onClick={startAdd} variant="outline" className="mt-4 gap-2 border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4" /> Create First Assignment
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {filtered.map(a => {
                  const overdue  = new Date(a.due_date) < now;
                  const subCount = (a.submitted_by || []).length;
                  return (
                    <div key={a._id}
                      className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-slate-700/30 transition-colors group">
                      <div className={`w-1 shrink-0 rounded-full self-stretch ${overdue ? 'bg-red-500' : 'bg-orange-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs bg-orange-500/10 border-orange-500/30 text-orange-400">{a.subject}</Badge>
                          {a.is_global
                            ? <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400">🌍 All</Badge>
                            : <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400">👤 Individual</Badge>
                          }
                          {overdue
                            ? <Badge className="text-xs bg-red-500/20 text-red-400 border-0">⏰ Overdue</Badge>
                            : <Badge className="text-xs bg-green-500/20 text-green-400 border-0">✅ Active</Badge>
                          }
                        </div>
                        <h3 className="font-bold text-slate-100 truncate">{a.title}</h3>
                        {a.description && (<p className="text-sm text-slate-400 mt-1 line-clamp-2">{a.description}</p>)}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {new Date(a.due_date).toLocaleDateString('en-GB')}</span>
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> {subCount} submitted</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start sm:self-center">
                        <Button size="sm" variant="outline" onClick={() => startEdit(a)}
                          className="w-8 h-8 p-0 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(a._id)}
                          className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
