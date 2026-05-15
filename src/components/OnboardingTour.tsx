import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TourStep {
  title: string;
  description: string;
  emoji: string;
  targetId?: string;
}

const tourSteps: TourStep[] = [
  {
    emoji: '🎉',
    title: 'Play Learn Grow-এ স্বাগতম!',
    description: 'এই সংক্ষিপ্ত ট্যুরে আমরা অ্যাপটির সেরা ফিচারগুলো দেখাবো।',
  },
  {
    emoji: '📚',
    title: 'ক্লাস বেছে নাও',
    description: 'তোমার শ্রেণি সিলেক্ট করো এবং সেই অনুযায়ী পাঠ্যক্রম দেখো।',
    targetId: 'class-selector',
  },
  {
    emoji: '🎮',
    title: 'মজার গেমস খেলো',
    description: 'গণিত, বিজ্ঞান, ভাষা — সব বিষয়ের মজাদার গেম এখানে! খেলে খেলে শেখো!',
    targetId: 'games-section',
  },
  {
    emoji: '📊',
    title: 'প্রগ্রেস ট্র্যাক করো',
    description: 'পয়েন্ট আয় করো, স্ট্রিক বাড়াও এবং Leaderboard-এ শীর্ষে উঠো!',
  },
  {
    emoji: '🏆',
    title: 'সার্টিফিকেট পাও',
    description: 'কোর্স সম্পন্ন করলে তোমার নামে সুন্দর সার্টিফিকেট পাবে!',
  },
  {
    emoji: '🚀',
    title: 'শুরু করো!',
    description: 'এখন শেখা শুরু করো এবং প্রতিদিন নতুন কিছু আবিষ্কার করো!',
  },
];

const OnboardingTour = () => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const key = `tour_done_${user.id}`;
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, [user]);

  // Highlight target element
  useEffect(() => {
    const currentStep = tourSteps[step];
    if (currentStep?.targetId) {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setTargetRect(el.getBoundingClientRect()), 500);
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (user) localStorage.setItem(`tour_done_${user.id}`, 'true');
  }, [user]);

  const next = () => {
    if (step < tourSteps.length - 1) setStep(s => s + 1);
    else dismiss();
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  if (!visible) return null;

  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;
  const progress = ((step + 1) / tourSteps.length) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Spotlight on target element */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'fixed',
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                zIndex: 9999,
                borderRadius: 16,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                border: '2px solid rgba(99,102,241,0.8)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Tour Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed z-[10000] bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1.5 bg-gray-100 dark:bg-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={dismiss}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Emoji + Step counter */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    key={`emoji-${step}`}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="text-4xl"
                  >
                    {current.emoji}
                  </motion.div>
                  <div className="flex gap-1.5 ml-auto">
                    {tourSteps.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: i === step ? 1.3 : 1 }}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          i <= step ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <motion.div
                  key={`content-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {current.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {current.description}
                  </p>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 mt-6">
                  {step > 0 && (
                    <button
                      onClick={prev}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      পেছনে
                    </button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={next}
                    className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
                      isLast
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {isLast ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        শুরু করো!
                      </>
                    ) : (
                      <>
                        পরবর্তী
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Skip */}
                {!isLast && (
                  <button
                    onClick={dismiss}
                    className="w-full mt-3 text-xs text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    বাদ দাও
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
