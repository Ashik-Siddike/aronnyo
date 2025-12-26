const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ededavyhrbhabqswgxbn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZWRhdnlocmJoYWJxc3dneGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDkwMjQsImV4cCI6MjA2NTgyNTAyNH0.g7qETNhG9wn_P3ulvDfxkVQjbHhqv4xST_IaK3tsSgg'; // Using anon key for now

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Creating database tables...');

  try {
    // Create student_activities table
    console.log('📝 Creating student_activities table...');
    
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create student_activities table for tracking student learning activities
        CREATE TABLE IF NOT EXISTS student_activities (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            student_id UUID NOT NULL,
            activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_completed', 'quiz_completed', 'game_played', 'achievement_earned')),
            subject TEXT NOT NULL,
            lesson_name TEXT,
            score INTEGER,
            stars_earned INTEGER NOT NULL DEFAULT 0,
            time_spent INTEGER NOT NULL DEFAULT 0,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON student_activities(student_id);
        CREATE INDEX IF NOT EXISTS idx_student_activities_created_at ON student_activities(created_at);
        CREATE INDEX IF NOT EXISTS idx_student_activities_subject ON student_activities(subject);
        CREATE INDEX IF NOT EXISTS idx_student_activities_type ON student_activities(activity_type);

        -- Enable RLS (Row Level Security)
        ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;
      `
    });

    if (tableError) {
      console.log('⚠️  RPC function not available, trying direct table creation...');
      
      // Try creating table directly using raw SQL
      const { error: directError } = await supabase
        .from('student_activities')
        .select('id')
        .limit(1);

      if (directError && directError.message.includes('does not exist')) {
        console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
        console.log('📋 SQL to run in Supabase SQL Editor:');
        console.log(`
-- Create student_activities table
CREATE TABLE IF NOT EXISTS student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_completed', 'quiz_completed', 'game_played', 'achievement_earned')),
    subject TEXT NOT NULL,
    lesson_name TEXT,
    score INTEGER,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_created_at ON student_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_student_activities_subject ON student_activities(subject);
CREATE INDEX IF NOT EXISTS idx_student_activities_type ON student_activities(activity_type);

-- Enable RLS
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Students can view own activities" ON student_activities
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own activities" ON student_activities
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own activities" ON student_activities
    FOR UPDATE USING (auth.uid() = student_id);
        `);
        return;
      }
    }

    console.log('✅ student_activities table ready');

    // Test table access
    console.log('🧪 Testing table access...');
    const { data, error: testError } = await supabase
      .from('student_activities')
      .select('id')
      .limit(1);

    if (testError) {
      console.log('❌ Error accessing table:', testError.message);
      console.log('💡 You may need to create the table manually in Supabase dashboard');
    } else {
      console.log('✅ Table access test successful');
    }

    console.log('🎉 Database setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the SQL provided above');
    console.log('4. Enable RLS policies');
  }
}

// Run the setup
createTables();