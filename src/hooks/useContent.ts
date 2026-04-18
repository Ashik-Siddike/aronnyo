// MongoDB-connected useContent hook
// Fetches real data from MongoDB via Express API

import { useState, useEffect } from 'react';
import { gradesApi, subjectsApi, contentsApi, GradeData, SubjectData, ContentData } from '@/services/api';

export interface Grade {
  id: number;
  name: string;
  order_index: number;
  created_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  grade_id: number;
  order_index: number;
  created_at?: string;
}

export interface Content {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  content_type: 'text' | 'pdf' | 'youtube' | 'video' | 'audio' | 'image' | 'interactive';
  youtube_link?: string;
  file_url?: string;
  pages?: any;
  content_data?: any;
  class?: string;
  subject?: string;
  grade_id?: number;
  subject_id?: number;
  chapter_id?: number;
  lesson_order?: number;
  is_published: boolean;
  created_at: string;
}

export const useContent = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from MongoDB API in parallel
      const [gradesData, subjectsData, contentsData] = await Promise.all([
        gradesApi.getAll(),
        subjectsApi.getAll(),
        contentsApi.getAll()
      ]);

      console.log('📦 Data loaded from MongoDB:', {
        grades: gradesData.length,
        subjects: subjectsData.length,
        contents: contentsData.length
      });

      setGrades(gradesData as Grade[]);
      setSubjects(subjectsData as Subject[]);
      setContents(contentsData.filter(c => c.is_published === true) as Content[]);

    } catch (err: any) {
      console.error('Error loading content from MongoDB:', err);
      setError(err.message || 'Failed to load content from database');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectsByGrade = (gradeId: number) => {
    return subjects.filter(subject => subject.grade_id === gradeId);
  };

  const getContentsBySubject = (subjectId: number) => {
    return contents.filter(content => content.subject_id === subjectId);
  };

  const getContentsByGrade = (gradeId: number) => {
    const gradeSubjects = getSubjectsByGrade(gradeId);
    const subjectIds = gradeSubjects.map(s => s.id);
    return contents.filter(content => subjectIds.includes(content.subject_id || 0));
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    grades,
    subjects,
    contents,
    loading,
    error,
    loadData,
    getSubjectsByGrade,
    getContentsBySubject,
    getContentsByGrade
  };
};
