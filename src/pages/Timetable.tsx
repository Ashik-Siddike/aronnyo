import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { useState } from 'react';

const scheduleData = [
  { day: 'Sunday', classes: [
    { time: '09:00 AM', subject: 'Math', teacher: 'Mr. Ali', room: 'Room 101', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { time: '10:00 AM', subject: 'English', teacher: 'Mrs. Sarah', room: 'Room 102', color: 'bg-green-100 text-green-700 border-green-200' },
    { time: '11:15 AM', subject: 'Science', teacher: 'Dr. Khan', room: 'Lab 1', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  ]},
  { day: 'Monday', classes: [
    { time: '09:00 AM', subject: 'Bangla', teacher: 'Mr. Rahman', room: 'Room 103', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { time: '10:00 AM', subject: 'Math', teacher: 'Mr. Ali', room: 'Room 101', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { time: '11:15 AM', subject: 'Games / PE', teacher: 'Mr. Jack', room: 'Playground', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  ]},
  { day: 'Tuesday', classes: [
    { time: '09:00 AM', subject: 'Science', teacher: 'Dr. Khan', room: 'Lab 1', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { time: '10:00 AM', subject: 'English', teacher: 'Mrs. Sarah', room: 'Room 102', color: 'bg-green-100 text-green-700 border-green-200' },
    { time: '11:15 AM', subject: 'Art', teacher: 'Ms. Lily', room: 'Art Room', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ]},
  { day: 'Wednesday', classes: [
    { time: '09:00 AM', subject: 'Math', teacher: 'Mr. Ali', room: 'Room 101', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { time: '10:00 AM', subject: 'Bangla', teacher: 'Mr. Rahman', room: 'Room 103', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { time: '11:15 AM', subject: 'Science', teacher: 'Dr. Khan', room: 'Lab 1', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  ]},
  { day: 'Thursday', classes: [
    { time: '09:00 AM', subject: 'English', teacher: 'Mrs. Sarah', room: 'Room 102', color: 'bg-green-100 text-green-700 border-green-200' },
    { time: '10:00 AM', subject: 'Math', teacher: 'Mr. Ali', room: 'Room 101', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { time: '11:15 AM', subject: 'Games / PE', teacher: 'Mr. Jack', room: 'Playground', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  ]}
];

export default function Timetable() {
  const todayIndex = new Date().getDay();
  // Adjust to start week on Sunday (0) to Thursday (4) for BD context. If Friday/Sat, default to Sunday
  const defaultDay = todayIndex >= 0 && todayIndex <= 4 ? todayIndex : 0;
  
  const [activeDay, setActiveDay] = useState(defaultDay);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-eduplay-purple p-3 rounded-xl text-white">
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Class Timetable</h1>
          <p className="text-gray-600 dark:text-gray-400">View your daily class schedule and routines</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Day Selector */}
        <div className="md:col-span-1 space-y-2">
          {scheduleData.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                activeDay === idx 
                  ? 'bg-eduplay-purple text-white shadow-md scale-105' 
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-slate-700'
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Schedule Display */}
        <div className="md:col-span-3">
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/80 border-b">
              <CardTitle className="text-2xl font-bold text-eduplay-purple">
                {scheduleData[activeDay].day}'s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {scheduleData[activeDay].classes.map((cls, idx) => (
                  <div key={idx} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    <div className="flex-shrink-0 w-32 flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
                      <Clock className="w-5 h-5 text-eduplay-orange" />
                      {cls.time}
                    </div>

                    <div className={`flex-1 p-4 rounded-xl border-2 ${cls.color} flex justify-between items-center`}>
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          {cls.subject}
                        </h3>
                        <p className="text-sm font-medium mt-1 opacity-80">Teacher: {cls.teacher}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-white/50 dark:bg-black/10 px-3 py-1 rounded-full text-sm font-bold">
                          {cls.room}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
