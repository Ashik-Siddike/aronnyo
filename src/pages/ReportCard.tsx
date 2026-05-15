import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, Star, Award, TrendingUp, BookOpen, Sparkles, ChevronDown, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SubjectResult {
  name: string;
  icon: string;
  marks: number;
  total: number;
  grade: string;
  gradeColor: string;
  comment: string;
}

interface StudentReport {
  id: number;
  name: string;
  avatar: string;
  class: string;
  roll: number;
  section: string;
  exam: string;
  year: string;
  subjects: SubjectResult[];
  attendance: { present: number; total: number };
  rank: number;
  totalStudents: number;
  teacherComment: string;
  principalComment: string;
}

const getGrade = (percentage: number): { grade: string; color: string } => {
  if (percentage >= 90) return { grade: 'A+', color: 'text-eduplay-green' };
  if (percentage >= 80) return { grade: 'A', color: 'text-eduplay-blue' };
  if (percentage >= 70) return { grade: 'B+', color: 'text-eduplay-purple' };
  if (percentage >= 60) return { grade: 'B', color: 'text-eduplay-orange' };
  if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' };
  return { grade: 'F', color: 'text-red-500' };
};

const sampleStudents: StudentReport[] = [
  {
    id: 1, name: 'Fatima Rahman', avatar: '👧', class: 'Nursery', roll: 1, section: 'A',
    exam: 'বার্ষিক পরীক্ষা', year: '2026',
    subjects: [
      { name: 'গণিত (Math)', icon: '🔢', marks: 92, total: 100, grade: 'A+', gradeColor: 'text-eduplay-green', comment: 'Excellent problem solving!' },
      { name: 'ইংরেজি (English)', icon: '📖', marks: 88, total: 100, grade: 'A', gradeColor: 'text-eduplay-blue', comment: 'Very good reading skills' },
      { name: 'বাংলা (Bangla)', icon: '🇧🇩', marks: 95, total: 100, grade: 'A+', gradeColor: 'text-eduplay-green', comment: 'অসাধারণ লেখার দক্ষতা!' },
      { name: 'বিজ্ঞান (Science)', icon: '🔬', marks: 85, total: 100, grade: 'A', gradeColor: 'text-eduplay-blue', comment: 'Great curiosity about nature' },
      { name: 'সাধারণ জ্ঞান', icon: '🌍', marks: 90, total: 100, grade: 'A+', gradeColor: 'text-eduplay-green', comment: 'Wide general knowledge' },
      { name: 'চারু ও কারুকলা', icon: '🎨', marks: 95, total: 100, grade: 'A+', gradeColor: 'text-eduplay-green', comment: 'Very creative and artistic!' },
    ],
    attendance: { present: 118, total: 125 },
    rank: 1, totalStudents: 35,
    teacherComment: 'ফাতিমা খুবই মেধাবী ও পরিশ্রমী ছাত্রী। সে সবসময় ক্লাসে সক্রিয় অংশগ্রহণ করে। তার ভবিষ্যৎ খুবই উজ্জ্বল! ⭐',
    principalComment: 'অত্যন্ত সন্তোষজনক ফলাফল। এভাবে চালিয়ে যাও।'
  },
  {
    id: 2, name: 'Arif Hossain', avatar: '👦', class: 'Nursery', roll: 2, section: 'A',
    exam: 'বার্ষিক পরীক্ষা', year: '2026',
    subjects: [
      { name: 'গণিত (Math)', icon: '🔢', marks: 78, total: 100, grade: 'B+', gradeColor: 'text-eduplay-purple', comment: 'Good improvement needed' },
      { name: 'ইংরেজি (English)', icon: '📖', marks: 82, total: 100, grade: 'A', gradeColor: 'text-eduplay-blue', comment: 'Good speaking skills' },
      { name: 'বাংলা (Bangla)', icon: '🇧🇩', marks: 85, total: 100, grade: 'A', gradeColor: 'text-eduplay-blue', comment: 'ভালো পড়ার অভ্যাস' },
      { name: 'বিজ্ঞান (Science)', icon: '🔬', marks: 90, total: 100, grade: 'A+', gradeColor: 'text-eduplay-green', comment: 'Excellent lab work!' },
      { name: 'সাধারণ জ্ঞান', icon: '🌍', marks: 75, total: 100, grade: 'B+', gradeColor: 'text-eduplay-purple', comment: 'Needs to read more' },
      { name: 'চারু ও কারুকলা', icon: '🎨', marks: 88, total: 100, grade: 'A', gradeColor: 'text-eduplay-blue', comment: 'Creative drawings!' },
    ],
    attendance: { present: 110, total: 125 },
    rank: 5, totalStudents: 35,
    teacherComment: 'আরিফ বিজ্ঞানে খুব ভালো করেছে। গণিতে আরো অনুশীলন প্রয়োজন।',
    principalComment: 'ভালো ফলাফল। আরো চেষ্টা করলে আরও ভালো করতে পারবে।'
  }
];

const ReportCard = () => {
  const [selectedStudent, setSelectedStudent] = useState(sampleStudents[0]);
  const reportRef = useRef<HTMLDivElement>(null);

  const totalMarks = selectedStudent.subjects.reduce((sum, s) => sum + s.marks, 0);
  const totalPossible = selectedStudent.subjects.reduce((sum, s) => sum + s.total, 0);
  const percentage = Math.round((totalMarks / totalPossible) * 100);
  const overallGrade = getGrade(percentage);
  const attendanceRate = Math.round((selectedStudent.attendance.present / selectedStudent.attendance.total) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 print:bg-white print:py-0 print:text-black relative overflow-hidden">
      {/* Background decorations for screen */}
      <div className="absolute inset-0 pointer-events-none print:hidden z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Base
          </Link>
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 rounded-full px-6">
            <Printer className="w-4 h-4 mr-2" /> Print Stats
          </Button>
        </div>

        {/* Header - Screen */}
        <div className="text-center mb-10 print:hidden">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/30 mb-4"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Official Player Stats</span>
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 drop-shadow-md">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PROGRESS REPORT
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Detailed breakdown of your learning adventures
          </p>
        </div>

        {/* Header - Print */}
        <div className="hidden print:block text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">247School</h1>
          <h2 className="text-xl font-semibold text-gray-700">Official Progress Report</h2>
        </div>

        {/* Student Selector (Screen only) */}
        <div className="flex flex-wrap gap-3 justify-center mb-10 print:hidden">
          {sampleStudents.map((student) => (
            <Button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`rounded-full px-6 py-4 transition-all duration-300 font-bold border-2 ${
                selectedStudent.id === student.id
                  ? 'bg-slate-800 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="mr-2 text-xl">{student.avatar}</span>
              {student.name}
            </Button>
          ))}
        </div>

        {/* Report Card */}
        <div ref={reportRef}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-[32px] overflow-hidden shadow-2xl print:shadow-none print:border-none print:bg-transparent print:rounded-none"
          >
            {/* Student Info Banner */}
            <div className="bg-slate-800/50 p-6 md:p-8 border-b border-slate-700 print:bg-gray-100 print:border-gray-300 print:p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-xs print:text-gray-500">Player Name</span>
                  <p className="font-black text-xl text-white mt-1 print:text-black flex items-center gap-2">
                    <span className="text-2xl print:hidden">{selectedStudent.avatar}</span> {selectedStudent.name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-xs print:text-gray-500">Guild (Class)</span>
                  <p className="font-bold text-lg text-white mt-1 print:text-black">{selectedStudent.class} ({selectedStudent.section})</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-xs print:text-gray-500">ID / Roll</span>
                  <p className="font-bold text-lg text-white mt-1 print:text-black">{selectedStudent.roll}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-xs print:text-gray-500">Global Rank</span>
                  <p className="font-black text-xl text-indigo-400 mt-1 print:text-black">#{selectedStudent.rank} <span className="text-sm text-slate-500">of {selectedStudent.totalStudents}</span></p>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="p-6 md:p-8 border-b border-slate-700 print:border-gray-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] print:border-gray-300 print:shadow-none print:bg-white">
                  <div className="text-4xl font-black text-emerald-400 print:text-black mb-1">{percentage}%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-gray-600">Total Score</div>
                </div>
                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 text-center shadow-[0_0_15px_rgba(168,85,247,0.1)] print:border-gray-300 print:shadow-none print:bg-white">
                  <div className={`text-4xl font-black ${overallGrade.color} print:text-black mb-1`}>{overallGrade.grade}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-gray-600">Final Grade</div>
                </div>
                <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 text-center shadow-[0_0_15px_rgba(59,130,246,0.1)] print:border-gray-300 print:shadow-none print:bg-white">
                  <div className="text-4xl font-black text-blue-400 print:text-black mb-1">{totalMarks}<span className="text-xl text-slate-600">/{totalPossible}</span></div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-gray-600">XP Earned</div>
                </div>
                <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 text-center shadow-[0_0_15px_rgba(249,115,22,0.1)] print:border-gray-300 print:shadow-none print:bg-white">
                  <div className="text-4xl font-black text-orange-400 print:text-black mb-1">{attendanceRate}%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-gray-600">Stamina (Attendance)</div>
                </div>
              </div>
            </div>

            {/* Subject-wise Results */}
            <div className="p-6 md:p-8 border-b border-slate-700 print:border-gray-300">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 print:text-black">
                <BookOpen className="w-6 h-6 text-indigo-400 print:text-black" />
                Mission Logs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 print:bg-gray-100 print:text-black uppercase text-xs tracking-wider">
                      <th className="text-left py-4 px-4 font-bold rounded-tl-xl">Subject</th>
                      <th className="text-center py-4 px-4 font-bold">Marks</th>
                      <th className="text-center py-4 px-4 font-bold">Total</th>
                      <th className="text-center py-4 px-4 font-bold">Progress</th>
                      <th className="text-center py-4 px-4 font-bold">Grade</th>
                      <th className="text-left py-4 px-4 font-bold rounded-tr-xl hidden md:table-cell">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 print:text-black font-medium">
                    {selectedStudent.subjects.map((subject, i) => {
                      const pct = Math.round((subject.marks / subject.total) * 100);
                      return (
                        <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors print:border-gray-200">
                          <td className="py-4 px-4 text-white print:text-black font-bold">
                            <span className="mr-2 text-lg print:hidden">{subject.icon}</span>{subject.name}
                          </td>
                          <td className="py-4 px-4 text-center font-bold">{subject.marks}</td>
                          <td className="py-4 px-4 text-center text-slate-500 print:text-gray-500">{subject.total}</td>
                          <td className="py-4 px-4 text-center w-40">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden print:bg-gray-200">
                                <div
                                  className="h-full bg-indigo-500 print:bg-black rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-400 print:text-black w-8">{pct}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`font-black text-lg ${subject.gradeColor} print:text-black`}>{subject.grade}</span>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-400 print:text-gray-600 hidden md:table-cell">{subject.comment}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900/80 text-white print:bg-gray-100 print:text-black font-black text-base">
                      <td className="py-4 px-4 rounded-bl-xl">OVERALL</td>
                      <td className="py-4 px-4 text-center text-indigo-400 print:text-black">{totalMarks}</td>
                      <td className="py-4 px-4 text-center text-slate-500 print:text-gray-500">{totalPossible}</td>
                      <td className="py-4 px-4 text-center text-indigo-400 print:text-black">{percentage}%</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-2xl ${overallGrade.color} print:text-black`}>{overallGrade.grade}</span>
                      </td>
                      <td className="py-4 px-4 rounded-br-xl hidden md:table-cell"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6 border-b border-slate-700 print:border-gray-300">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 print:bg-white print:border-gray-300">
                <h4 className="font-bold text-emerald-400 print:text-black mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                  <GraduationCap className="w-4 h-4" /> Class Teacher's Review
                </h4>
                <p className="text-sm text-slate-300 print:text-gray-800 leading-relaxed font-medium">{selectedStudent.teacherComment}</p>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 print:bg-white print:border-gray-300">
                <h4 className="font-bold text-indigo-400 print:text-black mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                  <Award className="w-4 h-4" /> Principal's Note
                </h4>
                <p className="text-sm text-slate-300 print:text-gray-800 leading-relaxed font-medium">{selectedStudent.principalComment}</p>
              </div>
            </div>

            {/* Print Only Signatures */}
            <div className="hidden print:block p-8 pt-16">
              <div className="grid grid-cols-3 gap-8 text-center text-sm font-bold">
                <div>
                  <div className="border-b-2 border-black mb-2 pb-8"></div>
                  <p>Class Teacher</p>
                </div>
                <div>
                  <div className="border-b-2 border-black mb-2 pb-8"></div>
                  <p>Parent / Guardian</p>
                </div>
                <div>
                  <div className="border-b-2 border-black mb-2 pb-8"></div>
                  <p>Principal</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA for screen only */}
        <div className="mt-12 text-center print:hidden">
          <Link to="/leaderboard">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black hover:scale-105 transition-all duration-300 text-lg px-10 py-6 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              View Leaderboard 🏆
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Global Print Styles to enforce cleanliness */}
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .playful-shadow { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ReportCard;
