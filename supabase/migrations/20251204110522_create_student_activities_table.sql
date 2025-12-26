/*
  # Create Student Activities Table

  1. New Tables
    - `student_activities`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references auth.users)
      - `activity_type` (text) - 'lesson_completed', 'quiz_completed', 'game_played', 'achievement_earned'
      - `subject` (text)
      - `lesson_name` (text)
      - `score` (integer)
      - `stars_earned` (integer, default 0)
      - `time_spent` (integer, default 0) - in minutes
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on student_activities table
    - Students can view/insert/update their own activities
    - Admins can view and manage all activities

  3. Performance
    - Add indexes for common queries
    - Create view for student statistics

  4. Important Notes
    - All student learning activities are tracked here
    - Admins have full visibility into all activities
    - Statistics are calculated using a view for efficiency
*/

-- Create student_activities table
CREATE TABLE IF NOT EXISTS student_activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL CHECK (activity_type IN ('lesson_completed', 'quiz_completed', 'game_played', 'achievement_earned')),
    subject text NOT NULL,
    lesson_name text,
    score integer,
    stars_earned integer NOT NULL DEFAULT 0,
    time_spent integer NOT NULL DEFAULT 0,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_created_at ON student_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_student_activities_subject ON student_activities(subject);
CREATE INDEX IF NOT EXISTS idx_student_activities_type ON student_activities(activity_type);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_student_activities_updated_at ON student_activities;
CREATE TRIGGER update_student_activities_updated_at 
    BEFORE UPDATE ON student_activities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Students can only see their own activities
CREATE POLICY "Students can view own activities" ON student_activities
    FOR SELECT TO authenticated
    USING (auth.uid() = student_id);

-- Students can insert their own activities
CREATE POLICY "Students can insert own activities" ON student_activities
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = student_id);

-- Students can update their own activities
CREATE POLICY "Students can update own activities" ON student_activities
    FOR UPDATE TO authenticated
    USING (auth.uid() = student_id);

-- Admins can view all activities
CREATE POLICY "Admins can view all activities" ON student_activities
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can manage all activities
CREATE POLICY "Admins can manage all activities" ON student_activities
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
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
