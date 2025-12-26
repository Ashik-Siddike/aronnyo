const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ededavyhrbhabqswgxbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWRhdnlocmJoYWJxc3dneGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDkwMjQsImV4cCI6MjA2NTgyNTAyNH0.g7qETNhG9wn_P3ulvDfxkVQjbHhqv4xST_IaK3tsSgg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStudentDemo() {
  console.log('🚀 Setting up student demo data...');

  try {
    // 1. Create demo student account
    console.log('📝 Creating demo student account...');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'student@demo.com',
      password: 'student123',
      options: {
        data: {
          full_name: 'Demo Student',
          role: 'student'
        }
      }
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error('❌ Error creating student account:', authError);
      return;
    }

    console.log('✅ Demo student account ready');

    // 2. Get or create student profile
    let studentId;
    
    if (authData.user) {
      studentId = authData.user.id;
    } else {
      // Try to sign in to get user ID
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'student@demo.com',
        password: 'student123'
      });

      if (signInError) {
        console.error('❌ Error signing in:', signInError);
        return;
      }

      studentId = signInData.user.id;
    }

    console.log('👤 Student ID:', studentId);

    // 3. Create student profile if not exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: studentId,
          full_name: 'Demo Student',
          role: 'student',
          grade: '5',
          parent_email: 'parent@demo.com'
        });

      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        return;
      }
      console.log('✅ Student profile created');
    } else {
      console.log('✅ Student profile already exists');
    }

    // 4. Add sample activities
    console.log('📊 Adding sample activities...');

    const sampleActivities = [
      {
        student_id: studentId,
        activity_type: 'lesson_completed',
        subject: 'Math',
        lesson_name: 'Basic Addition',
        stars_earned: 15,
        time_spent: 12,
        metadata: { difficulty: 'easy', completed_exercises: 10 }
      },
      {
        student_id: studentId,
        activity_type: 'quiz_completed',
        subject: 'Math',
        lesson_name: 'Addition Quiz',
        score: 85,
        stars_earned: 18,
        time_spent: 8,
        metadata: { total_questions: 10, correct_answers: 8 }
      },
      {
        student_id: studentId,
        activity_type: 'lesson_completed',
        subject: 'English',
        lesson_name: 'Reading Comprehension',
        stars_earned: 12,
        time_spent: 15,
        metadata: { difficulty: 'medium', words_learned: 5 }
      },
      {
        student_id: studentId,
        activity_type: 'game_played',
        subject: 'Math',
        lesson_name: 'Counting Game',
        score: 250,
        stars_earned: 8,
        time_spent: 5,
        metadata: { level_reached: 3, items_counted: 25 }
      },
      {
        student_id: studentId,
        activity_type: 'achievement_earned',
        subject: 'Math',
        lesson_name: 'Math Beginner',
        stars_earned: 25,
        time_spent: 0,
        metadata: { 
          description: 'Completed your first math lesson!', 
          icon: '🌟' 
        }
      },
      {
        student_id: studentId,
        activity_type: 'lesson_completed',
        subject: 'Science',
        lesson_name: 'Plants and Animals',
        stars_earned: 14,
        time_spent: 18,
        metadata: { difficulty: 'medium', experiments: 2 }
      },
      {
        student_id: studentId,
        activity_type: 'quiz_completed',
        subject: 'English',
        lesson_name: 'Vocabulary Quiz',
        score: 92,
        stars_earned: 20,
        time_spent: 6,
        metadata: { total_questions: 12, correct_answers: 11 }
      }
    ];

    // Add activities with different timestamps to simulate learning over time
    for (let i = 0; i < sampleActivities.length; i++) {
      const activity = sampleActivities[i];
      const daysAgo = Math.floor(Math.random() * 7); // Random day in last week
      const hoursAgo = Math.floor(Math.random() * 24); // Random hour
      
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);

      const { error: activityError } = await supabase
        .from('student_activities')
        .insert({
          ...activity,
          created_at: timestamp.toISOString()
        });

      if (activityError) {
        console.error(`❌ Error adding activity ${i + 1}:`, activityError);
      } else {
        console.log(`✅ Added activity: ${activity.lesson_name}`);
      }
    }

    console.log('🎉 Demo setup complete!');
    console.log('📧 Demo student login: student@demo.com');
    console.log('🔑 Demo student password: student123');
    console.log('🎯 You can now test the student dashboard with real data!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupStudentDemo();