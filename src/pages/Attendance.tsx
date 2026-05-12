import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle2, XCircle, Clock, TrendingUp, Users, Sparkles, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

// Fallback students if API unreachable
const FALLBACK_STUDENTS = [
  { _id: '1', name: 'Fatima Rahman',  avatar: '👧', class: 'Nursery-A', attendance: { present: 22, absent: 2, late: 1, total: 25, rate: 88 } },
  { _id: '2', name: 'Arif Hossain',   avatar: '👦', class: 'Nursery-A', attendance: { present: 20, absent: 3, late: 2, total: 25, rate: 80 } },
  { _id: '3', name: 'Nusrat Jahan',   avatar: '👧', class: 'Nursery-B', attendance: { present: 24, absent: 1, late: 0, total: 25, rate: 96 } },
  { _id: '4', name: 'Sakib Ahmed',    avatar: '👦', class: 'Nursery-B', attendance: { present: 21, absent: 2, late: 2, total: 25, rate: 84 } },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'present': return 'bg-eduplay-green/20 text-eduplay-green border-eduplay-green/30 hover:bg-eduplay-green/30';
    case 'absent':  return 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200';
    case 'late':    return 'bg-eduplay-orange/20 text-eduplay-orange border-eduplay-orange/30 hover:bg-eduplay-orange/30';
    case 'holiday': return 'bg-gray-100 text-gray-400 border-gray-200';
    case 'future':  return 'bg-gray-50 text-gray-300 border-gray-100';
    default: return '';
  }
};

const buildCalendar = (year: number, month: number, records: any[]) => {
  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date();
  const days: Array<{ date: number; status: string }> = [];

  for (let i = 0; i < firstDayOfWeek; i++) days.push({ date: 0, status: 'empty' });

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = currentDate.getDay();

    if (currentDate > today) {
      days.push({ date: d, status: 'future' });
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      days.push({ date: d, status: 'holiday' });
    } else {
      const record = records.find(r => r.date === dateStr);
      days.push({ date: d, status: record?.status || 'absent' });
    }
  }
  return days;
};

