import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Download, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Certificate() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getStudentDashboard(user?.id);
        setStudentData(data);
      } catch (err) {
        console.error('Failed to load certificate data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!studentData) return <div className="min-h-screen flex items-center justify-center">No data found</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-10 px-4">
      {/* Controls */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link to="/dashboard">
          <Button variant="outline" className="bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <Button onClick={handlePrint} className="bg-eduplay-purple hover:bg-purple-700 text-white">
          <Download className="w-4 h-4 mr-2" /> Download as PDF
        </Button>
      </div>

      {/* Certificate Body */}
      <div className="max-w-4xl mx-auto bg-white p-2 md:p-8 shadow-2xl rounded-xl print:shadow-none print:p-0 print:m-0">
        <div className="border-8 border-double border-eduplay-purple p-8 md:p-16 text-center relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white print:border-4">
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-b-8 border-r-8 border-eduplay-purple rounded-br-[100px] opacity-20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-b-8 border-l-8 border-eduplay-purple rounded-bl-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t-8 border-r-8 border-eduplay-purple rounded-tr-[100px] opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-t-8 border-l-8 border-eduplay-purple rounded-tl-[100px] opacity-20"></div>

          {/* Logo / Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-full shadow-lg border-4 border-yellow-200">
              <Award className="w-16 h-16" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-eduplay-purple uppercase tracking-widest mb-2 font-serif">
            Certificate
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 uppercase tracking-widest mb-10 font-medium">
            of Achievement
          </h2>

          <p className="text-lg md:text-xl text-gray-500 italic mb-4">
            This is proudly presented to
          </p>

          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 inline-block px-10 mb-6 font-serif">
            {studentData.name}
          </h3>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-16">
            For outstanding performance, earning <span className="font-bold text-eduplay-orange">{studentData.totalStars} Stars</span>, 
            unlocking <span className="font-bold text-eduplay-blue">{studentData.badges} Badges</span>, 
            and reaching the <span className="font-bold text-eduplay-green">{studentData.level}</span> level 
            with an accuracy of <span className="font-bold text-eduplay-purple">{studentData.accuracy}%</span>. 
            Keep up the excellent learning journey!
          </p>

          {/* Signatures */}
          <div className="flex justify-between items-end mt-12 px-4 md:px-16">
            <div className="text-center w-48">
              <div className="border-b-2 border-gray-800 pb-2 mb-2">
                <span className="font-script text-3xl">Admin</span>
              </div>
              <p className="text-sm font-bold text-gray-600 uppercase">Director</p>
            </div>
            
            {/* Seal */}
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl border-4 border-dashed border-white transform rotate-12 mx-4">
              <div className="text-center text-white">
                <div className="font-bold text-lg leading-tight uppercase">247<br/>School</div>
                <div className="text-xs opacity-90 mt-1">Certified</div>
              </div>
            </div>

            <div className="text-center w-48">
              <div className="border-b-2 border-gray-800 pb-2 mb-2">
                <span className="text-lg font-serif">{new Date().toLocaleDateString('en-GB')}</span>
              </div>
              <p className="text-sm font-bold text-gray-600 uppercase">Date</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
