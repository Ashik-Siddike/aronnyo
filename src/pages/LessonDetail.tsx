
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, Play, Pause, CheckCircle, Star, RefreshCw } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AudioService } from '@/services/audioService';
import { lessons } from '@/lib/lessons';
import NotFound from './NotFound';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { staticContents, mockDelay } from '@/data/staticData';

const LessonDetail = () => {
  const { subject, id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(new Date());
  const audioService = AudioService.getInstance();
  const { trackLessonStart, trackLessonComplete } = useLessonProgress();
  const { user } = useAuth();
  const [dbContent, setDbContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const lessonContent = lessons[subject as keyof typeof lessons]?.[Number(id)];

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        await mockDelay(200);
        
        // Check if it's a UUID (from database) or numeric ID (from static lessons)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUUID) {
          // Find in static contents
          const content = staticContents.find(c => c.id === id);
          if (content) {
            setDbContent(content);
            if (user && subject && content.title) {
              trackLessonStart(subject.charAt(0).toUpperCase() + subject.slice(1), content.title);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, user, subject, trackLessonStart]);

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, [audioService]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-eduplay-blue" />
      </div>
    );
  }

  if (!lessonContent && !dbContent) {
    return <NotFound />;
  }

  const handlePlayAudio = async () => {
    if (!lessonContent) return;

    const currentAudio = lessonContent.slides[currentSlide].audio;
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      try {
        await audioService.playText(currentAudio);
        setIsPlaying(false);
      } catch (error) {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleNext = () => {
    if (!lessonContent) return;

    audioService.stop();
    setIsPlaying(false);

    if (currentSlide < lessonContent.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (!lessonContent) return;

    audioService.stop();
    setIsPlaying(false);

    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = async () => {
    if (!lessonContent) return;

    try {
      const key = `plg_completed:${subject}`;
      const raw = localStorage.getItem(key);
      const completedIds: string[] = raw ? JSON.parse(raw) : [];
      const idStr = String(id);
      if (!completedIds.includes(idStr)) {
        completedIds.push(idStr);
        localStorage.setItem(key, JSON.stringify(completedIds));
      }
    } catch (e) {
      console.warn('Failed to persist lesson completion', e);
    }

    if (user && subject && lessonContent.title) {
      const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));

      await trackLessonComplete(
        subject.charAt(0).toUpperCase() + subject.slice(1),
        lessonContent.title,
        {
          difficulty: lessonContent.difficulty || 'medium',
          slides_completed: lessonContent.slides.length,
          lesson_id: id
        }
      );
    }

    navigate(`/quiz/${subject}/${id}`);
  };

  const progress = lessonContent ? ((currentSlide + 1) / lessonContent.slides.length) * 100 : 0;
  const contentTitle = dbContent?.title || lessonContent?.title || 'Lesson';
  const contentDescription = dbContent?.description || '';

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';

    let videoId = null;

    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0];
    }

    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
      : url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-eduplay-blue to-eduplay-purple text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to={`/lessons/nursery-${subject}`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lessons
              </Button>
            </Link>

            {lessonContent && (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  Slide {currentSlide + 1} of {lessonContent.slides.length}
                </div>
                <div className="w-32">
                  <Progress value={progress} className="h-2 bg-white/20" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-4 py-8">
        {dbContent ? (
          <Card className="max-w-4xl mx-auto border-0 playful-shadow">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {contentTitle}
                  </h2>
                  {contentDescription && (
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
                      {contentDescription}
                    </p>
                  )}
                </div>

                {dbContent.youtube_link && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(dbContent.youtube_link)}
                      title={contentTitle}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {dbContent.file_url && dbContent.content_type?.toLowerCase() === 'pdf' && (
                  <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg border">
                    <iframe src={dbContent.file_url} title="PDF content" className="w-full h-full" />
                  </div>
                )}

                {dbContent.content_data?.pages && Array.isArray(dbContent.content_data.pages) && (
                  <div className="space-y-4">
                    {dbContent.content_data.pages.map((page: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 border shadow-sm">
                        {page.title && <h3 className="text-xl font-bold mb-3">{page.title}</h3>}
                        {page.description && <p className="text-gray-700 whitespace-pre-wrap">{page.description}</p>}
                        {page.youtube_link && (
                          <div className="aspect-video w-full rounded-lg overflow-hidden mt-4">
                            <iframe
                              src={getYouTubeEmbedUrl(page.youtube_link)}
                              title={page.title || 'Video'}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 pt-6">
                  <Link to={`/quiz/${subject}/${id}`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-eduplay-green to-eduplay-blue text-lg px-8 py-3"
                    >
                      Take Quiz Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to={`/lessons/nursery-${subject}`}>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                      Back to Lessons
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !completed ? (
          <Card className="max-w-4xl mx-auto border-0 playful-shadow">
            <CardContent className="p-8">
              <div className="text-center space-y-8">
                <div className="text-8xl mb-6">
                  {lessonContent.slides[currentSlide].image}
                </div>

                <h2 className="text-3xl font-bold text-gray-800">
                  {lessonContent.slides[currentSlide].title}
                </h2>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {lessonContent.slides[currentSlide].content}
                </p>

                {/* Audio Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handlePlayAudio}
                    className="bg-gradient-to-r from-eduplay-orange to-eduplay-pink text-lg px-6 py-3"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'} Audio
                  </Button>
                  <Button variant="outline" onClick={handlePlayAudio} className="text-lg px-6 py-3">
                    <Volume2 className="w-5 h-5 mr-2" />
                    Listen Again
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                    variant="outline"
                    size="lg"
                    className="text-lg px-6 py-3"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-eduplay-blue to-eduplay-purple text-lg px-6 py-3"
                  >
                    {currentSlide === lessonContent.slides.length - 1 ? 'Finish Lesson' : 'Next'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Completion Screen
          <Card className="max-w-2xl mx-auto border-0 playful-shadow">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-8xl">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800">Lesson Complete!</h2>
              <p className="text-xl text-gray-600">
                Amazing work! You've successfully completed this lesson.
              </p>
              
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-semibold text-green-600">+3 Stars Earned!</span>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="bg-gradient-to-r from-eduplay-green to-eduplay-blue text-lg px-8 py-3"
                >
                  Take Quiz Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div>
                  <Link to={`/lessons/nursery-${subject}`}>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                      Back to Lessons
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
