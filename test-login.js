import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbjmbuktvlqrhmuvesif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam1idWt0dmxxcmhtdXZlc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDI3MTAsImV4cCI6MjA4MDQxODcxMH0.ERuRPMFqHeCCE3Xz2qOB5YDzL7NRkPpc_8gYOR9fu-k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🔍 Testing login with credentials...\n');

  const email = 'ashiksiddike@gmail.com';
  const password = 'ashik1234';

  try {
    console.log('📝 Attempting to sign in...');
    console.log('Email:', email);
    console.log('Password:', password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('Error details:', error);

      // Let's try to reset the password
      console.log('\n🔧 Attempting to update password...');

      // First sign up will fail if user exists, but we can then update password
      const { data: user, error: userError } = await supabase.auth.admin.updateUserById(
        '2b7e852a-5b3c-4cf2-8ea6-ed450a3b8840',
        { password: password }
      );

      if (userError) {
        console.log('⚠️  Cannot update password with anon key (expected)');
        console.log('💡 We need to use the Supabase service role key to update the password');
      }

      return;
    }

    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Session:', data.session ? 'Active' : 'None');

    // Check user profile
    console.log('\n📝 Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('❌ Error fetching profile:', profileError.message);
    } else {
      console.log('✅ User profile:', profile);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testLogin();
