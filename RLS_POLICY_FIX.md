# Row Level Security (RLS) Policy Error Fix

## The Problem
You're getting this error when trying to create a subject:
```
Failed to save subject: new row violates row-level security policy for table "subjects"
```

This means your Supabase database has Row Level Security enabled, but the policies are preventing you from inserting data.

## Quick Fix (Immediate Solution)

### Step 1: Run the Test Script
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Copy and paste the contents of `fix-rls-policy.js`
4. Press Enter to run the script

This will:
- Check your authentication
- Verify your user role
- Test database access
- Try to create a test subject

### Step 2: Run the SQL Fix
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix-rls-policies.sql`
4. Click **Run** to execute the script

This will:
- Disable RLS temporarily
- Create proper admin policies
- Re-enable RLS with correct permissions
- Set up your user as admin

## What the SQL Script Does:

### 1. **Disables RLS Temporarily**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE contents DISABLE ROW LEVEL SECURITY;
```

### 2. **Creates Admin Check Function**
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. **Sets Up Proper Policies**
- **Admins can manage all data**
- **Anyone can view published content**
- **Users can view their own profile**

### 4. **Creates Demo Admin User**
```sql
INSERT INTO users (id, email, full_name, role) 
VALUES (
  'demo-admin-id',
  'ashik@demo.com', 
  'Ashik Admin',
  'admin'
);
```

## After Running the Fix:

### Test Subject Creation:
1. Go to **Admin Panel > Grades & Subjects**
2. Click **Subjects** tab
3. Click **Add Subject**
4. Fill in the form and save

It should work without any RLS errors!

## If You Still Get Errors:

### Check 1: Verify Your User Role
Run this in browser console:
```javascript
supabase.from('users').select('role').eq('id', 'your-user-id').then(console.log)
```

### Check 2: Test Database Access
Run this in browser console:
```javascript
supabase.from('subjects').select('count').then(console.log)
```

### Check 3: Check RLS Status
In Supabase Dashboard:
1. Go to **Authentication > Policies**
2. Check if policies are active
3. Verify your user has admin role

## Alternative Quick Fix:

If you want to disable RLS completely (less secure but simpler):

```sql
-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE contents DISABLE ROW LEVEL SECURITY;
```

## Security Note:

The proper fix (using the full SQL script) is more secure because it:
- Keeps RLS enabled
- Only allows admins to modify data
- Allows public read access to published content
- Protects user data

## Test Results:

After running the fix, you should be able to:
- ✅ Create grades without RLS errors
- ✅ Create subjects without RLS errors
- ✅ Edit and delete data as admin
- ✅ View data as regular users
- ✅ Access admin panel without permission errors

The admin panel should now work smoothly with proper security policies!
