
import { BarChart, Star, Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-12 lg:py-16">
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
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 bg-clip-text text-transparent">
              Track Your Amazing Progress!
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
            See how much you've learned, celebrate your achievements, and discover what's next! 📈
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Student Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <Card className="border-0 playful-shadow bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Star className="w-10 h-10 text-yellow-500 mx-auto mb-3 animate-pulse" />
                    <div className="text-3xl font-extrabold text-purple-600">1,250</div>
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-1">Total Stars</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <Card className="border-0 playful-shadow bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-10 h-10 text-green-500 mx-auto mb-3 animate-bounce-gentle" />
                    <div className="text-3xl font-extrabold text-green-600">15</div>
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-1">Badges</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <Card className="border-0 playful-shadow bg-gradient-to-br from-orange-50 to-pink-50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-10 h-10 text-pink-500 mx-auto mb-3 animate-wiggle" />
                    <div className="text-3xl font-extrabold text-orange-600">45</div>
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-1">Hours</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <Card className="border-0 playful-shadow bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Target className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-pulse" />
                    <div className="text-3xl font-extrabold text-blue-600">89%</div>
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-1">Accuracy</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Subject Progress */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Card className="border-0 playful-shadow bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <BarChart className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-2xl font-bold">Subject Progress</span>
                    <span className="text-3xl animate-bounce-gentle">📚</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-lg flex items-center gap-2"><span>🔢</span> Math</span>
                      <span className="text-lg font-extrabold text-blue-600">85%</span>
                    </div>
                    <Progress value={85} className="h-4 bg-blue-100 [&>div]:bg-blue-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-lg flex items-center gap-2"><span>📖</span> English</span>
                      <span className="text-lg font-extrabold text-green-600">72%</span>
                    </div>
                    <Progress value={72} className="h-4 bg-green-100 [&>div]:bg-green-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-lg flex items-center gap-2"><span>🇧🇩</span> Bangla</span>
                      <span className="text-lg font-extrabold text-orange-500">90%</span>
                    </div>
                    <Progress value={90} className="h-4 bg-orange-100 [&>div]:bg-orange-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-lg flex items-center gap-2"><span>🔬</span> Science</span>
                      <span className="text-lg font-extrabold text-purple-600">67%</span>
                    </div>
                    <Progress value={67} className="h-4 bg-purple-100 [&>div]:bg-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Achievements & Goals */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Recent Achievements */}
            <Card className="border-0 playful-shadow bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold">Recent Achievements</span>
                  <span className="text-3xl animate-bounce-gentle">🎉</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">Math Master</div>
                    <div className="text-sm font-medium text-gray-600">Solved 50 problems!</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl">📚</div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">Bookworm</div>
                    <div className="text-sm font-medium text-gray-600">Read 25 stories!</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-4xl">⭐</div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">Star Collector</div>
                    <div className="text-sm font-medium text-gray-600">Earned 1000 stars!</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="border-0 playful-shadow bg-gradient-to-br from-orange-400 to-pink-500 text-white transform hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full blur-xl transform -translate-x-1/2 translate-y-1/2"></div>
                <div className="text-6xl mb-4 animate-bounce-gentle relative z-10">🔥</div>
                <div className="text-5xl font-extrabold mb-2 relative z-10 drop-shadow-md">7 Days</div>
                <div className="text-xl font-bold opacity-90 uppercase tracking-widest relative z-10">Learning Streak!</div>
                <div className="text-sm opacity-80 mt-3 font-medium relative z-10">Keep it up, superstar! 🌟</div>
              </CardContent>
            </Card>

            {/* Next Goal */}
            <Card className="border-0 playful-shadow bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold">Next Goal</span>
                  <span className="text-3xl animate-bounce-gentle">🎯</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-xl font-bold text-gray-800">Complete 10 Science Lessons</div>
                  <div className="text-5xl animate-float">🧪</div>
                  <div className="space-y-3 w-full">
                    <div className="flex justify-between text-base font-bold text-gray-700">
                      <span>Progress</span>
                      <span className="text-green-600">6/10</span>
                    </div>
                    <Progress value={60} className="h-3 bg-green-100 [&>div]:bg-green-500" />
                  </div>
                  <div className="text-base font-medium text-purple-600 bg-purple-50 inline-block px-4 py-2 rounded-full">Only 4 more to go! 🚀</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
