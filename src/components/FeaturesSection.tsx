
import { Trophy, Gamepad2, BarChart, Users, Volume2, Puzzle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';

const FeaturesSection = () => {
  const { t } = useLang();

  const features = [
    {
      icon: Gamepad2,
      title: t.featureGamesTitle,
      description: t.featureGamesDesc,
      color: 'from-eduplay-purple to-eduplay-blue',
      bgColor: 'bg-eduplay-purple/10',
      emoji: '🎮'
    },
    {
      icon: Trophy,
      title: t.featureRewardsTitle,
      description: t.featureRewardsDesc,
      color: 'from-eduplay-orange to-eduplay-yellow',
      bgColor: 'bg-eduplay-orange/10',
      emoji: '🏆'
    },
    {
      icon: BarChart,
      title: t.featureTrackTitle,
      description: t.featureTrackDesc,
      color: 'from-eduplay-green to-eduplay-blue',
      bgColor: 'bg-eduplay-green/10',
      emoji: '📊'
    },
    {
      icon: Volume2,
      title: t.featureAudioTitle,
      description: t.featureAudioDesc,
      color: 'from-eduplay-pink to-eduplay-purple',
      bgColor: 'bg-eduplay-pink/10',
      emoji: '🔊'
    },
    {
      icon: Puzzle,
      title: t.featureActivitiesTitle,
      description: t.featureActivitiesDesc,
      color: 'from-eduplay-blue to-eduplay-green',
      bgColor: 'bg-eduplay-blue/10',
      emoji: '🧩'
    },
    {
      icon: Users,
      title: t.featureParentTitle,
      description: t.featureParentDesc,
      color: 'from-eduplay-orange to-eduplay-pink',
      bgColor: 'bg-eduplay-orange/10',
      emoji: '👨‍👩‍👧‍👦'
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              {t.whyKidsLoveTitle}
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
            {t.whyKidsLoveDesc}
          </p>
        </motion.div>

        {/* Features Grid — 2-col mobile, 3-col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.4 }}
            >
              <Card className="border-0 playful-shadow bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group h-full">
                <CardContent className="p-4 sm:p-8 text-center space-y-3 sm:space-y-6 flex flex-col h-full">
                  <div className="relative mx-auto">
                    <div className={`inline-flex p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                      <feature.icon className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 text-xl sm:text-3xl animate-bounce-gentle">{feature.emoji}</div>
                  </div>

                  <h3 className="text-sm sm:text-2xl font-extrabold text-gray-800 leading-snug">{feature.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-lg leading-relaxed hidden sm:block">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Fun Fact Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-[3rem] p-10 lg:p-14 shadow-2xl max-w-5xl mx-auto border border-white/60 relative overflow-hidden">
            {/* Confetti background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-10 left-10 text-3xl animate-spin" style={{ animationDuration: '4s' }}>✨</div>
              <div className="absolute bottom-10 right-10 text-3xl animate-bounce">🎈</div>
              <div className="absolute top-20 right-20 text-4xl animate-pulse">🎉</div>
              <div className="absolute bottom-20 left-20 text-3xl animate-wiggle">🎊</div>
            </div>

            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-7xl lg:text-8xl mb-6 relative z-10 drop-shadow-lg">🎉</motion.div>
            <h3 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t.didYouKnow}
              </span>
            </h3>
            <p className="text-xl lg:text-2xl text-gray-700 mb-10 font-medium leading-relaxed max-w-3xl mx-auto relative z-10">
              {t.didYouKnowDesc}
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center relative z-10">
              {[
                { val: '3x',   label: t.moreEngagement, color: 'text-purple-600', border: 'border-purple-100' },
                { val: '85%',  label: t.betterRetention, color: 'text-green-600',  border: 'border-green-100'  },
                { val: '100%', label: t.funGuaranteed,   color: 'text-orange-500', border: 'border-orange-100' },
              ].map(({ val, label, color, border }) => (
                <motion.div key={val} whileHover={{ scale: 1.08 }} className={`bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-6 shadow-md border ${border} cursor-pointer`}>
                  <div className={`text-2xl sm:text-5xl font-extrabold ${color} mb-1`}>{val}</div>
                  <div className="text-[10px] sm:text-base font-bold text-gray-600 uppercase tracking-wide leading-tight">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
