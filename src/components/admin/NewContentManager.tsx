import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { staticGrades, staticSubjects, staticContents, mockDelay, Grade, Subject, Content } from '@/data/staticData';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import {
    Plus,
    Edit,
    Trash2,
    FileText,
    Video,
    Upload,
    Eye,
    Save,
    X,
    RefreshCw,
    BookOpen,
    ExternalLink
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

interface Content {
    id: string;
    title: string;
    description?: string;
    content_type: string;
    pages?: any;
    file_url?: string;
    youtube_link?: string;
    class?: string;
    subject?: string;
    chapter_id?: number;
    created_at?: string;
    // New fields for admin panel (may not exist in current schema)
    grade_id?: number;
    subject_id?: number;
    lesson_order?: number;
    is_published?: boolean;
}

const NewContentManager = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    // State management
    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingContent, setEditingContent] = useState<Content | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content_type: 'text' as 'text' | 'pdf' | 'youtube',
        content_data: '',
        grade_id: '',
        subject_id: '',
        lesson_order: 1,
        is_published: false
    });

    // Filtered subjects based on selected grade
    const filteredSubjects = subjects.filter(subject => {
        const matches = subject.grade_id === parseInt(formData.grade_id);
        console.log(`Subject ${subject.name} (grade_id: ${subject.grade_id}) matches grade ${formData.grade_id}: ${matches}`);
        return matches;
    });
    
    console.log('Filtered subjects for grade', formData.grade_id, ':', filteredSubjects);

    useEffect(() => {
        // Add a small delay to ensure auth is ready
        const timer = setTimeout(() => {
            loadAllData();
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            console.log('Loading all data from static data...');
            
            await mockDelay(300);
            
            console.log('Admin verified, fetching data...');

            // Load from static data
            const gradesData = [...staticGrades].sort((a, b) => 
                (a.order_index || 0) - (b.order_index || 0) || a.id - b.id
            );
            
            const subjectsData = [...staticSubjects].sort((a, b) => 
                a.grade_id - b.grade_id || (a.order_index || 0) - (b.order_index || 0) || a.id - b.id
            );
            
            const contentsData = [...staticContents].sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            console.log('Data loaded:', {
                grades: gradesData.length,
                subjects: subjectsData.length,
                contents: contentsData.length
            });

            // Set state
            console.log('Setting data:', {
                grades: gradesData?.length || 0,
                subjects: subjectsData?.length || 0,
                contents: contentsData?.length || 0
            });
            
            setGrades(gradesData || []);
            setSubjects(subjectsData || []);
            setContents(contentsData || []);
            
            toast({
                title: "Data Loaded",
                description: `Loaded ${gradesData?.length || 0} grades, ${subjectsData?.length || 0} subjects, ${contentsData?.length || 0} contents`,
            });

            console.log('Final state will be:', {
                grades: gradesData?.length || 0,
                subjects: subjectsData?.length || 0,
                contents: contentsData?.length || 0,
                gradesList: gradesData
            });

        } catch (error) {
            console.error('Error loading data:', error);
            toast({
                title: "Error",
                description: `Failed to load data: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast({
                title: "Validation Error",
                description: "Title is required",
                variant: "destructive",
            });
            return;
        }

        if (!formData.grade_id) {
            toast({
                title: "Validation Error",
                description: "Please select a grade",
                variant: "destructive",
            });
            return;
        }

        if (!formData.subject_id) {
            toast({
                title: "Validation Error",
                description: "Please select a subject",
                variant: "destructive",
            });
            return;
        }

        if (!formData.content_data.trim()) {
            toast({
                title: "Validation Error",
                description: "Content data is required",
                variant: "destructive",
            });
            return;
        }

        try {
            let processedContentData = formData.content_data;

            // Process content based on type
            if (formData.content_type === 'youtube') {
                const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
                const match = formData.content_data.match(youtubeRegex);
                if (match) {
                    processedContentData = {
                        videoId: match[1],
                        url: formData.content_data,
                        embedUrl: `https://www.youtube.com/embed/${match[1]}`
                    };
                } else {
                    toast({
                        title: "Invalid YouTube URL",
                        description: "Please provide a valid YouTube URL",
                        variant: "destructive",
                    });
                    return;
                }
            } else if (formData.content_type === 'text') {
                processedContentData = {
                    text: formData.content_data,
                    wordCount: formData.content_data.split(' ').length
                };
            } else if (formData.content_type === 'pdf') {
                processedContentData = {
                    url: formData.content_data,
                    filename: formData.content_data.split('/').pop() || 'document.pdf'
                };
            }

            // Create payload based on content type
            const contentPayload: any = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                content_type: formData.content_type
            };

            // Add content data to appropriate column based on type
            if (formData.content_type === 'text') {
                contentPayload.pages = processedContentData;
            } else if (formData.content_type === 'pdf') {
                contentPayload.file_url = processedContentData.url || processedContentData;
            } else if (formData.content_type === 'youtube') {
                contentPayload.youtube_link = processedContentData.url || processedContentData;
            }

            // Add new fields - only include if they have values
            if (formData.grade_id && formData.grade_id !== '') {
                contentPayload.grade_id = parseInt(formData.grade_id);
            }
            if (formData.subject_id && formData.subject_id !== '') {
                contentPayload.subject_id = parseInt(formData.subject_id);
            }
            if (formData.lesson_order && formData.lesson_order > 0) {
                contentPayload.lesson_order = formData.lesson_order;
            }
            if (formData.is_published !== undefined) {
                contentPayload.is_published = formData.is_published;
            }

            console.log('Content payload:', contentPayload);

            await mockDelay(300);

            if (editingContent) {
                // Update existing content in static data
                const contentIndex = staticContents.findIndex(c => c.id === editingContent.id);
                if (contentIndex !== -1) {
                    staticContents[contentIndex] = {
                        ...staticContents[contentIndex],
                        ...contentPayload,
                        id: editingContent.id,
                        created_at: staticContents[contentIndex].created_at
                    };
                }
            } else {
                // Create new content
                const newContent: Content = {
                    id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    ...contentPayload,
                    is_published: contentPayload.is_published || false,
                    created_at: new Date().toISOString()
                };
                staticContents.push(newContent);
            }

            toast({
                title: "Success",
                description: `Content ${editingContent ? 'updated' : 'created'} successfully`,
            });

            resetForm();
            loadAllData();
        } catch (error: any) {
            console.error('Error saving content:', error);
            toast({
                title: "Error",
                description: `Failed to save content: ${error?.message || 'Unknown error'}`,
                variant: "destructive",
            });
        }
    };

    const handleEdit = (content: Content) => {
        setEditingContent(content);
        
        // Extract content data from the appropriate column
        let contentData = '';
        if (content.content_type === 'text' && content.pages) {
            contentData = typeof content.pages === 'object' 
                ? (content.pages.text || JSON.stringify(content.pages))
                : content.pages;
        } else if (content.content_type === 'pdf' && content.file_url) {
            contentData = content.file_url;
        } else if (content.content_type === 'youtube' && content.youtube_link) {
            contentData = content.youtube_link;
        }
        
        setFormData({
            title: content.title,
            description: content.description,
            content_type: content.content_type,
            content_data: contentData,
            grade_id: content.grade_id?.toString() || '',
            subject_id: content.subject_id?.toString() || '',
            lesson_order: content.lesson_order || 1,
            is_published: content.is_published || false
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        const content = contents.find(c => c.id === id);
        if (!confirm(`Are you sure you want to delete "${content?.title}"?`)) return;

        try {
            await mockDelay(300);
            
            // Remove from static data
            const contentIndex = staticContents.findIndex(c => c.id === id);
            if (contentIndex !== -1) {
                staticContents.splice(contentIndex, 1);
            }

            toast({
                title: "Success",
                description: "Content deleted successfully",
            });

            loadAllData();
        } catch (error) {
            console.error('Error deleting content:', error);
            toast({
                title: "Error",
                description: `Failed to delete content: ${error.message}`,
                variant: "destructive",
            });
        }
    };

    const togglePublished = async (content: Content) => {
        try {
            await mockDelay(300);
            
            // Update in static data
            const contentIndex = staticContents.findIndex(c => c.id === content.id);
            if (contentIndex !== -1) {
                staticContents[contentIndex].is_published = !content.is_published;
            }

            toast({
                title: "Success",
                description: `Content ${!content.is_published ? 'published' : 'unpublished'} successfully`,
            });

            loadAllData();
        } catch (error: any) {
            console.error('Error updating content status:', error);
            toast({
                title: "Error",
                description: `Failed to update content status: ${error?.message || 'Unknown error'}`,
                variant: "destructive",
            });
        }
    };

    const handlePreview = (content: Content) => {
        const subjectName = subjects.find(s => s.id === content.subject_id)?.name?.toLowerCase() || 'unknown';
        navigate(`/lesson/${subjectName}/${content.id}`);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            content_type: 'text',
            content_data: '',
            grade_id: '',
            subject_id: '',
            lesson_order: 1,
            is_published: false
        });
        setEditingContent(null);
        setShowAddForm(false);
    };

    const getGradeName = (gradeId: number) => {
        return grades.find(g => g.id === gradeId)?.name || 'Unknown Grade';
    };

    const getSubjectName = (subjectId: number) => {
        return subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
    };

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case 'text': return <FileText className="w-4 h-4" />;
            case 'pdf': return <Upload className="w-4 h-4" />;
            case 'youtube': return <Video className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
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
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                        Content Management
                    </h2>
                    <p className="text-lg text-gray-600">
                        Create and manage educational content for grades 1st-5th Standard
                    </p>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        onClick={() => {
                            console.log('Manual refresh clicked');
                            loadAllData();
                        }}
                        variant="outline"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh ({grades.length} grades)
                    </Button>
                    <Button
                        onClick={async () => {
                            console.log('Testing direct database connection...');
                            try {
                                const { data, error } = await supabase
                                    .from('grades')
                                    .select('id, name, order_index, created_at')
                                    .order('order_index');
                                console.log('Direct test result:', { data, error });
                                toast({
                                    title: "Database Test",
                                    description: `Found ${data?.length || 0} grades. Check console for details.`,
                                });
                            } catch (err) {
                                console.error('Direct test error:', err);
                                toast({
                                    title: "Database Test Failed",
                                    description: err.message,
                                    variant: "destructive",
                                });
                            }
                        }}
                        variant="outline"
                        className="px-6 py-3 rounded-xl border-2 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 transition-all duration-300"
                    >
                        Test DB Connection
                    </Button>
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Content
                    </Button>
                </div>

                {/* Debug Info */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-amber-800 mb-4 text-lg">System Status</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="font-medium text-amber-800">Loading Status</p>
                                <p className="text-amber-700">{loading ? 'In Progress' : 'Complete'}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="font-medium text-amber-800">Grades Loaded</p>
                                <p className="text-amber-700">{grades.length}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="font-medium text-amber-800">Subjects Loaded</p>
                                <p className="text-amber-700">{subjects.length}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="font-medium text-amber-800">Contents Loaded</p>
                                <p className="text-amber-700">{contents.length}</p>
                            </div>
                        </div>
                        {grades.length > 0 && (
                            <div className="mt-4 bg-white/50 rounded-lg p-4">
                                <p className="font-medium text-amber-800 mb-2">Available Grades:</p>
                                <div className="flex flex-wrap gap-2">
                                    {grades.map(grade => (
                                        <span key={grade.id} className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-medium">
                                            {grade.name} (Order: {grade.order_index})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-blue-600 mb-1">{grades.length}</div>
                            <div className="text-sm text-gray-600 font-medium">Grades</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-green-600 mb-1">{subjects.length}</div>
                            <div className="text-sm text-gray-600 font-medium">Subjects</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-orange-600 mb-1">{contents.length}</div>
                            <div className="text-sm text-gray-600 font-medium">Total Content</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-purple-600 mb-1">
                                {contents.filter(c => c.is_published).length}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">Published</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-xl">
                            <CardTitle className="flex items-center justify-between text-xl">
                                <span className="flex items-center space-x-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>{editingContent ? 'Edit Content' : 'Add New Content'}</span>
                                </span>
                                <Button variant="ghost" size="sm" onClick={resetForm} className="text-white hover:bg-white/20">
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Enter content title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="content_type">Content Type *</Label>
                                        <Select
                                            value={formData.content_type}
                                            onValueChange={(value: 'text' | 'pdf' | 'youtube') =>
                                                setFormData(prev => ({ ...prev, content_type: value, content_data: '' }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text Content</SelectItem>
                                                <SelectItem value="pdf">PDF Document</SelectItem>
                                                <SelectItem value="youtube">YouTube Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="grade">Grade * (Found: {grades.length})</Label>
                                        <Select
                                            value={formData.grade_id}
                                            onValueChange={(value) => {
                                                console.log('Grade selected:', value);
                                                setFormData(prev => ({ ...prev, grade_id: value, subject_id: '' }));
                                            }}
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
                                        {grades.length === 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                No grades loaded. Check console for errors.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject * (Found: {filteredSubjects.length} for grade {formData.grade_id})</Label>
                                        <Select
                                            value={formData.subject_id}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}
                                            disabled={!formData.grade_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    !formData.grade_id ? "First select a grade" : "Select subject"
                                                } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredSubjects.length === 0 ? (
                                                    <SelectItem value="no-subjects" disabled>
                                                        No subjects available for this grade
                                                    </SelectItem>
                                                ) : (
                                                    filteredSubjects.map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {filteredSubjects.length === 0 && formData.grade_id && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Debug: Grade ID {formData.grade_id} has no subjects. Total subjects: {subjects.length}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="lesson_order">Lesson Order</Label>
                                        <Input
                                            id="lesson_order"
                                            type="number"
                                            min="1"
                                            value={formData.lesson_order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lesson_order: parseInt(e.target.value) || 1 }))}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_published"
                                            checked={formData.is_published}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <Label htmlFor="is_published">Publish immediately</Label>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter content description"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content_data">
                                        {formData.content_type === 'text' && 'Content Text *'}
                                        {formData.content_type === 'pdf' && 'PDF URL *'}
                                        {formData.content_type === 'youtube' && 'YouTube URL *'}
                                    </Label>
                                    {formData.content_type === 'text' ? (
                                        <Textarea
                                            id="content_data"
                                            value={formData.content_data}
                                            onChange={(e) => setFormData(prev => ({ ...prev, content_data: e.target.value }))}
                                            placeholder="Enter your content here..."
                                            rows={6}
                                            required
                                        />
                                    ) : (
                                        <Input
                                            id="content_data"
                                            value={formData.content_data}
                                            onChange={(e) => setFormData(prev => ({ ...prev, content_data: e.target.value }))}
                                            placeholder={
                                                formData.content_type === 'pdf'
                                                    ? "https://example.com/document.pdf"
                                                    : "https://www.youtube.com/watch?v=..."
                                            }
                                            required
                                        />
                                    )}
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <Button type="submit" className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingContent ? 'Update Content' : 'Create Content'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm} className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Content List */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-xl">
                        <CardTitle className="flex items-center space-x-2 text-xl">
                            <BookOpen className="w-5 h-5" />
                            <span>Content Library</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {contents.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Content Found</h3>
                                <p className="text-gray-500 mb-4">Start creating educational content for your students</p>
                                <Button 
                                    onClick={() => setShowAddForm(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Content
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {contents.map((content) => (
                                    <div key={content.id} className="border-0 shadow-lg bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                                        {getContentTypeIcon(content.content_type)}
                                                    </div>
                                                    <h3 className="font-bold text-xl text-gray-800">{content.title}</h3>
                                                    <Badge 
                                                        variant={content.is_published ? "default" : "secondary"}
                                                        className={`px-3 py-1 rounded-full font-medium ${
                                                            content.is_published 
                                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}
                                                    >
                                                        {content.is_published ? "Published" : "Draft"}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-600 mb-4 leading-relaxed">{content.description}</p>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Badge variant="outline" className="px-3 py-1 text-blue-600 border-blue-200 bg-blue-50">
                                                        {getGradeName(content.grade_id)}
                                                    </Badge>
                                                    <Badge variant="outline" className="px-3 py-1 text-green-600 border-green-200 bg-green-50">
                                                        {getSubjectName(content.subject_id)}
                                                    </Badge>
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                                        Order: {content.lesson_order}
                                                    </span>
                                                    <Badge variant="outline" className="px-3 py-1 text-purple-600 border-purple-200 bg-purple-50">
                                                        {content.content_type.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-6">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePreview(content)}
                                                    className="p-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                                                    title="Preview Lesson"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => togglePublished(content)}
                                                    className="p-2 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                                                    title={content.is_published ? "Unpublish" : "Publish"}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(content)}
                                                    className="p-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                                                    title="Edit Content"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(content.id)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                                                    title="Delete Content"
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
        </AdminLayout>
    );
};

export default NewContentManager;