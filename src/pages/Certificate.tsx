import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Download, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eduplay-purple"></div>
      <p className="text-gray-500 text-lg">সার্টিফিকেট লোড হচ্ছে...</p>
    </div>
  );

  if (!studentData) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-6xl">😕</div>
      <h2 className="text-2xl font-bold text-gray-700">তথ্য পাওয়া যায়নি</h2>
      <p className="text-gray-500 text-center">প্রথমে কিছু কুইজ ও পাঠ সম্পন্ন করো, তারপর সার্টিফিকেট পাবে!</p>
      <div className="flex gap-3">
        <Link to="/dashboard">
          <Button className="bg-eduplay-purple hover:bg-purple-700 text-white px-6 py-3 rounded-xl">📊 ড্যাশবোর্ড</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="px-6 py-3 rounded-xl">🏠 হোম</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 flex flex-col items-center justify-center relative overflow-hidden print:bg-white print:py-0">
      {/* Animated Background for screen */}
      <div className="absolute inset-0 pointer-events-none print:hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden relative z-10">
        <Link to="/dashboard">
          <Button variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <Button onClick={handlePrint} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-yellow-950 font-black shadow-lg shadow-orange-500/30">
          <Download className="w-4 h-4 mr-2" /> Download Plaque
        </Button>
      </div>

      {/* Certificate Body - Arcade Plaque Style */}
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-5xl mx-auto relative z-10"
      >
        <div className="bg-slate-800 p-3 md:p-6 rounded-[40px] shadow-[0_0_50px_rgba(234,179,8,0.2)] print:shadow-none print:bg-white print:p-0 print:rounded-none border-4 border-slate-700 print:border-none">
          
          <div className="border-[12px] border-double border-yellow-500/50 print:border-8 print:border-purple-800 bg-gradient-to-b from-slate-900 to-slate-800 print:from-white print:to-white p-8 md:p-16 text-center relative overflow-hidden rounded-[24px] print:rounded-none shadow-inner print:shadow-none">
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-b-8 border-r-8 border-yellow-500/30 print:border-purple-800 rounded-br-[100px]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 border-b-8 border-l-8 border-yellow-500/30 print:border-purple-800 rounded-bl-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-t-8 border-r-8 border-yellow-500/30 print:border-purple-800 rounded-tr-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-t-8 border-l-8 border-yellow-500/30 print:border-purple-800 rounded-tl-[100px]"></div>

            {/* Glowing Stars for Screen */}
            <div className="absolute top-10 left-20 text-yellow-300/50 text-2xl animate-ping print:hidden">✦</div>
            <div className="absolute top-20 right-24 text-yellow-300/50 text-3xl animate-pulse print:hidden">✦</div>
            <div className="absolute bottom-24 left-32 text-yellow-300/50 text-xl animate-pulse print:hidden">✦</div>
            
            {/* Logo / Badge */}
            <div className="flex justify-center mb-8 relative z-10">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 text-white p-5 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] border-4 border-yellow-100 print:shadow-none relative group cursor-default">
                <Award className="w-20 h-20 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 opacity-50 group-hover:animate-ping print:hidden"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 print:text-purple-800 uppercase tracking-[0.2em] mb-2 font-serif drop-shadow-sm print:drop-shadow-none">
              Achievement
            </h1>
            <h2 className="text-xl md:text-3xl text-yellow-600/80 print:text-purple-600 uppercase tracking-[0.3em] mb-12 font-bold flex items-center justify-center gap-4">
              <span className="w-12 h-0.5 bg-yellow-600/50 print:bg-purple-600"></span>
              Unlocked
              <span className="w-12 h-0.5 bg-yellow-600/50 print:bg-purple-600"></span>
            </h2>

            <p className="text-lg md:text-xl text-slate-400 print:text-gray-500 italic mb-4 font-medium">
              This grand title is proudly presented to
            </p>

            <div className="relative inline-block mb-10">
              <h3 className="text-5xl md:text-6xl font-black text-white print:text-gray-900 border-b-4 border-yellow-500/50 print:border-gray-800 pb-3 px-12 font-serif relative z-10">
                {studentData.name}
              </h3>
              <div className="absolute -inset-x-6 -inset-y-4 bg-yellow-500/10 blur-xl rounded-full print:hidden z-0"></div>
            </div>

            <p className="text-lg md:text-2xl text-slate-300 print:text-gray-700 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              For mastering the realms of learning! Earning <span className="font-black text-yellow-400 print:text-yellow-600 drop-shadow-md">{studentData.totalStars} Stars</span>, 
              unlocking <span className="font-black text-emerald-400 print:text-emerald-600 drop-shadow-md">{studentData.badges} Badges</span>, 
              and reaching <span className="font-black text-purple-400 print:text-purple-600 drop-shadow-md">{studentData.level}</span> 
              with an epic accuracy of <span className="font-black text-blue-400 print:text-blue-600 drop-shadow-md">{studentData.accuracy}%</span>. 
              The adventure continues!
            </p>

            {/* Signatures */}
            <div className="flex justify-between items-end mt-16 px-4 md:px-16 relative z-10">
              <div className="text-center w-48">
                <div className="border-b-2 border-slate-500 print:border-gray-800 pb-2 mb-2">
                  <span className="font-script text-4xl text-white print:text-gray-800 opacity-90">Admin</span>
                </div>
                <p className="text-sm font-black text-slate-500 print:text-gray-600 uppercase tracking-widest">Guild Master</p>
              </div>
              
              {/* Seal */}
              <div className="w-36 h-36 bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] border-[6px] border-dashed border-white/80 print:border-white transform rotate-12 mx-4 relative group">
                <div className="text-center text-white print:text-white drop-shadow-md">
                  <div className="font-black text-2xl leading-tight uppercase tracking-wider">247<br/>School</div>
                  <div className="text-xs font-bold opacity-90 mt-1 uppercase tracking-widest">Official</div>
                </div>
                {/* Ribbons */}
                <div className="absolute -bottom-6 -left-4 w-12 h-16 bg-red-500 -z-10 transform -rotate-12 rounded-b-md shadow-lg border-l-2 border-r-2 border-red-700"></div>
                <div className="absolute -bottom-6 -right-4 w-12 h-16 bg-red-500 -z-10 transform rotate-12 rounded-b-md shadow-lg border-l-2 border-r-2 border-red-700"></div>
              </div>

              <div className="text-center w-48">
                <div className="border-b-2 border-slate-500 print:border-gray-800 pb-2 mb-2">
                  <span className="text-xl font-bold text-white print:text-gray-800 tracking-wider">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
                <p className="text-sm font-black text-slate-500 print:text-gray-600 uppercase tracking-widest">Date Achieved</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important; 
          }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
