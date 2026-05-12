import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Check, X, Clock, Calendar, BookOpen, RefreshCw, ChevronRight, Users } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

const SUBJECTS = ['Math', 'English', 'Bangla', 'Science', 'Art', 'Games/PE', 'ICT', 'Social Studies'];
const DAYS     = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const TIMES    = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','11:15 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM'];
const COLORS   = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-red-100 text-red-700 border-red-200',
];

const COLOR_LABELS = ['Blue', 'Green', 'Purple', 'Orange', 'Pink', 'Yellow', 'Teal', 'Red'];

const EMPTY_FORM = {
  day: 'Sunday',
  day_index: 0,
  time: '09:00 AM',
  subject: 'Math',
  teacher: '',
  room: '',
  color: COLORS[0],
};

export default function AdminTimetable() {
  const [schedule,   setSchedule]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [activeDay,  setActiveDay]  = useState(0);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState<string | null>(null);
  const [form,       setForm]       = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/timetable`);
      const data = await res.json();
      setSchedule(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedule(); }, []);

  const byDay = DAYS.map((day, idx) => ({
    day,
    classes: schedule
      .filter(e => e.day === day)
      .sort((a, b) => a.time.localeCompare(b.time)),
  }));

  const startAdd = () => {
    setForm({ ...EMPTY_FORM, day: DAYS[activeDay], day_index: activeDay });
    setEditId(null);
    setShowForm(true);
  };

  const startEdit = (entry: any) => {
    setForm({
      day:       entry.day,
      day_index: entry.day_index ?? DAYS.indexOf(entry.day),
      time:      entry.time,
      subject:   entry.subject,
      teacher:   entry.teacher,
      room:      entry.room || '',
      color:     entry.color || COLORS[0],
    });
    setEditId(entry._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.teacher.trim()) { toast.error('Teacher name is required'); return; }
    setSaving(true);
    try {
      let res;
      if (editId) {
        res = await fetch(`${API}/timetable/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(`${API}/timetable`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      if (res.ok) {
        toast.success(editId ? 'Schedule updated!' : 'Class added!');
        setShowForm(false);
        setEditId(null);
        await fetchSchedule();
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this class entry?')) return;
    try {
      const res = await fetch(`${API}/timetable/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Deleted!'); await fetchSchedule(); }
      else toast.error('Failed to delete');
    } catch {
      toast.error('Network error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 rounded-xl text-white">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Timetable Manager</h2>
              <p className="text-sm text-slate-400">{schedule.length} entries across {DAYS.length} days</p>
            </div>
          </div>
          <Button onClick={startAdd} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Class
          </Button>
        </div>

        {/* Day tabs */}
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day, idx) => (
            <button key={idx} onClick={() => setActiveDay(idx)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeDay === idx
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-violet-400'
              }`}>
              {day}
              <span className="ml-2 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                {byDay[idx].classes.length}
              </span>
            </button>
          ))}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="border-2 border-violet-500/30 shadow-xl rounded-2xl bg-slate-800/80">
            <CardHeader className="bg-slate-700/50 rounded-t-2xl border-b border-slate-700">
              <CardTitle className="text-lg font-bold text-violet-400">
                {editId ? '✏️ Edit Class Entry' : '➕ Add New Class'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Day</label>
                  <select value={form.day}
                    onChange={e => setForm(f => ({ ...f, day: e.target.value, day_index: DAYS.indexOf(e.target.value) }))}
                    className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Time</label>
                  <select value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500">
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Subject</label>
                  <select value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-slate-600 rounded-lg px-3 py-2 text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Teacher Name</label>
                  <Input placeholder="e.g. Mr. Ali" value={form.teacher}
                    onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))}
                    className="bg-slate-900 border-slate-600 text-slate-100 focus-visible:ring-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Room / Location</label>
                  <Input placeholder="e.g. Room 101, Lab 2" value={form.room}
                    onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                    className="bg-slate-900 border-slate-600 text-slate-100 focus-visible:ring-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Color Tag</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c, i) => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                        title={COLOR_LABELS[i]}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${c.split(' ')[0]} ${form.color === c ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : 'opacity-60 hover:opacity-100'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editId ? 'Update' : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}
                  className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Table */}
        <Card className="border border-slate-700 shadow-xl rounded-2xl overflow-hidden bg-slate-800/60">
          <CardHeader className="bg-slate-800/80 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-violet-400">
                {DAYS[activeDay]}'s Schedule
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchSchedule} className="gap-2 text-slate-400 hover:text-white">
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
              </div>
            ) : byDay[activeDay].classes.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No classes on {DAYS[activeDay]}</p>
                <Button onClick={startAdd} variant="outline" className="mt-4 gap-2 border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4" /> Add First Class
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {byDay[activeDay].classes.map(cls => (
                  <div key={cls._id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-700/30 transition-colors group">
                    <div className="flex items-center gap-2 w-28 shrink-0 text-slate-400 font-bold text-sm">
                      <Clock className="w-4 h-4 text-orange-400" /> {cls.time}
                    </div>
                    <div className={`flex-1 p-3 rounded-xl border-2 ${cls.color} flex justify-between items-center`}>
                      <div>
                        <h4 className="font-bold flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" /> {cls.subject}
                        </h4>
                        <p className="text-xs opacity-80 mt-0.5">👤 {cls.teacher}{cls.room && ` · 📍 ${cls.room}`}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" onClick={() => startEdit(cls)}
                        className="w-8 h-8 p-0 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(cls._id)}
                        className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
}
