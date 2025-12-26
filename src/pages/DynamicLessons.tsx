import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Play, Star, Trophy, Clock, BookOpen, RefreshCw } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useContent } from '@/hooks/useContent';

const DynamicLessons = () => {
  const { subject } = useParams<{ subject: string }>();
  const { grades, subjects, contents, loading, error, loadData } = useContent();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [previewLessonId, setPreviewLessonId] = useState<string | null>(null);
  const location = useLocation();
  const topRef = useRef<HTMLDivElement | null>(null);
  const hasClassParam = useMemo(() => new URLSearchParams(location.search).has('class'), [location.search]);

  const extractGradeNumber = (value: string | null | undefined): number | null => {
    if (!value) return null;
    const match = String(value).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  useEffect(() => {
    if (!grades.length) return;
    const params = new URLSearchParams(location.search);
    const classParam = params.get('class');
    if (classParam) {
      const wantedNum = extractGradeNumber(classParam);
      const grade = grades.find(g => extractGradeNumber(g.name) === wantedNum);
      if (grade) {
        setSelectedGrade(grade.id);
        return;
      }
    }
    if (subject) {
      try {
        const key = `plg_last_grade:${subject.toLowerCase()}`;
        const raw = localStorage.getItem(key);
        const savedId = raw ? parseInt(raw, 10) : NaN;
        if (!Number.isNaN(savedId) && grades.some(g => g.id === savedId)) {
          setSelectedGrade(savedId);
        }
      } catch {}
    }
  }, [location.search, grades, subject]);

  const currentSubject = useMemo(() => {
    if (!selectedGrade) return null;
    const subjectsInGrade = subjects.filter(s => s.grade_id === selectedGrade);
    const paramSubject = subject?.toLowerCase() || '';
    return subjectsInGrade.find(s => s.name.toLowerCase() === paramSubject);
  }, [selectedGrade, subjects, subject]);

  const currentContents = useMemo(() => {
    if (!selectedGrade || !currentSubject) {
      return [];
    }
    const filtered = contents.filter(c => 
      c.grade_id === selectedGrade && c.subject_id === currentSubject.id
    );
    return filtered.sort((a: any, b: any) => {
      const ao = a.lesson_order ?? 9999;
      const bo = b.lesson_order ?? 9999;
      if (ao !== bo) return ao - bo;
      return (new Date(a.created_at || 0).getTime()) - (new Date(b.created_at || 0).getTime());
    });
  }, [contents, selectedGrade, currentSubject]);

  useEffect(() => {
    if (subject && selectedGrade) {
      try {
        localStorage.setItem(`plg_last_grade:${subject.toLowerCase()}`, String(selectedGrade));
      } catch {}
    }
  }, [subject, selectedGrade]);

  const completedIds = useMemo(() => {
    try {
      const key = `plg_completed:${subject}`;
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [] as string[];
    }
  }, [subject]);

  const completedLessons = currentContents.filter(lesson => lesson.is_published).length;
  const totalStars = currentContents.length * 3;

  const getSubjectEmoji = (subjectName: string) => {
    const name = subjectName.toLowerCase();
    if (name.includes('math')) return '🔢';
    if (name.includes('english')) return '📖';
    if (name.includes('science')) return '🔬';
    if (name.includes('bangla')) return '🇧🇩';
    if (name.includes('social')) return '🌍';
    return '📚';
  };

  const getDifficultyColor = (index: number) => {
    if (index < 3) return 'Easy';
    if (index < 6) return 'Medium';
    return 'Hard';
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'secondary';
      case 'Medium': return 'outline';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-eduplay-blue" />
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div ref={topRef} />
      <div className="bg-gradient-to-r from-eduplay-blue via-purple-600 to-eduplay-purple text-white py-12 animate-fade-in shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/30 transition-all hover:scale-105 backdrop-blur-sm border border-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-7xl animate-bounce-gentle drop-shadow-2xl">
                  {getSubjectEmoji(subject || '')}
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3 animate-slide-in-right drop-shadow-lg">
                    {subject?.charAt(0).toUpperCase() + subject?.slice(1)} Adventures
                  </h1>
                  <p className="text-xl opacity-95 animate-fade-in delay-150 font-medium">
                    Learn and explore with fun lessons!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/25 backdrop-blur-md rounded-3xl p-8 animate-scale-in shadow-2xl border border-white/30 min-w-[200px]">
              <div className="text-4xl font-bold mb-2">{completedLessons}/{currentContents.length}</div>
              <div className="text-sm opacity-95 mb-4 font-medium">Lessons Available</div>
              <div className="flex items-center justify-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-lg" />
                <span className="font-bold text-lg">{totalStars} Stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!hasClassParam && !selectedGrade && (
          <Card className="mb-8 border-0 shadow-xl animate-fade-in bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl">
                <div className="bg-gradient-to-br from-eduplay-blue to-eduplay-purple p-3 rounded-xl mr-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Select Your Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {grades.map((grade) => (
                  <Button
                    key={grade.id}
                    variant={selectedGrade === grade.id ? "default" : "outline"}
                    onClick={() => setSelectedGrade(grade.id)}
                    className={`h-20 text-lg font-semibold transition-all duration-300 rounded-xl ${
                      selectedGrade === grade.id
                        ? 'bg-gradient-to-r from-eduplay-blue to-eduplay-purple shadow-lg scale-105'
                        : 'hover:scale-105 hover:shadow-md border-2'
                    }`}
                  >
                    {grade.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedGrade && (
          <>
            {previewLessonId && (
              <Card className="mb-8 border-0 shadow-2xl animate-fade-in bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
                <CardHeader className="pb-4">
                  {(() => {
                    const lesson = currentContents.find(l => String(l.id) === String(previewLessonId));
                    if (!lesson) return null;
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="text-5xl">{getSubjectEmoji(lesson.title)}</div>
                          <div className="flex-1">
                            <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-eduplay-blue to-eduplay-purple bg-clip-text text-transparent">
                              {lesson.title}
                            </CardTitle>
                            <p className="text-gray-700 text-lg">{lesson.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardHeader>
                <CardContent className="pt-0 space-y-6">
                  {(() => {
                    const lesson = currentContents.find(l => String(l.id) === String(previewLessonId));
                    if (!lesson) return null;
                    if (lesson.youtube_link) {
                      let videoId = null;
                      const url = lesson.youtube_link;

                      if (url.includes('youtube.com/watch')) {
                        const urlParams = new URLSearchParams(url.split('?')[1]);
                        videoId = urlParams.get('v');
                      } else if (url.includes('youtu.be/')) {
                        videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
                      } else if (url.includes('youtube.com/embed/')) {
                        videoId = url.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0];
                      }

                      const embedUrl = videoId
                        ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
                        : url;

                      return (
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow">
                          <iframe
                            src={embedUrl}
                            title="YouTube video"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      );
                    }
                    if (lesson.file_url && lesson.content_type?.toLowerCase() === 'pdf') {
                      return (
                        <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow border">
                          <iframe src={lesson.file_url} title="PDF preview" className="w-full h-full" />
                        </div>
                      );
                    }
                    if (lesson.content_type?.toLowerCase() === 'text') {
                      return (
                        <div className="bg-white rounded-xl p-6 border">
                          <p className="text-gray-700 whitespace-pre-wrap">{(lesson as any).pages?.text || lesson.description}</p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link to={`/lesson/${subject}/${previewLessonId}`}>
                      <Button className="bg-gradient-to-r from-eduplay-blue via-blue-600 to-eduplay-purple hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-base px-8 py-6 rounded-xl font-semibold">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Open Full Lesson
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setPreviewLessonId(null)}
                      className="border-2 hover:bg-gray-100 transition-all duration-300 text-base px-8 py-6 rounded-xl font-medium"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Close Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="mb-8 border-0 shadow-lg animate-fade-in bg-gradient-to-r from-white to-blue-50/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-eduplay-blue to-eduplay-purple p-3 rounded-xl">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Your Progress</h3>
                  </div>
                  <Badge className="bg-gradient-to-r from-eduplay-green to-green-600 text-white animate-scale-in px-4 py-2 text-base shadow-md">
                    {currentContents.length > 0 ? Math.round((completedLessons / currentContents.length) * 100) : 0}% Complete
                  </Badge>
                </div>
                <Progress
                  value={currentContents.length > 0 ? (completedLessons / currentContents.length) * 100 : 0}
                  className="h-4 shadow-inner"
                />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentContents.map((lesson, index) => {
                const isCompleted = completedIds.includes(String(lesson.id));
                return (
                <Card
                  key={lesson.id}
                  className="border-0 shadow-lg transition-all duration-300 group animate-fade-in overflow-hidden hover:shadow-2xl hover:scale-[1.03] bg-gradient-to-br from-white to-blue-50/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                <CardHeader className="pb-4 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-eduplay-blue/10 to-eduplay-purple/10 rounded-full blur-3xl -z-10"></div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-5xl mb-2 group-hover:animate-bounce drop-shadow-lg">
                        {getSubjectEmoji(lesson.title)}
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full shadow-sm">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 transition-all ${i < 2 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-eduplay-blue transition-colors mb-2">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{lesson.description || 'Interactive lesson content'}</p>

                    <div className="flex items-center flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs font-medium shadow-sm">
                        {lesson.content_type === 'interactive' && '🎮 Interactive'}
                        {lesson.content_type === 'video' && '🎥 Video'}
                        {lesson.content_type === 'pdf' && '📄 PDF'}
                        {lesson.content_type === 'quiz' && '❓ Quiz'}
                        {!lesson.content_type && '📚 Lesson'}
                      </Badge>
                      {lesson.is_published === false && (
                        <Badge variant="secondary" className="text-xs bg-gray-200">
                          Draft
                        </Badge>
                      )}
                    </div>
                </CardHeader>
                  
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-5 text-sm bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-gray-700 font-medium">
                        <Clock className="w-4 h-4 mr-2 text-eduplay-blue" />
                        {lesson.lesson_order || 1} min
                      </div>
                      <Badge variant={getDifficultyVariant(getDifficultyColor(index))} className="shadow-sm font-semibold">
                        {getDifficultyColor(index)}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setPreviewLessonId(String(lesson.id));
                          setTimeout(() => {
                            if (topRef.current) {
                              topRef.current.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }, 0);
                        }}
                        className="w-full bg-gradient-to-r from-eduplay-blue via-blue-600 to-eduplay-purple hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 rounded-xl font-semibold text-base py-6"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                      </Button>
                      <Link to={`/lesson/${subject}/${lesson.id}`} className="block">
                        <Button variant="outline" className="w-full hover:bg-gradient-to-r hover:from-eduplay-blue/10 hover:to-purple-100 transition-all duration-300 rounded-xl border-2 font-medium py-5">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Open Full Lesson
                        </Button>
                      </Link>
                      <Link to={`/quiz/${subject}/${lesson.id}`} className="block">
                        <Button variant="outline" className="w-full hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 rounded-xl border-2 font-medium py-5">
                          <Trophy className="w-4 h-4 mr-2" />
                          Take Quiz
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );})}
            </div>

            {currentContents.length === 0 && (
              <Card className="border-0 shadow-xl animate-fade-in bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
                <CardContent className="p-16 text-center">
                  <div className="bg-gradient-to-br from-eduplay-blue/10 to-eduplay-purple/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-20 h-20 text-eduplay-blue" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">No Lessons Available</h3>
                  <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">
                    No lessons have been created for this subject and grade yet.
                  </p>
                  <p className="text-sm text-gray-500 bg-white/60 px-6 py-3 rounded-full inline-block">
                    Check back later or contact your teacher for more content
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicLessons;
