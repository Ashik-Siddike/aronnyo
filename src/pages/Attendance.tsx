import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle2, XCircle, Clock, TrendingUp, Users, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Generate realistic attendance data
const generateMonthData = (year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date();
  const days: Array<{ date: number; status: 'present' | 'absent' | 'late' | 'holiday' | 'future' | 'empty' }> = [];

  // Empty cells before the first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ date: 0, status: 'empty' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    const dayOfWeek = currentDate.getDay();

    if (currentDate > today) {
      days.push({ date: d, status: 'future' });
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      // Friday & Saturday are holidays
      days.push({ date: d, status: 'holiday' });
    } else {
      // Random realistic attendance
      const rand = Math.random();
      if (rand < 0.82) {
        days.push({ date: d, status: 'present' });
      } else if (rand < 0.92) {
        days.push({ date: d, status: 'late' });
      } else {
        days.push({ date: d, status: 'absent' });
      }
    }
  }
  return days;
};

const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

const students = [
  { id: 1, name: 'Fatima Rahman', avatar: '👧', class: 'Nursery-A', present: 22, absent: 2, late: 1, total: 25 },
  { id: 2, name: 'Arif Hossain', avatar: '👦', class: 'Nursery-A', present: 20, absent: 3, late: 2, total: 25 },
  { id: 3, name: 'Nusrat Jahan', avatar: '👧', class: 'Nursery-B', present: 24, absent: 1, late: 0, total: 25 },
  { id: 4, name: 'Sakib Ahmed', avatar: '👦', class: 'Nursery-B', present: 21, absent: 2, late: 2, total: 25 },
  { id: 5, name: 'Mim Akter', avatar: '👧', class: '1st Standard', present: 23, absent: 1, late: 1, total: 25 },
  { id: 6, name: 'Raihan Islam', avatar: '👦', class: '1st Standard', present: 19, absent: 4, late: 2, total: 25 },
  { id: 7, name: 'Tanha Sultana', avatar: '👧', class: '2nd Standard', present: 25, absent: 0, late: 0, total: 25 },
  { id: 8, name: 'Jubayer Khan', avatar: '👦', class: '2nd Standard', present: 22, absent: 2, late: 1, total: 25 },
];

const Attendance = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const monthData = generateMonthData(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const stats = {
    present: monthData.filter(d => d.status === 'present').length,
    absent: monthData.filter(d => d.status === 'absent').length,
    late: monthData.filter(d => d.status === 'late').length,
    holiday: monthData.filter(d => d.status === 'holiday').length,
  };
  const totalSchoolDays = stats.present + stats.absent + stats.late;
  const attendanceRate = totalSchoolDays > 0 ? Math.round((stats.present / totalSchoolDays) * 100) : 0;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'present': return 'bg-eduplay-green/20 text-eduplay-green border-eduplay-green/30 hover:bg-eduplay-green/30';
      case 'absent': return 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200';
      case 'late': return 'bg-eduplay-orange/20 text-eduplay-orange border-eduplay-orange/30 hover:bg-eduplay-orange/30';
      case 'holiday': return 'bg-gray-100 text-gray-400 border-gray-200';
      case 'future': return 'bg-gray-50 text-gray-300 border-gray-100';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-eduplay-purple transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-4 animate-fade-in">
            <Calendar className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">Attendance Management</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent">
              📋 উপস্থিতি ট্র্যাকার
            </span>
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in delay-150">
            প্রতিদিনের উপস্থিতি রেকর্ড দেখো এবং ট্র্যাক করো
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'উপস্থিত', value: stats.present, icon: '✅', color: 'from-eduplay-green/20 to-eduplay-green/5', textColor: 'text-eduplay-green' },
            { label: 'অনুপস্থিত', value: stats.absent, icon: '❌', color: 'from-red-100 to-red-50', textColor: 'text-red-500' },
            { label: 'দেরিতে', value: stats.late, icon: '⏰', color: 'from-eduplay-orange/20 to-eduplay-orange/5', textColor: 'text-eduplay-orange' },
            { label: 'উপস্থিতি হার', value: `${attendanceRate}%`, icon: '📊', color: 'from-eduplay-purple/20 to-eduplay-blue/5', textColor: 'text-eduplay-purple' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 playful-shadow overflow-hidden hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className={`p-5 bg-gradient-to-br ${stat.color}`}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Student List */}
          <Card className="border-0 playful-shadow lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-eduplay-purple" />
                ছাত্রছাত্রী তালিকা
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-eduplay-purple/5 transition-all duration-200 text-left ${
                    selectedStudent.id === student.id ? 'bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/5 border-l-3 border-l-eduplay-purple' : ''
                  }`}
                >
                  <span className="text-2xl">{student.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${selectedStudent.id === student.id ? 'text-eduplay-purple' : 'text-gray-800'}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-eduplay-green">{Math.round((student.present / student.total) * 100)}%</p>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-eduplay-green to-eduplay-blue rounded-full transition-all duration-500"
                        style={{ width: `${(student.present / student.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Right - Calendar */}
          <Card className="border-0 playful-shadow lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">{selectedStudent.avatar}</span>
                  {selectedStudent.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={prevMonth} className="p-2 hover:bg-eduplay-purple/10">
                    <ChevronLeft className="w-4 h-4 text-eduplay-purple" />
                  </Button>
                  <span className="font-bold text-eduplay-purple min-w-[130px] text-center">
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
                  <div key={i} className={`text-center text-xs font-bold py-2 ${i >= 5 ? 'text-gray-400' : 'text-gray-600'}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthData.map((day, i) => (
                  <div key={i} className="aspect-square">
                    {day.status === 'empty' ? (
                      <div />
                    ) : (
                      <div
                        className={`w-full h-full rounded-xl border flex flex-col items-center justify-center text-sm font-bold transition-all duration-200 cursor-default ${getStatusStyle(day.status)}`}
                      >
                        <span>{day.date}</span>
                        {day.status === 'present' && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
                        {day.status === 'absent' && <XCircle className="w-3 h-3 mt-0.5" />}
                        {day.status === 'late' && <Clock className="w-3 h-3 mt-0.5" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                {[
                  { label: 'উপস্থিত', color: 'bg-eduplay-green/20 border-eduplay-green/30', icon: '✅' },
                  { label: 'অনুপস্থিত', color: 'bg-red-100 border-red-200', icon: '❌' },
                  { label: 'দেরিতে', color: 'bg-eduplay-orange/20 border-eduplay-orange/30', icon: '⏰' },
                  { label: 'ছুটি', color: 'bg-gray-100 border-gray-200', icon: '🏖️' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
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
