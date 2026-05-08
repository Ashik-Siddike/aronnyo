import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dailyChallengeApi } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, CheckCircle2, Target, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function DailyChallenge() {
  const { user } = useAuth();
  const [challengeData, setChallengeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const data = await dailyChallengeApi.getToday(user.id);
        setChallengeData(data);
      }
    } catch (err) {
      console.error('Failed to load daily challenge', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [user]);

  const handleComplete = async () => {
    if (!user?.id || !challengeData?.challenge) return;
    try {
      setCompleting(true);
      const res = await dailyChallengeApi.complete(user.id, challengeData.challenge.id, challengeData.challenge.rewardStars);
      if (res.success) {
        toast.success(`অসাধারণ! তুমি ${res.rewardStars} স্টার জিতেছ! 🌟`);
        // Refresh to show completed state
        fetchChallenge();
      }
    } catch (err) {
      toast.error('দুঃখিত, কিছু সমস্যা হয়েছে।');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse bg-gray-100 dark:bg-slate-800 border-0 h-40">
        <CardContent className="h-full flex items-center justify-center">
          <Target className="w-8 h-8 text-gray-300 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!challengeData || !challengeData.challenge) return null;

  const { challenge, isCompleted } = challengeData;

  return (
    <Card className={`border-2 overflow-hidden transition-all duration-500 relative ${isCompleted ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-eduplay-orange bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-900/30'}`}>
      
      {/* Decorative background circle */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"></div>

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl flex-shrink-0 ${isCompleted ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' : 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300'}`}>
              {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Daily Challenge</span>
                {!isCompleted && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{challenge.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl backdrop-blur-sm min-w-[120px]">
            <div className="flex items-center gap-1 font-bold text-lg mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>+{challenge.rewardStars}</span>
            </div>
            {isCompleted ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 w-full justify-center py-1">
                সম্পন্ন! 🎉
              </Badge>
            ) : (
              <Button 
                onClick={handleComplete} 
                disabled={completing}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                {completing ? 'অপেক্ষা...' : 'শুরু করো'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper badge component for within this file
const Badge = ({ children, className }: any) => (
  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);
