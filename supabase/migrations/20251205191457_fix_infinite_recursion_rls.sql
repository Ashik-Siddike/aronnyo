/*
  # Fix Infinite Recursion in RLS Policies

  ## Problem
  Multiple tables have RLS policies that check if a user is an admin by querying
  the users table. This creates infinite recursion when the users table itself
  has RLS policies that do the same check.

  ## Solution
  1. Drop all policies that cause circular dependencies
  2. Create simpler policies that allow:
     - All authenticated users to view published content
     - Users to view/update their own data
     - Service role to handle admin operations
  3. Remove admin checks from RLS policies (admin operations should use service_role)

  ## Changes
  - Drop and recreate policies on: users, grades, subjects, contents, chapters, quizzes, teams
  - Simplify all policies to avoid querying users table
  - Allow all authenticated users to read public/published data
  
  ## Security
  - Users can only modify their own data
  - All users can view published content
  - Admin operations must use service_role key (handled by backend)
*/

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

DROP POLICY IF EXISTS "Anyone can view grades" ON grades;
DROP POLICY IF EXISTS "Admins can manage grades" ON grades;

DROP POLICY IF EXISTS "Anyone can view subjects" ON subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;

DROP POLICY IF EXISTS "Users can view published content" ON contents;
DROP POLICY IF EXISTS "Admins can view all content" ON contents;
DROP POLICY IF EXISTS "Admins can manage all content" ON contents;
DROP POLICY IF EXISTS "Teachers can manage own content" ON contents;

DROP POLICY IF EXISTS "Anyone can view chapters" ON chapters;
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;

DROP POLICY IF EXISTS "Anyone can view published quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can manage quizzes" ON quizzes;

DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
DROP POLICY IF EXISTS "Admins can manage teams" ON teams;

-- =====================================================
-- USERS TABLE POLICIES (No circular dependencies!)
-- =====================================================

-- Allow users to insert their own profile during signup
CREATE POLICY "allow_insert_own_profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "allow_select_own_profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "allow_update_own_profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can do anything (for admin operations)
CREATE POLICY "allow_service_role_all"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- GRADES TABLE POLICIES
-- =====================================================

-- All authenticated users can view grades
CREATE POLICY "allow_select_grades"
  ON grades FOR SELECT
  TO authenticated
  USING (true);

-- Service role can manage grades (for admin)
CREATE POLICY "allow_service_role_grades"
  ON grades FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- SUBJECTS TABLE POLICIES
-- =====================================================

-- All authenticated users can view subjects
CREATE POLICY "allow_select_subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Service role can manage subjects (for admin)
CREATE POLICY "allow_service_role_subjects"
  ON subjects FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- CONTENTS TABLE POLICIES
-- =====================================================

-- All authenticated users can view published content
CREATE POLICY "allow_select_published_contents"
  ON contents FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Service role can view and manage all content (for admin)
CREATE POLICY "allow_service_role_contents"
  ON contents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- CHAPTERS TABLE POLICIES
-- =====================================================

-- All authenticated users can view chapters
CREATE POLICY "allow_select_chapters"
  ON chapters FOR SELECT
  TO authenticated
  USING (true);

-- Service role can manage chapters (for admin)
CREATE POLICY "allow_service_role_chapters"
  ON chapters FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- QUIZZES TABLE POLICIES
-- =====================================================

-- All authenticated users can view quizzes
CREATE POLICY "allow_select_quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Service role can manage quizzes (for admin)
CREATE POLICY "allow_service_role_quizzes"
  ON quizzes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TEAMS TABLE POLICIES
-- =====================================================

-- All authenticated users can view teams
CREATE POLICY "allow_select_teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

-- Service role can manage teams (for admin)
CREATE POLICY "allow_service_role_teams"
  ON teams FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Drop the problematic is_admin() function
-- =====================================================
DROP FUNCTION IF EXISTS is_admin();
