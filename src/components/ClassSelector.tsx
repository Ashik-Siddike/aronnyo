
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const standards = [
  { value: '1st', label: '১ম',  age: '৬-৭ বছর',   gradient: 'from-red-400 to-pink-500',     shadow: 'shadow-red-300/50',    emoji: '🌟' },
  { value: '2nd', label: '২য়',  age: '৭-৮ বছর',   gradient: 'from-orange-400 to-yellow-500', shadow: 'shadow-orange-300/50', emoji: '🎨' },
  { value: '3rd', label: '৩য়',  age: '৮-৯ বছর',   gradient: 'from-yellow-400 to-amber-500',  shadow: 'shadow-yellow-300/50', emoji: '🚀' },
  { value: '4th', label: '৪র্থ', age: '৯-১০ বছর',  gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-300/50',  emoji: '📚' },
  { value: '5th', label: '৫ম',  age: '১০-১১ বছর', gradient: 'from-blue-400 to-indigo-500',   shadow: 'shadow-blue-300/50',   emoji: '🔬' },
];

const ClassSelector = () => {
  const navigate = useNavigate();

  const handleGradeSelect = (gradeValue: string) => {
    navigate(`/class/${gradeValue}`);
  };

  return (
    <section id="class-selector" className="py-12 lg:py-28 bg-gradient-to-b from-white via-purple-50/40 to-blue-50/50 relative overflow-hidden">
      {/* decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-6 text-4xl animate-float opacity-20">✨</div>
        <div className="absolute top-28 right-10 text-4xl animate-bounce-gentle opacity-25">🌟</div>
        <div className="absolute bottom-16 left-10 text-3xl animate-wiggle opacity-20">🎨</div>
        <div className="absolute bottom-10 right-14 text-4xl animate-pulse opacity-15">🚀</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-4 border border-purple-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-purple-700 font-bold text-xs sm:text-sm uppercase tracking-wider">
              Start Your Learning Adventure
            </span>
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-gray-800 mb-3 leading-tight">
            তোমার{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              শ্রেণি বেছে নাও
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto font-medium">
            তোমার ক্লাস সিলেক্ট করো — তোমার জন্য তৈরি পাঠ্যক্রম পাবে! 🌟
          </p>
        </motion.div>

        {/* ── Mobile: horizontal scroll  |  Desktop: 5-col grid ── */}
        <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
          {standards.map((standard, index) => (
            <motion.button
              key={standard.value}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleGradeSelect(standard.value)}
              className="snap-start flex-shrink-0 w-36 flex flex-col items-center"
            >
              <div className={`w-full aspect-square bg-gradient-to-br ${standard.gradient} rounded-2xl flex flex-col items-center justify-center shadow-lg ${standard.shadow} relative overflow-hidden`}>
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl" />
                <span className="text-4xl mb-1 drop-shadow">{standard.emoji}</span>
                <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow">
                  <GraduationCap className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="mt-2.5 text-center">
                <div className="font-extrabold text-gray-800 text-sm">Grade {standard.label}</div>
                <div className="text-xs text-gray-500">{standard.age}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-5 gap-8 max-w-5xl mx-auto mb-16">
          {standards.map((standard, index) => (
            <motion.button
              key={standard.value}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleGradeSelect(standard.value)}
              className="group flex flex-col items-center gap-3"
            >
              <div className={`w-full aspect-square bg-gradient-to-br ${standard.gradient} rounded-3xl flex flex-col items-center justify-center shadow-xl ${standard.shadow} relative overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="text-5xl mb-2">{standard.emoji}</span>
                <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center shadow-md">
                  <GraduationCap className="w-7 h-7 text-gray-700 group-hover:text-purple-600 transition-colors" />
                </div>
              </div>
              <div className="text-center">
                <div className="font-extrabold text-gray-800 text-lg">Grade {standard.label}</div>
                <div className="text-sm text-gray-500">{standard.age}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* CTA Card — mobile compact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 lg:mt-0"
        >
          <div className="bg-gradient-to-br from-white via-purple-50/90 to-blue-50/90 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl max-w-4xl mx-auto border border-white/60 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex mb-4"
            >
              <div className="w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
              </div>
            </motion.div>

            <h3 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-gray-800 mb-3 leading-tight">
              শেখার যাত্রা শুরু করতে{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                প্রস্তুত?
              </span>
            </h3>
            <p className="text-sm sm:text-lg text-gray-500 mb-6 max-w-xl mx-auto">
              উপরে যেকোনো ক্লাস বেছে নাও এবং তোমার পাঠ্যক্রম দেখো! 🎯
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {[
                { icon: '✨', label: 'ইন্টারঅ্যাক্টিভ' },
                { icon: '🎮', label: 'মজাদার' },
                { icon: '📈', label: 'প্রগ্রেস' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 bg-white/70 p-3 rounded-2xl shadow-sm">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-bold text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClassSelector;
