-- Create student_activities table for tracking student learning activities
CREATE TABLE IF NOT EXISTS student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_completed', 'quiz_completed', 'game_played', 'achievement_earned')),
    subject TEXT NOT NULL,
    lesson_name TEXT,
    score INTEGER,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0, -- in minutes
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_created_at ON student_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_student_activities_subject ON student_activities(subject);
CREATE INDEX IF NOT EXISTS idx_student_activities_type ON student_activities(activity_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_student_activities_updated_at 
    BEFORE UPDATE ON student_activities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Students can only see their own activities
CREATE POLICY "Students can view own activities" ON student_activities
    FOR SELECT USING (auth.uid() = student_id);

-- Students can insert their own activities
CREATE POLICY "Students can insert own activities" ON student_activities
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own activities
CREATE POLICY "Students can update own activities" ON student_activities
    FOR UPDATE USING (auth.uid() = student_id);

-- Admins can view all activities
CREATE POLICY "Admins can view all activities" ON student_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Admins can manage all activities
CREATE POLICY "Admins can manage all activities" ON student_activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create a view for student statistics
CREATE OR REPLACE VIEW student_stats AS
SELECT 
    student_id,
    COUNT(*) as total_activities,
    SUM(stars_earned) as total_stars,
    SUM(time_spent) as total_time_spent,
    COUNT(CASE WHEN activity_type = 'lesson_completed' THEN 1 END) as lessons_completed,
    COUNT(CASE WHEN activity_type = 'quiz_completed' THEN 1 END) as quizzes_completed,
    COUNT(CASE WHEN activity_type = 'achievement_earned' THEN 1 END) as achievements_earned,
    AVG(CASE WHEN activity_type = 'quiz_completed' AND score IS NOT NULL THEN score END) as average_quiz_score,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    MAX(created_at) as last_activity
FROM student_activities
GROUP BY student_id;

-- Grant access to the view
GRANT SELECT ON student_stats TO authenticated;

-- Create RLS policy for the view
ALTER VIEW student_stats SET (security_invoker = true);

-- Insert some sample data for testing (optional)
-- This will be commented out in production
/*
INSERT INTO student_activities (student_id, activity_type, subject, lesson_name, stars_earned, time_spent, score, metadata) VALUES
    ((SELECT id FROM auth.users WHERE email = 'student@example.com' LIMIT 1), 'lesson_completed', 'Math', 'Basic Addition', 10, 15, NULL, '{"difficulty": "easy"}'),
    ((SELECT id FROM auth.users WHERE email = 'student@example.com' LIMIT 1), 'quiz_completed', 'Math', 'Addition Quiz', 15, 10, 85, '{"questions": 10, "correct": 8}'),
    ((SELECT id FROM auth.users WHERE email = 'student@example.com' LIMIT 1), 'achievement_earned', 'Math', 'Math Beginner', 25, 0, NULL, '{"description": "Completed first math lesson!", "icon": "🏆"}');
*/