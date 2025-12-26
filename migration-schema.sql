
/*
  # Complete Schema Migration

  Migrated from old Supabase project
  Date: 2025-12-05T12:29:58.698Z

  Tables included: contents, profiles, team_members, teams, chapters, grades, subjects, users, student_activities, student_stats
*/


CREATE TABLE IF NOT EXISTS contents (
  id uuid,
  title text,
  subtitle text,
  description text,
  content_type text,
  youtube_link text,
  file_url text,
  class text,
  subject text,
  created_at timestamptz,
  pages text,
  chapter_id text,
  grade_id integer,
  subject_id text,
  lesson_order integer,
  is_published boolean,
  content_data text
);

ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON contents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON contents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON contents
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON contents
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS profiles (
  id uuid,
  name text,
  age integer,
  grade text,
  avatar_url text,
  created_at timestamptz,
  updated_at timestamptz,
  address text,
  gender text,
  bio text
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON profiles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON profiles
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS team_members (
  id uuid,
  team_id text,
  user_id text,
  joined_at timestamptz
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON team_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON team_members
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON team_members
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON team_members
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS teams (
  id uuid,
  name text,
  description text,
  created_at timestamptz
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON teams
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON teams
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON teams
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON teams
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS chapters (
  id integer,
  name text,
  grade_id integer,
  subject_id integer,
  order integer,
  description text,
  created_at timestamptz
);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON chapters
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON chapters
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON chapters
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON chapters
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS grades (
  id integer,
  name text,
  order_index integer
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON grades
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON grades
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON grades
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON grades
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS subjects (
  id integer,
  name text,
  grade_id integer,
  order_index integer
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON subjects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON subjects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON subjects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON subjects
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS users (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON users
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON users
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS student_activities (
  id uuid,
  student_id text,
  activity_type text,
  subject text,
  lesson_name text,
  score integer,
  stars_earned integer,
  time_spent integer,
  metadata text,
  created_at timestamptz,
  updated_at timestamptz
);

ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON student_activities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON student_activities
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON student_activities
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON student_activities
  FOR DELETE TO authenticated USING (true);



CREATE TABLE IF NOT EXISTS student_stats (
  student_id text,
  total_activities integer,
  total_stars integer,
  total_time_spent integer,
  lessons_completed integer,
  quizzes_completed integer,
  achievements_earned integer,
  average_quiz_score integer,
  active_days integer,
  last_activity timestamptz
);

ALTER TABLE student_stats ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your needs)
CREATE POLICY "Enable read for authenticated users" ON student_stats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON student_stats
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON student_stats
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON student_stats
  FOR DELETE TO authenticated USING (true);

