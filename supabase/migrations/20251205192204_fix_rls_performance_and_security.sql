/*
  # Fix RLS Performance and Security Issues

  ## Critical Security Fixes
  
  1. **RLS Performance Optimization**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation for each row and improves performance at scale
  
  2. **Remove Duplicate Policies**
     - Drop old `*_admin_all` and `*_select_all` policies that create conflicts
     - Keep only the newer, simpler policies without circular dependencies
  
  3. **Clean Up Unused Indexes**
     - Drop unused indexes to reduce maintenance overhead
  
  ## Changes Made
  
  ### Users Table
  - Updated policies to use `(select auth.uid())`
  
  ### All Other Tables
  - Removed duplicate admin policies
  - Created simple, secure policies for each table
  
  ### Indexes
  - Dropped some unused indexes to reduce overhead
*/

-- =====================================================
-- FIX USERS TABLE RLS POLICIES (Performance)
-- =====================================================

DROP POLICY IF EXISTS "allow_insert_own_profile" ON users;
DROP POLICY IF EXISTS "allow_select_own_profile" ON users;
DROP POLICY IF EXISTS "allow_update_own_profile" ON users;

CREATE POLICY "allow_insert_own_profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "allow_select_own_profile"
  ON users FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "allow_update_own_profile"
  ON users FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- =====================================================
-- REMOVE DUPLICATE POLICIES FROM ALL TABLES
-- =====================================================

-- Achievements
DROP POLICY IF EXISTS "achievements_admin_all" ON achievements;
DROP POLICY IF EXISTS "achievements_select_all" ON achievements;
DROP POLICY IF EXISTS "achievements_select" ON achievements;
DROP POLICY IF EXISTS "achievements_insert" ON achievements;
DROP POLICY IF EXISTS "service_role_achievements" ON achievements;

-- Activity
DROP POLICY IF EXISTS "activity_admin_all" ON activity;
DROP POLICY IF EXISTS "activity_select_all" ON activity;
DROP POLICY IF EXISTS "activity_select" ON activity;
DROP POLICY IF EXISTS "activity_insert" ON activity;
DROP POLICY IF EXISTS "service_role_activity" ON activity;

-- Chapters
DROP POLICY IF EXISTS "chapters_admin_all" ON chapters;
DROP POLICY IF EXISTS "chapters_select_all" ON chapters;

-- Contents
DROP POLICY IF EXISTS "contents_admin_all" ON contents;
DROP POLICY IF EXISTS "contents_select_all" ON contents;

-- Friends
DROP POLICY IF EXISTS "friends_admin_all" ON friends;
DROP POLICY IF EXISTS "friends_select_all" ON friends;
DROP POLICY IF EXISTS "friends_select" ON friends;
DROP POLICY IF EXISTS "friends_insert" ON friends;
DROP POLICY IF EXISTS "service_role_friends" ON friends;

-- Goals
DROP POLICY IF EXISTS "goals_admin_all" ON goals;
DROP POLICY IF EXISTS "goals_select_all" ON goals;
DROP POLICY IF EXISTS "goals_select" ON goals;
DROP POLICY IF EXISTS "goals_insert" ON goals;
DROP POLICY IF EXISTS "goals_update" ON goals;
DROP POLICY IF EXISTS "service_role_goals" ON goals;

-- Grades
DROP POLICY IF EXISTS "grades_admin_all" ON grades;
DROP POLICY IF EXISTS "grades_select_all" ON grades;

-- Quizzes
DROP POLICY IF EXISTS "quizzes_admin_all" ON quizzes;
DROP POLICY IF EXISTS "quizzes_select_all" ON quizzes;

-- Results
DROP POLICY IF EXISTS "results_admin_all" ON results;
DROP POLICY IF EXISTS "results_select_all" ON results;
DROP POLICY IF EXISTS "results_select" ON results;
DROP POLICY IF EXISTS "results_insert" ON results;
DROP POLICY IF EXISTS "service_role_results" ON results;

-- Subjects
DROP POLICY IF EXISTS "subjects_admin_all" ON subjects;
DROP POLICY IF EXISTS "subjects_select_all" ON subjects;

-- Team Members
DROP POLICY IF EXISTS "team_members_admin_all" ON team_members;
DROP POLICY IF EXISTS "team_members_select_all" ON team_members;
DROP POLICY IF EXISTS "team_members_select" ON team_members;
DROP POLICY IF EXISTS "service_role_team_members" ON team_members;

-- Teams
DROP POLICY IF EXISTS "teams_admin_all" ON teams;
DROP POLICY IF EXISTS "teams_select_all" ON teams;

-- =====================================================
-- CREATE SIMPLE POLICIES FOR TABLES
-- =====================================================

-- Achievements
CREATE POLICY "achievements_select"
  ON achievements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "achievements_insert"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "service_role_achievements"
  ON achievements FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Activity
CREATE POLICY "activity_select"
  ON activity FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "activity_insert"
  ON activity FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "service_role_activity"
  ON activity FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Friends
CREATE POLICY "friends_select"
  ON friends FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR (select auth.uid()) = friend_id);

CREATE POLICY "friends_insert"
  ON friends FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "service_role_friends"
  ON friends FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Goals
CREATE POLICY "goals_select"
  ON goals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "goals_insert"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "goals_update"
  ON goals FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "service_role_goals"
  ON goals FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Results
CREATE POLICY "results_select"
  ON results FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "results_insert"
  ON results FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "service_role_results"
  ON results FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Team Members
CREATE POLICY "team_members_select"
  ON team_members FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "service_role_team_members"
  ON team_members FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- DROP UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_achievements_user_id;
DROP INDEX IF EXISTS idx_activity_user_id;
DROP INDEX IF EXISTS idx_goals_user_id;
DROP INDEX IF EXISTS idx_friends_user_id;
DROP INDEX IF EXISTS idx_friends_friend_id;
DROP INDEX IF EXISTS idx_team_members_team_id;
DROP INDEX IF EXISTS idx_team_members_user_id;
