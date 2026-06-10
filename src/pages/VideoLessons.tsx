import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle2, Star, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { activityApi, contentsApi, videoHistoryApi, profilesApi } from '@/services/api';
import { toast } from 'sonner';
import { useStudentActivity } from '@/contexts/StudentActivityContext';

// Fallback videos if DB has none
const FALLBACK_VIDEOS = [
  { id: 'video-math-1',    title: 'Basic Addition for Kids',   url: 'https://www.youtube.com/embed/1F_45p1mY5k', subject: 'Math',    duration: '5:20', stars: 10, class: '1st' },
  { id: 'video-english-1', title: 'Learn English Alphabet',    url: 'https://www.youtube.com/embed/BELlZKpi1gs', subject: 'English', duration: '4:15', stars: 10, class: 'Nursery' },
  { id: 'video-science-1', title: 'Solar System Planets',      url: 'https://www.youtube.com/embed/libKVRa01L8', subject: 'Science', duration: '8:30', stars: 15, class: '1st' },
  { id: 'video-bangla-1',  title: 'বাংলা স্বরবর্ণ',           url: 'https://www.youtube.com/embed/R9K4lqN-0Zc', subject: 'Bangla',  duration: '6:10', stars: 10, class: 'Nursery' },
];

type Video = {
  id: string;
  title: string;
  url: string;
  subject: string;
  duration: string;
  stars: number;
  class?: string;
};

function mapContent(c: any): Video {
  return {
    id:       c._id || c.id,
    title:    c.title,
    url:      c.youtube_link || c.url || '',
    subject:  c.subject || '',
    duration: c.duration || '—',
    stars:    c.stars ?? 10,
    class:    c.class || '',
  };
}

function matchClass(videoClass: string, studentGradeId: number): boolean {
  if (!videoClass) return false;
  const vClass = videoClass.toLowerCase().trim();
  
  if (studentGradeId === 1) {
    return vClass === 'nursery';
  }
  if (studentGradeId === 2) {
    return vClass === '1st' || vClass === 'grade 1';
  }
  if (studentGradeId === 3) {
    return vClass === '2nd' || vClass === 'grade 2';
  }
  if (studentGradeId === 4) {
    return vClass === '3rd' || vClass === 'grade 3';
  }
  if (studentGradeId === 5) {
    return vClass === '4th' || vClass === 'grade 4';
  }
  if (studentGradeId === 6) {
    return vClass === '5th' || vClass === 'grade 5';
  }
  return false;
}

