import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, BookOpen, Beaker, Globe, ArrowRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useState, useEffect } from 'react';

const ClassSelection = () => {
  const { standard } = useParams();
  const navigate = useNavigate();
  const { grades, subjects, contents, loading, error, loadData } = useContent();
  const [currentGrade, setCurrentGrade] = useState<any>(null);

  // Find the current grade with better matching
  useEffect(() => {
    if (grades.length > 0 && standard) {
      console.log('Looking for grade:', standard);
      console.log('Available grades:', grades.map(g => g.name));
      
      const grade = grades.find(g => {
        const gradeName = g.name.toLowerCase();
        const standardName = standard.toLowerCase();
        
        // Try different matching patterns
        return (
          gradeName.includes(standardName) ||
          gradeName.includes(standardName + ' standard') ||
          gradeName.includes(standardName + 'st') ||
          gradeName.includes(standardName + 'nd') ||
          gradeName.includes(standardName + 'rd') ||
          gradeName.includes(standardName + 'th') ||
          standardName.includes(gradeName.split(' ')[0]) ||
          // Direct number matching
          (standardName === '1st' && gradeName.includes('1')) ||
          (standardName === '2nd' && gradeName.includes('2')) ||
          (standardName === '3rd' && gradeName.includes('3')) ||
          (standardName === '4th' && gradeName.includes('4')) ||
          (standardName === '5th' && gradeName.includes('5'))
        );
      });
      
      console.log('Found grade:', grade);
      setCurrentGrade(grade);
    }
  }, [grades, standard]);

  // Get subjects for the current grade
  const gradeSubjects = currentGrade 
    ? subjects.filter(subject => subject.grade_id === currentGrade.id)
    : [];

  // Get content count for each subject
  const subjectsWithContent = gradeSubjects.map(subject => {
    const subjectContents = contents.filter(content => 
      content.subject_id === subject.id && content.is_published
    );
    return {
      ...subject,
      contentCount: subjectContents.length
    };
  });

  const handleSubjectClick = (subjectName: string) => {
    navigate(`/lessons/${subjectName.toLowerCase()}?class=${standard}`);
  };

  const getSubjectEmoji = (subjectName: string) => {
    const name = subjectName.toLowerCase();
    if (name.includes('math')) return '🔢';
    if (name.includes('english')) return '📖';
    if (name.includes('science')) return '🔬';
    if (name.includes('bangla')) return '🇧🇩';
    if (name.includes('social')) return '🌍';
    return '📚';
  };

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase();
    if (name.includes('math')) return Calculator;
    if (name.includes('english')) return BookOpen;
    if (name.includes('science')) return Beaker;
    if (name.includes('bangla')) return Globe;
    if (name.includes('social')) return Globe;
    return BookOpen;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-eduplay-blue" />
          <p className="text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading subjects: {error}</p>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentGrade) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Grade "{standard}" not found</p>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Available grades:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {grades.map(grade => (
                <Button
                  key={grade.id}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/class/${grade.name.toLowerCase().replace(' ', '')}`)}
                >
                  {grade.name}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const standardName = currentGrade.name;

  const getColorForIndex = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-100 to-purple-100',
      'bg-gradient-to-br from-green-100 to-blue-100',
      'bg-gradient-to-br from-orange-100 to-pink-100',
      'bg-gradient-to-br from-purple-100 to-pink-100',
      'bg-gradient-to-br from-yellow-100 to-orange-100',
      'bg-gradient-to-br from-pink-100 to-red-100',
    ];
    return colors[index % colors.length];
  };

  const getButtonColorForIndex = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-purple-600',
      'bg-gradient-to-r from-green-500 to-blue-600',
      'bg-gradient-to-r from-orange-500 to-pink-600',
      'bg-gradient-to-r from-purple-500 to-pink-600',
      'bg-gradient-to-r from-yellow-500 to-orange-600',
      'bg-gradient-to-r from-pink-500 to-red-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 py-16">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-eduplay-blue/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            {standardName}
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in delay-150">
            Choose your favorite subject to start learning!
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="container mx-auto px-4">
        {subjectsWithContent.length === 0 ? (
          <Card className="border-0 playful-shadow animate-fade-in">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Subjects Available</h3>
              <p className="text-gray-500 mb-4">
                No subjects have been created for this grade yet.
              </p>
              <p className="text-sm text-gray-400">
                Contact your teacher to add subjects for this grade.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjectsWithContent.map((subject, index) => {
              const IconComponent = getSubjectIcon(subject.name);
              return (
                <Card 
                  key={subject.id}
                  className={`border-0 playful-shadow hover:shadow-xl transition-all group hover:scale-105 animate-fade-in ${getColorForIndex(index)}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl group-hover:animate-bounce">
                        {getSubjectEmoji(subject.name)}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-700">{subject.contentCount}</div>
                        <div className="text-xs text-gray-500">Lessons</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-eduplay-blue transition-colors">
                      {subject.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {subject.contentCount > 0 
                        ? `${subject.contentCount} lessons available` 
                        : 'No lessons available yet'
                      }
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => handleSubjectClick(subject.name)}
                      className={`w-full ${getButtonColorForIndex(index)} hover:shadow-lg transform hover:scale-105 transition-all`}
                      disabled={subject.contentCount === 0}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {subject.contentCount > 0 ? 'Start Learning' : 'Coming Soon'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassSelection;