import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle2, Star, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { activityApi } from '@/services/api';
import { toast } from 'sonner';

// Sample video database
const videoDatabase = [
  { id: 'v1', title: 'Basic Addition for Kids', url: 'https://www.youtube.com/embed/8hz0LAmGGgY', subject: 'Math', duration: '5:20', stars: 10 },
  { id: 'v2', title: 'Learn English Alphabet', url: 'https://www.youtube.com/embed/ccGQcs0bIfE', subject: 'English', duration: '4:15', stars: 10 },
  { id: 'v3', title: 'Solar System Planets', url: 'https://www.youtube.com/embed/Qd6nLM2QlWw', subject: 'Science', duration: '8:30', stars: 15 },
  { id: 'v4', title: 'Bangla Sorborno (স্বরবর্ণ)', url: 'https://www.youtube.com/embed/O-A6hM9Z4Sg', subject: 'Bangla', duration: '6:10', stars: 10 },
];

export default function VideoLessons() {
  const { user } = useAuth();
  const [activeVideo, setActiveVideo] = useState(videoDatabase[0]);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load from local storage or API for now we use simple state + local storage
  useEffect(() => {
    const saved = localStorage.getItem('watched_videos_' + user?.id);
    if (saved) {
      setWatchedVideos(JSON.parse(saved));
    }
  }, [user]);

  const handleMarkWatched = async () => {
    if (!user?.id) {
      toast.error('Please login first');
      return;
    }
    if (watchedVideos.includes(activeVideo.id)) {
      toast.info('You have already watched this video!');
      return;
    }

    try {
      setSubmitting(true);
      
      // Save to activity
      await activityApi.track({
        student_id: user.id,
        subject: activeVideo.subject,
        activity_type: 'video_watched',
        score: 100,
        stars_earned: activeVideo.stars,
        time_spent: parseInt(activeVideo.duration) || 5
      });

      // Update state
      const newWatched = [...watchedVideos, activeVideo.id];
      setWatchedVideos(newWatched);
      localStorage.setItem('watched_videos_' + user.id, JSON.stringify(newWatched));
      
      toast.success(`Great job! You earned ${activeVideo.stars} stars! 🌟`);
    } catch (err) {
      toast.error('Failed to update progress');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12">
      {/* Header */}
      <div className="bg-eduplay-purple text-white py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Play className="w-6 h-6 fill-white" /> Video Lessons
            </h1>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 font-bold">
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            Watched: {watchedVideos.length} / {videoDatabase.length}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-eduplay-purple/20 shadow-xl">
              <div className="aspect-video bg-black relative">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={activeVideo.url} 
                  title={activeVideo.title} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-eduplay-purple uppercase tracking-wider mb-1 block">
                      {activeVideo.subject}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {activeVideo.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-lg text-yellow-700 dark:text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> +{activeVideo.stars}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
                    <Clock className="w-5 h-5" /> Duration: {activeVideo.duration}
                  </div>
                  
                  {watchedVideos.includes(activeVideo.id) ? (
                    <Button disabled variant="outline" className="border-green-500 text-green-600 bg-green-50 font-bold">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleMarkWatched} 
                      disabled={submitting}
                      className="bg-eduplay-green hover:bg-green-600 text-white font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Mark as Watched
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">Up Next</h3>
            
            <div className="space-y-3">
              {videoDatabase.map(video => {
                const isWatching = activeVideo.id === video.id;
                const isWatched = watchedVideos.includes(video.id);
                
                return (
                  <Card 
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`cursor-pointer transition-all hover:scale-[1.02] ${isWatching ? 'border-2 border-eduplay-blue shadow-md' : 'border border-gray-200 dark:border-slate-800'}`}
                  >
                    <CardContent className="p-3 flex gap-3">
                      <div className="w-24 h-16 bg-gray-200 dark:bg-slate-800 rounded-lg relative flex items-center justify-center overflow-hidden">
                        <Play className={`w-8 h-8 ${isWatching ? 'text-eduplay-blue' : 'text-gray-400'}`} />
                        {isWatched && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm line-clamp-2 ${isWatching ? 'text-eduplay-blue' : 'text-gray-700 dark:text-gray-300'}`}>
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">{video.subject}</span>
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
