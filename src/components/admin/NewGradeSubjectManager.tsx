import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { staticGrades, staticSubjects, mockDelay, Grade, Subject } from '@/data/staticData';
import AdminLayout from './AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GraduationCap, 
  BookOpen,
  Save,
  X,
  RefreshCw
} from 'lucide-react';

interface Grade {
  id: number;
  name: string;
  order_index?: number;
  created_at?: string;
}

interface Subject {
  id: number;
  name: string;
  grade_id: number;
  order_index?: number;
  created_at?: string;
}

const NewGradeSubjectManager = () => {
  const { toast } = useToast();
  
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grades' | 'subjects'>('grades');
  
  // Grade form state
  const [gradeForm, setGradeForm] = useState({
    name: ''
  });
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [showGradeForm, setShowGradeForm] = useState(false);

  // Subject form state
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    grade_id: ''
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading grades and subjects from static data...');

      await mockDelay(300);

      // Load from static data
      const gradesData = [...staticGrades].sort((a, b) => a.id - b.id);
      const subjectsData = [...staticSubjects].sort((a, b) => a.id - b.id);

      setGrades(gradesData);
      setSubjects(subjectsData);

      console.log('Data loaded:', {
        grades: gradesData.length,
        subjects: subjectsData.length
      });

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: `Failed to load data: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Grade management functions
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gradeForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Grade name is required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate grade names
    const existingGrade = grades.find(g => 
      g.name.toLowerCase() === gradeForm.name.trim().toLowerCase() && 
      (!editingGrade || g.id !== editingGrade.id)
    );

    if (existingGrade) {
      toast({
        title: "Validation Error",
        description: "A grade with this name already exists",
        variant: "destructive",
      });
      return;
    }

    try {
      await mockDelay(300);
      
      const gradeData = {
        name: gradeForm.name.trim()
      };

      if (editingGrade) {
        // Update in static data
        const gradeIndex = staticGrades.findIndex(g => g.id === editingGrade.id);
        if (gradeIndex !== -1) {
          staticGrades[gradeIndex].name = gradeData.name;
        }
      } else {
        // Create new grade
        const newGrade: Grade = {
          id: Math.max(...staticGrades.map(g => g.id), 0) + 1,
          name: gradeData.name,
          order_index: staticGrades.length + 1
        };
        staticGrades.push(newGrade);
      }

      toast({
        title: "Success",
        description: `Grade "${gradeForm.name}" ${editingGrade ? 'updated' : 'created'} successfully`,
      });

      resetGradeForm();
      loadData();
    } catch (error) {
      console.error('Error saving grade:', error);
      toast({
        title: "Error",
        description: `Failed to save grade: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditGrade = (grade: Grade) => {
    setEditingGrade(grade);
    setGradeForm({
      name: grade.name
    });
    setShowGradeForm(true);
  };

  const handleDeleteGrade = async (id: string) => {
    const grade = grades.find(g => g.id === id);
    const relatedSubjects = subjects.filter(s => s.grade_id === id);
    
    if (!grade) {
      toast({
        title: "Error",
        description: "Grade not found",
        variant: "destructive",
      });
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${grade.name}"?\n\nThis will also delete:\n- ${relatedSubjects.length} related subjects\n- All content in those subjects\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await mockDelay(300);
      console.log('Deleting grade:', id, grade.name);
      
      // Delete related content from static data
      const contentIdsToDelete = staticContents
        .filter(c => c.grade_id === parseInt(id))
        .map(c => c.id);
      
      contentIdsToDelete.forEach(contentId => {
        const contentIndex = staticContents.findIndex(c => c.id === contentId);
        if (contentIndex !== -1) {
          staticContents.splice(contentIndex, 1);
        }
      });

      // Delete related subjects from static data
      const subjectIdsToDelete = staticSubjects
        .filter(s => s.grade_id === parseInt(id))
        .map(s => s.id);
      
      subjectIdsToDelete.forEach(subjectId => {
        const subjectIndex = staticSubjects.findIndex(s => s.id === subjectId);
        if (subjectIndex !== -1) {
          staticSubjects.splice(subjectIndex, 1);
        }
      });

      // Delete the grade from static data
      const gradeIndex = staticGrades.findIndex(g => g.id === parseInt(id));
      if (gradeIndex !== -1) {
        staticGrades.splice(gradeIndex, 1);
      }

      toast({
        title: "Success",
        description: `Grade "${grade.name}" and all related data deleted successfully`,
      });

      loadData();
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast({
        title: "Error",
        description: `Failed to delete grade: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const resetGradeForm = () => {
    setGradeForm({
      name: ''
    });
    setEditingGrade(null);
    setShowGradeForm(false);
  };

  // Subject management functions
  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjectForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    if (!subjectForm.grade_id) {
      toast({
        title: "Validation Error",
        description: "Please select a grade",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate subject names within the same grade
    const existingSubject = subjects.find(s => 
      s.name.toLowerCase() === subjectForm.name.trim().toLowerCase() && 
      s.grade_id === subjectForm.grade_id &&
      (!editingSubject || s.id !== editingSubject.id)
    );

    if (existingSubject) {
      const gradeName = grades.find(g => g.id === subjectForm.grade_id)?.name;
      toast({
        title: "Validation Error",
        description: `A subject with this name already exists in ${gradeName}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await mockDelay(300);
      
      const subjectData = {
        name: subjectForm.name.trim(),
        grade_id: parseInt(subjectForm.grade_id)
      };

      if (editingSubject) {
        // Update in static data
        const subjectIndex = staticSubjects.findIndex(s => s.id === editingSubject.id);
        if (subjectIndex !== -1) {
          staticSubjects[subjectIndex].name = subjectData.name;
          staticSubjects[subjectIndex].grade_id = subjectData.grade_id;
        }
      } else {
        // Create new subject
        const newSubject: Subject = {
          id: Math.max(...staticSubjects.map(s => s.id), 0) + 1,
          name: subjectData.name,
          grade_id: subjectData.grade_id,
          order_index: staticSubjects.filter(s => s.grade_id === subjectData.grade_id).length + 1
        };
        staticSubjects.push(newSubject);
      }

      const gradeName = grades.find(g => g.id === subjectForm.grade_id)?.name;
      toast({
        title: "Success",
        description: `Subject "${subjectForm.name}" ${editingSubject ? 'updated' : 'created'} successfully in ${gradeName}`,
      });

      resetSubjectForm();
      loadData();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: "Error",
        description: `Failed to save subject: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      grade_id: subject.grade_id
    });
    setShowSubjectForm(true);
  };

  const handleDeleteSubject = async (id: string) => {
    const subject = subjects.find(s => s.id === id);
    
    if (!subject) {
      toast({
        title: "Error",
        description: "Subject not found",
        variant: "destructive",
      });
      return;
    }

    const gradeName = grades.find(g => g.id === subject.grade_id)?.name;
    const confirmMessage = `Are you sure you want to delete "${subject.name}" from ${gradeName}?\n\nThis will also delete all content in this subject.\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await mockDelay(300);
      console.log('Deleting subject:', id, subject.name);
      
      // Delete related content from static data
      const contentIdsToDelete = staticContents
        .filter(c => c.subject_id === parseInt(id))
        .map(c => c.id);
      
      contentIdsToDelete.forEach(contentId => {
        const contentIndex = staticContents.findIndex(c => c.id === contentId);
        if (contentIndex !== -1) {
          staticContents.splice(contentIndex, 1);
        }
      });

      // Delete the subject from static data
      const subjectIndex = staticSubjects.findIndex(s => s.id === parseInt(id));
      if (subjectIndex !== -1) {
        staticSubjects.splice(subjectIndex, 1);
      }

      toast({
        title: "Success",
        description: `Subject "${subject.name}" and all related content deleted successfully`,
      });

      loadData();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: `Failed to delete subject: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      name: '',
      grade_id: ''
    });
    setEditingSubject(null);
    setShowSubjectForm(false);
  };

  const getGradeName = (gradeId: number) => {
    return grades.find(g => g.id === gradeId)?.name || 'Unknown Grade';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eduplay-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Grades & Subjects Management</h2>
            <p className="text-gray-600 mt-1">
              Manage educational structure and curriculum organization
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={loadData}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant={activeTab === 'grades' ? 'default' : 'outline'}
              onClick={() => setActiveTab('grades')}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Grades
            </Button>
            <Button 
              variant={activeTab === 'subjects' ? 'default' : 'outline'}
              onClick={() => setActiveTab('subjects')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Subjects
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-6 h-6 text-eduplay-blue mx-auto mb-2" />
              <div className="text-xl font-bold text-eduplay-blue">{grades.length}</div>
              <div className="text-sm text-gray-600">Total Grades</div>
            </CardContent>
          </Card>
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-eduplay-green mx-auto mb-2" />
              <div className="text-xl font-bold text-eduplay-green">{subjects.length}</div>
              <div className="text-sm text-gray-600">Total Subjects</div>
            </CardContent>
          </Card>
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-eduplay-orange mx-auto mb-2" />
              <div className="text-xl font-bold text-eduplay-orange">
                {grades.length > 0 ? Math.round(subjects.length / grades.length) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg Subjects/Grade</div>
            </CardContent>
          </Card>
          <Card className="border-0 playful-shadow">
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-6 h-6 text-eduplay-purple mx-auto mb-2" />
              <div className="text-xl font-bold text-eduplay-purple">
                {grades.length}
              </div>
              <div className="text-sm text-gray-600">Primary Grades</div>
            </CardContent>
          </Card>
        </div>

        {activeTab === 'grades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Manage Grades</h3>
              <Button 
                onClick={() => setShowGradeForm(true)}
                className="bg-gradient-to-r from-eduplay-blue to-eduplay-purple"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Grade
              </Button>
            </div>

            {showGradeForm && (
              <Card className="border-0 playful-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</span>
                    <Button variant="ghost" size="sm" onClick={resetGradeForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGradeSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="grade_name">Grade Name *</Label>
                      <Input
                        id="grade_name"
                        value={gradeForm.name}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., 1st Standard, 2nd Standard"
                        required
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-gradient-to-r from-eduplay-green to-eduplay-blue">
                        <Save className="w-4 h-4 mr-2" />
                        {editingGrade ? 'Update Grade' : 'Create Grade'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetGradeForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle>Existing Grades</CardTitle>
              </CardHeader>
              <CardContent>
                {grades.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No grades found. Create your first grade!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grades.map((grade) => (
                      <div key={grade.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{grade.name}</h3>
                              <Badge variant="outline" className="text-blue-600 border-blue-200">
                                {subjects.filter(s => s.grade_id === grade.id).length} subjects
                              </Badge>
                            </div>

                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditGrade(grade)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteGrade(grade.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Manage Subjects</h3>
              <Button 
                onClick={() => setShowSubjectForm(true)}
                className="bg-gradient-to-r from-eduplay-green to-eduplay-blue"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>

            {showSubjectForm && (
              <Card className="border-0 playful-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</span>
                    <Button variant="ghost" size="sm" onClick={resetSubjectForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubjectSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject_name">Subject Name *</Label>
                        <Input
                          id="subject_name"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Mathematics, English, Science"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject_grade">Grade *</Label>
                        <Select 
                          value={subjectForm.grade_id} 
                          onValueChange={(value) => setSubjectForm(prev => ({ ...prev, grade_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              grades.length === 0 
                                ? "Loading grades..." 
                                : "Select grade"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.length === 0 ? (
                              <SelectItem value="loading" disabled>
                                No grades available
                              </SelectItem>
                            ) : (
                              grades.map((grade) => (
                                <SelectItem key={grade.id} value={grade.id.toString()}>
                                  {grade.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-gradient-to-r from-eduplay-green to-eduplay-blue">
                        <Save className="w-4 h-4 mr-2" />
                        {editingSubject ? 'Update Subject' : 'Create Subject'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetSubjectForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 playful-shadow">
              <CardHeader>
                <CardTitle>Existing Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No subjects found. Create your first subject!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{subject.name}</h3>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                              <Badge variant="outline" className="text-blue-600 border-blue-200">
                                {getGradeName(subject.grade_id)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSubject(subject)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewGradeSubjectManager;