import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, Star, Award, TrendingUp, BookOpen, Sparkles, ChevronDown, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-eduplay-purple transition-colors mb-6 print:hidden">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 px-4 py-2 rounded-full border border-eduplay-purple/20 mb-4 animate-fade-in">
            <Award className="w-5 h-5 text-eduplay-purple mr-2" />
            <span className="text-eduplay-purple font-semibold">Report Card System</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green bg-clip-text text-transparent">
              📄 প্রগ্রেস রিপোর্ট কার্ড
            </span>
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in delay-150">
            ছাত্রছাত্রীদের পরীক্ষার ফলাফল এবং মূল্যায়ন রিপোর্ট
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-8 print:hidden">
          {sampleStudents.map((student) => (
            <Button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`rounded-full px-5 py-3 transition-all duration-300 ${
                selectedStudent.id === student.id
                  ? 'bg-gradient-to-r from-eduplay-purple to-eduplay-blue text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-eduplay-purple/5 border'
              }`}
            >
              <span className="mr-2">{student.avatar}</span>
              {student.name}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <Button variant="outline" onClick={handlePrint} className="border-eduplay-purple/30 text-eduplay-purple hover:bg-eduplay-purple/5">
            <Printer className="w-4 h-4 mr-2" /> প্রিন্ট করুন
          </Button>
        </div>

        {/* Report Card */}
        <div ref={reportRef}>
          <Card className="border-0 playful-shadow overflow-hidden print:shadow-none print:border">
            {/* School Header */}
            <div className="bg-gradient-to-r from-eduplay-purple via-eduplay-blue to-eduplay-green p-6 text-center text-white">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img src="/assets/logo-2.png" alt="Logo" className="h-10 bg-white/20 rounded-lg p-1" />
                <h2 className="text-2xl font-bold">247School</h2>
              </div>
              <p className="text-white/80 text-sm">শিশুদের জন্য আনন্দময় শিক্ষা প্ল্যাটফর্ম</p>
              <div className="mt-3 inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold">
                📋 {selectedStudent.exam} — {selectedStudent.year}
              </div>
            </div>

            {/* Student Info */}
            <div className="p-6 bg-gradient-to-r from-eduplay-purple/5 to-eduplay-blue/5 border-b">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ছাত্র/ছাত্রীর নাম:</span>
                  <p className="font-bold text-gray-800 flex items-center gap-1">
                    <span className="text-xl">{selectedStudent.avatar}</span> {selectedStudent.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">শ্রেণী:</span>
                  <p className="font-bold text-gray-800">{selectedStudent.class} ({selectedStudent.section})</p>
                </div>
                <div>
                  <span className="text-gray-500">রোল নং:</span>
                  <p className="font-bold text-gray-800">{selectedStudent.roll}</p>
                </div>
                <div>
                  <span className="text-gray-500">মেধা ক্রম:</span>
                  <p className="font-bold text-eduplay-purple">{selectedStudent.rank}/{selectedStudent.totalStudents}</p>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-eduplay-green/20 bg-eduplay-green/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-black text-eduplay-green">{percentage}%</div>
                    <div className="text-xs text-gray-600 mt-1">সর্বমোট শতাংশ</div>
                  </CardContent>
                </Card>
                <Card className="border border-eduplay-purple/20 bg-eduplay-purple/5">
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-black ${overallGrade.color}`}>{overallGrade.grade}</div>
                    <div className="text-xs text-gray-600 mt-1">সামগ্রিক গ্রেড</div>
                  </CardContent>
                </Card>
                <Card className="border border-eduplay-blue/20 bg-eduplay-blue/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-black text-eduplay-blue">{totalMarks}/{totalPossible}</div>
                    <div className="text-xs text-gray-600 mt-1">মোট নম্বর</div>
                  </CardContent>
                </Card>
                <Card className="border border-eduplay-orange/20 bg-eduplay-orange/5">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-black text-eduplay-orange">{attendanceRate}%</div>
                    <div className="text-xs text-gray-600 mt-1">উপস্থিতি</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Subject-wise Results */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-eduplay-purple" />
                বিষয়ভিত্তিক ফলাফল
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10">
                      <th className="text-left py-3 px-4 font-bold text-gray-700 rounded-tl-xl">বিষয়</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">প্রাপ্ত নম্বর</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">মোট</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">শতাংশ</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">গ্রেড</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700 rounded-tr-xl hidden md:table-cell">মন্তব্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.subjects.map((subject, i) => {
                      const pct = Math.round((subject.marks / subject.total) * 100);
                      return (
                        <tr key={i} className="border-b border-gray-50 hover:bg-eduplay-purple/5 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-800">
                            <span className="mr-2">{subject.icon}</span>{subject.name}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-gray-800">{subject.marks}</td>
                          <td className="py-3 px-4 text-center text-gray-500">{subject.total}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-eduplay-purple to-eduplay-blue rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-600">{pct}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-black text-lg ${subject.gradeColor}`}>{subject.grade}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-500 hidden md:table-cell">{subject.comment}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-eduplay-purple/10 to-eduplay-blue/10 font-bold">
                      <td className="py-3 px-4 text-gray-800 rounded-bl-xl">সর্বমোট</td>
                      <td className="py-3 px-4 text-center text-eduplay-purple">{totalMarks}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{totalPossible}</td>
                      <td className="py-3 px-4 text-center text-eduplay-purple">{percentage}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xl ${overallGrade.color}`}>{overallGrade.grade}</span>
                      </td>
                      <td className="py-3 px-4 rounded-br-xl hidden md:table-cell"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div className="p-6 grid md:grid-cols-2 gap-4 border-b">
              <div className="bg-eduplay-green/5 border border-eduplay-green/20 rounded-2xl p-4">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-eduplay-green" /> শ্রেণী শিক্ষকের মন্তব্য
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedStudent.teacherComment}</p>
              </div>
              <div className="bg-eduplay-purple/5 border border-eduplay-purple/20 rounded-2xl p-4">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-eduplay-purple" /> প্রধান শিক্ষকের মন্তব্য
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedStudent.principalComment}</p>
              </div>
            </div>

            {/* Grade Scale */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-sm font-bold text-gray-600 mb-3">গ্রেড স্কেল:</h4>
              <div className="flex flex-wrap gap-3 text-xs">
                {[
                  { grade: 'A+', range: '90-100%', color: 'bg-eduplay-green/20 text-eduplay-green border-eduplay-green/30' },
                  { grade: 'A', range: '80-89%', color: 'bg-eduplay-blue/20 text-eduplay-blue border-eduplay-blue/30' },
                  { grade: 'B+', range: '70-79%', color: 'bg-eduplay-purple/20 text-eduplay-purple border-eduplay-purple/30' },
                  { grade: 'B', range: '60-69%', color: 'bg-eduplay-orange/20 text-eduplay-orange border-eduplay-orange/30' },
                  { grade: 'C', range: '50-59%', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                  { grade: 'F', range: '0-49%', color: 'bg-red-100 text-red-500 border-red-200' },
                ].map((g, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-full border font-bold ${g.color}`}>
                    {g.grade} ({g.range})
                  </span>
                ))}
              </div>
            </div>

            {/* Signature Area */}
            <div className="p-6 border-t">
              <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                <div>
                  <div className="border-b border-gray-300 mb-2 pb-6"></div>
                  <p className="font-medium">শ্রেণী শিক্ষক</p>
                </div>
                <div>
                  <div className="border-b border-gray-300 mb-2 pb-6"></div>
                  <p className="font-medium">অভিভাবক</p>
                </div>
                <div>
                  <div className="border-b border-gray-300 mb-2 pb-6"></div>
                  <p className="font-medium">প্রধান শিক্ষক</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-8 rounded-3xl playful-shadow animate-fade-in print:hidden">
          <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-3 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">ভালো ফলাফলের জন্য অভিনন্দন! 🎉</h3>
          <p className="text-white/80 mb-4">তোমার কঠোর পরিশ্রম এবং নিষ্ঠার প্রতিফলন এই রিপোর্ট কার্ডে!</p>
          <Link to="/leaderboard">
            <Button className="bg-white text-eduplay-purple hover:bg-white/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-5 rounded-2xl">
              লিডারবোর্ড দেখো 🏆
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
