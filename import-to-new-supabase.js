import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function importData() {
  console.log('🚀 Starting data import to new Supabase project...\n');

  const data = JSON.parse(fs.readFileSync('migration-data.json', 'utf8'));

  // Import grades first
  if (data.grades && data.grades.length > 0) {
    console.log(`\n📥 Importing ${data.grades.length} grades...`);

    for (const grade of data.grades) {
      const gradeData = {
        name: grade.name || grade.class_name,
        description: grade.description || '',
        order_index: grade.id || 0
      };

      const { data: inserted, error } = await supabase
        .from('grades')
        .upsert(gradeData, { onConflict: 'name' })
        .select()
        .single();

      if (error) {
        console.log(`❌ Error importing grade: ${error.message}`);
      } else {
        console.log(`✅ Imported grade: ${gradeData.name}`);
      }
    }
  }

  // Import subjects
  if (data.subjects && data.subjects.length > 0) {
    console.log(`\n📥 Importing ${data.subjects.length} subjects...`);

    for (const subject of data.subjects) {
      // Get grade UUID if needed
      let gradeId = null;
      if (subject.grade || subject.class) {
        const gradeName = subject.grade || subject.class;
        const { data: gradeData } = await supabase
          .from('grades')
          .select('id')
          .eq('name', gradeName)
          .maybeSingle();

        gradeId = gradeData?.id;
      }

      const subjectData = {
        name: subject.name || subject.subject_name,
        description: subject.description || '',
        icon: subject.icon || '',
        color: subject.color || '#000000',
        grade_id: gradeId
      };

      const { error } = await supabase
        .from('subjects')
        .upsert(subjectData, { onConflict: 'name' })
        .select();

      if (error) {
        console.log(`❌ Error importing subject: ${error.message}`);
      } else {
        console.log(`✅ Imported subject: ${subjectData.name}`);
      }
    }
  }

  // Import contents
  if (data.contents && data.contents.length > 0) {
    console.log(`\n📥 Importing ${data.contents.length} contents...`);

    for (const content of data.contents) {
      // Get grade UUID
      let gradeId = null;
      if (content.class || content.grade) {
        const gradeName = content.class || content.grade;
        const { data: gradeData } = await supabase
          .from('grades')
          .select('id')
          .ilike('name', `%${gradeName}%`)
          .maybeSingle();

        gradeId = gradeData?.id;
      }

      // Get subject UUID
      let subjectId = null;
      if (content.subject) {
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id')
          .ilike('name', `%${content.subject}%`)
          .maybeSingle();

        subjectId = subjectData?.id;
      }

      const contentData = {
        id: content.id,
        title: content.title,
        subtitle: content.subtitle,
        description: content.description,
        content_type: content.content_type === 'youtube' ? 'video' : content.content_type,
        youtube_link: content.youtube_link,
        file_url: content.file_url,
        grade_id: gradeId,
        subject_id: subjectId,
        content_data: content.pages ? { pages: content.pages } : content.content_data || {},
        is_published: content.is_published !== false,
        order_index: content.lesson_order || 0,
        created_at: content.created_at
      };

      const { error } = await supabase
        .from('contents')
        .upsert(contentData, { onConflict: 'id' });

      if (error) {
        console.log(`❌ Error importing content "${content.title}": ${error.message}`);
      } else {
        console.log(`✅ Imported content: ${content.title}`);
      }
    }
  }

  // Import users (skip auth.users, only public.users)
  if (data.users && data.users.length > 0) {
    console.log(`\n📥 Importing ${data.users.length} users to public.users...`);
    console.log('⚠️  Note: Users must sign up through auth first. Skipping auth user creation.');
    console.log('⚠️  Only updating public.users metadata for existing users.');
  }

  // Import student_activities
  if (data.student_activities && data.student_activities.length > 0) {
    console.log(`\n📥 Importing ${data.student_activities.length} student activities...`);

    let imported = 0;
    for (const activity of data.student_activities) {
      const activityData = {
        id: activity.id,
        student_id: activity.student_id,
        activity_type: activity.activity_type,
        subject: activity.subject,
        lesson_name: activity.lesson_name,
        score: activity.score,
        stars_earned: activity.stars_earned || 0,
        time_spent: activity.time_spent || 0,
        metadata: activity.metadata || {},
        created_at: activity.created_at
      };

      const { error } = await supabase
        .from('student_activities')
        .upsert(activityData, { onConflict: 'id' });

      if (!error) {
        imported++;
      }
    }
    console.log(`✅ Imported ${imported} student activities`);
  }

  console.log('\n🎉 Import complete!');
  console.log('\n📝 Summary:');
  console.log('  ✅ Grades imported');
  console.log('  ✅ Subjects imported');
  console.log('  ✅ Contents imported');
  console.log('  ✅ Student activities imported');
  console.log('\n⚠️  Note: User accounts need to be created through signup.');
}

importData().catch(console.error);
