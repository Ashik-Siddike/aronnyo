// Static useContent hook - No Supabase dependency
// Uses static data from staticData.ts
// Can be easily converted to Django API calls later

import { useState, useEffect } from 'react';
import { staticGrades, staticSubjects, staticContents, mockDelay, Grade, Subject, Content } from '@/data/staticData';

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
      
      // Simulate API delay
      await mockDelay(300);

      // Load from static data
      const gradesData = [...staticGrades];
      const subjectsData = [...staticSubjects];
      const contentsData = staticContents.filter(c => c.is_published === true);

      console.log('Data loaded successfully:', {
        grades: gradesData.length,
        subjects: subjectsData.length,
        contents: contentsData.length
      });

      setGrades(gradesData);
      setSubjects(subjectsData);
      setContents(contentsData);

    } catch (err: any) {
      console.error('Error loading content:', err);
      setError(err.message || 'Failed to load content');
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