export default function VideoLessons() {
  const { user } = useAuth();
  const { refreshStats } = useStudentActivity();

  const [videos,        setVideos]        = useState<Video[]>([]);
  const [activeVideo,   setActiveVideo]   = useState<Video | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);

  // ── Load videos from DB (contents collection) ──
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let studentGradeId: number | null = null;

        // 1. Get class/grade_id from URL query params
        const params = new URLSearchParams(window.location.search);
        const urlClass = params.get('class')?.toLowerCase().trim();
        const urlGradeId = params.get('grade_id');

        if (urlGradeId) {
          studentGradeId = parseInt(urlGradeId);
        } else if (urlClass) {
          if (urlClass === 'nursery') studentGradeId = 1;
          else if (urlClass === '1st' || urlClass === 'grade 1' || urlClass === 'class 1' || urlClass === '1') studentGradeId = 2;
          else if (urlClass === '2nd' || urlClass === 'grade 2' || urlClass === 'class 2' || urlClass === '2') studentGradeId = 3;
          else if (urlClass === '3rd' || urlClass === 'grade 3' || urlClass === 'class 3' || urlClass === '3') studentGradeId = 4;
          else if (urlClass === '4th' || urlClass === 'grade 4' || urlClass === 'class 4' || urlClass === '4') studentGradeId = 5;
          else if (urlClass === '5th' || urlClass === 'grade 5' || urlClass === 'class 5' || urlClass === '5') studentGradeId = 6;
        }

        // 2. If not in URL, and student is logged in, fetch from profile
        if (!studentGradeId && user?.id) {
          try {
            const profileData = await profilesApi.get(user.id);
            if (profileData && profileData.grade_id) {
              studentGradeId = profileData.grade_id;
            }
          } catch (profileErr) {
            console.error('Failed to fetch profile in VideoLessons:', profileErr);
          }
        }

        // 3. Fetch all videos
        const all = await contentsApi.getAll();
        let vids = all
          .filter((c: any) => c.content_type === 'video' && c.is_published !== false)
          .map(mapContent);

        // 4. Apply class filter if we determined a grade ID
        if (studentGradeId) {
          const matchedVids = vids.filter((v: any) => v.class && matchClass(v.class, studentGradeId!));
          // If we have matching videos for the student's class, filter to them
          if (matchedVids.length > 0) {
            vids = matchedVids;
          }
        }

        if (vids.length > 0) {
          setVideos(vids);
          setActiveVideo(vids[0]);
        } else {
          setVideos(FALLBACK_VIDEOS);
          setActiveVideo(FALLBACK_VIDEOS[0]);
        }
      } catch {
        setVideos(FALLBACK_VIDEOS);
        setActiveVideo(FALLBACK_VIDEOS[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [user]);

  // ── Load watch history: DB first, localStorage fallback ──
  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.id) {
        // Guest: use localStorage
        const saved = localStorage.getItem('watched_videos_guest');
        if (saved) setWatchedVideos(JSON.parse(saved));
        return;
      }
      try {
        const data = await videoHistoryApi.getWatched(user.id);
        setWatchedVideos(data.watched || []);
      } catch {
        // Offline fallback
        const saved = localStorage.getItem('watched_videos_' + user.id);
        if (saved) setWatchedVideos(JSON.parse(saved));
      }
    };
    loadHistory();
  }, [user]);

  // ── Mark video as watched ──
  const handleMarkWatched = async () => {
    if (!activeVideo) return;
    if (!user?.id) { toast.error('Please login first'); return; }
    if (watchedVideos.includes(activeVideo.id)) {
      toast.info('You already watched this video!');
      return;
    }

    try {
      setSubmitting(true);

      // Track activity in DB
      await activityApi.track({
        student_id:    user.id,
        subject:       activeVideo.subject,
        activity_type: 'video_watched',
        score:         100,
        stars_earned:  activeVideo.stars,
        time_spent:    parseInt(activeVideo.duration) || 5,
      });

      await refreshStats().catch(() => {});

      // Save to video history DB + localStorage mirror
      await videoHistoryApi.markWatched(user.id, activeVideo.id);

      const newWatched = [...watchedVideos, activeVideo.id];
      setWatchedVideos(newWatched);
      localStorage.setItem('watched_videos_' + user.id, JSON.stringify(newWatched));

      toast.success(`Great job! You earned ${activeVideo.stars} stars! 🌟`);
    } catch {
      // Save at least to localStorage if DB fails
      const newWatched = [...watchedVideos, activeVideo.id];
      setWatchedVideos(newWatched);
      localStorage.setItem('watched_videos_' + (user?.id || 'guest'), JSON.stringify(newWatched));
      toast.success(`Marked as watched! +${activeVideo.stars} ⭐`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <RefreshCw className="w-10 h-10 animate-spin text-eduplay-purple" />
      </div>
    );
  }

  if (!activeVideo) return null;

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
            Watched: {watchedVideos.length} / {videos.length}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-eduplay-purple/20 shadow-xl">
              <div className="aspect-video bg-black relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={activeVideo.url}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
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
                  <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-lg text-yellow-700 dark:text-yellow-500 font-bold shrink-0">
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
                      {submitting
                        ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                        : <><CheckCircle2 className="w-5 h-5 mr-2" /> Mark as Watched</>
                      }
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">
              Up Next ({videos.length})
            </h3>
            <div className="space-y-3">
              {videos.map(video => {
                const isWatching = activeVideo.id === video.id;
                const isWatched  = watchedVideos.includes(video.id);
                return (
                  <Card
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`cursor-pointer transition-all hover:scale-[1.02] ${
                      isWatching
                        ? 'border-2 border-eduplay-blue shadow-md'
                        : 'border border-gray-200 dark:border-slate-800'
                    }`}
                  >
                    <CardContent className="p-3 flex gap-3">
                      <div className="w-24 h-16 bg-gray-200 dark:bg-slate-800 rounded-lg relative flex items-center justify-center overflow-hidden shrink-0">
                        <Play className={`w-8 h-8 ${isWatching ? 'text-eduplay-blue' : 'text-gray-400'}`} />
                        {isWatched && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm line-clamp-2 ${isWatching ? 'text-eduplay-blue' : 'text-gray-700 dark:text-gray-300'}`}>
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">{video.subject}</span>
                          <span>{video.duration}</span>
                          {isWatched && <span className="text-green-500 font-bold">✓ Done</span>}
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
