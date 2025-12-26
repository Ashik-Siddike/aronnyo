// Test Admin Login - Run this in browser console
console.log('🔐 Testing Admin Login');
console.log('=====================');

// Test admin login
async function testAdminLogin() {
    console.log('🔍 Testing admin login...');
    
    try {
        // Try to login with admin credentials
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@playlearngrow.com',
            password: 'admin123456'
        });
        
        if (error) {
            console.error('❌ Login failed:', error);
            return false;
        }
        
        console.log('✅ Admin login successful:', data.user.email);
        console.log('📋 User ID:', data.user.id);
        
        return data.user;
    } catch (err) {
        console.error('❌ Login test failed:', err);
        return false;
    }
}

// Test admin access
async function testAdminAccess(user) {
    console.log('🔍 Testing admin access...');
    
    try {
        // Test grade creation
        const testGrade = {
            name: 'Test Grade ' + Date.now()
        };
        
        const { data: newGrade, error: gradeError } = await supabase
            .from('grades')
            .insert([testGrade])
            .select()
            .single();
            
        if (gradeError) {
            console.error('❌ Grade creation failed:', gradeError);
            return false;
        }
        
        console.log('✅ Grade created:', newGrade);
        
        // Test subject creation
        const testSubject = {
            name: 'Test Subject ' + Date.now(),
            grade_id: newGrade.id
        };
        
        const { data: newSubject, error: subjectError } = await supabase
            .from('subjects')
            .insert([testSubject])
            .select()
            .single();
            
        if (subjectError) {
            console.error('❌ Subject creation failed:', subjectError);
            return false;
        }
        
        console.log('✅ Subject created:', newSubject);
        
        // Clean up
        await supabase.from('subjects').delete().eq('id', newSubject.id);
        await supabase.from('grades').delete().eq('id', newGrade.id);
        console.log('🧹 Test data cleaned up');
        
        return true;
    } catch (err) {
        console.error('❌ Admin access test failed:', err);
        return false;
    }
}

// Check user profile
async function checkUserProfile(user) {
    console.log('🔍 Checking user profile...');
    
    try {
        const { data: profile, error } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('id', user.id)
            .single();
            
        if (error) {
            console.error('❌ Profile check failed:', error);
            return false;
        }
        
        console.log('✅ User profile:', profile);
        
        if (profile.role !== 'admin') {
            console.log('⚠️ User is not admin. Role:', profile.role);
            return false;
        }
        
        console.log('✅ User is admin');
        return true;
    } catch (err) {
        console.error('❌ Profile check failed:', err);
        return false;
    }
}

// Run all tests
async function runAdminTest() {
    console.log('🚀 Running admin test...\n');
    
    const user = await testAdminLogin();
    if (!user) {
        console.log('❌ Admin login failed');
        return;
    }
    
    console.log('');
    
    const profile = await checkUserProfile(user);
    if (!profile) {
        console.log('❌ User profile check failed');
        return;
    }
    
    console.log('');
    
    const access = await testAdminAccess(user);
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Admin Login: ${user ? '✅' : '❌'}`);
    console.log(`User Profile: ${profile ? '✅' : '❌'}`);
    console.log(`Admin Access: ${access ? '✅' : '❌'}`);
    
    if (user && profile && access) {
        console.log('\n🎉 Admin setup successful!');
        console.log('💡 You can now use the admin panel.');
        console.log('📧 Email: admin@playlearngrow.com');
        console.log('🔑 Password: admin123456');
    } else {
        console.log('\n⚠️ Admin setup incomplete. Please:');
        console.log('1. Run the SQL script in Supabase');
        console.log('2. Refresh this page');
        console.log('3. Try again');
    }
    
    return { user, profile, access };
}

// Auto-run
runAdminTest();

// Export
window.adminTest = {
    testAdminLogin,
    testAdminAccess,
    checkUserProfile,
    runAdminTest
};
