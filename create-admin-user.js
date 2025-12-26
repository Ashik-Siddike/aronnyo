import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbjmbuktvlqrhmuvesif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam1idWt0dmxxcmhtdXZlc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDI3MTAsImV4cCI6MjA4MDQxODcxMH0.ERuRPMFqHeCCE3Xz2qOB5YDzL7NRkPpc_8gYOR9fu-k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  console.log('🚀 Creating admin user...\n');

  const email = 'ashiksiddike@gmail.com';
  const password = 'ashik1234';
  const fullName = 'Ashik Siddike';

  try {
    // Step 1: Sign up the user
    console.log('📝 Step 1: Creating user account...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (signUpError) {
      console.error('❌ Error creating user:', signUpError.message);

      // If user already exists, try to sign in to get the user ID
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️  User already exists, attempting to sign in...');

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (signInError) {
          console.error('❌ Error signing in:', signInError.message);
          console.log('\n💡 Please try one of these solutions:');
          console.log('1. Go to Supabase Dashboard > Authentication > Users');
          console.log('2. Find and delete the existing user with email:', email);
          console.log('3. Run this script again\n');
          return;
        }

        console.log('✅ User signed in successfully');
        console.log('📋 User ID:', signInData.user.id);

        // Update role to admin
        await makeUserAdmin(signInData.user.id, email, fullName);
        return;
      }

      return;
    }

    console.log('✅ User account created successfully');
    console.log('📋 User ID:', signUpData.user.id);
    console.log('📧 Email:', signUpData.user.email);

    // Step 2: Create user profile with admin role
    console.log('\n📝 Step 2: Creating user profile with admin role...');
    await makeUserAdmin(signUpData.user.id, email, fullName);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function makeUserAdmin(userId, email, fullName) {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: email,
          full_name: fullName,
          role: 'admin'
        }
      ])
      .select()
      .single();

    if (userError) {
      // If user already exists in users table, update their role
      if (userError.code === '23505') {
        console.log('⚠️  User profile already exists, updating role to admin...');

        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin', full_name: fullName })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating user role:', updateError.message);
          return;
        }

        console.log('✅ User role updated to admin');
        console.log('📋 User Profile:', updatedUser);
      } else {
        console.error('❌ Error creating user profile:', userError.message);
        return;
      }
    } else {
      console.log('✅ User profile created with admin role');
      console.log('📋 User Profile:', userData);
    }

    // Step 3: Verify admin access
    console.log('\n📝 Step 3: Verifying admin access...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('email', email)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying user:', verifyError.message);
      return;
    }

    console.log('✅ Admin user verified successfully!');
    console.log('📋 Final User Data:', verifyData);

    console.log('\n🎉 SUCCESS! Admin user created and configured.');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', '(use the password you provided)');
    console.log('\n💡 You can now login to the admin panel using these credentials.');

  } catch (error) {
    console.error('❌ Unexpected error in makeUserAdmin:', error);
  }
}

// Run the script
createAdminUser();
