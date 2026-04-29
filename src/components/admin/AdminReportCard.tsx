import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save, Loader2, ArrowLeft, GraduationCap, Award, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

interface SubjectMark { name: string; marks: string; total: string; grade: string; }
interface Student { id: string; full_name: string; role: string; }

const defaultSubjects: SubjectMark[] = [
  { name: 'গণিত (Math)',       marks: '', total: '100', grade: '' },
  { name: 'ইংরেজি (English)',  marks: '', total: '100', grade: '' },
  { name: 'বাংলা (Bangla)',    marks: '', total: '100', grade: '' },
  { name: 'বিজ্ঞান (Science)', marks: '', total: '100', grade: '' },
];

const getGrade = (marks: string, total: string) => {
  const pct = (parseInt(marks) / parseInt(total)) * 100;
  if (isNaN(pct)) return '';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

const AdminReportCard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [examName, setExamName] = useState('Annual Examination');
  const [examYear, setExamYear] = useState('2026');
  const [teacherComment, setTeacherComment] = useState('');
  const [principalComment, setPrincipalComment] = useState('');
  const [rank, setRank] = useState('');
  const [subjects, setSubjects] = useState<SubjectMark[]>(defaultSubjects);

  // Fetch students
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/users`)
      .then(r => r.json())
      .then(data => {
        const list = data.filter((u: any) => u.role === 'student');
        setStudents(list);
        if (list.length > 0) {
          setSelectedStudent(list[0].id);
          setSelectedStudentName(list[0].full_name);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fetch existing report for selected student
  useEffect(() => {
    if (!selectedStudent) return;
    fetch(`${API_BASE}/report-cards?student_id=${selectedStudent}`)
      .then(r => r.json())
      .then(data => {
        if (data?.length > 0) {
          const report = data[0];
          setExamName(report.exam_name || 'Annual Examination');
          setExamYear(report.exam_year || '2026');
          setTeacherComment(report.teacher_comment || '');
          setPrincipalComment(report.principal_comment || '');
          setRank(report.rank?.toString() || '');
          setSubjects(report.subjects?.length ? report.subjects : defaultSubjects);
        } else {
          setTeacherComment(''); setPrincipalComment(''); setRank('');
          setSubjects(defaultSubjects);
        }
      })
      .catch(console.error);
  }, [selectedStudent]);

  const updateSubject = (index: number, field: keyof SubjectMark, value: string) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    const m = field === 'marks' ? value : updated[index].marks;
    const t = field === 'total' ? value : updated[index].total;
    if (m && t) updated[index].grade = getGrade(m, t);
    setSubjects(updated);
  };

  const totalObtained = subjects.reduce((s, sub) => s + (parseInt(sub.marks) || 0), 0);
  const totalMax = subjects.reduce((s, sub) => s + (parseInt(sub.total) || 0), 0);
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/report-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: selectedStudent, exam_name: examName, exam_year: examYear,
          teacher_comment: teacherComment, principal_comment: principalComment,
          total_marks: totalObtained, rank: parseInt(rank) || 0,
          subjects, percentage
        })
      });
      if (res.ok) toast.success('✅ Report Card saved to MongoDB!');
      else throw new Error();
    } catch {
      toast.error('Failed to save report card');
    } finally { setSaving(false); }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head>
        <title>Report Card — ${selectedStudentName}</title>
        <style>
          body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1e293b}
          h1{text-align:center;color:#4f46e5;margin:0}
          .sub{text-align:center;color:#64748b;font-size:14px;margin-bottom:24px}
          .meta{display:flex;gap:12px;margin-bottom:20px;font-size:13px}
          .meta div{background:#f1f5f9;padding:8px 14px;border-radius:8px;flex:1;text-align:center}
          table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px}
          th{background:#4f46e5;color:#fff;padding:10px;text-align:left}
          td{padding:8px 10px;border-bottom:1px solid #e2e8f0}
          tr:nth-child(even) td{background:#f8fafc}
          .total td{font-weight:700;background:#ede9fe}
          .cb{background:#f8fafc;border-left:4px solid #4f46e5;padding:10px 14px;margin-bottom:12px;border-radius:4px;font-size:13px}
          .footer{display:flex;justify-content:space-between;margin-top:40px}
          .sl{border-top:1px solid #334155;padding-top:6px;font-size:11px;color:#64748b;width:140px;text-align:center}
          @media print{body{padding:20px}}
        </style>
      </head><body>
        <h1>247School</h1>
        <div class="sub">${examName} — Academic Year ${examYear}</div>
        <div class="meta">
          <div><strong>Student:</strong> ${selectedStudentName}</div>
          <div><strong>Class Rank:</strong> ${rank || '—'}</div>
          <div><strong>Total:</strong> ${totalObtained}/${totalMax}</div>
          <div><strong>Percentage:</strong> ${percentage}%</div>
        </div>
        <table>
          <thead><tr><th>Subject</th><th>Marks Obtained</th><th>Out of</th><th>Grade</th></tr></thead>
          <tbody>
            ${subjects.map(s => `<tr><td>${s.name}</td><td>${s.marks||'—'}</td><td>${s.total}</td><td><b>${s.grade||'—'}</b></td></tr>`).join('')}
            <tr class="total"><td>TOTAL</td><td>${totalObtained}</td><td>${totalMax}</td><td>${percentage}%</td></tr>
          </tbody>
        </table>
        ${teacherComment ? `<div class="cb"><strong>Teacher's Remarks:</strong><br/>${teacherComment}</div>` : ''}
        ${principalComment ? `<div class="cb"><strong>Principal's Remarks:</strong><br/>${principalComment}</div>` : ''}
        <div class="footer">
          <div class="sl">Class Teacher</div>
          <div class="sl">Principal</div>
          <div class="sl">Parent / Guardian</div>
        </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/admin" className="inline-flex items-center text-indigo-300 hover:text-white transition-colors mb-3">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-pink-400" /> Dynamic Report Cards
            </h1>
            <p className="text-indigo-200/50 mt-1 text-sm">Generate, edit, save and print student progress reports.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePrint} disabled={!selectedStudent} variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
              <Printer className="w-4 h-4 mr-2" /> Print / PDF
            </Button>
            <Button onClick={handleSave} disabled={saving || !selectedStudent} className="bg-pink-600 hover:bg-pink-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Report
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Student list */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl h-fit">
            <CardHeader className="bg-slate-800/50 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" /> Select Student
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {students.map(s => (
                    <button key={s.id}
                      onClick={() => { setSelectedStudent(s.id); setSelectedStudentName(s.full_name); }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedStudent === s.id
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : 'text-slate-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="font-medium">{s.full_name}</div>
                      <div className="text-xs opacity-60">{s.role}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editor */}
          <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl" ref={printRef}>
            <CardHeader className="bg-slate-800/50 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-400" /> Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {!selectedStudent ? (
                <div className="text-center py-10 text-slate-400">Select a student to edit their report.</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-indigo-200">Exam Name</label>
                      <Input value={examName} onChange={e => setExamName(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-indigo-200">Year</label>
                      <Input value={examYear} onChange={e => setExamYear(e.target.value)} className="bg-slate-900/50 border-white/10 text-white" />
                    </div>
                  </div>

                  {/* Subject marks */}
                  <div className="space-y-2">
                    <label className="text-sm text-indigo-200 font-medium">Subject-wise Marks</label>
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800/80 text-indigo-200 text-xs">
                          <tr>
                            <th className="p-3 text-left">Subject</th>
                            <th className="p-3 text-center w-24">Marks</th>
                            <th className="p-3 text-center w-20">Total</th>
                            <th className="p-3 text-center w-16">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((sub, i) => (
                            <tr key={i} className="border-t border-white/5">
                              <td className="p-2 text-white text-sm">{sub.name}</td>
                              <td className="p-2">
                                <Input type="number" value={sub.marks}
                                  onChange={e => updateSubject(i, 'marks', e.target.value)}
                                  className="bg-slate-900/50 border-white/10 text-white h-8 text-center"
                                  placeholder="0" />
                              </td>
                              <td className="p-2 text-center text-slate-400">{sub.total}</td>
                              <td className="p-2 text-center font-bold text-sm">
                                <span className={sub.grade === 'A+' ? 'text-emerald-400' : sub.grade === 'F' ? 'text-red-400' : 'text-indigo-300'}>
                                  {sub.grade || '—'}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t border-white/20 bg-slate-800/60">
                            <td className="p-3 font-bold text-white text-sm">TOTAL</td>
                            <td className="p-3 text-center font-bold text-pink-400">{totalObtained}</td>
                            <td className="p-3 text-center text-slate-400">{totalMax}</td>
                            <td className="p-3 text-center font-bold text-yellow-400">{percentage}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-indigo-200">Class Rank</label>
                    <Input type="number" value={rank} onChange={e => setRank(e.target.value)} className="bg-slate-900/50 border-white/10 text-white w-32" placeholder="e.g. 1" />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-sm text-indigo-200 font-medium">Teacher's Remarks <span className="text-xs text-slate-500">(Visible to Parents)</span></label>
                    <Textarea value={teacherComment} onChange={e => setTeacherComment(e.target.value)} className="bg-slate-900/50 border-white/10 text-white min-h-[80px]" placeholder="Write constructive feedback..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-indigo-200 font-medium">Principal's Remarks <span className="text-xs text-slate-500">(Optional)</span></label>
                    <Textarea value={principalComment} onChange={e => setPrincipalComment(e.target.value)} className="bg-slate-900/50 border-white/10 text-white min-h-[80px]" placeholder="Principal's comments..." />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminReportCard;