const Attendance = () => {
  const { user } = useAuth();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [students,     setStudents]     = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [calLoading, setCalLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Load students list
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API}/attendance/students`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
          setSelectedStudent(data[0]);
          setIsFallback(false);
        } else {
          throw new Error('Empty');
        }
      } catch {
        setStudents(FALLBACK_STUDENTS);
        setSelectedStudent(FALLBACK_STUDENTS[0]);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Load attendance records for selected student + month
  useEffect(() => {
    if (!selectedStudent || isFallback) return;
    const fetchRecords = async () => {
      setCalLoading(true);
      try {
        const res = await fetch(
          `${API}/attendance?student_id=${selectedStudent._id}&month=${currentMonth + 1}&year=${currentYear}`
        );
        const data = await res.json();
        setAttendanceRecords(Array.isArray(data) ? data : []);
      } catch {
        setAttendanceRecords([]);
      } finally {
        setCalLoading(false);
      }
    };
    fetchRecords();
  }, [selectedStudent, currentMonth, currentYear, isFallback]);

  const monthData = buildCalendar(currentYear, currentMonth, attendanceRecords);

  const stats = {
    present: monthData.filter(d => d.status === 'present').length,
    absent:  monthData.filter(d => d.status === 'absent').length,
    late:    monthData.filter(d => d.status === 'late').length,
    holiday: monthData.filter(d => d.status === 'holiday').length,
  };
  const totalSchoolDays = stats.present + stats.absent + stats.late;
  const attendanceRate  = totalSchoolDays > 0 ? Math.round((stats.present / totalSchoolDays) * 100) : 0;

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-eduplay-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/" className="inline-flex items-center text-gray-600 dark:text-slate-300 hover:text-eduplay-purple transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-4 animate-fade-in">
            <Calendar className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">
              Attendance Management
              {isFallback && <span className="ml-2 text-xs text-amber-500">(Sample Data)</span>}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-slate-100 mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent">
              📋 উপস্থিতি ট্র্যাকার
            </span>
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            প্রতিদিনের উপস্থিতি রেকর্ড দেখো এবং ট্র্যাক করো
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'উপস্থিত',    value: stats.present,   icon: '✅', color: 'from-eduplay-green/20 to-eduplay-green/5',    textColor: 'text-eduplay-green' },
            { label: 'অনুপস্থিত', value: stats.absent,    icon: '❌', color: 'from-red-100 to-red-50',                       textColor: 'text-red-500' },
            { label: 'দেরিতে',    value: stats.late,       icon: '⏰', color: 'from-eduplay-orange/20 to-eduplay-orange/5',   textColor: 'text-eduplay-orange' },
            { label: 'উপস্থিতি হার', value: `${attendanceRate}%`, icon: '📊', color: 'from-eduplay-purple/20 to-eduplay-blue/5', textColor: 'text-eduplay-purple' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 playful-shadow overflow-hidden hover:scale-105 transition-all duration-300">
              <CardContent className={`p-5 bg-gradient-to-br ${stat.color}`}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Student List */}
          <Card className="border-0 playful-shadow lg:col-span-1 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 dark:text-slate-100">
                <Users className="w-5 h-5 text-eduplay-purple" /> ছাত্রছাত্রী তালিকা
                <span className="ml-auto text-xs text-slate-400 font-normal">{students.length} জন</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student._id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-slate-700 hover:bg-eduplay-purple/5 transition-all text-left ${
                    selectedStudent?._id === student._id ? 'bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/5' : ''
                  }`}
                >
                  <span className="text-2xl">{student.avatar || '🧒'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${selectedStudent?._id === student._id ? 'text-eduplay-purple' : 'text-gray-800 dark:text-slate-100'}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{student.class || student.grade || 'N/A'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-eduplay-green">{student.attendance?.rate ?? 0}%</p>
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full mt-1">
                      <div className="h-full bg-gradient-to-r from-eduplay-green to-eduplay-blue rounded-full transition-all"
                        style={{ width: `${student.attendance?.rate ?? 0}%` }} />
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Right — Calendar */}
          <Card className="border-0 playful-shadow lg:col-span-2 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg flex items-center gap-2 dark:text-slate-100">
                  <span className="text-xl">{selectedStudent?.avatar || '🧒'}</span>
                  {selectedStudent?.name}
                  {calLoading && <RefreshCw className="w-4 h-4 animate-spin text-slate-400 ml-2" />}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={prevMonth} className="p-2 hover:bg-eduplay-purple/10">
                    <ChevronLeft className="w-4 h-4 text-eduplay-purple" />
                  </Button>
                  <span className="font-bold text-eduplay-purple min-w-[130px] text-center text-sm">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextMonth} className="p-2 hover:bg-eduplay-purple/10">
                    <ChevronRight className="w-4 h-4 text-eduplay-purple" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day, i) => (
                  <div key={i} className={`text-center text-xs font-bold py-2 ${i >= 5 ? 'text-gray-400' : 'text-gray-600 dark:text-slate-300'}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthData.map((day, i) => (
                  <div key={i} className="aspect-square">
                    {day.status === 'empty' ? <div /> : (
                      <div className={`w-full h-full rounded-xl border flex flex-col items-center justify-center text-sm font-bold transition-all cursor-default ${getStatusStyle(day.status)}`}>
                        <span>{day.date}</span>
                        {day.status === 'present' && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
                        {day.status === 'absent'  && <XCircle className="w-3 h-3 mt-0.5" />}
                        {day.status === 'late'    && <Clock className="w-3 h-3 mt-0.5" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                {[
                  { label: 'উপস্থিত',    color: 'bg-eduplay-green/20 border-eduplay-green/30',   icon: '✅' },
                  { label: 'অনুপস্থিত', color: 'bg-red-100 border-red-200',                       icon: '❌' },
                  { label: 'দেরিতে',    color: 'bg-eduplay-orange/20 border-eduplay-orange/30',   icon: '⏰' },
                  { label: 'ছুটি',      color: 'bg-gray-100 border-gray-200',                     icon: '🏖️' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                    <div className={`w-5 h-5 rounded-md border ${item.color}`} />
                    <span>{item.icon} {item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-8 rounded-3xl playful-shadow animate-fade-in">
          <TrendingUp className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-white mb-2">নিয়মিত স্কুলে আসো, নিয়মিত শেখো! 📚</h3>
          <p className="text-white/80 mb-4">প্রতিদিন উপস্থিত থাকলে তুমি আরও বেশি শিখতে পারবে!</p>
          <Link to="/dashboard">
            <Button className="bg-white text-eduplay-purple hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-5 rounded-2xl">
              ড্যাশবোর্ড দেখো 📊
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
